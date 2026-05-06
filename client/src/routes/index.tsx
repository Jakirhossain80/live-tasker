import { createBrowserRouter } from 'react-router-dom'
import DashboardLayout from '../layouts/DashboardLayout'
import Login from '../pages/auth/Login'
import Activity from '../pages/dashboard/Activity'
import DashboardHome from '../pages/dashboard/DashboardHome'
import MyTasks from '../pages/dashboard/MyTasks'
import ProjectBoard from '../pages/dashboard/ProjectBoard'
import TaskDetails from '../pages/dashboard/TaskDetails'

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/',
    element: <DashboardLayout />,
    children: [
      {
        index: true,
        element: <DashboardHome />,
      },
      {
        path: 'dashboard',
        element: <DashboardHome />,
      },
      {
        path: 'dashboard/my-tasks',
        element: <MyTasks />,
      },
      {
        path: 'dashboard/tasks/:taskId',
        element: <TaskDetails />,
      },
      {
        path: 'dashboard/boards/:boardId',
        element: <ProjectBoard />,
      },
      {
        path: 'project-board',
        element: <ProjectBoard />,
      },
      {
        path: 'dashboard/activity',
        element: <Activity />,
      },
    ],
  },
])
