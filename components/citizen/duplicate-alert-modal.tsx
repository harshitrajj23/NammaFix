'use client'

import { 
  AlertTriangle, 
  ThumbsUp, 
  PlusCircle, 
  MapPin, 
  Users,
  AlertCircle
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useState } from 'react'

interface DuplicateAlertModalProps {
  isOpen: boolean
  onClose: () => void
  onVote: (complaintId: string) => Promise<void>
  onContinue: () => void
  isVoting: boolean
  similarComplaint: {
    id: string
    title: string
    description: string
    location: string
    category: string
    severity: string
    status: string
    votes: number
  } | null
}

export default function DuplicateAlertModal({
  isOpen,
  onClose,
  onVote,
  onContinue,
  isVoting,
  similarComplaint
}: DuplicateAlertModalProps) {
  const [hasVoted, setHasVoted] = useState(false)

  if (!similarComplaint) return null

  const handleVote = async () => {
    try {
      await onVote(similarComplaint.id)
      setHasVoted(true)
    } catch (err) {
      console.error('Vote failed:', err)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[450px] bg-card border-border shadow-2xl">
        <DialogHeader>
          <div className="flex items-center gap-2 text-amber-500 mb-2">
            <AlertTriangle className="w-6 h-6" />
            <DialogTitle className="text-xl font-bold">Similar Issue Detected</DialogTitle>
          </div>
          <DialogDescription className="text-muted-foreground text-sm">
            A similar issue has already been reported in your area. Voting on existing issues helps authorities prioritize high-impact problems.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 p-4 rounded-lg bg-secondary/50 border border-border/50 space-y-3">
          <div className="flex justify-between items-start gap-2">
            <h4 className="font-bold text-foreground leading-tight">{similarComplaint.title}</h4>
            <Badge className={`text-[9px] uppercase font-bold border-0 ${
              similarComplaint.severity === 'critical' ? 'bg-red-500' :
              similarComplaint.severity === 'high' ? 'bg-orange-500' :
              similarComplaint.severity === 'medium' ? 'bg-yellow-500 text-black' : 'bg-green-500'
            }`}>
              {similarComplaint.severity}
            </Badge>
          </div>

          <p className="text-xs text-muted-foreground line-clamp-2 italic">
            "{similarComplaint.description}"
          </p>

          <div className="flex flex-wrap gap-3 pt-2 border-t border-border/30">
            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <MapPin className="w-3.5 h-3.5 text-accent" />
              <span className="truncate max-w-[150px]">{similarComplaint.location}</span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <Users className="w-3.5 h-3.5 text-blue-400" />
              <span className="font-bold text-foreground">{similarComplaint.votes + (hasVoted ? 1 : 0)} Citizens affected</span>
            </div>
          </div>
        </div>

        <div className="py-4 text-center">
          <p className="text-sm font-medium text-foreground">Are you also facing this problem?</p>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          {!hasVoted ? (
            <Button 
              className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground font-bold gap-2"
              onClick={handleVote}
              disabled={isVoting}
            >
              <ThumbsUp className="w-4 h-4" />
              YES, I AM FACING THIS
            </Button>
          ) : (
            <div className="flex-1 p-2 bg-green-500/10 border border-green-500/30 rounded-md text-center">
              <p className="text-xs font-bold text-green-400 flex items-center justify-center gap-2">
                <CheckCircle className="w-4 h-4" />
                VOTE RECORDED!
              </p>
            </div>
          )}
          
          <Button 
            variant="ghost" 
            className="flex-1 text-muted-foreground hover:text-foreground hover:bg-secondary gap-2 border border-transparent hover:border-border"
            onClick={onContinue}
            disabled={isVoting}
          >
            <PlusCircle className="w-4 h-4" />
            NO, NEW PROBLEM
          </Button>
        </DialogFooter>

        {hasVoted && (
          <p className="text-[10px] text-center text-muted-foreground mt-2">
            Your vote has been added. Authorities will prioritize issues affecting more citizens.
          </p>
        )}
      </DialogContent>
    </Dialog>
  )
}

function CheckCircle(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  )
}
