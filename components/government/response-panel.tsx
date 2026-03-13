'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card } from '@/components/ui/card'
import { Mic } from 'lucide-react'

interface GovernmentResponsePanelProps {
  complaintId: string
  onSubmit?: (data: {
    responseText: string
    deadlineDate?: Date
    audioUrl?: string
  }) => Promise<void>
  isLoading?: boolean
}

export default function GovernmentResponsePanel({
  complaintId,
  onSubmit,
  isLoading = false,
}: GovernmentResponsePanelProps) {
  const [responseText, setResponseText] = useState('')
  const [deadlineDate, setDeadlineDate] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async () => {
    if (!responseText.trim()) {
      setError('Please enter a response')
      return
    }

    try {
      setError(null)
      await onSubmit?.({
        responseText,
        deadlineDate: deadlineDate ? new Date(deadlineDate) : undefined,
      })
      setResponseText('')
      setDeadlineDate('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit response')
    }
  }

  return (
    <Card className="bg-secondary/50 border-border p-4 mt-4">
      <h4 className="text-sm font-semibold text-foreground mb-3">Government Response</h4>
      
      <div className="space-y-3">
        {error && (
          <div className="p-2 bg-destructive/10 border border-destructive/50 rounded text-xs text-destructive">
            {error}
          </div>
        )}

        <div className="space-y-2">
          <label className="text-xs font-medium text-foreground">Response Message</label>
          <Textarea
            value={responseText}
            onChange={(e) => setResponseText(e.target.value)}
            placeholder="Enter government response to the citizen..."
            className="min-h-20 bg-background border-border text-foreground placeholder:text-muted-foreground resize-none text-sm"
            disabled={isLoading}
            maxLength={500}
          />
          <p className="text-xs text-muted-foreground text-right">
            {responseText.length}/500
          </p>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-medium text-foreground uppercase tracking-widest font-bold">Set Resolution Deadline</label>
          <input
            type="datetime-local"
            value={deadlineDate}
            onChange={(e) => setDeadlineDate(e.target.value)}
            className="w-full px-3 py-2 bg-background border border-border text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-accent text-sm"
            disabled={isLoading}
          />
        </div>

        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="border-border hover:bg-background gap-2 text-xs"
            disabled={isLoading}
          >
            <Mic className="w-3 h-3" />
            Record Audio
          </Button>
        </div>

        <Button
          onClick={handleSubmit}
          disabled={isLoading}
          className="w-full bg-accent hover:bg-accent/90 text-accent-foreground text-sm"
          size="sm"
        >
          {isLoading ? 'Submitting...' : 'Submit Government Response'}
        </Button>
      </div>
    </Card>
  )
}
