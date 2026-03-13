"use client"

import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import GovNavbar from '@/components/government/navbar'
import EmergencyProblemCard from '@/components/government/emergency-problem-card'
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
import { ArrowLeft, AlertCircle, CheckCircle } from 'lucide-react'

export default function EmergencyPage() {
  const router = useRouter()
  const [problems, setProblems] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  const fetchProblems = async (silent = false) => {
    try {
      if (!silent) setIsLoading(true)
      const { data: complaints, error: fetchErr } = await supabase
        .from('complaints')
        .select('*')
        .in('severity', ['critical', 'high'])
        .order('created_at', { ascending: false })

      if (fetchErr) throw fetchErr

      // Map to consistent structure
      const formatted = complaints?.map(c => ({
        id: c.id,
        userId: c.user_id,
        title: c.title,
        description: c.description,
        location: c.location,
        category: c.category,
        severity: c.severity,
        imageUrl: c.image_url,
        audioUrl: c.audio_url,
        status: c.status,
        createdAt: c.created_at
      })) || []

      setProblems(formatted)
    } catch (err) {
      console.error('Emergency Fetch Error:', err)
      setError('Failed to load emergency problems')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchProblems()

    // Real-time updates: Refetch every 5 seconds
    const interval = setInterval(() => {
      fetchProblems(true)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const handleResponseSubmit = async (data: {
    complaintId: string
    responseText: string
    deadlineDate?: Date
  }) => {
    try {
      const problem = problems.find(p => p.id === data.complaintId)
      if (!problem) return

      // STEP 5 — Save response
      const { error: resError } = await supabase.from("responses").insert({
        complaint_id: data.complaintId,
        government_response: data.responseText,
        responded_at: new Date().toISOString()
      })
      if (resError) throw resError

      // STEP 6 — Send notification to citizen
      const { error: notifError } = await supabase.from("notifications").insert({
        user_id: problem.userId,
        complaint_id: data.complaintId,
        message: "Government responded to your urgent complaint: " + problem.title
      })
      if (notifError) throw notifError

      // STEP 10 — Optional status update
      const { error: statusError } = await supabase
        .from("complaints")
        .update({ status: "in_progress" })
        .eq("id", data.complaintId)
      if (statusError) throw statusError

      console.log('Urgent response successfully sent!')
      fetchProblems(true)
    } catch (err) {
      console.error('Failed to submit urgent response:', err)
      alert('Failed to send response. Please try again.')
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
          <h1 className="text-3xl font-bold text-foreground mb-2">Emergency Problems</h1>
          <p className="text-muted-foreground">
            Critical and High issues requiring immediate government action (Real-time)
          </p>
        </div>

        {/* Content */}
        {error ? (
          <Empty>
            <EmptyMedia variant="icon">
              <AlertCircle className="size-6 text-red-500" />
            </EmptyMedia>
            <EmptyTitle>Error loading problems</EmptyTitle>
            <EmptyDescription>{error}</EmptyDescription>
          </Empty>
        ) : isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-96 bg-secondary rounded-lg" />
            ))}
          </div>
        ) : problems.length === 0 ? (
          <Empty>
            <EmptyMedia variant="icon">
              <CheckCircle className="size-6 text-green-500" />
            </EmptyMedia>
            <EmptyTitle>All clear!</EmptyTitle>
            <EmptyDescription>No critical or high-severity issues reported currently.</EmptyDescription>
          </Empty>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {problems.map((problem) => (
              <EmergencyProblemCard
                key={problem.id}
                problem={problem}
                onResponseSubmit={handleResponseSubmit}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

