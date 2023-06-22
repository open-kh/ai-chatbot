import { UseChatHelpers } from 'ai/react'

import { Button } from '@/components/ui/button'
import { ExternalLink } from '@/components/external-link'
import { IconArrowRight } from '@/components/ui/icons'

const exampleMessages = [
  {
    heading: 'Explain technical concepts',
    message: `What is a "serverless function"?`
  },
  {
    heading: 'Summarize an article',
    message: 'Summarize the following article for a 2nd grader: \n'
  },
  {
    heading: 'Draft an email',
    message: `Draft an email to my boss about the following: \n`
  }
]

export function EmptyScreen({ setInput }: Pick<UseChatHelpers, 'setInput'>) {
  return (
    <div className="mx-auto max-w-2xl px-4 text-center align-middle">
      <div className="rounded-2xl border bg-background p-8">
        <h1 className="mb-2 text-lg font-semibold">
          Welcome to AI Chatbot!
        </h1>
        <p><span className='text-red'>NOTE:</span> Free chat, no control</p>
      </div>
    </div>
  )
}
