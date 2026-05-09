import { ArrowRight, BarChart3, CheckCircle2, PlayCircle } from 'lucide-react'
import { Link } from 'react-router-dom'

function HeroSection() {
  return (
    <section
      id="home"
      className="relative overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(99,102,241,0.18),transparent_34rem),radial-gradient(circle_at_80%_20%,rgba(168,85,247,0.12),transparent_28rem),#faf8ff]"
    >
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_0.92fr] lg:px-8 lg:py-20">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white/80 px-3 py-1 text-sm font-semibold text-indigo-700 shadow-sm shadow-indigo-100/70">
            <CheckCircle2 className="h-4 w-4" />
            Real-time Collaboration Active
          </div>

          <h1 className="mt-6 max-w-4xl text-4xl font-black leading-tight tracking-normal text-slate-950 sm:text-5xl lg:text-6xl">
            Manage Team Tasks in{' '}
            <span className="italic text-indigo-600">Real Time</span>
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
            LiveTasker keeps projects, assignments, discussions, and activity in sync with WebSocket-driven updates
            your team can see the moment work changes.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              to="/register"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white shadow-xl shadow-indigo-200 hover:bg-indigo-700"
            >
              Get Started for Free
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href="#how-it-works"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-indigo-100 bg-white/85 px-5 py-3 text-sm font-bold text-slate-800 shadow-sm hover:bg-white"
            >
              <PlayCircle className="h-4 w-4" />
              View Demo
            </a>
          </div>

          <div className="mt-10 grid max-w-xl grid-cols-3 gap-6 rounded-3xl border border-indigo-100 bg-white/70 p-5 shadow-lg shadow-indigo-100/50 backdrop-blur">
            <div>
              <p className="text-2xl font-black text-slate-950">12k+</p>
              <p className="mt-1 text-sm text-slate-500">Tasks tracked</p>
            </div>
            <div>
              <p className="text-2xl font-black text-slate-950">98%</p>
              <p className="mt-1 text-sm text-slate-500">On-time clarity</p>
            </div>
            <div>
              <p className="text-2xl font-black text-slate-950">24/7</p>
              <p className="mt-1 text-sm text-slate-500">Live activity</p>
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -inset-5 rounded-[2.25rem] bg-indigo-200/40 blur-2xl" />
          <div className="relative overflow-hidden rounded-3xl border border-white bg-white p-4 shadow-2xl shadow-indigo-200/70">
            <div className="rounded-2xl border border-slate-200 bg-[#faf8ff] p-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                <div>
                  <p className="text-sm font-bold text-slate-950">Live Project Board</p>
                  <p className="mt-1 text-xs text-slate-500">WebSocket updates active</p>
                </div>
                <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  Live
                </span>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                {['Backlog', 'In Progress', 'Done'].map((column, index) => (
                  <div key={column} className="rounded-xl border border-indigo-100 bg-white p-3 shadow-sm">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold text-slate-700">{column}</p>
                      <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-bold text-indigo-600">
                        {index + 3}
                      </span>
                    </div>
                    <div className="mt-3 space-y-3">
                      <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                        <div className="h-2 w-20 rounded-full bg-indigo-200" />
                        <div className="mt-3 h-2 w-full rounded-full bg-slate-200" />
                        <div className="mt-2 h-2 w-2/3 rounded-full bg-slate-200" />
                      </div>
                      <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                        <div className="h-2 w-16 rounded-full bg-emerald-200" />
                        <div className="mt-3 h-2 w-5/6 rounded-full bg-slate-200" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 rounded-2xl border border-indigo-100 bg-white p-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                    <BarChart3 className="h-5 w-5" />
                  </span>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-slate-950">Team activity synced</p>
                    <div className="mt-2 h-2 rounded-full bg-slate-100">
                      <div className="h-2 w-3/4 rounded-full bg-indigo-600" />
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

export default HeroSection
