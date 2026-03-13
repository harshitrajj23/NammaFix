'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
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
import { ArrowLeft, TrendingUp, CheckCircle } from 'lucide-react'

export default function RecurringPage() {
  const router = useRouter()
  const [problems, setProblems] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProblems = async (silent = false) => {
    try {
      if (!silent) setIsLoading(true)
      const res = await fetch('/api/complaints?type=recurring')
      if (!res.ok) throw new Error('Failed to fetch')
      const data = await res.json()
      setProblems(data)
    } catch (err) {
      console.error('Recurring Fetch Error:', err)
      setError('Failed to load recurring problems')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchProblems()

    // Real-time updates: Refetch every 10 seconds
    const interval = setInterval(() => {
      fetchProblems(true)
    }, 10000)

    return () => clearInterval(interval)
  }, [])

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
          <h1 className="text-3xl font-bold text-foreground mb-2">Recurring Problems</h1>
          <p className="text-muted-foreground">
            Issues detected 3+ times in the same location (Real-time)
          </p>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-wrap gap-2 text-xs text-muted-foreground">
          <span>Analysis: Areas with frequent reporting of the same category are listed here.</span>
        </div>

        {/* Content */}
        {error ? (
          <Empty>
            <EmptyMedia variant="icon">
              <TrendingUp className="size-6 text-red-500" />
            </EmptyMedia>
            <EmptyTitle>Error loading analysis</EmptyTitle>
            <EmptyDescription>{error}</EmptyDescription>
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
              <CheckCircle className="size-6 text-green-500" />
            </EmptyMedia>
            <EmptyTitle>No hot spots detected</EmptyTitle>
            <EmptyDescription>All areas have managed report counts currently.</EmptyDescription>
          </Empty>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {problems.map((problem) => (
              <GovProblemCard
                key={problem.id}
                id={problem.id}
                title={problem.title}
                description={`This location has seen ${problem.occurrences} reports for ${problem.category}.`}
                location={problem.location}
                category={problem.category}
                severity={problem.severity}
                occurrences={problem.occurrences}
                lastReportedAt={new Date(problem.lastReportedAt)}
                type="recurring"
              />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

