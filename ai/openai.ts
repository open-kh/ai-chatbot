import { kv } from '@vercel/kv'
import { OpenAIStream, StreamingTextResponse } from 'ai'
import { Configuration, OpenAIApi } from 'openai-edge'

import { auth } from '@/auth'
import { nanoid } from '@/lib/utils'
import { OPENAI_KEY_GEN } from './keys'

export const runtime = 'edge'

export async function POST(req: Request) {
    const json = await req.json()
    const { messages, previewToken, prompt } = json
    let { stream } = json
    const session = await auth()
    
    if (process.env.VERCEL_ENV !== 'preview') {
        if (session == null) {
            return new Response('Unauthorized', { status: 401 })
        }
    }

    const configuration = new Configuration({
        apiKey: previewToken || (process.env.OPENAI_API_KEY??OPENAI_KEY_GEN)
    })

    const openai = new OpenAIApi(configuration)
    let temperature = 0.7

    const payload = {
        model: 'text-davinci-003',
        prompt,
        temperature,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
        max_tokens: 2048,
        n: 1,
      };

    let res;
    stream = stream??true;
    if(prompt){
        res = await openai.createCompletion(payload)
    }else{
        res = await openai.createChatCompletion({
            model: 'gpt-3.5-turbo',
            messages,
            temperature,
            stream
          })
    }

    const streamRes = OpenAIStream(res, {
        async onCompletion(completion) {
            const title = json.messages[0].content.substring(0, 100)
            const userId = session?.user?.email
            if (userId) {
                const id = json.id ?? nanoid()
                const createdAt = Date.now()
                const path = `/chat/${id}`
                const payload = {
                    id,
                    title,
                    userId,
                    createdAt,
                    path,
                    messages: [
                        ...messages,
                        {
                            content: completion,
                            role: 'assistant'
                        }
                    ]
                }
                await kv.hmset(`chat:${id}`, payload)
                await kv.zadd(`user:chat:${userId}`, {
                    score: createdAt,
                    member: `chat:${id}`
                })
            }
        }
    })

    return new StreamingTextResponse(streamRes)
}
