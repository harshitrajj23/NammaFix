'use client'

import { createContext, useContext, ReactNode } from 'react'
import { User } from '@/lib/types'

interface AppContextType {
  user: User | null
  isLoading: boolean
  error: Error | null
}

const AppContext = createContext<AppContextType | undefined>(undefined)

interface AppProviderProps {
  children: ReactNode
  user?: User | null
}

export function AppProvider({ children, user = null }: AppProviderProps) {
  return (
    <AppContext.Provider value={{ user, isLoading: false, error: null }}>
      {children}
    </AppContext.Provider>
  )
}

export function useAppContext() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider')
  }
  return context
}

/**
 * Hook to get current user, returns null if not authenticated
 */
export function useCurrentUser() {
  const { user } = useAppContext()
  return user
}
