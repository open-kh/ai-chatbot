import { nanoid } from '@/lib/utils'
import { Chat } from '@/components/chat'
// import ChatCompletion from '@/components/chat-completion'

export const runtime = 'edge'

export default function IndexPage() {
  const id = nanoid()
//   return <ChatCompletion />
  return <Chat id={id} />
}
