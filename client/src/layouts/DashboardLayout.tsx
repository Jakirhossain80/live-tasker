import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '../components/layout/Sidebar'
import TopNavbar from '../components/layout/TopNavbar'
import MainContent from './MainContent'

function DashboardLayout() {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)

  function openMobileSidebar() {
    setIsMobileSidebarOpen(true)
  }

  function closeMobileSidebar() {
    setIsMobileSidebarOpen(false)
  }

  return (
    <div className="min-h-screen bg-[#faf8ff] text-slate-900">
      <Sidebar isMobileOpen={isMobileSidebarOpen} onClose={closeMobileSidebar} />
      <TopNavbar onMenuClick={openMobileSidebar} isSidebarOpen={isMobileSidebarOpen} />
      <MainContent>
        <Outlet />
      </MainContent>
    </div>
  )
}

export default DashboardLayout
