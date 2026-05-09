import { createBrowserRouter } from 'react-router-dom'
import DashboardLayout from '../layouts/DashboardLayout'
import Login from '../pages/auth/Login'
import Register from '../pages/auth/Register'
import Activity from '../pages/dashboard/Activity'
import DashboardHome from '../pages/dashboard/DashboardHome'
import Members from '../pages/dashboard/Members'
import MyTasks from '../pages/dashboard/MyTasks'
import ProjectBoard from '../pages/dashboard/ProjectBoard'
import Settings from '../pages/dashboard/Settings'
import TaskDetails from '../pages/dashboard/TaskDetails'
import Workspaces from '../pages/dashboard/Workspaces'
import Landing from '../pages/public/Landing'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Landing />,
  },
  {
    path: '/landing',
    element: <Landing />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '/dashboard',
    element: <DashboardLayout />,
    children: [
      {
        index: true,
        element: <DashboardHome />,
      },
      {
        path: 'my-tasks',
        element: <MyTasks />,
      },
      {
        path: 'members',
        element: <Members />,
      },
      {
        path: 'workspaces',
        element: <Workspaces />,
      },
      {
        path: 'tasks/:taskId',
        element: <TaskDetails />,
      },
      {
        path: 'boards/:boardId',
        element: <ProjectBoard />,
      },
      {
        path: 'activity',
        element: <Activity />,
      },
      {
        path: 'settings',
        element: <Settings />,
      },
    ],
  },
  {
    path: '/project-board',
    element: <DashboardLayout />,
    children: [
      {
        index: true,
        element: <ProjectBoard />,
      },
    ],
  },
])
