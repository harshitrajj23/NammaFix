'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { MapPin } from 'lucide-react'
import { Issue } from '@/lib/types'

interface IssueCardProps {
  issue: Issue
  onConfirm?: (issueId: string) => void | Promise<void>
  onDeny?: (issueId: string) => void | Promise<void>
  compact?: boolean
  isLoading?: boolean
}

export default function IssueCard({
  issue,
  onConfirm,
  onDeny,
  compact = false,
  isLoading = false,
}: IssueCardProps) {
  return (
    <Card className="bg-card border-border overflow-hidden hover:border-accent/50 transition-colors">
      {/* Image placeholder area */}
      <div className="w-full h-40 bg-gradient-to-br from-secondary to-secondary/50 flex items-center justify-center">
        {issue.imageUrl ? (
          <img 
            src={issue.imageUrl} 
            alt={issue.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-muted">
              <MapPin className="w-6 h-6 text-muted-foreground" />
            </div>
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-foreground mb-2 line-clamp-2">{issue.title}</h3>
        
        <div className="flex items-center gap-2 mb-2 text-sm text-muted-foreground">
          <MapPin className="w-4 h-4 flex-shrink-0" />
          <span className="line-clamp-1">{issue.location}</span>
        </div>

        <div className="flex items-center gap-2 mb-4 text-xs text-muted-foreground">
          <span className="inline-block px-2 py-1 rounded bg-secondary">{issue.category}</span>
          <span>{issue.confirmations} confirmations</span>
        </div>

        {!compact && (
          <div className="flex gap-2">
            <Button
              onClick={() => onConfirm?.(issue.id)}
              disabled={isLoading}
              className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground"
              size="sm"
            >
              Confirm
            </Button>
            <Button
              onClick={() => onDeny?.(issue.id)}
              disabled={isLoading}
              variant="outline"
              className="flex-1 border-border hover:bg-secondary"
              size="sm"
            >
              Dispute
            </Button>
          </div>
        )}
      </div>
    </Card>
  )
}
