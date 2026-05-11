import { ShieldCheck, TrendingUp, UserCog, Users } from 'lucide-react'
import MemberStatCard, { type MemberStatCardProps } from './MemberStatCard'

type MembersStatsProps = {
  totalMembers?: number
  adminMembers?: number
  activeMembers?: number
}

function MembersStats({ totalMembers = 0, adminMembers = 0, activeMembers = 0 }: MembersStatsProps) {
  const stats: MemberStatCardProps[] = [
    {
      label: 'Total Members',
      value: String(totalMembers),
      helper: 'Current workspace',
      helperClassName: 'text-emerald-600',
      icon: TrendingUp,
      iconClassName: 'bg-indigo-50 text-indigo-600',
    },
    {
      label: 'Admins',
      value: String(adminMembers),
      icon: UserCog,
      iconClassName: 'bg-slate-100 text-slate-600',
    },
    {
      label: 'Active Now',
      value: String(activeMembers),
      icon: ShieldCheck,
      iconClassName: 'bg-emerald-50 text-emerald-600',
      showPulse: activeMembers > 0,
    },
    {
      label: 'Available Seats',
      value: '0',
      helper: 'Seat limits unavailable',
      icon: Users,
      variant: 'primary',
    },
  ]

  return (
    <section className="grid grid-cols-1 gap-6 md:grid-cols-4">
      {stats.map((stat) => (
        <MemberStatCard key={stat.label} {...stat} />
      ))}
    </section>
  )
}

export default MembersStats
