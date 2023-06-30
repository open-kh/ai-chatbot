import { auth } from '@/auth';
import { HfInference } from '@huggingface/inference'
import { kv } from '@vercel/kv';
import { HuggingFaceStream, StreamingTextResponse } from 'ai'
import { nanoid } from 'nanoid';

// Create a new HuggingFace Inference instance
const Hf = new HfInference(process.env.HUGGINGFACE_API_KEY)

// IMPORTANT! Set the runtime to edge
export const runtime = 'edge'

const DEFAULT_SYSTEM_PROMPT = process.env.DEFAULT_SYSTEM_PROMPT

// Build a prompt from the messages
function buildPompt(
    messages: { content: string; role: 'system' | 'user' | 'assistant' }[]
) {
    return (
        messages
            .map(({ content, role }) => {
                if(role == 'system'){
                    // return `<|system|>${content}<|system|>`
                    return `<|prefix_begin|>${content}<|prefix_end|>`
                }else if (role === 'user') {
                    return `<|prompter|>${content}<|endoftext|>`
                } else {
                    return `<|assistant|>${content}<|endoftext|>`
                }
            })
            .join('') + '<|assistant|>'
    )
}

export async function POST(req: Request) {
    // Extract the `messages` from the body of the request
    const json = await req.json()
    const { messages } = json
    const session = await auth()
    const response = await Hf.textGenerationStream({
        // model: 'OpenAssistant/oasst-sft-6-llama-30b-xor',
        model: 'OpenAssistant/oasst-sft-4-pythia-12b-epoch-3.5',
        inputs: buildPompt([
            {
                role: 'system',
                content: process.env.DEFAULT_SYSTEM_PROMPT
            },
            ...messages
        ]),
        parameters: {
            max_new_tokens: 200,
            // @ts-ignore (this is a valid parameter specifically in OpenAssistant models)
            typical_p: 0.2,
            repetition_penalty: 1,
            truncate: 1000,
            return_full_text: false
        }
    })

    // Convert the response into a friendly text-stream
    const stream = HuggingFaceStream(response, {
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