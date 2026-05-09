import { Activity, KanbanSquare, ShieldCheck, UsersRound } from 'lucide-react'

const features = [
  {
    title: 'Real-time Updates',
    description: 'See task movement, comments, and status changes instantly as teammates work across the board.',
    icon: Activity,
    className: 'lg:col-span-2',
  },
  {
    title: 'Drag & Drop Board',
    description: 'Move work through each stage with a fast, visual board built for daily project flow.',
    icon: KanbanSquare,
    className: '',
  },
  {
    title: 'Team Workspaces',
    description: 'Group projects, members, and task activity into shared spaces for every team or client.',
    icon: UsersRound,
    className: '',
  },
  {
    title: 'Role-Based Access',
    description: 'Give every teammate the right level of control without slowing down collaboration.',
    icon: ShieldCheck,
    className: 'lg:col-span-2',
    permissions: [
      { role: 'Project Lead', access: 'Full Access' },
      { role: 'Developer', access: 'Write Access' },
      { role: 'Guest', access: 'Read Only' },
    ],
  },
]

function FeaturesSection() {
  return (
    <section id="features" className="bg-[#faf8ff] py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-bold uppercase tracking-wider text-indigo-600">Features</p>
          <h2 className="mt-3 text-3xl font-black text-slate-950 sm:text-4xl">Everything you need to ship faster</h2>
          <p className="mt-4 text-base leading-7 text-slate-600">
            Powerful features designed to keep your workflow fluid and your team focused.
          </p>
        </div>

        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon

            return (
              <article
                key={feature.title}
                className={`group min-h-64 rounded-3xl border border-indigo-100 bg-white/90 p-6 shadow-xl shadow-indigo-100/40 transition duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-indigo-200/70 ${feature.className}`}
              >
                <div className="flex h-full flex-col">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 transition group-hover:bg-indigo-600 group-hover:text-white">
                    <Icon className="h-6 w-6" />
                  </span>
                  <h3 className="mt-6 text-xl font-black text-slate-950">{feature.title}</h3>
                  <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600">{feature.description}</p>

                  {feature.permissions ? (
                    <div className="mt-6 space-y-3">
                      {feature.permissions.map((permission) => (
                        <div
                          key={permission.role}
                          className="flex items-center justify-between gap-4 rounded-2xl border border-indigo-100 bg-[#faf8ff] px-4 py-3"
                        >
                          <span className="text-sm font-bold text-slate-800">{permission.role}</span>
                          <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700">
                            {permission.access}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="mt-auto pt-8">
                      <div className="h-2 rounded-full bg-indigo-50">
                        <div className="h-2 w-2/3 rounded-full bg-indigo-200 transition group-hover:w-5/6 group-hover:bg-indigo-500" />
                      </div>
                    </div>
                  )}
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default FeaturesSection
