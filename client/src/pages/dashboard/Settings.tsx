import { useEffect, useState } from 'react'
import { isAxiosError } from 'axios'
import { SlidersHorizontal } from 'lucide-react'
import { updateMyProfile } from '../../api/auth'
import AccountStatusCard from '../../components/settings/AccountStatusCard'
import InterfaceTheme from '../../components/settings/InterfaceTheme'
import NotificationPreferences from '../../components/settings/NotificationPreferences'
import ProfileInformation from '../../components/settings/ProfileInformation'
import SecuritySettings from '../../components/settings/SecuritySettings'
import SettingsActions from '../../components/settings/SettingsActions'
import UpgradeProCard from '../../components/settings/UpgradeProCard'
import { useAuthStore } from '../../store/auth.store'

const NOT_PROVIDED = 'Not provided'

type ApiErrorResponse = {
  message?: string
}

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

function Settings() {
  const [resetSignal, setResetSignal] = useState(0)
  const [settingsActionMessage, setSettingsActionMessage] = useState('')
  const [isSavingProfile, setIsSavingProfile] = useState(false)
  const user = useAuthStore((state) => state.user)
  const setUser = useAuthStore((state) => state.setUser)
  const isBootstrapped = useAuthStore((state) => state.isBootstrapped)
  const isProfileLoading = !isBootstrapped
  const [profileForm, setProfileForm] = useState({
    name: getDisplayValue(user?.name),
    email: getDisplayValue(user?.email),
    jobTitle: NOT_PROVIDED,
  })

  useEffect(() => {
    if (!isBootstrapped) {
      return
    }

    setProfileForm((currentProfileForm) => ({
      name: getDisplayValue(user?.name),
      email: getDisplayValue(user?.email),
      jobTitle: currentProfileForm.jobTitle || NOT_PROVIDED,
    }))
  }, [isBootstrapped, user?.email, user?.name])

  const profile = {
    fullName: profileForm.name,
    email: profileForm.email,
    jobTitle: profileForm.jobTitle,
    initials: getInitials(profileForm.name, profileForm.email),
    statusText: isProfileLoading
      ? 'Loading profile...'
      : user
        ? undefined
        : 'Profile information is unavailable.',
  }

  function handleProfileChange(field: 'name' | 'email' | 'jobTitle', value: string) {
    setProfileForm((currentProfileForm) => ({
      ...currentProfileForm,
      [field]: value,
    }))
  }

  function handleCancel() {
    setProfileForm({
      name: getDisplayValue(user?.name),
      email: getDisplayValue(user?.email),
      jobTitle: NOT_PROVIDED,
    })
    setResetSignal((currentSignal) => currentSignal + 1)
    setSettingsActionMessage('Settings reset to current account data.')
  }

  async function handleSaveChanges() {
    if (!user) {
      setSettingsActionMessage('Profile information is unavailable.')
      return
    }

    setIsSavingProfile(true)
    setSettingsActionMessage('')

    try {
      const result = await updateMyProfile({
        name: profileForm.name,
        email: profileForm.email,
      })

      setUser(result.user)
      setSettingsActionMessage('Profile updated successfully.')
    } catch (error) {
      if (isAxiosError<ApiErrorResponse>(error)) {
        setSettingsActionMessage(
          error.response?.data?.message || error.message || 'Could not update profile.',
        )
        return
      }

      setSettingsActionMessage(
        error instanceof Error ? error.message : 'Could not update profile.',
      )
    } finally {
      setIsSavingProfile(false)
    }
  }

  function handleDeleteWorkspace() {
    setSettingsActionMessage('Delete workspace API is not available yet.')
  }

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
          <ProfileInformation onProfileChange={handleProfileChange} profile={profile} />
          <SecuritySettings resetSignal={resetSignal} />
          <NotificationPreferences resetSignal={resetSignal} />
        </div>

        <aside className="space-y-6">
          <InterfaceTheme />
          <UpgradeProCard />
          <AccountStatusCard />
        </aside>
      </section>

      <SettingsActions
        isSaving={isSavingProfile}
        message={settingsActionMessage}
        onCancel={handleCancel}
        onDeleteWorkspace={handleDeleteWorkspace}
        onSaveChanges={handleSaveChanges}
      />
    </div>
  )
}

export default Settings
