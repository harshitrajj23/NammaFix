'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import GovNavbar from '@/components/government/navbar'
import GovProblemCard from '@/components/government/problem-card'
import { Button } from '@/components/ui/button'
import { 
  Empty, 
  EmptyHeader, 
  EmptyTitle, 
  EmptyDescription, 
  EmptyContent, 
  EmptyMedia 
} from '@/components/ui/empty'
import { Skeleton } from '@/components/ui/skeleton'
import { ArrowLeft, AlertCircle, Inbox } from 'lucide-react'


export default function NewProblemsPage() {
  const router = useRouter()
  const [problems, setProblems] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const { data: complaints, error: fetchErr } = await supabase
          .from('complaints')
          .select('*')
          .in('severity', ['medium', 'low'])
          .order('created_at', { ascending: false })

        if (fetchErr) throw fetchErr

        console.log('Government dashboard complaints:', complaints)

        // Map to frontend structure
        const formatted = complaints?.map(c => ({
          id: c.id,
          userId: c.user_id,
          title: c.title,
          category: c.category,
          description: c.description,
          location: c.location,
          severity: c.severity,
          createdAt: c.created_at,
          imageUrl: c.image_url,
          audioUrl: c.audio_url,
          deadlineAt: c.deadline_at,
          officerEmail: c.officer_email,
          emailSent: c.email_sent
        })) || []

        setProblems(formatted)
      } catch (err) {
        console.error('Fetch Error:', err)
        setError('Failed to load new problems')
      } finally {
        setIsLoading(false)
      }
    }

    fetchProblems()

    // Real-time updates: Refetch every 5 seconds
    const interval = setInterval(fetchProblems, 5000)

    return () => clearInterval(interval)
  }, [supabase])

  const handleResponseSubmit = async (data: {
    complaintId: string
    responseText: string
    deadlineDate?: Date
  }) => {
    try {
      const problem = problems.find(p => p.id === data.complaintId)
      if (!problem) return

      // Use the centralized API instead of direct Supabase writes
      const response = await fetch('/api/government/respond', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          complaint_id: data.complaintId,
          response_message: data.responseText,
          officer_id: 'government@nammafix.in', // In production, get this from auth
          deadline_at: data.deadlineDate?.toISOString()
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'API call failed')
      }

      console.log('Response successfully sent via API')
      
      // Refresh local data
      setProblems(prev => prev.map(p => 
        p.id === data.complaintId ? { 
          ...p, 
          status: 'in_progress',
          deadlineAt: data.deadlineDate,
          officerEmail: 'government@nammafix.in'
        } : p
      ))
    } catch (err: any) {
      console.error('Failed to submit government response:', err)
      alert(`Failed to send response: ${err.message || 'Please try again.'}`)
    }
  }



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
          <h1 className="text-3xl font-bold text-foreground mb-2">New Problems</h1>
          <p className="text-muted-foreground">
            Recently submitted complaints (Real-time)
          </p>
        </div>


        {/* Filters */}
        <div className="mb-6 flex flex-wrap gap-2 text-xs text-muted-foreground">
          <span>Priority View: Critical & High severity items are prioritized at the top.</span>
        </div>

        {/* Content */}
        {error ? (
          <Empty>
            <EmptyMedia variant="icon">
              <AlertCircle className="size-6" />
            </EmptyMedia>
            <EmptyTitle>Error loading problems</EmptyTitle>
            <EmptyDescription>Failed to load new problems. Please try again.</EmptyDescription>
          </Empty>

        ) : isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-56 bg-secondary rounded-lg" />
            ))}
          </div>
        ) : problems.length === 0 ? (
          <Empty>
            <EmptyMedia variant="icon">
              <Inbox className="size-6" />
            </EmptyMedia>
            <EmptyTitle>No new problems</EmptyTitle>
            <EmptyDescription>All new problems have been reviewed</EmptyDescription>
          </Empty>

        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {problems.map((problem: any) => (
              <GovProblemCard
                key={problem.id}
                id={problem.id}
                title={problem.title}
                description={problem.description}
                location={problem.location}
                category={problem.category}
                severity={problem.severity}
                timestamp={new Date(problem.createdAt)}
                imageUrl={problem.imageUrl}
                audioUrl={problem.audioUrl}
                userId={problem.userId}
                onResponseSubmit={handleResponseSubmit}
                type="new"
              />
            ))}
          </div>
        )}

      </main>
    </div>
  )
}

