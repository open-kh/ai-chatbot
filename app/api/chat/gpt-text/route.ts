import { Configuration, OpenAIApi } from 'openai-edge'
import { OpenAIStream, StreamingTextResponse } from 'ai'
import { OPENAI_KEY } from '../route'
import { NextResponse } from 'next/server'

// Create an OpenAI API client (that's edge friendly!)
// const config = new Configuration({
//     apiKey: process.env.OPENAI_API_KEY ?? OPENAI_KEY
// })
// const openai = new OpenAIApi(config)

// IMPORTANT! Set the runtime to edge
export const runtime = 'edge'

export async function POST(req: Request) {
    // Extract the `prompt` from the body of the request
    const { prompt, stream } = await req.json()

    const payload = {
        model: 'text-davinci-003',
        prompt,
        temperature: 0.7,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
        max_tokens: 2048,
        stream: stream??true,
        n: 1,
    };

    // Ask OpenAI for a streaming completion given the prompt
    // const response = await openai.createCompletion(payload)
    const response = await fetch('https://api.openai.com/v1/completions', {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.OPENAI_API_KEY ?? OPENAI_KEY}`,
        },
        method: 'POST',
        body: JSON.stringify(payload),
    });

    // const data = await response.json();
    // return NextResponse.json(data);

    // Convert the response into a friendly text-stream
    const streamRes = OpenAIStream(response)

    // Respond with the stream
    return new StreamingTextResponse(streamRes)
}