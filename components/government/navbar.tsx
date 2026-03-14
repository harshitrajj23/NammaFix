'use client'

import { Bell, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import LogoutButton from '@/components/shared/logout-button'

interface GovNavbarProps {
  governmentName?: string
  onLogout?: () => void
}

export default function GovNavbar({ governmentName, onLogout }: GovNavbarProps) {
  const [showProfile, setShowProfile] = useState(false)

  return (
    <nav className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <img src="/nammafix-logo.png" alt="NammaFix" className="h-8 w-8 object-contain" />
            <span className="text-xl font-bold text-foreground">Namma<span className="text-orange-500">Fix</span></span>
            <span className="text-xs text-muted-foreground ml-2">Government Portal</span>
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
              aria-label="Profile"
            >
              <User className="h-5 w-5 text-foreground" />
            </Button>

            {showProfile && (
              <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-lg py-2 z-50">
                {governmentName && (
                  <div className="px-4 py-2 border-b border-border text-sm text-foreground">
                    {governmentName}
                  </div>
                )}
                <LogoutButton
                  variant="ghost"
                  className="w-full justify-start px-4 py-2 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
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
