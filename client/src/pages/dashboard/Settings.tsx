import { SlidersHorizontal } from 'lucide-react'
import AccountStatusCard from '../../components/settings/AccountStatusCard'
import InterfaceTheme from '../../components/settings/InterfaceTheme'
import NotificationPreferences from '../../components/settings/NotificationPreferences'
import ProfileInformation from '../../components/settings/ProfileInformation'
import SecuritySettings from '../../components/settings/SecuritySettings'
import SettingsActions from '../../components/settings/SettingsActions'
import UpgradeProCard from '../../components/settings/UpgradeProCard'

const profile = {
  fullName: 'Alex Henderson',
  email: 'alex.h@livetasker.com',
  jobTitle: 'Senior Product Designer',
  initials: 'AH',
}

function Settings() {
  return (
    <div className="mx-auto max-w-[1440px] space-y-6">
      <section className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
              <SlidersHorizontal className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-950 sm:text-3xl">Settings</h2>
              <p className="mt-1 text-sm text-slate-500">
                Manage your account preferences and workspace configuration.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
        <div className="space-y-6">
          <ProfileInformation profile={profile} />
          <SecuritySettings />
          <NotificationPreferences />
        </div>

        <aside className="space-y-6">
          <InterfaceTheme />
          <UpgradeProCard />
          <AccountStatusCard />
        </aside>
      </section>

      <SettingsActions />
    </div>
  )
}

export default Settings
