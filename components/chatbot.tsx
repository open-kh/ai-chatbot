import { useLocalStorage } from '@/lib/hooks/use-local-storage'
import { useEffect, useMemo, useState } from 'react'

let chatbots = [
  { key: 'fb', name: 'facebook' },
  { key: 'openai', name: 'openai' },
  { key: 'google', name: 'google' }
]
export default function App() {
  const [app, setApp] = useLocalStorage<string | null>('ai-endpoint', null)
  useEffect(() => {
    if (app == null) return setApp(chatbots[0].key)
  }, [])
  return (
    <>
      <div className="flex mb-2 flex-col">
        <div className="w-full rounded-lg border border-neutral-200 bg-transparent pr-2 text-neutral-900 dark:border-neutral-600 dark:text-white">
          <select
            className="w-full bg-transparent p-2"
            // @ts-ignore
            defaultValue={app}
            onChange={e => setApp(e.target.value)}
          >
            {chatbots.map(bot => (
              <option
                key={bot.key}
                value={bot.key}
                className={`dark:bg-[#343541] text-white`}
              >
                ChatBot | {bot.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </>
  )
}
