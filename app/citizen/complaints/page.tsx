'use client'

import Navbar from '@/components/citizen/navbar'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useComplaints } from '@/hooks/use-complaints'
import { Skeleton } from '@/components/ui/skeleton'
import { Card } from '@/components/ui/card'
import ProblemCard from '@/components/citizen/problem-card'

export default function ComplaintsPage() {
  const { complaints, refresh, isLoading, error: fetchError } = useComplaints()
  const safeComplaints = Array.isArray(complaints) ? complaints : []

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-muted-foreground animate-pulse">Loading complaints...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <Link href="/citizen">
          <Button variant="outline" className="border-border hover:bg-secondary mb-8">
            ← Back to Home
          </Button>
        </Link>

        <h1 className="text-3xl font-bold text-foreground mb-8">Your Complaints</h1>

        {fetchError && (
          <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm">
            Failed to load complaints. Please refresh the page.
          </div>
        )}
        
        {safeComplaints.length === 0 ? (
          <div className="text-center py-12 bg-card border border-border rounded-lg">
            <p className="text-muted-foreground mb-4">No complaints submitted yet</p>
            <Link href="/citizen">
              <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
                Submit Your First Complaint
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {safeComplaints.map(complaint => (
              <ProblemCard 
                key={complaint.id} 
                complaint={complaint} 
                onFeedbackSubmitted={refresh}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
