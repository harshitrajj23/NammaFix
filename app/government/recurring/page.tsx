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
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Skeleton } from '@/components/ui/skeleton'
import { ArrowLeft, TrendingUp, CheckCircle, MapPin, AlertCircle, Info } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

const MOCK_RECURRING_PROBLEM = {
  id: 'mock-recurring-demo-1',
  title: "Bridge repair happening repeatedly",
  category: "Infrastructure",
  location: "Old River Bridge, Indiranagar",
  occurrences: 5,
  severity: "high" as const,
  lastReportedAt: new Date().toISOString(),
  description: "Citizens have reported that the bridge is being repaired multiple times but the issue keeps returning.",
  message: "Recurring issue detected. Requires long-term government intervention."
}

export default function RecurringPage() {
  const router = useRouter()
  const [problems, setProblems] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedProblem, setSelectedProblem] = useState<any | null>(null)

  const fetchProblems = async (silent = false) => {
    try {
      if (!silent) setIsLoading(true)
      const res = await fetch('/api/complaints?type=recurring')
      if (!res.ok) throw new Error('Failed to fetch')
      const data = await res.json()
      setProblems(data || [])
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

  const displayProblems = problems.length > 0 ? problems : [MOCK_RECURRING_PROBLEM]

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
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {displayProblems.map((problem) => (
              <div 
                key={problem.id} 
                onClick={() => setSelectedProblem(problem)}
                className="cursor-pointer transition-transform hover:scale-[1.02] active:scale-[0.98]"
              >
                <GovProblemCard
                  id={problem.id}
                  title={problem.title}
                  description={problem.description || `This location has seen ${problem.occurrences} reports for ${problem.category}.`}
                  location={problem.location}
                  category={problem.category}
                  severity={problem.severity}
                  occurrences={problem.occurrences}
                  lastReportedAt={new Date(problem.lastReportedAt)}
                  type="recurring"
                />
              </div>
            ))}
          </div>
        )}

        {/* Detail Modal */}
        <Dialog open={!!selectedProblem} onOpenChange={(open) => !open && setSelectedProblem(null)}>
          <DialogContent className="sm:max-w-lg border-border bg-card">
            <DialogHeader>
              <div className="flex items-center gap-2 mb-2">
                <Badge className="bg-accent/10 text-accent border-accent/20 uppercase text-[10px] font-bold">
                  Recurring Issue
                </Badge>
                {selectedProblem?.severity && (
                  <Badge className={`uppercase text-[10px] font-bold ${
                    selectedProblem.severity === 'high' || selectedProblem.severity === 'critical' ? 'bg-red-900/20 text-red-500' : 'bg-yellow-900/20 text-yellow-500'
                  }`}>
                    {selectedProblem.severity} Priority
                  </Badge>
                )}
              </div>
              <DialogTitle className="text-2xl font-bold">{selectedProblem?.title}</DialogTitle>
            </DialogHeader>

            <div className="space-y-6 pt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Location</p>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-accent" />
                    <span className="truncate">{selectedProblem?.location}</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Reports</p>
                  <div className="flex items-center gap-2 text-sm text-accent">
                    <AlertCircle className="w-4 h-4" />
                    <span className="font-bold">{selectedProblem?.occurrences} reports detected</span>
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Category</p>
                <Badge variant="secondary" className="text-xs uppercase font-bold">
                  {selectedProblem?.category}
                </Badge>
              </div>

              <div className="space-y-2">
                <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Description</p>
                <p className="text-sm text-foreground leading-relaxed">
                  {selectedProblem?.description || `A recurring pattern of issues related to ${selectedProblem?.category} has been identified at this location. This area requires systematic inspection.`}
                </p>
              </div>

              <div className="p-4 bg-accent/5 border border-accent/20 rounded-lg flex gap-3">
                <Info className="w-5 h-5 text-accent flex-shrink-0" />
                <p className="text-sm font-medium text-accent italic">
                  {selectedProblem?.message || "Recurring issue detected. Requires long-term government intervention."}
                </p>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <Button onClick={() => setSelectedProblem(null)} variant="secondary" className="font-bold">
                CLOSE
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  )
}

