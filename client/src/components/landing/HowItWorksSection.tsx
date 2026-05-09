import { ClipboardList, Send, Sparkles, UserPlus } from 'lucide-react'

const steps = [
  {
    title: 'Create Workspace',
    description: 'Start a shared space for projects, boards, tasks, and team activity.',
    icon: Sparkles,
  },
  {
    title: 'Invite Team',
    description: 'Add teammates, assign roles, and bring everyone into the same workflow.',
    icon: UserPlus,
  },
  {
    title: 'Track Progress',
    description: 'Watch updates arrive in real time as work moves from planning to done.',
    icon: ClipboardList,
  },
]

function HowItWorksSection() {
  return (
    <section id="how-it-works" className="bg-white/70 py-20">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
        <div>
          <p className="text-sm font-bold uppercase tracking-wider text-indigo-600">Process</p>
          <h2 className="mt-3 max-w-2xl text-3xl font-black text-slate-950 sm:text-4xl">
            Get up and running in minutes, not hours.
          </h2>

          <div className="mt-12 space-y-0">
            {steps.map((step, index) => {
              const Icon = step.icon
              const isLast = index === steps.length - 1

              return (
                <div key={step.title} className="relative flex gap-5 pb-10 last:pb-0">
                  {!isLast ? <div className="absolute left-6 top-14 h-[calc(100%-3.5rem)] w-px bg-indigo-100" /> : null}
                  <div className="relative z-10 inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-200">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="pt-1">
                    <p className="text-sm font-bold text-indigo-600">Step 0{index + 1}</p>
                    <h3 className="mt-2 text-xl font-black text-slate-950">{step.title}</h3>
                    <p className="mt-3 max-w-md text-sm leading-6 text-slate-600">{step.description}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="relative">
          <div className="absolute -inset-5 rounded-[2.25rem] bg-indigo-100/70 blur-2xl" />
          <div className="relative rounded-3xl border border-indigo-100 bg-white p-5 shadow-2xl shadow-indigo-100/70">
            <div className="rounded-2xl bg-[#faf8ff] p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-black text-slate-950">Team Collaboration</p>
                  <p className="mt-1 text-xs font-medium text-slate-500">Workspace setup preview</p>
                </div>
                <span className="inline-flex items-center justify-center rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700">
                  3 active members
                </span>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-[0.8fr_1.2fr]">
                <div className="space-y-3">
                  {['AL', 'MR', 'SN'].map((initials) => (
                    <div key={initials} className="flex items-center gap-3 rounded-2xl bg-white p-3 shadow-sm">
                      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-sm font-black text-indigo-700">
                        {initials}
                      </span>
                      <div>
                        <div className="h-2 w-20 rounded-full bg-slate-300" />
                        <div className="mt-2 h-2 w-14 rounded-full bg-slate-200" />
                      </div>
                      <span className="ml-auto h-2 w-2 rounded-full bg-emerald-500" />
                    </div>
                  ))}
                </div>

                <div className="rounded-2xl bg-white p-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Sprint progress</p>
                    <Send className="h-4 w-4 text-indigo-600" />
                  </div>
                  <div className="mt-5 space-y-4">
                    <div>
                      <div className="flex justify-between text-xs font-bold text-slate-600">
                        <span>Design system</span>
                        <span>80%</span>
                      </div>
                      <div className="mt-2 h-2 rounded-full bg-indigo-50">
                        <div className="h-2 w-4/5 rounded-full bg-indigo-600" />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs font-bold text-slate-600">
                        <span>API review</span>
                        <span>55%</span>
                      </div>
                      <div className="mt-2 h-2 rounded-full bg-indigo-50">
                        <div className="h-2 w-[55%] rounded-full bg-emerald-500" />
                      </div>
                    </div>
                    <div className="rounded-2xl border border-indigo-100 bg-[#faf8ff] p-3">
                      <div className="h-2 w-24 rounded-full bg-indigo-200" />
                      <div className="mt-3 h-2 w-full rounded-full bg-slate-200" />
                      <div className="mt-2 h-2 w-2/3 rounded-full bg-slate-200" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HowItWorksSection
