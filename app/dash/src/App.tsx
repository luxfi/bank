import { BrowserRouter, Routes, Route, Navigate } from 'react-router'
import { BrandProvider } from '@/hooks/brand'
import { AuthProvider, useAuth } from '@/hooks/useAuth'
import { Layout } from '@/components/Layout'
import { Landing } from '@/pages/Landing'
import { Login } from '@/pages/Login'
import { Signup } from '@/pages/Signup'
import { Callback } from '@/pages/Callback'
import { Dashboard } from '@/pages/Dashboard'
import { Accounts } from '@/pages/Accounts'
import { Cards } from '@/pages/Cards'
import { Send } from '@/pages/Send'
import { Exchange } from '@/pages/Exchange'
import { Wallet } from '@/pages/Wallet'
import { Activity } from '@/pages/Activity'
import { Spinner } from '@/components/ui'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth()
  if (isLoading)
    return (
      <div className="min-h-screen grid place-items-center text-[var(--color-fg-subtle)]">
        <Spinner className="w-6 h-6" />
      </div>
    )
  if (!isAuthenticated) return <Navigate to="/login" replace />
  return <>{children}</>
}

export function App() {
  return (
    <BrowserRouter>
      <BrandProvider>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/callback" element={<Callback />} />
          <Route
            path="/app"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="accounts" element={<Accounts />} />
            <Route path="cards" element={<Cards />} />
            <Route path="send" element={<Send />} />
            <Route path="exchange" element={<Exchange />} />
            <Route path="wallet" element={<Wallet />} />
            <Route path="activity" element={<Activity />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
      </BrandProvider>
    </BrowserRouter>
  )
}
