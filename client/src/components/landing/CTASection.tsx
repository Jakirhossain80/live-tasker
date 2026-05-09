import { ArrowRight, Calendar } from 'lucide-react'
import { Link } from 'react-router-dom'

function CTASection() {
  return (
    <section className="bg-white/70 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-slate-950 px-6 py-12 text-white shadow-2xl shadow-indigo-200 sm:px-10 lg:p-16">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.35),transparent_28rem)]" />
          <div className="relative mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-black sm:text-4xl lg:text-5xl">Ready to boost your team's velocity?</h2>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-300">
              Join teams using LiveTasker to coordinate work, track progress, and keep every project moving in real
              time.
            </p>
          </div>

          <div className="relative mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              to="/register"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-indigo-700 shadow-lg shadow-indigo-950/20 hover:bg-indigo-50"
            >
              Get Started for Free
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href="#how-it-works"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/10 px-5 py-3 text-sm font-bold text-white backdrop-blur hover:bg-white/15"
            >
              <Calendar className="h-4 w-4" />
              Schedule a Demo
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CTASection
