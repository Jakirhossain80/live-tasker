import {
  Bell,
  Boxes,
  CheckCircle2,
  ClipboardList,
  KeyRound,
  MessageSquareText,
  Pencil,
  UserPlus,
} from 'lucide-react'
import ProfileActivityCard from '../../components/profile/ProfileActivityCard'
import ProfileHeader from '../../components/profile/ProfileHeader'
import ProfileInfoCard from '../../components/profile/ProfileInfoCard'
import ProfileQuickActions from '../../components/profile/ProfileQuickActions'
import ProfileStats from '../../components/profile/ProfileStats'
import type { ProfileActivity } from '../../components/profile/ProfileActivityCard'
import type { ProfileHeaderData } from '../../components/profile/ProfileHeader'
import type { ProfileInfoItem } from '../../components/profile/ProfileInfoCard'
import type { ProfileQuickAction } from '../../components/profile/ProfileQuickActions'
import type { ProfileStat } from '../../components/profile/ProfileStats'

const profile: ProfileHeaderData = {
  name: 'Sarah Jenkins',
  title: 'Senior Product Designer',
  email: 's.jenkins@livetasker.com',
  initials: 'SJ',
  workspaceRole: 'ADMIN',
  bio: 'Senior Product Designer passionate about building scalable design systems and fostering collaborative team environments at LiveTasker.',
}

const profileDetails: ProfileInfoItem[] = [
  { label: 'Full Name', value: 'Sarah Jenkins' },
  { label: 'Email', value: 's.jenkins@livetasker.com' },
  { label: 'Job Title', value: 'Senior Product Designer' },
  { label: 'Timezone', value: 'PST (UTC-8)' },
  { label: 'Joined Date', value: 'Oct 2023' },
  { label: 'Workspace Role', value: 'Primary Administrator' },
]

const stats: ProfileStat[] = [
  {
    label: 'Assigned Tasks',
    value: '42',
    icon: ClipboardList,
    iconClassName: 'bg-indigo-50 text-indigo-600',
    hoverBorderClassName: 'hover:border-indigo-300',
  },
  {
    label: 'Completed Tasks',
    value: '128',
    icon: CheckCircle2,
    iconClassName: 'bg-emerald-50 text-emerald-600',
    hoverBorderClassName: 'hover:border-emerald-300',
  },
  {
    label: 'Workspaces',
    value: '4',
    icon: Boxes,
    iconClassName: 'bg-amber-50 text-amber-600',
    hoverBorderClassName: 'hover:border-amber-300',
  },
]

const activities: ProfileActivity[] = [
  {
    id: 1,
    title: "Completed 'UI Dashboard Redesign'",
    time: '2 hours ago',
    context: 'Product Design Workspace',
    icon: CheckCircle2,
    iconClassName: 'bg-emerald-50 text-emerald-600',
  },
  {
    id: 2,
    title: "Joined 'Marketing Workspace'",
    time: 'Yesterday at 4:30 PM',
    icon: UserPlus,
    iconClassName: 'bg-indigo-50 text-indigo-600',
  },
  {
    id: 3,
    title: "Commented on 'Sprint Planning Board'",
    time: 'Oct 12, 2023',
    context: 'Engineering Team',
    icon: MessageSquareText,
    iconClassName: 'bg-amber-50 text-amber-600',
  },
]

const quickActions: ProfileQuickAction[] = [
  { label: 'Edit Profile', icon: Pencil },
  { label: 'Change Password', icon: KeyRound },
  { label: 'Manage Notifications', icon: Bell },
]

function Profile() {
  return (
    <div className="mx-auto max-w-[1440px] space-y-6">
      <section>
        <h2 className="text-2xl font-bold text-slate-950 sm:text-3xl">My Profile</h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
          View your account information and recent workspace activity.
        </p>
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
        <div className="space-y-6">
          <ProfileHeader profile={profile} />
          <ProfileStats stats={stats} />
          <ProfileActivityCard activities={activities} />
        </div>

        <aside className="space-y-6">
          <ProfileInfoCard details={profileDetails} />
          <ProfileQuickActions actions={quickActions} />
        </aside>
      </section>
    </div>
  )
}

export default Profile
