import { Mail, Pencil } from 'lucide-react'

export type ProfileHeaderData = {
  name: string
  title: string
  email: string
  initials: string
  workspaceRole: string
  bio: string
}

type ProfileHeaderProps = {
  profile: ProfileHeaderData
}

function ProfileHeader({ profile }: ProfileHeaderProps) {
  return (
    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="h-32 bg-[linear-gradient(135deg,#eef2ff_0%,#c7d2fe_48%,#818cf8_100%)]" />

      <div className="px-5 pb-6 sm:px-6">
        <div className="-mt-14 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-end">
            <div className="relative h-28 w-28 shrink-0 rounded-xl border-4 border-white bg-indigo-600 shadow-sm">
              <div className="flex h-full w-full items-center justify-center rounded-lg text-3xl font-bold text-white">
                {profile.initials}
              </div>
              <span className="absolute -right-1 -top-1 h-5 w-5 rounded-full border-4 border-white bg-emerald-500" aria-label="Online" />
            </div>

            <div className="min-w-0 pt-1 sm:pb-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="break-words text-2xl font-bold text-slate-950 sm:text-3xl">{profile.name}</h2>
                <span className="inline-flex rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-bold uppercase text-indigo-700">
                  {profile.workspaceRole}
                </span>
              </div>
              <p className="mt-1 text-sm font-medium text-slate-600">{profile.title}</p>
              <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-500">
                <span className="inline-flex items-center gap-1.5">
                  <Mail className="h-4 w-4" />
                  {profile.email}
                </span>
              </div>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">{profile.bio}</p>
            </div>
          </div>

          <div className="flex shrink-0 lg:pb-1">
            <button
              type="button"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm shadow-indigo-600/20 transition hover:bg-indigo-700"
            >
              <Pencil className="h-4 w-4" />
              Edit Profile
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ProfileHeader
