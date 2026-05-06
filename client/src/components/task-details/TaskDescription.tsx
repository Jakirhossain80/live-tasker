import { FileText, Image, Paperclip } from 'lucide-react'

const bulletItems = [
  'Revise Endpoint reference for /v2/auth',
  'Add documentation for X-Rate-Limit-Retry headers',
  'Update GraphQL schema playground examples',
  'Mark /v1/search as deprecated with 3-month sunset notice',
]

const attachments = [
  {
    id: 1,
    fileName: 'api_spec_v2.4.pdf',
    icon: Paperclip,
  },
  {
    id: 2,
    fileName: 'schema_diagram.png',
    icon: Image,
  },
]

function TaskDescription() {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
          <FileText className="h-5 w-5" />
        </div>
        <h3 className="text-base font-bold text-slate-950">Description</h3>
      </div>

      <p className="mt-5 text-sm leading-6 text-slate-600">
        We need to perform a comprehensive update of our API documentation to reflect the recent changes in the v2.4
        core service release. This includes updating authentication endpoints, new rate limiting headers, and the
        deprecated legacy search parameters.
      </p>

      <ul className="mt-5 space-y-2 text-sm leading-6 text-slate-600">
        {bulletItems.map((item) => (
          <li key={item} className="flex gap-3">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-500" />
            <span>{item}</span>
          </li>
        ))}
      </ul>

      <div className="mt-6">
        <h4 className="text-sm font-semibold text-slate-950">Attachments</h4>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {attachments.map((attachment) => {
            const Icon = attachment.icon

            return (
              <button
                key={attachment.id}
                type="button"
                className="flex items-center gap-3 rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-3 text-left text-sm font-medium text-slate-700 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-indigo-600 shadow-sm">
                  <Icon className="h-4 w-4" />
                </span>
                <span className="min-w-0 truncate">{attachment.fileName}</span>
              </button>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default TaskDescription
