'use client'

import { useState } from 'react'
import { Bell, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import NotificationPanel from '@/components/shared/notification-panel'
import { useNotifications } from '@/hooks/use-notifications'
import LogoutButton from '@/components/shared/logout-button'

interface NavbarProps {
  onNotificationClick?: () => void
}

export default function Navbar({ onNotificationClick }: NavbarProps) {
  const [showNotifications, setShowNotifications] = useState(false)
  const { unreadCount } = useNotifications()

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications)
    onNotificationClick?.()
  }

  return (
    <>
      <nav className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded bg-accent flex items-center justify-center">
              <span className="text-accent-foreground font-bold text-sm">NF</span>
            </div>
            <span className="text-xl font-bold text-foreground">NammaFix</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleNotificationClick}
              className="relative hover:bg-secondary"
              aria-label={`Notifications (${unreadCount} unread)`}
            >
              <Bell className="h-5 w-5 text-foreground" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 h-2 w-2 bg-accent rounded-full"></span>
              )}
            </Button>
            
            <LogoutButton 
              className="text-muted-foreground hover:text-foreground hover:bg-secondary ml-2" 
            />
          </div>
        </div>
      </nav>

      {showNotifications && (
        <NotificationPanel onClose={() => setShowNotifications(false)} />
      )}
    </>
  )
}
