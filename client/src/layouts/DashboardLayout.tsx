import { Outlet } from 'react-router-dom'
import Sidebar from '../components/layout/Sidebar'
import TopNavbar from '../components/layout/TopNavbar'
import MainContent from './MainContent'

function DashboardLayout() {
  return (
    <div className="min-h-screen bg-[#faf8ff] text-slate-900">
      <Sidebar />
      <TopNavbar />
      <MainContent>
        <Outlet />
      </MainContent>
    </div>
  )
}

export default DashboardLayout
