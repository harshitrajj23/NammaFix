'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MapPin, Clock } from 'lucide-react'
import { HistoricalComplaint } from '@/lib/types'

interface HistoricalComplaintCardProps {
  complaint: HistoricalComplaint
  isLoading?: boolean
}

const statusColors = {
  resolved: 'bg-green-500/10 text-green-400',
  pending: 'bg-yellow-500/10 text-yellow-400',
  'in-progress': 'bg-blue-500/10 text-blue-400',
  rejected: 'bg-red-500/10 text-red-400',
}

export default function HistoricalComplaintCard({
  complaint,
  isLoading = false,
}: HistoricalComplaintCardProps) {
  const getDisplayStatus = (status: string) => {
    return status.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
  }

  return (
    <Card className="bg-card border-border overflow-hidden hover:border-accent/50 transition-colors">
      <div className="p-6 space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <p className="text-xs font-mono text-muted-foreground">{complaint.complaintId}</p>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
              <MapPin className="w-4 h-4 flex-shrink-0" />
              <span>{complaint.location}</span>
            </div>
          </div>
          <Badge className={statusColors[complaint.status as keyof typeof statusColors]}>
            {getDisplayStatus(complaint.status)}
          </Badge>
        </div>

        <div className="space-y-3 border-t border-border pt-4">
          <div className="flex items-start gap-3">
            <Clock className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-1" />
            <div className="text-sm space-y-1">
              <p className="text-muted-foreground text-xs">Created</p>
              <p className="text-foreground">
                {complaint.createdAt instanceof Date
                  ? complaint.createdAt.toLocaleDateString()
                  : new Date(complaint.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          {complaint.resolvedAt && (
            <div className="flex items-start gap-3">
              <Clock className="w-4 h-4 text-green-400 flex-shrink-0 mt-1" />
              <div className="text-sm space-y-1">
                <p className="text-muted-foreground text-xs">Resolved</p>
                <p className="text-foreground">
                  {complaint.resolvedAt instanceof Date
                    ? complaint.resolvedAt.toLocaleDateString()
                    : new Date(complaint.resolvedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          )}

          {complaint.resolutionTimeline && (
            <div className="bg-secondary/50 rounded px-3 py-2 text-xs text-muted-foreground">
              <p className="font-medium text-foreground mb-1">Resolution Timeline</p>
              <p>{complaint.resolutionTimeline}</p>
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}
