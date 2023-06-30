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
