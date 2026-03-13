'use client'

import { useState, useEffect, useMemo } from 'react'
import { Clock, AlertCircle } from 'lucide-react'

interface DeadlineCountdownProps {
  deadlineAt: string | Date
  complaintId: string
  officerEmail?: string
  emailSent?: boolean
  onExceeded?: () => void
}

export default function DeadlineCountdown({
  deadlineAt,
  complaintId,
  officerEmail = 'government@nammafix.in',
  emailSent: initialEmailSent = false,
  onExceeded,
}: DeadlineCountdownProps) {
  const [timeLeft, setTimeLeft] = useState<number>(0)
  const [emailSent, setEmailSent] = useState(initialEmailSent)

  useEffect(() => {
    const targetDate = new Date(deadlineAt)

    const calculateTime = () => {
      const now = new Date()
      const diff = targetDate.getTime() - now.getTime()
      setTimeLeft(diff)

      // Trigger email if time is up and not already sent
      if (diff <= 0 && !emailSent) {
        setEmailSent(true)
        triggerEmail()
        onExceeded?.()
      }
    }

    const triggerEmail = async () => {
      try {
        console.log(`[Countdown] Deadline reached for ${complaintId}. Triggering email...`)
        const res = await fetch('/api/government/send-deadline-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ complaintId, officerEmail }),
        })
        if (!res.ok) throw new Error('Failed to trigger deadline email')
        console.log(`[Countdown] Email trigger successful for ${complaintId}`)
      } catch (err) {
        console.error('[Countdown] Email trigger error:', err)
      }
    }

    calculateTime()
    const interval = setInterval(calculateTime, 1000)

    return () => clearInterval(interval)
  }, [deadlineAt, complaintId, officerEmail, emailSent, onExceeded])

  const formatTime = (ms: number) => {
    if (ms <= 0) return '🚨 DEADLINE EXCEEDED'

    const seconds = Math.floor((ms / 1000) % 60)
    const minutes = Math.floor((ms / (1000 * 60)) % 60)
    const hours = Math.floor(ms / (1000 * 60 * 60))

    if (hours > 0) {
      return `⏳ ${hours}h ${minutes}m ${seconds}s remaining`
    }
    if (minutes > 0) {
      return `⏳ ${minutes}m ${seconds}s remaining`
    }
    return `⏳ ${seconds} seconds remaining`
  }

  const isExceeded = timeLeft <= 0

  return (
    <div className={`text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 ${isExceeded ? (emailSent ? 'text-orange-500' : 'text-red-500') : 'text-accent'}`}>
      {isExceeded ? (
        <>
          <div className={`w-1.5 h-1.5 rounded-full ${emailSent ? 'bg-orange-500' : 'bg-red-500 animate-pulse'}`} />
          <span>🚨 DEADLINE EXCEEDED</span>
        </>
      ) : (
        <>
          <div className="w-1.5 h-1.5 rounded-full bg-accent animate-ping" />
          <span>{formatTime(timeLeft)}</span>
        </>
      )}
    </div>
  )
}
