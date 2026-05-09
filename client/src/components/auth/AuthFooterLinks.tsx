import { Link } from 'react-router-dom'

function AuthFooterLinks() {
  return (
    <footer className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm font-medium text-slate-500">
      <Link
        to="/support"
        className="rounded-md hover:text-indigo-600 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-100"
      >
        Support
      </Link>
      <Link
        to="/documentation"
        className="rounded-md hover:text-indigo-600 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-100"
      >
        Documentation
      </Link>
      <Link
        to="/status"
        className="rounded-md hover:text-indigo-600 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-100"
      >
        Status
      </Link>
    </footer>
  )
}

export default AuthFooterLinks
