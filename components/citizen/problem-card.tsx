'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Star, CheckCircle } from 'lucide-react'

interface ProblemCardProps {
  complaint: any
  onFeedbackSubmitted?: () => void
}

export default function ProblemCard({ complaint, onFeedbackSubmitted }: ProblemCardProps) {
  const [showFeedbackForm, setShowFeedbackForm] = useState(false)
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isResolving, setIsResolving] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [resolved, setResolved] = useState(false)

  const handleResolve = async () => {
    setIsResolving(true)
    try {
      const res = await fetch('/api/complaints/resolve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ complaint_id: complaint.id })
      })

      const data = await res.json()
      
      if (!data.success) {
        console.error('Resolve request failed:', data.error)
        alert(`Failed to resolve: ${data.error || 'Unknown error'}`)
        return
      }

      setResolved(true)
      if (onFeedbackSubmitted) onFeedbackSubmitted()
    } catch (err) {
      console.error('Resolve error:', err)
      alert('Network error while resolving. Please check your connection.')
    } finally {
      setIsResolving(false)
    }
  }

  const handleSubmitFeedback = async () => {
    if (rating === 0) return alert('Please provide a rating')
    
    setIsSubmitting(true)
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          complaint_id: complaint.id,
          rating,
          comment
        })
      })

      if (!res.ok) throw new Error('Failed to submit feedback')

      setIsSubmitted(true)
      setShowFeedbackForm(false)
      if (onFeedbackSubmitted) onFeedbackSubmitted()
    } catch (err) {
      console.error(err)
      alert('Error submitting feedback. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-600 hover:bg-green-700 text-white border-0">Resolved</Badge>
      case 'in_progress':
        return <Badge className="bg-yellow-500 hover:bg-yellow-600 text-black border-0">In Progress</Badge>
      case 'resolved':
        return <Badge className="bg-green-500 hover:bg-green-600 text-white border-0">Feedback Provided</Badge>
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>
      default:
        return <Badge variant="secondary" className="bg-secondary text-muted-foreground">{status}</Badge>
    }
  }

  return (
    <Card className={`overflow-hidden bg-card border-border flex flex-col h-full hover:border-accent/50 transition-colors ${complaint.status === 'completed' ? 'ring-1 ring-green-500/30' : ''}`}>
      {complaint.imageUrl && (
        <div className="w-full h-48 bg-secondary relative">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src={complaint.imageUrl} 
            alt={complaint.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <div className="p-6 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-lg text-foreground line-clamp-1">{complaint.title}</h3>
          {getStatusBadge(complaint.status)}
        </div>
        
        <div className="flex gap-2 mb-2">
          <Badge className={`text-[10px] uppercase font-bold ${
            complaint.severity === 'critical' ? 'bg-red-500 hover:bg-red-600 text-white' :
            complaint.severity === 'high' ? 'bg-orange-500 hover:bg-orange-600 text-white' :
            complaint.severity === 'medium' ? 'bg-yellow-500 hover:bg-yellow-600 text-black' :
            'bg-green-500 hover:bg-green-600 text-white'
          }`}>
            {complaint.severity || 'medium'}
          </Badge>
          <span className="text-xs text-muted-foreground flex items-center bg-secondary px-2 py-0.5 rounded uppercase font-medium">
            {complaint.category}
          </span>
          {(complaint.status === 'completed' || complaint.status === 'resolved') && (
            <Badge variant="outline" className="text-[10px] border-green-500 text-green-500 uppercase font-bold gap-1">
              <CheckCircle className="w-3 h-3" />
              Citizen Verified
            </Badge>
          )}
        </div>

        <div className="text-xs text-muted-foreground mb-4">
          <span>{new Date(complaint.createdAt).toLocaleDateString()}</span>
        </div>

        <p className="text-sm text-foreground mb-4 line-clamp-3">
          {complaint.description}
        </p>
        <p className="text-sm text-muted-foreground mb-4 truncate">
          📍 {complaint.location}
        </p>

        {complaint.responses?.[0]?.government_response && (
          <div className="mb-4 p-3 bg-accent/5 border border-accent/10 rounded-lg">
            <p className="text-[10px] uppercase font-bold text-accent mb-1 tracking-wider">Government Response</p>
            <p className="text-sm text-foreground italic">"{ complaint.responses[0].government_response }"</p>
          </div>
        )}

        {/* Action Button Section */}
        {complaint.responses?.[0]?.government_response && 
         complaint.status !== 'completed' && 
         complaint.status !== 'resolved' && 
         !resolved && (
          <div className="mt-4 pt-4 border-t border-border">
            {!showFeedbackForm ? (
              <Button 
                onClick={handleResolve}
                disabled={isResolving}
                className="w-full bg-green-600 hover:bg-green-700 text-white text-xs font-bold gap-2 py-6"
              >
                <CheckCircle className="w-4 h-4" />
                {isResolving ? 'MARKING AS RESOLVED...' : 'WORK COMPLETED? MARK AS RESOLVED'}
              </Button>
            ) : (
              <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">Rate Resolution</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button 
                        key={s} 
                        onClick={() => setRating(s)}
                        className={`transition-colors ${rating >= s ? 'text-yellow-500' : 'text-muted-foreground'}`}
                      >
                        <Star className={`w-6 h-6 ${rating >= s ? 'fill-current' : ''}`} />
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">Feedback Details</label>
                  <Textarea 
                    placeholder="Share your feedback about the resolution..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="min-h-[80px] bg-secondary/50 border-border text-sm"
                  />
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1 text-xs"
                    onClick={() => setShowFeedbackForm(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    size="sm" 
                    className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground text-xs font-bold"
                    onClick={handleSubmitFeedback}
                    disabled={isSubmitting || rating === 0}
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
                  </Button>
                </div>
              </div>
            )}
            
            {!showFeedbackForm && !isSubmitted && complaint.status !== 'completed' && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowFeedbackForm(true)}
                className="w-full mt-2 text-muted-foreground hover:text-accent text-[10px] uppercase font-bold"
              >
                Add Detail Feedback
              </Button>
            )}
          </div>
        )}

        {(complaint.status === 'completed' || resolved || isSubmitted) && (
          <div className="mt-4 p-4 bg-green-900/10 border border-green-500/20 rounded-lg flex items-center justify-center gap-2 animate-in zoom-in duration-300">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <p className="text-sm font-bold text-green-600">Problem Resolved</p>
          </div>
        )}
        
        <div className="mt-auto">
          {complaint.audioUrl && (
            <div className="pt-4 border-t border-border mt-4">
              <p className="text-xs text-muted-foreground mb-2">Voice Note</p>
              <audio controls src={complaint.audioUrl} className="w-full h-8" />
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}
