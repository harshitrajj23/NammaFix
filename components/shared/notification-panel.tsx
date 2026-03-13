'use client'

import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useNotifications, markNotificationAsRead, markAllNotificationsAsRead } from '@/hooks/use-notifications'
import { Skeleton } from '@/components/ui/skeleton'

interface NotificationPanelProps {
  onClose: () => void
}

export default function NotificationPanel({ onClose }: NotificationPanelProps) {
  const { notifications, isLoading, mutate } = useNotifications()

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await markNotificationAsRead(notificationId)
      mutate()
    } catch (error) {
      console.error('Failed to mark notification as read:', error)
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead()
      mutate()
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error)
    }
  }

  const unreadNotifications = notifications.filter(n => !n.read)

  return (
    <div className="fixed inset-0 top-16 z-40 bg-black/50 backdrop-blur-sm">
      <div className="absolute right-0 top-16 w-full sm:w-96 bg-card border-l border-border shadow-lg max-h-[calc(100vh-4rem)] overflow-y-auto">
        <div className="sticky top-0 border-b border-border bg-card/95 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Notifications</h2>
            {unreadNotifications.length > 0 && (
              <p className="text-xs text-muted-foreground">{unreadNotifications.length} new</p>
            )}
          </div>
          <div className="flex items-center gap-2">
            {unreadNotifications.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleMarkAllAsRead}
                className="text-xs hover:bg-secondary"
              >
                Mark all read
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="hover:bg-secondary"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="p-4 space-y-3">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-16 bg-secondary rounded" />
            ))
          ) : notifications.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p className="text-sm">No notifications yet</p>
              <p className="text-xs mt-2">You'll see updates about your complaints here</p>
            </div>
          ) : (
            notifications.map(notification => (
              <button
                key={notification.id}
                onClick={() => handleMarkAsRead(notification.id)}
                className={`w-full text-left p-3 rounded transition-colors ${
                  notification.read 
                    ? 'bg-transparent hover:bg-secondary/50' 
                    : 'bg-secondary/50 hover:bg-secondary'
                }`}
              >
                <div className="flex items-start gap-3">
                  {!notification.read && (
                    <div className="mt-2 flex-shrink-0 h-2 w-2 bg-accent rounded-full" />
                  )}
                  <div className="flex-1">
                    <p className={`text-sm ${notification.read ? 'font-normal text-muted-foreground' : 'font-medium text-foreground'}`}>
                      {notification.title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">{notification.message}</p>
                    <p className="text-xs text-muted-foreground/60 mt-1">
                      {new Date(notification.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      <button
        className="absolute inset-0"
        onClick={onClose}
        aria-label="Close notifications"
      />
    </div>
  )
}
