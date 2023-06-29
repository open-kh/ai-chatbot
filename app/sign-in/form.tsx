'use client'

import { signIn } from 'next-auth/react'
import { useSearchParams, useRouter } from 'next/navigation'
import { ChangeEvent, useState } from 'react'

export const LoginForm = () => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formValues, setFormValues] = useState({
    name: '',
    email: '',
    password: '123456'
  })
  const [error, setError] = useState('')

  const searchParams = useSearchParams()
//   const callbackUrl = searchParams.get('callbackUrl') || '/'
  const callbackUrl = process.env.NEXTAUTH_URL || '/'

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setLoading(true)
      setFormValues({ email: '', password: '', name: '' })

      const res = await signIn('credentials', {
        redirect: false,
        name: formValues.name,
        email: formValues.email,
        password: formValues.password,
        callbackUrl
      })
      setLoading(false)
      if (!res?.error) {
        router.push(callbackUrl)
      } else {
        setError('invalid email or password')
      }
    } catch (error: any) {
      setLoading(false)
      setError(error)
    }
  }

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    setFormValues({ ...formValues, [name]: value })
  }

//   const input_style =
//     'form-control block w-full px-3 py-3 text-sm font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded-xl transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none'
  const input_style = 'block shadow-sm w-full px-3 py-3 text-sm font-normal text-gray-700 bg-clip-padding border rounded-lg transition ease-in-out hover:shadow-lg focus:shadow-md'
    
  return (
    <form onSubmit={onSubmit}>
      {error && (
        <p className="text-center bg-red-600 py-4 mb-6 rounded">{error}</p>
      )}
      <div className="mb-2">
        <input
          required
          type="text"
          name="name"
          value={formValues.name??"Dr. Strange"}
          onChange={handleChange}
          placeholder="Username"
          className={`form-control ${input_style}`}
        />
      </div>
      <div className="mb-2">
        <input
          required
          type="email"
          name="email"
          value={formValues.email}
          onChange={handleChange}
          placeholder="Email address"
          className={`form-control ${input_style}`}
        />
      </div>
      <div className="mb-4">
        <input
          required
          type="password"
          name="password"
          value={formValues.password??123456}
          onChange={handleChange}
          placeholder="Password"
          className={`form-control ${input_style}`}
        />
      </div>
      <button
        type="submit"
        className={`shadow-sm px-3 py-3 text-sm border border-gray-200 rounded-lg uppercase inline-block hover:shadow-lg transition duration-150 ease-in-out w-full text-white-700 ${loading ? ' bg-slate-300 text-gray' : 'bg-slate-700 text-white'}`}
        disabled={loading}
      >
        {loading ? 'loading...' : 'Sign In'}
      </button>
    </form>
  )
}

export default LoginForm
