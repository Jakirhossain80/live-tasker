import { Check } from 'lucide-react'
import { Link } from 'react-router-dom'

const plans = [
  {
    name: 'Free',
    price: '$0',
    suffix: '/mo',
    features: ['Up to 3 members', '5 active workspaces', 'Basic board view'],
    button: 'Get Started',
    highlighted: false,
  },
  {
    name: 'Pro',
    price: '$19',
    suffix: '/mo',
    badge: 'Popular',
    features: ['Unlimited members', 'Unlimited workspaces', 'Advanced reporting', 'Custom roles'],
    button: 'Start Free Trial',
    highlighted: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    suffix: '',
    features: ['SSO & SAML', 'Dedicated support', 'Custom contract'],
    button: 'Contact Sales',
    highlighted: false,
  },
]

function PricingSection() {
  return (
    <section id="pricing" className="bg-[#faf8ff] py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-bold uppercase tracking-wider text-indigo-600">Pricing</p>
          <h2 className="mt-3 text-3xl font-black text-slate-950 sm:text-4xl">Simple, transparent pricing</h2>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {plans.map((plan) => (
            <article
              key={plan.name}
              className={`rounded-3xl border p-6 shadow-xl ${
                plan.highlighted
                  ? 'border-indigo-500 bg-indigo-600 text-white shadow-indigo-200'
                  : 'border-indigo-100 bg-white/90 shadow-indigo-100/50'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <h3 className={`text-xl font-bold ${plan.highlighted ? 'text-white' : 'text-slate-950'}`}>{plan.name}</h3>
                {plan.badge ? (
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-indigo-700">{plan.badge}</span>
                ) : null}
              </div>
              <div className="mt-6 flex items-end gap-1">
                <span className="text-4xl font-black">{plan.price}</span>
                {plan.suffix ? (
                  <span className={`pb-1 text-sm ${plan.highlighted ? 'text-indigo-100' : 'text-slate-500'}`}>
                    {plan.suffix}
                  </span>
                ) : null}
              </div>

              <ul className="mt-6 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-sm">
                    <Check className={`h-4 w-4 ${plan.highlighted ? 'text-white' : 'text-emerald-600'}`} />
                    <span className={plan.highlighted ? 'text-white' : 'text-slate-700'}>{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                to="/register"
                className={`mt-8 inline-flex w-full items-center justify-center rounded-xl px-4 py-3 text-sm font-bold ${
                  plan.highlighted
                    ? 'bg-white text-indigo-700 hover:bg-indigo-50'
                    : 'border border-indigo-100 bg-white text-slate-900 shadow-sm hover:bg-indigo-50'
                }`}
              >
                {plan.button}
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default PricingSection
