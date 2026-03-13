'use client'

import { Card } from '@/components/ui/card'
import { MapPin, Star, MessageSquare } from 'lucide-react'

interface FeedbackCardProps {
  feedback: {
    id: string
    rating: number
    feedbackText: string
    createdAt: string
    complaintTitle: string
    location: string
    complaintId: string
  }
}

export default function FeedbackCard({ feedback }: FeedbackCardProps) {
  const renderRating = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating
            ? 'fill-yellow-500 text-yellow-500'
            : 'text-muted-foreground/30'
        }`}
      />
    ))
  }

  return (
    <Card className="bg-card border-border overflow-hidden hover:border-accent/40 transition-all flex flex-col h-full group">
      <div className="p-5 space-y-4 flex flex-col h-full">
        {/* Header - Complaint Info */}
        <div className="space-y-1">
          <div className="flex items-start justify-between gap-4">
            <h3 className="font-bold text-foreground text-lg line-clamp-1 group-hover:text-accent transition-colors">
              {feedback.complaintTitle}
            </h3>
            <div className="flex gap-0.5 mt-1 flex-shrink-0">
              {renderRating(feedback.rating)}
            </div>
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="w-3 h-3" />
            <span className="truncate">{feedback.location}</span>
          </div>
        </div>

        {/* Feedback text */}
        <div className="relative">
          <div className="absolute -left-2 top-0 text-muted-foreground/20 italic text-4xl font-serif">“</div>
          <p className="text-sm text-foreground/90 italic pl-2 leading-relaxed h-full line-clamp-4">
            {feedback.feedbackText || "No comment provided."}
          </p>
        </div>

        {/* Footer */}
        <div className="mt-auto pt-4 border-t border-border/50 flex items-center justify-between">
          <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
            <MessageSquare className="w-3 h-3" />
            <span>ID: {feedback.complaintId.slice(0, 8)}</span>
          </div>
          <div className="text-[10px] text-muted-foreground font-medium bg-secondary/50 px-2 py-1 rounded">
            {new Date(feedback.createdAt).toLocaleDateString(undefined, {
              day: 'numeric',
              month: 'short',
              year: 'numeric'
            })}
          </div>
        </div>
      </div>
    </Card>
  )
}
