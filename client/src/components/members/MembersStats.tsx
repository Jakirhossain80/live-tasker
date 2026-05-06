import { ShieldCheck, TrendingUp, UserCog, Users } from 'lucide-react'
import MemberStatCard, { type MemberStatCardProps } from './MemberStatCard'

const stats: MemberStatCardProps[] = [
  {
    label: 'Total Members',
    value: '24',
    helper: '+3 this month',
    helperClassName: 'text-emerald-600',
    icon: TrendingUp,
    iconClassName: 'bg-indigo-50 text-indigo-600',
  },
  {
    label: 'Admins',
    value: '4',
    icon: UserCog,
    iconClassName: 'bg-slate-100 text-slate-600',
  },
  {
    label: 'Active Now',
    value: '12',
    icon: ShieldCheck,
    iconClassName: 'bg-emerald-50 text-emerald-600',
    showPulse: true,
  },
  {
    label: 'Available Seats',
    value: '6',
    helper: 'Upgrade for more',
    icon: Users,
    variant: 'primary',
  },
]

function MembersStats() {
  return (
    <section className="grid grid-cols-1 gap-6 md:grid-cols-4">
      {stats.map((stat) => (
        <MemberStatCard key={stat.label} {...stat} />
      ))}
    </section>
  )
}

export default MembersStats
