export type ProfileInfoItem = {
  label: string
  value: string
}

type ProfileInfoCardProps = {
  details: ProfileInfoItem[]
}

function ProfileInfoCard({ details }: ProfileInfoCardProps) {
  const fallbackDetails =
    details.length > 0
      ? details
      : [
          { label: 'Full Name', value: 'Sarah Jenkins' },
          { label: 'Email', value: 's.jenkins@livetasker.com' },
          { label: 'Job Title', value: 'Senior Product Designer' },
          { label: 'Timezone', value: 'PST (UTC-8)' },
          { label: 'Joined Date', value: 'Oct 2023' },
          { label: 'Workspace Role', value: 'Primary Administrator' },
        ]

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="text-lg font-semibold text-slate-950">Profile Information</h3>

      <dl className="mt-5 space-y-4">
        {fallbackDetails.map((item) => (
          <div key={item.label} className="border-b border-slate-100 pb-4 last:border-b-0 last:pb-0">
            <dt className="text-xs font-bold uppercase text-slate-500">{item.label}</dt>
            <dd className="mt-1 break-words text-sm font-semibold text-slate-950">{item.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}

export default ProfileInfoCard
