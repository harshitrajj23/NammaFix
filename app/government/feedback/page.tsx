'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import GovNavbar from '@/components/government/navbar'
import FeedbackCard from '@/components/government/feedback-card'
import { Button } from '@/components/ui/button'
import { Empty } from '@/components/ui/empty'
import { Skeleton } from '@/components/ui/skeleton'
import { ArrowLeft, MessageSquare, Star } from 'lucide-react'

export default function FeedbackPage() {
  const router = useRouter()
  const [feedback, setFeedback] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeFilter, setActiveFilter] = useState<'all' | 'high' | 'recent'>('all')
  const supabase = createClient()

  const fetchFeedback = async () => {
    try {
      setIsLoading(true)
      
      const { data, error: fetchErr } = await supabase
        .from('feedback')
        .select(`
          id,
          rating,
          comment,
          created_at,
          complaint_id,
          complaints (
            title,
            location
          )
        `)
        .order('created_at', { ascending: false })

      if (fetchErr) throw fetchErr

      // Map to expected FeedbackCard structure
      const formatted = data?.map(f => ({
        id: f.id,
        rating: f.rating,
        feedbackText: f.comment,
        createdAt: f.created_at,
        complaintTitle: (f.complaints as any)?.title || 'Unknown Complaint',
        location: (f.complaints as any)?.location || 'Unknown Location',
        complaintId: f.complaint_id
      })) || []

      setFeedback(formatted)
    } catch (err) {
      console.error('Error fetching feedback:', err)
      setError('Failed to load feedback')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchFeedback()
  }, [])

  const filteredFeedback = feedback.filter(f => {
    if (activeFilter === 'high') return f.rating === 5
    return true
  })

  return (
    <div className="min-h-screen bg-background">
      <GovNavbar governmentName="Government Official" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Header with back button */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-4 text-muted-foreground hover:text-foreground gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <h1 className="text-3xl font-bold text-foreground mb-2">Citizen Feedback</h1>
          <p className="text-muted-foreground">
            Reviews and ratings from citizens about government responses
          </p>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-wrap gap-2">
          <Button 
            variant={activeFilter === 'all' ? 'default' : 'outline'} 
            size="sm" 
            onClick={() => setActiveFilter('all')}
            className={activeFilter === 'all' ? 'bg-accent text-accent-foreground' : 'border-border hover:bg-secondary'}
          >
            All Ratings
          </Button>
          <Button 
            variant={activeFilter === 'high' ? 'default' : 'outline'} 
            size="sm" 
            onClick={() => setActiveFilter('high')}
            className={activeFilter === 'high' ? 'bg-accent text-accent-foreground' : 'border-border hover:bg-secondary'}
          >
            5 Stars
          </Button>
          <Button 
            variant={activeFilter === 'recent' ? 'default' : 'outline'} 
            size="sm" 
            onClick={() => setActiveFilter('recent')}
            className={activeFilter === 'recent' ? 'bg-accent text-accent-foreground' : 'border-border hover:bg-secondary'}
          >
            Recent
          </Button>
        </div>

        {/* Content */}
        {error ? (
          <div className="bg-card border border-border p-8 rounded-lg text-center flex flex-col items-center gap-4">
             <div className="h-12 w-12 rounded-full bg-red-900/20 flex items-center justify-center">
                <Star className="text-red-500 w-6 h-6" />
             </div>
             <div className="space-y-1">
                <h3 className="text-lg font-semibold">Error loading feedback</h3>
                <p className="text-muted-foreground text-sm">{error}</p>
             </div>
             <Button onClick={fetchFeedback} variant="outline" size="sm">Try Again</Button>
          </div>
        ) : isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-48 bg-secondary rounded-lg" />
            ))}
          </div>
        ) : filteredFeedback.length === 0 ? (
          <div className="bg-card border border-border p-12 rounded-lg text-center flex flex-col items-center gap-4">
             <div className="h-16 w-16 rounded-full bg-secondary flex items-center justify-center">
                <MessageSquare className="text-muted-foreground w-8 h-8" />
             </div>
             <div className="space-y-1">
                <h3 className="text-xl font-bold">No feedback found</h3>
                <p className="text-muted-foreground text-sm">Citizen feedback will appear here once they resolve issues</p>
             </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredFeedback.map((item) => (
              <FeedbackCard key={item.id} feedback={item as any} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
