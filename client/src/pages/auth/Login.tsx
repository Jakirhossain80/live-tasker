import { Eye, LockKeyhole, Mail } from 'lucide-react'
import { Link } from 'react-router-dom'
import AuthCard from '../../components/auth/AuthCard'
import AuthShell from '../../components/auth/AuthShell'
import SocialLoginButtons from '../../components/auth/SocialLoginButtons'

function Login() {
  return (
    <AuthShell>
      <AuthCard title="Welcome back">
        <SocialLoginButtons />

        <div className="my-5 flex items-center gap-3 sm:my-6">
          <div className="h-px flex-1 bg-slate-200" />
          <span className="shrink-0 text-xs font-semibold text-slate-400">Or continue with</span>
          <div className="h-px flex-1 bg-slate-200" />
        </div>

        <form className="space-y-5">
          <div>
            <label htmlFor="email" className="text-sm font-semibold text-slate-700">
              Email address
            </label>
            <div className="mt-2 flex h-12 items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-3 transition focus-within:border-indigo-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-indigo-100">
              <Mail className="h-5 w-5 shrink-0 text-slate-400" />
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="name@company.com"
                className="min-w-0 flex-1 bg-transparent text-sm font-medium text-slate-950 outline-none placeholder:text-slate-400"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between gap-4">
              <label htmlFor="password" className="text-sm font-semibold text-slate-700">
                Password
              </label>
              <Link
                to="/forgot-password"
                className="rounded-md text-sm font-semibold text-indigo-600 hover:text-indigo-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-100"
              >
                Forgot password?
              </Link>
            </div>
            <div className="mt-2 flex h-12 items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-3 transition focus-within:border-indigo-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-indigo-100">
              <LockKeyhole className="h-5 w-5 shrink-0 text-slate-400" />
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                placeholder="........"
                className="min-w-0 flex-1 bg-transparent text-sm font-medium text-slate-950 outline-none placeholder:text-slate-400"
              />
              <button
                type="button"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-slate-400 transition hover:bg-white hover:text-slate-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-100"
                aria-label="Show password"
              >
                <Eye className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between gap-4">
            <label htmlFor="remember" className="flex min-w-0 items-center gap-2 text-sm font-medium text-slate-600">
              <input
                id="remember"
                name="remember"
                type="checkbox"
                className="h-4 w-4 shrink-0 rounded border-slate-300 text-indigo-600 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-100"
              />
              <span>Remember me for 30 days</span>
            </label>
          </div>

          <button
            type="submit"
            className="inline-flex h-12 w-full items-center justify-center rounded-lg bg-indigo-600 px-4 text-sm font-semibold text-white shadow-sm shadow-indigo-600/20 transition hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-200"
          >
            Sign In
          </button>
        </form>

        <p className="mt-7 text-center text-sm text-slate-500">
          Don't have an account?{' '}
          <Link
            to="/register"
            className="rounded-md font-semibold text-indigo-600 hover:text-indigo-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-100"
          >
            Create an account
          </Link>
        </p>
      </AuthCard>

      <footer className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm font-medium text-slate-500">
        <Link
          to="/privacy"
          className="rounded-md hover:text-indigo-600 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-100"
        >
          Privacy Policy
        </Link>
        <Link
          to="/terms"
          className="rounded-md hover:text-indigo-600 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-100"
        >
          Terms of Service
        </Link>
        <Link
          to="/support"
          className="rounded-md hover:text-indigo-600 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-100"
        >
          Support
        </Link>
      </footer>
    </AuthShell>
  )
}

export default Login
