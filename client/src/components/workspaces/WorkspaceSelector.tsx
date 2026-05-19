import { FolderKanban } from 'lucide-react'
import type { Workspace } from '../../api/workspaces'

type WorkspaceSelectorProps = {
  workspaces: Workspace[]
  selectedWorkspaceId: string
  onChange: (workspaceId: string) => void
}

function WorkspaceSelector({ workspaces, selectedWorkspaceId, onChange }: WorkspaceSelectorProps) {
  return (
    <label className="block w-full sm:max-w-xs">
      <span className="text-sm font-semibold text-slate-700">Current Workspace</span>
      <div className="relative mt-2">
        <FolderKanban className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <select
          value={selectedWorkspaceId}
          onChange={(event) => onChange(event.target.value)}
          className="h-11 w-full appearance-none rounded-lg border border-slate-200 bg-white px-10 text-sm font-semibold text-slate-900 outline-none transition focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100"
        >
          {workspaces.map((workspace) => (
            <option key={workspace._id} value={workspace._id}>
              {workspace.name}
            </option>
          ))}
        </select>
      </div>
    </label>
  )
}

export default WorkspaceSelector
