import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { getWorkspaceActivity, type ActivityLog } from '../../api/activity'
import { createComment, getComments, type Comment } from '../../api/comments'
import { getTaskById, type Task } from '../../api/tasks'
import CardSkeleton from '../../components/common/CardSkeleton'
import TaskActionButtons from '../../components/task-details/TaskActionButtons'
import TaskActivityHistory from '../../components/task-details/TaskActivityHistory'
import TaskDescription from '../../components/task-details/TaskDescription'
import TaskDetailsHeader from '../../components/task-details/TaskDetailsHeader'
import TaskDiscussion from '../../components/task-details/TaskDiscussion'
import TaskProperties from '../../components/task-details/TaskProperties'
import { useSocket } from '../../hooks/useSocket'

type CommentAddedPayload = {
  comment: Comment
}

function isValidTaskId(taskId?: string | null) {
  return Boolean(taskId && /^[a-f\d]{24}$/i.test(taskId))
}

function getCommentTaskId(comment: Comment) {
  return typeof comment.task === 'string' ? comment.task : comment.task._id
}

function getTaskBoardId(task: Task) {
  return typeof task.board === 'string' ? task.board : task.board._id
}

function getTaskWorkspaceId(task: Task) {
  return typeof task.workspace === 'string' ? task.workspace : task.workspace._id
}

function getActivityTaskId(activity: ActivityLog) {
  if (typeof activity.task === 'string') {
    return activity.task
  }

  if (activity.task) {
    return activity.task._id
  }

  return activity.entityType === 'task' ? activity.entityId : undefined
}

function upsertComment(comments: Comment[], nextComment: Comment) {
  if (comments.some((comment) => comment._id === nextComment._id)) {
    return comments.map((comment) => (comment._id === nextComment._id ? nextComment : comment))
  }

  return [...comments, nextComment]
}

function TaskDetails() {
  const { taskId } = useParams()
  const hasValidTaskId = isValidTaskId(taskId)
  const queryClient = useQueryClient()
  const { socket, isConnected } = useSocket()
  const { data: task, isLoading: isTaskLoading } = useQuery({
    queryKey: ['task', taskId],
    queryFn: () => getTaskById(taskId as string),
    enabled: hasValidTaskId,
  })
  const {
    data: comments,
    isLoading: areCommentsLoading,
    isError: isCommentsError,
    error: commentsError,
  } = useQuery({
    queryKey: ['comments', taskId],
    queryFn: () => getComments(taskId as string),
    enabled: hasValidTaskId,
  })
  const boardId = task ? getTaskBoardId(task) : undefined
  const workspaceId = task ? getTaskWorkspaceId(task) : undefined
  const {
    data: activity,
    isLoading: isActivityLoading,
    isError: isActivityError,
    error: activityError,
  } = useQuery({
    queryKey: ['workspace-activity', workspaceId],
    queryFn: () => getWorkspaceActivity(workspaceId as string),
    enabled: Boolean(workspaceId),
  })
  const taskActivity =
    hasValidTaskId && taskId ? (activity ?? []).filter((activityLog) => getActivityTaskId(activityLog) === taskId) : []
  const createCommentMutation = useMutation({
    mutationFn: (content: string) => createComment(taskId as string, { content }),
    onSuccess: (comment) => {
      queryClient.setQueryData<Comment[]>(['comments', taskId], (currentComments = []) =>
        upsertComment(currentComments, comment),
      )

      if (workspaceId) {
        void queryClient.invalidateQueries({ queryKey: ['workspace-activity', workspaceId] })
      }

      toast.success('Comment added.')
    },
    onError: () => {
      toast.error('Could not add comment.')
    },
  })

  useEffect(() => {
    if (!boardId || !isConnected) {
      return
    }

    socket.emit('joinBoard', { boardId })

    return () => {
      if (socket.connected) {
        socket.emit('leaveBoard', { boardId })
      }
    }
  }, [boardId, isConnected, socket])

  useEffect(() => {
    if (!hasValidTaskId || !taskId) {
      return
    }

    function handleCommentAdded(payload: CommentAddedPayload) {
      if (getCommentTaskId(payload.comment) !== taskId) {
        return
      }

      queryClient.setQueryData<Comment[]>(['comments', taskId], (currentComments = []) =>
        upsertComment(currentComments, payload.comment),
      )

      if (workspaceId) {
        void queryClient.invalidateQueries({ queryKey: ['workspace-activity', workspaceId] })
      }
    }

    socket.on('commentAdded', handleCommentAdded)

    return () => {
      socket.off('commentAdded', handleCommentAdded)
    }
  }, [hasValidTaskId, queryClient, socket, taskId, workspaceId])

  if (isTaskLoading) {
    return (
      <div className="mx-auto max-w-[1440px] space-y-6">
        <CardSkeleton rows={3} showFooter />

        <div className="grid gap-6 lg:grid-cols-12">
          <div className="space-y-6 lg:col-span-8">
            <CardSkeleton rows={5} />
            <CardSkeleton rows={4} showFooter />
          </div>

          <aside className="space-y-6 lg:col-span-4">
            <CardSkeleton rows={4} />
            <CardSkeleton rows={2} />
          </aside>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-[1440px] space-y-6">
      <TaskDetailsHeader />

      <div className="grid gap-6 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-8">
          <TaskDescription />
          <TaskDiscussion
            comments={hasValidTaskId ? comments ?? [] : undefined}
            isLoading={areCommentsLoading}
            isSubmitting={createCommentMutation.isPending}
            onSubmitComment={(content) => {
              if (hasValidTaskId) {
                createCommentMutation.mutate(content)
              }
            }}
            errorMessage={
              isCommentsError
                ? commentsError instanceof Error
                  ? commentsError.message
                  : 'Could not load comments.'
                : undefined
            }
          />
        </div>

        <aside className="space-y-6 lg:col-span-4">
          <TaskProperties assignees={task?.assignees} />
          <TaskActionButtons />
          <TaskActivityHistory
            activities={workspaceId ? taskActivity : undefined}
            isLoading={isActivityLoading}
            errorMessage={
              isActivityError
                ? activityError instanceof Error
                  ? activityError.message
                  : 'Could not load activity.'
                : undefined
            }
          />
        </aside>
      </div>
    </div>
  )
}

export default TaskDetails
