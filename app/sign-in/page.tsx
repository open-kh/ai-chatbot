import { LoginButton } from '@/components/login-button'
import LoginForm from './form'

export default function SignInPage() {
  return (
    <div className="flex flex-row h-[calc(100vh-theme(spacing.16))] bg-slate-500 center items-center align-middle justify-center pb-20 px-10">
      <div className='md:w-[60%] max-sm:hidden center items-center align-middle justify-center'>
        <img src="/images/chat.png" width={'50%'} className='rounded-xl shadow-md hover:shadow-2xl'/>
      </div>
      <div className='md:w-[40%] max-sm:w-full center items-center align-middle justify-center flex-auto'>
        <div className='md:w-[50%] max-sm:w-full'>
            <LoginForm/>
        </div>
      </div>
    </div>
  )
}
