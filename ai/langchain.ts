import { auth } from '@/auth';
import { StreamingTextResponse, LangChainStream, Message } from 'ai'
import { ChatOpenAI } from 'langchain/chat_models/openai'
import { AIChatMessage, HumanChatMessage } from 'langchain/schema'
import { OPENAI_KEY_GEN } from './keys';

export const runtime = 'edge'

export async function POST(req: Request) {
    const json = await req.json()
    const { messages, previewToken } = json
    const session = await auth()

    const { stream, handlers } = LangChainStream()

    const llm = new ChatOpenAI({
        streaming: true,
        openAIApiKey: process.env.OPENAI_API_KEY??OPENAI_KEY_GEN,
        // maxTokens: 1024,
        callbacks: [handlers]
    })


    llm.call(
        (messages as Message[]).map(m =>
            m.role == 'user'
                ? new HumanChatMessage(m.content)
                : new AIChatMessage(m.content)
        )
    ).catch(console.error)

    return new StreamingTextResponse(stream)
}