export type ProfileInfoItem = {
  label: string
  value: string
}

type ProfileInfoCardProps = {
  details: ProfileInfoItem[]
}

function getDisplayValue(value: string) {
  return value.trim() || 'Not provided'
}

function ProfileInfoCard({ details }: ProfileInfoCardProps) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="text-lg font-semibold text-slate-950">Profile Information</h3>

      <dl className="mt-5 space-y-4">
        {details.map((item) => (
          <div key={item.label} className="border-b border-slate-100 pb-4 last:border-b-0 last:pb-0">
            <dt className="text-xs font-bold uppercase text-slate-500">{item.label}</dt>
            <dd className="mt-1 break-words text-sm font-semibold text-slate-950">{getDisplayValue(item.value)}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}

export default ProfileInfoCard
