'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MapPin, AlertTriangle, User, AlertCircle } from 'lucide-react'
import { EmergencyProblem } from '@/lib/types'
import { useState } from 'react'
import ResponsePanel from './response-panel'

interface EmergencyProblemCardProps {
  problem: any // Using any to flexibly handle the Complaint type or previous EmergencyProblem
  onResponseSubmit?: (data: {
    complaintId: string
    responseText: string
    deadlineDate?: Date
  }) => Promise<void>
  isLoading?: boolean
}

const SEVERITY_BANNER_COLORS = {
  critical: 'bg-red-600 text-white',
  high: 'bg-orange-600 text-white',
  medium: 'bg-yellow-500 text-black',
  low: 'bg-green-600 text-white',
}

const STATUS_COLORS = {
  submitted: 'bg-blue-900/20 text-blue-400',
  'under-review': 'bg-purple-900/20 text-purple-400',
  'in-progress': 'bg-cyan-900/20 text-cyan-400',
  resolved: 'bg-green-900/20 text-green-400',
}

export default function EmergencyProblemCard({
  problem,
  onResponseSubmit,
  isLoading = false,
}: EmergencyProblemCardProps) {
  const [showResponse, setShowResponse] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [audioError, setAudioError] = useState(false)

  const handleResponseSubmit = async (data: {
    responseText: string
    deadlineDate?: Date
  }) => {
    setIsSubmitting(true)
    try {
      await onResponseSubmit?.({
        complaintId: problem.id || problem.complaintId,
        ...data,
      })
      setShowResponse(false)
    } finally {
      setIsSubmitting(false)
    }
  }

  const severity = problem.severity || problem.priority || 'medium'

  return (
    <Card className="bg-card border-border overflow-hidden hover:border-accent/50 transition-colors flex flex-col h-full">
      {/* Priority banner */}
      <div className={`px-4 py-2 flex items-center justify-between ${SEVERITY_BANNER_COLORS[severity as keyof typeof SEVERITY_BANNER_COLORS] || SEVERITY_BANNER_COLORS.medium}`}>
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4" />
          <span className="text-xs font-bold uppercase tracking-wider">
            {severity} Severity
          </span>
        </div>
        <Badge variant="outline" className="text-[10px] border-white/30 text-white hover:bg-white/10 uppercase">
          {problem.category}
        </Badge>
      </div>

      {/* Image Preview */}
      {(problem.imageUrl || problem.image_url) && (
        <div className="w-full h-48 bg-black/20 relative">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src={problem.imageUrl || problem.image_url} 
            alt={problem.title}
            className="w-full h-full object-contain"
          />
        </div>
      )}

      <div className="p-5 space-y-4 flex-1 flex flex-col">
        {/* Title & Description */}
        <div className="space-y-2">
          <h3 className="font-bold text-lg text-foreground line-clamp-1">{problem.title}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2">{problem.description}</p>
        </div>

        {/* Location */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground bg-secondary/30 p-2 rounded">
          <MapPin className="w-4 h-4 flex-shrink-0 text-accent" />
          <span className="truncate">{problem.location}</span>
        </div>

        {/* Audio Attachment */}
        {(problem.audioUrl || problem.audio_url) && (
          <div className="bg-secondary/20 p-2 rounded border border-border/50">
            <p className="text-[10px] text-muted-foreground mb-1 uppercase font-bold tracking-wider">Voice Evidence</p>
            {audioError ? (
              <div className="text-[10px] text-red-500 bg-red-500/10 p-2 rounded border border-red-500/20 flex items-center gap-2 mt-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Voice note unavailable</span>
              </div>
            ) : (
              <audio 
                controls 
                preload="metadata"
                src={problem.audioUrl || problem.audio_url} 
                className="w-full h-8" 
                onError={() => {
                  console.warn("Audio load failed for URL:", problem.audioUrl || problem.audio_url);
                  setAudioError(true);
                }}
              />
            )}
          </div>
        )}

        {/* Status and Meta */}
        <div className="flex items-center justify-between pt-2 border-t border-border/50 mt-auto">
          <Badge className={`text-[10px] font-bold uppercase ${STATUS_COLORS[problem.status as keyof typeof STATUS_COLORS] || STATUS_COLORS.submitted}`}>
            {problem.status}
          </Badge>
          <span className="text-[10px] text-muted-foreground flex items-center gap-1">
            <User className="w-3 h-3" />
            {new Date(problem.createdAt).toLocaleDateString()}
          </span>
        </div>

        {/* Response panel toggle */}
        <div className="pt-2">
          {!showResponse ? (
            <button
              onClick={() => setShowResponse(true)}
              className="w-full px-3 py-2 bg-accent hover:bg-accent/90 text-accent-foreground rounded text-sm font-bold transition-all transform hover:scale-[1.02] active:scale-[0.98]"
              disabled={isLoading}
            >
              Action Required: Respond Now
            </button>
          ) : (
            <button
              onClick={() => setShowResponse(false)}
              className="w-full px-3 py-2 bg-secondary hover:bg-secondary/80 text-foreground rounded text-sm font-medium transition-colors"
            >
              Cancel Response
            </button>
          )}
        </div>

        {showResponse && (
          <div className="mt-4 animate-in fade-in slide-in-from-top-2 duration-300">
            <ResponsePanel
              complaintId={problem.id || problem.complaintId}
              onSubmit={handleResponseSubmit}
              isLoading={isSubmitting}
            />
          </div>
        )}
      </div>
    </Card>
  )
}
