import useSWR from 'swr'
import { Notification } from '@/lib/types'

const fetcher = (url: string) => fetch(url).then(res => res.json())

export function useNotifications() {
  const { data, error, isLoading, mutate } = useSWR<Notification[]>(
    '/api/notifications',
    fetcher
  )

  const unreadCount = data?.filter(n => !n.read).length || 0

  return {
    notifications: data || [],
    unreadCount,
    isLoading,
    error,
    mutate,
  }
}

export async function markNotificationAsRead(notificationId: string) {
  const response = await fetch(`/api/notifications/${notificationId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ read: true }),
  })

  if (!response.ok) {
    throw new Error('Failed to mark notification as read')
  }

  return response.json()
}

export async function markAllNotificationsAsRead() {
  const response = await fetch('/api/notifications/mark-all-read', {
    method: 'PATCH',
  })

  if (!response.ok) {
    throw new Error('Failed to mark all notifications as read')
  }

  return response.json()
}
