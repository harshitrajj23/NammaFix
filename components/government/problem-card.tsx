import { useState, useMemo } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MapPin, AlertCircle, RefreshCw, MessageSquare, Users, Shield, Clock } from 'lucide-react'
import GovernmentResponsePanel from './response-panel'
import DeadlineCountdown from './deadline-countdown'

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
  votes?: number
  type?: 'new' | 'recurring'
  status?: string
  deadlineAt?: string | Date
  officerEmail?: string
  emailSent?: boolean
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
  votes,
  type = 'new',
  status,
  deadlineAt,
  officerEmail,
  emailSent,
  onResponseSubmit,
}: GovProblemCardProps) {
  const [showResponse, setShowResponse] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [audioError, setAudioError] = useState(false)
  const [isExceeded, setIsExceeded] = useState(false)

  // Stable Officer ID for this session
  const officerId = useMemo(() => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    return `OFF-${randomNum}`;
  }, []);

  // Helper to format deadline nicely
  const formatDeadline = (date: Date) => {
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

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
    <Card className="bg-card border-border overflow-hidden hover:border-accent/50 transition-colors flex flex-col h-full relative">
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

      {/* Deadline Alert Banner */}
      {type === 'new' && deadlineAt && isExceeded && (
        <div className={`px-4 py-1.5 flex items-center gap-2 text-white animate-pulse bg-red-600`}>
          <AlertCircle className="w-4 h-4" />
          <span className="text-[10px] font-bold uppercase tracking-wider">
            🚨 DEADLINE EXCEEDED. Officer ${officerId} please resolve immediately.
          </span>
        </div>
      )}

      <div className="p-4 space-y-3 flex-1 flex flex-col">
        {/* Header with type indicator */}
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-foreground line-clamp-2 flex-1">{title}</h3>
          {status === 'in_progress' && (
            <Badge className="text-[10px] uppercase font-bold px-1.5 py-0 bg-blue-900/20 text-blue-400 border border-blue-500/30 flex-shrink-0">
              IN PROGRESS
            </Badge>
          )}
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

        {/* Deadline & Officer ID Indicator */}
        {type === 'new' && deadlineAt && (
          <div className={`flex flex-col gap-1.5 p-2 rounded border ${isExceeded ? 'bg-red-500/5 border-red-500/20' : 'bg-secondary/10 border-border/50'}`}>
            <div className="flex items-center justify-between text-[10px]">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Shield className="w-3 h-3 text-accent" />
                <span className="font-medium uppercase tracking-wider">Officer Assigned:</span>
                <span className="text-foreground font-bold">{officerId}</span>
              </div>
              <div className="flex items-center gap-1 text-muted-foreground">
                <Clock className="w-3 h-3" />
                <span>Due: {formatDeadline(new Date(deadlineAt))}</span>
              </div>
            </div>
            <DeadlineCountdown 
              deadlineAt={deadlineAt} 
              complaintId={id} 
              officerEmail={officerEmail}
              emailSent={emailSent}
              onExceeded={() => setIsExceeded(true)}
            />
          </div>
        )}

        {/* Audio Attachment */}
        {audioUrl && (
          <div className="pt-2 border-t border-border/50">
            <p className="text-[10px] text-muted-foreground mb-1.5 uppercase font-bold tracking-wider">Voice Note Attachment</p>
            {audioError ? (
              <div className="text-[10px] text-red-500 bg-red-500/10 p-2 rounded border border-red-500/20 flex items-center gap-2 mt-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Voice note unavailable</span>
              </div>
            ) : (
              <div className="bg-secondary/40 p-1.5 rounded-md border border-border/30">
                <audio 
                  controls 
                  preload="metadata"
                  src={audioUrl} 
                  className="w-full h-7" 
                  onError={() => {
                    console.warn("Audio load failed for URL:", audioUrl);
                    setAudioError(true);
                  }}
                />
              </div>
            )}
          </div>
        )}

        {/* IDs and metadata */}
        <div className="space-y-1 text-[10px] text-muted-foreground/60 pt-1">
          {complaintId && (
            <div>ID: {complaintId}</div>
          )}
          {votes !== undefined && votes > 0 && (
            <div className={`flex items-center gap-1.5 px-2 py-1 rounded border ${votes >= 16 ? 'bg-red-500/10 border-red-500/30 text-red-500' : 'bg-blue-500/10 border-blue-500/30 text-blue-400'}`}>
              <Users className="w-3.5 h-3.5" />
              <span className="font-bold uppercase tracking-tighter">{votes} Supporting Citizens</span>
            </div>
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
            {/* Contextual ID for response form */}
            <div className="mt-2 px-1 flex items-center justify-between text-[10px] text-muted-foreground border-t border-border/30 pt-2">
              <span>Responding as: <span className="text-foreground font-bold">{officerId}</span></span>
              <span>ID: <span className="text-foreground font-bold">{id}</span></span>
            </div>
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


