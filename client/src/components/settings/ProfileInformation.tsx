import { Camera } from 'lucide-react'

type ProfileInformationProps = {
  profile: {
    fullName: string
    email: string
    jobTitle: string
    initials: string
  }
}

function ProfileInformation({ profile }: ProfileInformationProps) {
  const inputClassName =
    'w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100'

  return (
    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 bg-slate-50/50 px-5 py-4">
        <div className="flex items-center justify-between gap-4">
          <h3 className="text-lg font-semibold text-slate-950">Profile Information</h3>
        </div>
      </div>

      <div className="flex flex-col gap-6 p-5 md:grid md:grid-cols-[132px_minmax(0,1fr)] md:items-start">
        <div className="flex justify-center md:justify-start">
          <div className="relative">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-indigo-100 text-2xl font-semibold text-indigo-700">
              {profile.initials}
            </div>
            <button
              type="button"
              className="absolute bottom-0 right-0 inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:ring-offset-2"
              aria-label="Change profile photo"
            >
              <Camera className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700">Full Name</span>
            <input
              type="text"
              defaultValue={profile.fullName}
              className={inputClassName}
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700">Email Address</span>
            <input
              type="email"
              defaultValue={profile.email}
              className={inputClassName}
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700">Job Title</span>
            <input
              type="text"
              defaultValue={profile.jobTitle}
              className={inputClassName}
            />
          </label>
        </div>
      </div>
    </section>
  )
}

export default ProfileInformation
