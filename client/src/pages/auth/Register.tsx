import { AxiosError } from 'axios'
import { Circle, Eye, LockKeyhole, Mail, UserRound } from 'lucide-react'
import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { registerUser } from '../../api/auth'
import AuthCard from '../../components/auth/AuthCard'
import AuthFooterLinks from '../../components/auth/AuthFooterLinks'
import AuthShell from '../../components/auth/AuthShell'
import { useAuthStore } from '../../store/auth.store'

type ApiErrorResponse = {
  message?: string
}

function Register() {
  const navigate = useNavigate()
  const setAuth = useAuthStore((state) => state.setAuth)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setErrorMessage('')

    if (!name || !email || !password || !confirmPassword) {
      setErrorMessage('Please fill in all fields.')
      return
    }

    if (password !== confirmPassword) {
      setErrorMessage('Password and confirm password must match.')
      return
    }

    if (!termsAccepted) {
      setErrorMessage('Please accept the terms before creating an account.')
      return
    }

    setIsSubmitting(true)

    try {
      const { user, accessToken } = await registerUser({ name, email, password })

      setAuth(user, accessToken)
      navigate('/dashboard')
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>
      const message = axiosError.response?.data?.message ?? 'Unable to create your account. Please try again.'

      setErrorMessage(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthShell>
      <AuthCard title="Create your account" subtitle="Join thousands of teams managing tasks efficiently.">
        <button
          type="button"
          className="inline-flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-100"
        >
          <Circle className="h-5 w-5 text-slate-600" />
          Sign up with Google
        </button>

        <div className="my-5 flex items-center gap-3 sm:my-6">
          <div className="h-px flex-1 bg-slate-200" />
          <span className="shrink-0 text-xs font-bold text-slate-400">OR REGISTER WITH EMAIL</span>
          <div className="h-px flex-1 bg-slate-200" />
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name" className="text-sm font-semibold text-slate-700">
              Full name
            </label>
            <div className="mt-2 flex h-12 items-center gap-3 rounded-xl border border-slate-300 bg-white px-3 transition focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-100">
              <UserRound className="h-5 w-5 shrink-0 text-slate-400" />
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                placeholder="John Doe"
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="min-w-0 flex-1 bg-transparent text-sm font-medium text-slate-950 outline-none placeholder:text-slate-400"
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="text-sm font-semibold text-slate-700">
              Email Address
            </label>
            <div className="mt-2 flex h-12 items-center gap-3 rounded-xl border border-slate-300 bg-white px-3 transition focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-100">
              <Mail className="h-5 w-5 shrink-0 text-slate-400" />
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="name@company.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="min-w-0 flex-1 bg-transparent text-sm font-medium text-slate-950 outline-none placeholder:text-slate-400"
              />
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label htmlFor="password" className="text-sm font-semibold text-slate-700">
                Password
              </label>
              <div className="mt-2 flex h-12 items-center gap-3 rounded-xl border border-slate-300 bg-white px-3 transition focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-100">
                <LockKeyhole className="h-5 w-5 shrink-0 text-slate-400" />
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  placeholder="........"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="min-w-0 flex-1 bg-transparent text-sm font-medium text-slate-950 outline-none placeholder:text-slate-400"
                />
                <button
                  type="button"
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-slate-400 transition hover:bg-slate-50 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-100"
                  aria-label="Show password"
                >
                  <Eye className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="text-sm font-semibold text-slate-700">
                Confirm Password
              </label>
              <div className="mt-2 flex h-12 items-center gap-3 rounded-xl border border-slate-300 bg-white px-3 transition focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-100">
                <LockKeyhole className="h-5 w-5 shrink-0 text-slate-400" />
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  placeholder="........"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  className="min-w-0 flex-1 bg-transparent text-sm font-medium text-slate-950 outline-none placeholder:text-slate-400"
                />
                <button
                  type="button"
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-slate-400 transition hover:bg-slate-50 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-100"
                  aria-label="Show confirm password"
                >
                  <Eye className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          <label htmlFor="terms" className="flex items-start gap-2 text-sm font-medium leading-6 text-slate-600">
            <input
              id="terms"
              name="terms"
              type="checkbox"
              checked={termsAccepted}
              onChange={(event) => setTermsAccepted(event.target.checked)}
              className="mt-1 h-4 w-4 shrink-0 rounded border-slate-300 text-indigo-600 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-100"
            />
            <span>
              I agree to the{' '}
              <Link
                to="/terms"
                className="rounded-md font-semibold text-indigo-600 hover:text-indigo-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-100"
              >
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link
                to="/privacy"
                className="rounded-md font-semibold text-indigo-600 hover:text-indigo-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-100"
              >
                Privacy Policy
              </Link>
              .
            </span>
          </label>

          {errorMessage ? (
            <p className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-700">
              {errorMessage}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex h-12 w-full items-center justify-center rounded-xl bg-indigo-600 px-4 text-sm font-semibold text-white shadow-md shadow-indigo-600/20 transition hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-200 disabled:cursor-not-allowed disabled:bg-indigo-400"
          >
            {isSubmitting ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="mt-7 text-center text-sm text-slate-500">
          Already have an account?{' '}
          <Link
            to="/login"
            className="rounded-md font-semibold text-indigo-600 hover:text-indigo-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-100"
          >
            Log in
          </Link>
        </p>
      </AuthCard>

      <AuthFooterLinks />
    </AuthShell>
  )
}

export default Register
