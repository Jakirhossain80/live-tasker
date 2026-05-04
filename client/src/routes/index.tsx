import { createBrowserRouter } from 'react-router-dom'
import DashboardLayout from '../layouts/DashboardLayout'
import DashboardHome from '../pages/dashboard/DashboardHome'
import ProjectBoard from '../pages/dashboard/ProjectBoard'

export const router = createBrowserRouter([
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
        path: 'dashboard/boards/:boardId',
        element: <ProjectBoard />,
      },
      {
        path: 'project-board',
        element: <ProjectBoard />,
      },
    ],
  },
])
