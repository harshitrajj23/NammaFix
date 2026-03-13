import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MapPin, AlertCircle, RefreshCw, MessageSquare } from 'lucide-react'
import GovernmentResponsePanel from './response-panel'

interface GovProblemCardProps {
  id: string
  title: string
  description?: string
  location: string
  timestamp?: Date
  complaintId?: string
  occurrences?: number
  lastReportedAt?: Date
  category?: string
  severity?: 'low' | 'medium' | 'high' | 'critical'
  imageUrl?: string
  audioUrl?: string
  userId?: string
  type?: 'new' | 'recurring'
  onResponseSubmit?: (data: {
    complaintId: string
    responseText: string
    deadlineDate?: Date
  }) => Promise<void>
}

const SEVERITY_COLORS = {
  low: 'bg-green-900/20 text-green-400',
  medium: 'bg-yellow-900/20 text-yellow-400',
  high: 'bg-orange-900/20 text-orange-400',
  critical: 'bg-red-900/30 text-red-500 border border-red-500/50',
}

export default function GovProblemCard({
  id,
  title,
  description,
  location,
  timestamp,
  complaintId,
  occurrences,
  lastReportedAt,
  category,
  severity = 'medium',
  imageUrl,
  audioUrl,
  userId,
  type = 'new',
  onResponseSubmit,
}: GovProblemCardProps) {
  const [showResponse, setShowResponse] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleResponseSubmit = async (data: {
    responseText: string
    deadlineDate?: Date
  }) => {
    setIsSubmitting(true)
    try {
      await onResponseSubmit?.({
        complaintId: id,
        ...data,
      })
      setShowResponse(false)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="bg-card border-border overflow-hidden hover:border-accent/50 transition-colors flex flex-col h-full">
      {imageUrl && (
        <div className="w-full h-40 bg-secondary relative">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src={imageUrl} 
            alt={title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <div className="p-4 space-y-3 flex-1 flex flex-col">
        {/* Header with type indicator */}
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-foreground line-clamp-2 flex-1">{title}</h3>
          {type === 'recurring' && (
            <RefreshCw className="w-5 h-5 text-accent flex-shrink-0 mt-1" />
          )}
        </div>

        {/* Description */}
        {description && (
          <p className="text-sm text-muted-foreground line-clamp-3">{description}</p>
        )}

        {/* Location */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground/80 bg-secondary/20 p-2 rounded">
          <MapPin className="w-4 h-4 flex-shrink-0" />
          <span className="truncate">{location}</span>
        </div>

        {/* Audio Attachment */}
        {audioUrl && (
          <div className="pt-1">
            <p className="text-[10px] text-muted-foreground mb-1 uppercase font-bold tracking-wider">Voice Note</p>
            <audio controls src={audioUrl} className="w-full h-6" />
          </div>
        )}

        {/* IDs and metadata */}
        <div className="space-y-1 text-[10px] text-muted-foreground/60 pt-1">
          {complaintId && (
            <div>ID: {complaintId}</div>
          )}
          {occurrences && (
            <div className="flex items-center gap-1 text-accent font-medium">
              <AlertCircle className="w-3 h-3" />
              <span>{occurrences} occurrences reported</span>
            </div>
          )}
        </div>

        {/* Action Button */}
        {type === 'new' && (
          <div className="pt-2">
            {!showResponse ? (
              <button
                onClick={() => setShowResponse(true)}
                className="w-full py-2 bg-accent/10 hover:bg-accent/20 text-accent text-xs font-bold rounded flex items-center justify-center gap-2 transition-colors border border-accent/20"
              >
                <MessageSquare className="w-3 h-3" />
                RESPOND TO CITIZEN
              </button>
            ) : (
              <button
                onClick={() => setShowResponse(false)}
                className="w-full py-2 bg-secondary text-muted-foreground text-xs font-medium rounded transition-colors"
                disabled={isSubmitting}
              >
                CANCEL RESPONSE
              </button>
            )}
          </div>
        )}

        {showResponse && (
          <div className="mt-2 text-left">
            <GovernmentResponsePanel
              complaintId={id}
              onSubmit={handleResponseSubmit}
              isLoading={isSubmitting}
            />
          </div>
        )}

        {/* Footer with badges */}
        <div className="flex flex-wrap items-center gap-2 pt-3 mt-auto border-t border-border">
          {category && (
            <Badge variant="secondary" className="text-[10px] uppercase font-bold px-1.5 py-0">
              {category}
            </Badge>
          )}
          {severity && (
            <Badge className={`text-[10px] uppercase font-bold px-1.5 py-0 ${SEVERITY_COLORS[severity]}`}>
              {severity}
            </Badge>
          )}
          <div className="text-[10px] text-muted-foreground ml-auto">
            {timestamp
              ? new Date(timestamp).toLocaleDateString()
              : lastReportedAt
              ? new Date(lastReportedAt).toLocaleDateString()
              : 'N/A'}
          </div>
        </div>
      </div>
    </Card>
  )
}


