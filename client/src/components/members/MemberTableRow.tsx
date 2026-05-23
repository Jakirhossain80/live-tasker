import { useEffect, useRef, useState } from 'react'
import { MoreVertical } from 'lucide-react'
import MemberStatusBadge, { type MemberStatus } from './MemberStatusBadge'

export type MemberRole = 'Owner' | 'Admin' | 'Member' | 'Guest'

export type Member = {
  id: string
  name: string
  email: string
  initials: string
  role: MemberRole
  status: MemberStatus
  note: string
  avatarClassName: string
}

type MemberTableRowProps = {
  member: Member
  isActionPending?: boolean
  isCurrentUser?: boolean
  onChangeRole: (member: Member) => void
  onRemove: (member: Member) => void
}

function MemberTableRow({
  member,
  isActionPending = false,
  isCurrentUser = false,
  onChangeRole,
  onRemove,
}: MemberTableRowProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [menuPosition, setMenuPosition] = useState({ left: 0, top: 0 })
  const buttonRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const isOwner = member.role === 'Owner'
  const cannotRemoveMember = isOwner || isCurrentUser

  useEffect(() => {
    if (!isMenuOpen) {
      return undefined
    }

    function closeMenuOnOutsideClick(event: MouseEvent) {
      if (buttonRef.current?.contains(event.target as Node) || menuRef.current?.contains(event.target as Node)) {
        return
      }

      setIsMenuOpen(false)
    }

    document.addEventListener('mousedown', closeMenuOnOutsideClick)

    return () => {
      document.removeEventListener('mousedown', closeMenuOnOutsideClick)
    }
  }, [isMenuOpen])

  function toggleMenu() {
    const buttonRect = buttonRef.current?.getBoundingClientRect()

    if (buttonRect) {
      setMenuPosition({
        left: Math.max(8, buttonRect.right - 160),
        top: buttonRect.bottom + 8,
      })
    }

    setIsMenuOpen((currentValue) => !currentValue)
  }

  function handleChangeRole() {
    setIsMenuOpen(false)
    onChangeRole(member)
  }

  function handleRemove() {
    setIsMenuOpen(false)
    onRemove(member)
  }

  return (
    <tr className="border-t border-slate-100 bg-white transition hover:bg-indigo-50/40">
      <td className="min-w-[280px] px-5 py-4">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold ${member.avatarClassName}`}
          >
            {member.initials}
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-950">{member.name}</p>
            <p className="mt-1 text-xs font-medium text-slate-500">{member.note}</p>
          </div>
        </div>
      </td>
      <td className="px-5 py-4">
        <span className="text-sm font-medium text-slate-600">{member.email}</span>
      </td>
      <td className="px-5 py-4">
        <MemberStatusBadge status={member.status} />
      </td>
      <td className="px-5 py-4">
        <select
          defaultValue={member.role}
          aria-label={`Role for ${member.name}`}
          className="rounded-lg border-0 bg-transparent px-0 py-1 text-sm font-semibold text-slate-700 outline-none transition hover:text-indigo-600 focus:text-indigo-600 focus:ring-0"
        >
          <option>Owner</option>
          <option>Admin</option>
          <option>Member</option>
          <option>Guest</option>
        </select>
      </td>
      <td className="px-5 py-4 text-right">
        <div className="relative inline-block text-left">
          <button
            ref={buttonRef}
            type="button"
            onClick={toggleMenu}
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700"
            aria-label={`More options for ${member.name}`}
            aria-expanded={isMenuOpen}
            aria-haspopup="menu"
          >
            <MoreVertical className="h-4 w-4" />
          </button>

          {isMenuOpen ? (
            <div
              ref={menuRef}
              role="menu"
              style={{ left: menuPosition.left, top: menuPosition.top }}
              className="fixed z-20 w-40 overflow-hidden rounded-lg border border-slate-200 bg-white py-1 text-left shadow-lg shadow-slate-900/10"
            >
              <button
                type="button"
                role="menuitem"
                onClick={handleChangeRole}
                disabled={isActionPending || isOwner}
                className="block w-full px-3 py-2 text-left text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:text-slate-300"
                title={isOwner ? 'Owner roles cannot be changed from this menu.' : undefined}
              >
                Change Role
              </button>
              <button
                type="button"
                role="menuitem"
                onClick={handleRemove}
                disabled={isActionPending || cannotRemoveMember}
                className="block w-full px-3 py-2 text-left text-sm font-medium text-rose-600 hover:bg-rose-50 disabled:cursor-not-allowed disabled:text-slate-300"
                title={
                  isOwner
                    ? 'Workspace owners cannot be removed from this menu.'
                    : isCurrentUser
                      ? 'You cannot remove yourself from this menu.'
                      : undefined
                }
              >
                Remove Member
              </button>
            </div>
          ) : null}
        </div>
      </td>
    </tr>
  )
}

export default MemberTableRow
