import { CheckCircle2, CheckSquare } from 'lucide-react'

const footerGroups = [
  {
    title: 'Product',
    links: ['Features', 'Integrations', 'Security', 'Roadmap'],
  },
  {
    title: 'Company',
    links: ['About Us', 'Careers', 'Blog', 'Press'],
  },
  {
    title: 'Support',
    links: ['Help Center', 'Documentation', 'Contact', 'Status'],
  },
  {
    title: 'Legal',
    links: ['Privacy Policy', 'Terms of Service', 'Cookie Policy'],
  },
]

function LandingFooter() {
  return (
    <footer className="border-t border-indigo-100 bg-[#faf8ff]">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.15fr_2fr]">
          <div>
            <div className="flex items-center gap-2 text-slate-950">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-200">
                <CheckSquare className="h-5 w-5" />
              </span>
              <span className="text-lg font-bold">LiveTasker</span>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-6 text-slate-600">
              A real-time task management workspace for teams that need clear ownership, faster updates, and focused
              collaboration.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {footerGroups.map((group) => (
              <div key={group.title}>
                <h3 className="text-sm font-black text-slate-950">{group.title}</h3>
                <ul className="mt-4 space-y-3">
                  {group.links.map((link) => (
                    <li key={link}>
                      <a href="#" className="text-sm font-medium text-slate-500 hover:text-indigo-600">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-indigo-100 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-500">© 2024 LiveTasker Inc. All rights reserved.</p>
          <div className="inline-flex items-center gap-2 text-sm font-bold text-emerald-700">
            <CheckCircle2 className="h-4 w-4" />
            System Status: Healthy
          </div>
        </div>
      </div>
    </footer>
  )
}

export default LandingFooter
