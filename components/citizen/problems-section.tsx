'use client'

import IssueCard from '@/components/shared/issue-card'
import { Empty } from '@/components/ui/empty'
import { useIssues } from '@/hooks/use-issues'
import { Skeleton } from '@/components/ui/skeleton'
import { useState } from 'react'

interface ProblemsSectionProps {
  userLocation?: string
  onIssueConfirm?: (issueId: string) => Promise<void>
  onIssueDeny?: (issueId: string) => Promise<void>
}

export default function ProblemsSection({ 
  userLocation, 
  onIssueConfirm,
  onIssueDeny,
}: ProblemsSectionProps) {
  const { issues, isLoading, error } = useIssues(userLocation)
  const [loadingId, setLoadingId] = useState<string | null>(null)

  const handleConfirm = async (issueId: string) => {
    setLoadingId(issueId)
    try {
      await onIssueConfirm?.(issueId)
    } finally {
      setLoadingId(null)
    }
  }

  const handleDeny = async (issueId: string) => {
    setLoadingId(issueId)
    try {
      await onIssueDeny?.(issueId)
    } finally {
      setLoadingId(null)
    }
  }

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Problems Near You</h2>
        <p className="text-muted-foreground">Issues reported in your area</p>
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
            description="Failed to load problems. Please try again."
          />
        ) : issues.length === 0 ? (
          <Empty 
            icon="map-pin"
            title="No issues yet"
            description="No problems have been reported near you"
          />
        ) : (
          issues.map(issue => (
            <IssueCard
              key={issue.id}
              issue={issue}
              onConfirm={handleConfirm}
              onDeny={handleDeny}
              isLoading={loadingId === issue.id}
            />
          ))
        )}
      </div>
    </section>
  )
}
