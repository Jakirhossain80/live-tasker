import type { ReactNode } from 'react'

type MainContentProps = {
  children: ReactNode
}

function MainContent({ children }: MainContentProps) {
  return <main className="min-h-screen bg-[#faf8ff] px-4 pb-8 pt-20 sm:px-6 md:ml-[280px] lg:px-8">{children}</main>
}

export default MainContent
