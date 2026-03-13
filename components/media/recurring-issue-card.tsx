'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { MapPin, AlertCircle } from 'lucide-react'
import { RecurringIssueInvestigation } from '@/lib/types'

interface RecurringIssueCardProps {
  issue: RecurringIssueInvestigation
  onViewDetails?: (issueId: string) => void
  isLoading?: boolean
}

const severityColors = {
  low: 'bg-green-500/10 text-green-400 hover:bg-green-500/20',
  medium: 'bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20',
  high: 'bg-red-500/10 text-red-400 hover:bg-red-500/20',
}

export default function RecurringIssueCard({
  issue,
  onViewDetails,
  isLoading = false,
}: RecurringIssueCardProps) {
  return (
    <Card className="bg-card border-border overflow-hidden hover:border-accent/50 transition-colors">
      <div className="p-6 space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-semibold text-foreground mb-2">{issue.title}</h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
              <MapPin className="w-4 h-4 flex-shrink-0" />
              <span>{issue.location}</span>
              {issue.constituency && (
                <>
                  <span>•</span>
                  <span>{issue.constituency}</span>
                </>
              )}
            </div>
          </div>
          <Badge className={severityColors[issue.severity]}>
            {issue.severity.charAt(0).toUpperCase() + issue.severity.slice(1)}
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Occurrences</p>
            <p className="text-lg font-bold text-accent">{issue.occurrences}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Contractor</p>
            <p className="text-sm text-foreground">{issue.assignedContractor || 'Unassigned'}</p>
          </div>
        </div>

        <div className="pt-2 border-t border-border">
          <p className="text-xs text-muted-foreground mb-3">
            Last reported: {issue.lastReportedAt instanceof Date 
              ? issue.lastReportedAt.toLocaleDateString() 
              : new Date(issue.lastReportedAt).toLocaleDateString()}
          </p>
          <Button
            onClick={() => onViewDetails?.(issue.id)}
            disabled={isLoading}
            className="w-full bg-accent hover:bg-accent/90 text-accent-foreground text-sm"
          >
            View Details
          </Button>
        </div>
      </div>
    </Card>
  )
}
