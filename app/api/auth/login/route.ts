import { nanoid } from 'nanoid'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'edge'

export async function POST(req: NextRequest) {
  const router = useRouter()
  let data = await req.json()
  if (data.password != 123456) return
  const user = {
    id: nanoid(),
    name: 'Open Brain',
    email: 'openbrain@gmail.com',
    image: '/favicon.ico',
    password: '123456'
  }
  const callbackUrl = process.env.NEXTAUTH_URL || '/'
  const res = await signIn('credentials', {
    redirect: false,
    ...user,
    ...data,
    callbackUrl
  })
  if (!res?.error) {
    router.push(callbackUrl)
  }
  return NextResponse.json({
    is_success: true,
    ...user,
    ...data,
    id: data.email.replaceAll(' ', '').toLowerCase()
  })
}
export async function GET(req: Request) {
  // const data1 = await req.headers
  let data: { name: string; email: string } = {
    name: '',
    email: ''
  }
  const res = await req.url.split('?')[1].split('&')
  for (const key in res) {
    const i = res[key].split('=')
    eval(`data.${i[0]} = ${i[1]}`)
  }
  if (data.email.toLowerCase().split('@')[1] != 'itc.edu.kh') return
  const user = {
    id: nanoid(),
    name: 'Open Brain',
    email: 'openbrain@itc.edu.kh',
    image: '/favicon.ico'
  }
  const callbackUrl = process.env.NEXTAUTH_URL || '/'
  return await signIn('credentials', {
    redirect: false,
    ...user,
    ...data,
    callbackUrl
  })
}
