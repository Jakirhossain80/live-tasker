import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider } from 'react-router-dom'
import { Toaster } from 'sonner'
import './index.css'
import AuthBootstrap from './components/auth/AuthBootstrap'
import ErrorBoundary from './components/common/ErrorBoundary'
import { router } from './routes'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <AuthBootstrap>
          <RouterProvider router={router} />
        </AuthBootstrap>
      </ErrorBoundary>
      <Toaster position="top-right" />
    </QueryClientProvider>
  </StrictMode>,
)
