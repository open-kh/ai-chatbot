import { NextRequest, NextResponse } from "next/server"

export const runtime = 'edge'

export async function POST(req: NextRequest) {
    let data = await req.json()
    if(data.password != 123456) return;
    const user = {
        id: 1,
        name: 'Open Brain',
        email: 'openbrain@gmail.com',
        image: '/favicon.ico',
        password: '123456'
    }
    return NextResponse.json({is_success: true,...user,...data, id: data.email.replaceAll(' ','').toLowerCase()})
}