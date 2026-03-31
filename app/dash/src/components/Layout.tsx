import { useState } from 'react'
import { NavLink, Outlet } from 'react-router'
import { useAuth } from '@/hooks/useAuth'

const nav = [
  { to: '/', label: 'Dashboard' },
  { to: '/accounts', label: 'Accounts' },
  { to: '/transactions', label: 'Transactions' },
  { to: '/payments', label: 'Payments' },
  { to: '/conversions', label: 'Conversions' },
  { to: '/beneficiaries', label: 'Beneficiaries' },
  { to: '/documents', label: 'Documents' },
] as const

function linkClass({ isActive }: { isActive: boolean }) {
  return `block rounded-md px-3 py-2 text-sm font-medium transition-colors ${
    isActive
      ? 'bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900'
      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white'
  }`
}

export function Layout() {
  const { user, logout } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const email = (user?.email as string) || ''

  return (
    <div className="flex h-full">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950 transition-transform lg:static lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-14 items-center border-b border-gray-200 px-4 dark:border-gray-800">
          <span className="text-lg font-semibold">Bank</span>
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {nav.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.to === '/'}
              className={linkClass}
              onClick={() => setSidebarOpen(false)}
            >
              {n.label}
            </NavLink>
          ))}
        </nav>
        <div className="border-t border-gray-200 p-3 dark:border-gray-800">
          <p className="truncate text-xs text-gray-500 dark:text-gray-400">{email}</p>
          <button
            onClick={logout}
            className="mt-2 w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            Sign out
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-14 items-center border-b border-gray-200 px-4 dark:border-gray-800 lg:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="mr-3 rounded-md p-1.5 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
            aria-label="Open menu"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <span className="text-lg font-semibold">Bank</span>
        </header>
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
