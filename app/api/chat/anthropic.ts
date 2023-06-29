import { auth } from '@/auth';
import { kv } from '@vercel/kv';
import { AnthropicStream, StreamingTextResponse } from 'ai'
import { nanoid } from 'nanoid';
 
// IMPORTANT! Set the runtime to edge
export const runtime = 'edge'
 
// Build a prompt from the messages
function buildPrompt(
  messages: { content: string; role: 'system' | 'user' | 'assistant' }[]
) {
  return (
    messages
      .map(({ content, role }) => {
        if (role === 'user') {
          return `Human: ${content}`
        } else {
          return `Assistant: ${content}`
        }
      })
      .join('\n\n') + 'Assistant:'
  )
}
 
export async function POST(req: Request) {
  // Extract the `messages` from the body of the request
  const json = await req.json()
  const { messages, previewToken } = json
  const session = await auth()
 
  const res = await fetch('https://api.anthropic.com/v1/complete', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY
    },
    body: JSON.stringify({
      prompt: buildPrompt(messages),
      model: 'claude-v1',
      max_tokens_to_sample: 300,
      temperature: 0.9,
      stream: true
    })
  })
 
  // Convert the response into a friendly text-stream
  const stream = AnthropicStream(res,{
    async onCompletion(completion) {
      const title = json.messages[0].content.substring(0, 100)
      const userId = session?.user.id
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
 
  // Respond with the stream
  return new StreamingTextResponse(stream)
}