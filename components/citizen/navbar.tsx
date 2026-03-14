'use client'

import { useState } from 'react'
import { Bell, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import NotificationPanel from '@/components/shared/notification-panel'
import { useNotifications } from '@/hooks/use-notifications'
import ProfileCard from './profile-card'

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
            <img src="/nammafix-logo.png" alt="NammaFix" className="h-8 w-8 object-contain" />
            <span className="text-xl font-bold text-foreground">Namma<span className="text-orange-500">Fix</span></span>
          </div>
          
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleNotificationClick}
              className="relative hover:bg-secondary rounded-full"
              aria-label={`Notifications (${unreadCount} unread)`}
            >
              <Bell className="h-5 w-5 text-foreground" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 h-2 w-2 bg-accent rounded-full border-2 border-card"></span>
              )}
            </Button>
            
            <ProfileCard />
          </div>
        </div>
      </nav>

      {showNotifications && (
        <NotificationPanel onClose={() => setShowNotifications(false)} />
      )}
    </>
  )
}
