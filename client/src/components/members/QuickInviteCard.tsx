import { Copy, Link2 } from 'lucide-react'

function QuickInviteCard() {
  return (
    <article className="rounded-2xl border border-indigo-100 bg-indigo-50/70 p-5 shadow-sm">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-indigo-600 text-white shadow-sm shadow-indigo-600/20">
        <Link2 className="h-6 w-6" />
      </div>

      <div className="mt-5">
        <h3 className="text-base font-bold text-slate-950">Quick Invite Link</h3>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Share this link to let teammates join the workspace instantly.
        </p>
      </div>

      <label className="mt-5 block">
        <span className="sr-only">Invite link</span>
        <input
          type="text"
          value="livetasker.com/join/workspace-alpha-445"
          readOnly
          className="h-11 w-full rounded-lg border border-indigo-100 bg-white px-3 text-sm font-medium text-slate-700 outline-none"
        />
      </label>

      <button
        type="button"
        className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-indigo-600/20 hover:bg-indigo-700"
      >
        <Copy className="h-4 w-4" />
        Copy
      </button>
    </article>
  )
}

export default QuickInviteCard
