import { CheckCircle } from 'lucide-react'

function AuthBrand() {
  return (
    <div className="mb-6 text-center sm:mb-8">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 sm:h-14 sm:w-14">
        <CheckCircle className="h-7 w-7 sm:h-8 sm:w-8" />
      </div>
      <h1 className="mt-4 text-2xl font-bold text-slate-950 sm:text-3xl">LiveTasker</h1>
      <p className="mt-2 text-sm font-medium text-slate-500">Simplify your workflow in real-time.</p>
    </div>
  )
}

export default AuthBrand
