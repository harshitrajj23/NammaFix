'use client'

import { RecurringIssueInvestigation } from '@/lib/types'
import RecurringIssueCard from './recurring-issue-card'
import { Empty } from '@/components/ui/empty'
import { Skeleton } from '@/components/ui/skeleton'
import { useState } from 'react'

interface RecurringProblemsSectionProps {
  issues: RecurringIssueInvestigation[]
  isLoading?: boolean
  error?: string
  onViewDetails?: (issueId: string) => void
}

export default function RecurringProblemsSection({
  issues,
  isLoading = false,
  error,
  onViewDetails,
}: RecurringProblemsSectionProps) {
  const [loadingId, setLoadingId] = useState<string | null>(null)

  const handleViewDetails = async (issueId: string) => {
    setLoadingId(issueId)
    try {
      await onViewDetails?.(issueId)
    } finally {
      setLoadingId(null)
    }
  }

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Recurring Problems</h2>
        <p className="text-sm text-muted-foreground">
          Issues repeatedly reported by citizens requiring investigation
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-80 bg-secondary" />
          ))
        ) : error ? (
          <Empty
            icon="alert-circle"
            title="Error loading issues"
            description="Failed to load recurring problems. Please try again."
          />
        ) : issues.length === 0 ? (
          <Empty
            icon="search"
            title="No recurring issues found"
            description="There are no recurring problems to investigate at this time"
          />
        ) : (
          issues.map((issue) => (
            <RecurringIssueCard
              key={issue.id}
              issue={issue}
              onViewDetails={handleViewDetails}
              isLoading={loadingId === issue.id}
            />
          ))
        )}
      </div>
    </section>
  )
}
