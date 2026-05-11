import MyTasksTableRow, { type MyTask } from './MyTasksTableRow'

type MyTasksTableProps = {
  tasks: MyTask[]
}

function MyTasksTable({ tasks }: MyTasksTableProps) {
  return (
    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-left">
          <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-5 py-3">Task</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3">Priority</th>
              <th className="px-5 py-3">Due Date</th>
              <th className="px-5 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <MyTasksTableRow key={task.id} task={task} />
            ))}
          </tbody>
        </table>
      </div>

      <footer className="flex flex-col gap-3 border-t border-slate-200 bg-slate-50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm font-medium text-slate-500">Showing {tasks.length} tasks</p>

        <div className="flex items-center gap-2">
          {['Previous', '1', '2', '3', 'Next'].map((item) => (
            <button
              key={item}
              type="button"
              className={`inline-flex h-9 min-w-9 items-center justify-center rounded-lg px-3 text-sm font-semibold transition ${
                item === '1'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-950'
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </footer>
    </section>
  )
}

export default MyTasksTable
