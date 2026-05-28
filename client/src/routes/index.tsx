import { createBrowserRouter } from 'react-router-dom'
import ErrorFallback from '../components/common/ErrorFallback'
import ProtectedRoute, { PublicOnlyRoute } from '../components/guards/ProtectedRoute'
import DashboardLayout from '../layouts/DashboardLayout'
import Login from '../pages/auth/Login'
import Register from '../pages/auth/Register'
import Activity from '../pages/dashboard/Activity'
import Boards from '../pages/dashboard/Boards'
import DashboardHome from '../pages/dashboard/DashboardHome'
import Members from '../pages/dashboard/Members'
import MyTasks from '../pages/dashboard/MyTasks'
import Profile from '../pages/dashboard/Profile'
import ProjectBoard from '../pages/dashboard/ProjectBoard'
import Settings from '../pages/dashboard/Settings'
import TaskDetails from '../pages/dashboard/TaskDetails'
import Workspaces from '../pages/dashboard/Workspaces'
import JoinWorkspace from '../pages/JoinWorkspace'
import Landing from '../pages/public/Landing'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Landing />,
    errorElement: <ErrorFallback />,
  },
  {
    path: '/landing',
    element: <Landing />,
    errorElement: <ErrorFallback />,
  },
  {
    path: '/login',
    element: (
      <PublicOnlyRoute>
        <Login />
      </PublicOnlyRoute>
    ),
    errorElement: <ErrorFallback />,
  },
  {
    path: '/register',
    element: (
      <PublicOnlyRoute>
        <Register />
      </PublicOnlyRoute>
    ),
    errorElement: <ErrorFallback />,
  },
  {
    path: '/join/:inviteCode',
    element: <JoinWorkspace />,
    errorElement: <ErrorFallback />,
  },
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    errorElement: <ErrorFallback />,
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
        path: 'boards',
        element: <Boards />,
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
      {
        path: 'profile',
        element: <Profile />,
      },
    ],
  },
  {
    path: '/project-board',
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    errorElement: <ErrorFallback />,
    children: [
      {
        index: true,
        element: <ProjectBoard />,
      },
    ],
  },
])
