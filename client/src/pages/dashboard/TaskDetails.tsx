import TaskActionButtons from '../../components/task-details/TaskActionButtons'
import TaskActivityHistory from '../../components/task-details/TaskActivityHistory'
import TaskDescription from '../../components/task-details/TaskDescription'
import TaskDetailsHeader from '../../components/task-details/TaskDetailsHeader'
import TaskDiscussion from '../../components/task-details/TaskDiscussion'
import TaskProperties from '../../components/task-details/TaskProperties'

function TaskDetails() {
  return (
    <div className="mx-auto max-w-[1440px] space-y-6">
      <TaskDetailsHeader />

      <div className="grid gap-6 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-8">
          <TaskDescription />
          <TaskDiscussion />
        </div>

        <aside className="space-y-6 lg:col-span-4">
          <TaskProperties />
          <TaskActionButtons />
          <TaskActivityHistory />
        </aside>
      </div>
    </div>
  )
}

export default TaskDetails
