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
import { useNavigate } from 'react-router-dom'
import ProfileActivityCard from '../../components/profile/ProfileActivityCard'
import ProfileHeader from '../../components/profile/ProfileHeader'
import ProfileInfoCard from '../../components/profile/ProfileInfoCard'
import ProfileQuickActions from '../../components/profile/ProfileQuickActions'
import ProfileStats from '../../components/profile/ProfileStats'
import { useAuthStore } from '../../store/auth.store'
import type { ProfileActivity } from '../../components/profile/ProfileActivityCard'
import type { ProfileHeaderData } from '../../components/profile/ProfileHeader'
import type { ProfileInfoItem } from '../../components/profile/ProfileInfoCard'
import type { ProfileQuickAction } from '../../components/profile/ProfileQuickActions'
import type { ProfileStat } from '../../components/profile/ProfileStats'

const NOT_PROVIDED = 'Not provided'

function getDisplayValue(value?: string | null) {
  const trimmedValue = value?.trim()

  return trimmedValue || NOT_PROVIDED
}

function getInitials(name?: string | null, email?: string | null) {
  const trimmedName = name?.trim()

  if (trimmedName) {
    const initials = trimmedName
      .split(/\s+/)
      .map((part) => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase()

    if (initials) {
      return initials
    }
  }

  const trimmedEmail = email?.trim()

  if (trimmedEmail) {
    return trimmedEmail[0].toUpperCase()
  }

  return 'LT'
}

// Demo stats are intentionally separate from authenticated user identity until profile stats are API-backed.
const demoStats: ProfileStat[] = [
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
  { id: 'edit-profile', label: 'Edit Profile', icon: Pencil },
  { id: 'change-password', label: 'Change Password', icon: KeyRound },
  { id: 'manage-notifications', label: 'Manage Notifications', icon: Bell },
]

function Profile() {
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)
  const name = getDisplayValue(user?.name)
  const email = getDisplayValue(user?.email)

  const profile: ProfileHeaderData = {
    name,
    title: NOT_PROVIDED,
    email,
    initials: getInitials(user?.name, user?.email),
    workspaceRole: NOT_PROVIDED,
    bio: NOT_PROVIDED,
  }

  const profileDetails: ProfileInfoItem[] = [
    { label: 'Full Name', value: name },
    { label: 'Email', value: email },
    { label: 'Job Title', value: NOT_PROVIDED },
    { label: 'Timezone', value: NOT_PROVIDED },
    { label: 'Joined Date', value: NOT_PROVIDED },
    { label: 'Workspace Role', value: NOT_PROVIDED },
  ]

  function handleProfileSettingsNavigation() {
    navigate('/dashboard/settings')
  }

  function handleViewAllActivity() {
    navigate('/dashboard/activity')
  }

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
          <ProfileHeader profile={profile} onEditProfile={handleProfileSettingsNavigation} />
          <ProfileStats stats={demoStats} />
          <ProfileActivityCard activities={activities} onViewAll={handleViewAllActivity} />
        </div>

        <aside className="space-y-6">
          <ProfileInfoCard details={profileDetails} />
          <ProfileQuickActions actions={quickActions} onActionClick={handleProfileSettingsNavigation} />
        </aside>
      </section>
    </div>
  )
}

export default Profile
