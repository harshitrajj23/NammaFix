'use client'

import { Bell, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import LogoutButton from '@/components/shared/logout-button'

interface MediaNavbarProps {
  organizationName?: string
  onLogout?: () => void
}

export default function MediaNavbar({ organizationName, onLogout }: MediaNavbarProps) {
  const [showProfile, setShowProfile] = useState(false)

  return (
    <nav className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded bg-accent flex items-center justify-center">
            <span className="text-accent-foreground font-bold text-sm">NF</span>
          </div>
          <span className="text-xl font-bold text-foreground">NammaFix</span>
          <span className="text-xs text-muted-foreground ml-2">Media Portal</span>
        </div>
        
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="relative hover:bg-secondary"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5 text-foreground" />
          </Button>

          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowProfile(!showProfile)}
              className="hover:bg-secondary"
              aria-label="Profile menu"
            >
              <User className="h-5 w-5 text-foreground" />
            </Button>

            {showProfile && (
              <div className="absolute right-0 mt-2 w-48 rounded-lg bg-card border border-border shadow-lg py-2 z-50">
                {organizationName && (
                  <div className="px-4 py-2 border-b border-border">
                    <p className="text-sm font-medium text-foreground">{organizationName}</p>
                    <p className="text-xs text-muted-foreground">Media Organization</p>
                  </div>
                )}
                <LogoutButton
                  variant="ghost"
                  className="w-full justify-start px-4 py-2 text-sm text-foreground hover:bg-secondary transition-colors"
                  onLogout={onLogout}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
