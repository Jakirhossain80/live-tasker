import { Link } from 'react-router-dom'

function UpgradeCard() {
  return (
    <section className="rounded-xl border border-slate-200 bg-indigo-600 p-5 text-white shadow-sm">
      <h2 className="text-lg font-semibold">Upgrade to Pro</h2>
      <p className="mt-2 text-sm text-indigo-100">Get unlimited workspaces and advanced team analytics.</p>
      <Link
        to="/dashboard/settings"
        className="mt-5 inline-flex rounded-lg bg-white px-4 py-2 text-sm font-medium text-indigo-700 hover:bg-indigo-50"
      >
        Learn More
      </Link>
    </section>
  )
}

export default UpgradeCard
