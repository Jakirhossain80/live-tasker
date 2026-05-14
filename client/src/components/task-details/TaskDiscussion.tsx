import { MessageSquare, Paperclip, Send } from 'lucide-react'
import type { Comment } from '../../api/comments'

const fallbackComments = [
  {
    id: 1,
    author: 'Sarah Chen',
    initials: 'SC',
    time: '10:24 AM',
    message:
      "I've uploaded the draft for the authentication section. Can someone from the security team review the JWT token examples?",
  },
  {
    id: 2,
    author: 'Marcus Wright',
    initials: 'MW',
    time: '11:15 AM',
    message: "Looking good Sarah. I'll take a look at the security examples before EOD today.",
  },
]

type TaskDiscussionProps = {
  comments?: Comment[]
  isLoading?: boolean
  errorMessage?: string
}

function getAuthorName(comment: Comment) {
  return typeof comment.author === 'string' ? 'Workspace member' : comment.author.name
}

function getAuthorInitials(comment: Comment) {
  return getAuthorName(comment)
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

function formatCommentTime(createdAt: string) {
  return new Intl.DateTimeFormat('en', {
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(createdAt))
}

function TaskDiscussion({ comments, isLoading = false, errorMessage }: TaskDiscussionProps) {
  const hasLiveComments = Array.isArray(comments)

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
          <MessageSquare className="h-5 w-5" />
        </div>
        <h3 className="text-base font-bold text-slate-950">Discussion</h3>
      </div>

      <div className="mt-5 space-y-5">
        {isLoading ? (
          <p className="text-sm font-medium text-slate-500">Loading comments...</p>
        ) : errorMessage ? (
          <p className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-700">
            {errorMessage}
          </p>
        ) : hasLiveComments ? (
          comments.length === 0 ? (
            <p className="text-sm font-medium text-slate-500">No comments yet.</p>
          ) : (
            comments.map((comment) => (
              <article key={comment._id} className="flex gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-xs font-semibold text-white">
                  {getAuthorInitials(comment)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="rounded-2xl rounded-tl-sm bg-slate-50 px-4 py-3">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                      <h4 className="text-sm font-semibold text-slate-950">{getAuthorName(comment)}</h4>
                      <span className="text-xs text-slate-400">{formatCommentTime(comment.createdAt)}</span>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{comment.content}</p>
                  </div>
                  <div className="mt-2 flex items-center gap-4 pl-1">
                    <button type="button" className="text-xs font-semibold text-slate-500 hover:text-indigo-700">
                      Reply
                    </button>
                    <button type="button" className="text-xs font-semibold text-slate-500 hover:text-indigo-700">
                      Like
                    </button>
                  </div>
                </div>
              </article>
            ))
          )
        ) : (
          fallbackComments.map((comment) => (
            <article key={comment.id} className="flex gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-xs font-semibold text-white">
                {comment.initials}
              </div>
              <div className="min-w-0 flex-1">
                <div className="rounded-2xl rounded-tl-sm bg-slate-50 px-4 py-3">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                    <h4 className="text-sm font-semibold text-slate-950">{comment.author}</h4>
                    <span className="text-xs text-slate-400">{comment.time}</span>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{comment.message}</p>
                </div>
                <div className="mt-2 flex items-center gap-4 pl-1">
                  <button type="button" className="text-xs font-semibold text-slate-500 hover:text-indigo-700">
                    Reply
                  </button>
                  <button type="button" className="text-xs font-semibold text-slate-500 hover:text-indigo-700">
                    Like
                  </button>
                </div>
              </div>
            </article>
          ))
        )}
      </div>

      <div className="mt-6 flex gap-3 border-t border-slate-200 pt-5">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-200 text-xs font-semibold text-slate-600">
          AR
        </div>
        <div className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-slate-50 p-3">
          <textarea
            rows={3}
            placeholder="Write a comment..."
            className="min-h-20 w-full resize-none bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
          />
          <div className="mt-3 flex items-center justify-between gap-3">
            <button
              type="button"
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:text-indigo-700"
              aria-label="Attach file"
            >
              <Paperclip className="h-4 w-4" />
            </button>
            <button
              type="button"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-indigo-600/20 hover:bg-indigo-700"
            >
              <Send className="h-4 w-4" />
              Send
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default TaskDiscussion
