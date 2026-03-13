'use client'

import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { useComplaints } from '@/hooks/use-complaints'
import { Skeleton } from '@/components/ui/skeleton'
import { Complaint } from '@/lib/types'

interface ComplaintsSectionProps {
  userId?: string
  complaints?: Complaint[]
  isLoading?: boolean
}

export default function ComplaintsSection({ userId, complaints: externalComplaints, isLoading: externalIsLoading }: ComplaintsSectionProps) {
  const { complaints: internalComplaints, isLoading: internalIsLoading } = useComplaints(userId)

  const complaints = externalComplaints || internalComplaints
  const isLoading = externalIsLoading !== undefined ? externalIsLoading : internalIsLoading

  const safeComplaints = Array.isArray(complaints) ? complaints : []
  const completedCount = safeComplaints.filter(c => c.status === 'resolved').length

  const completionPercentage = safeComplaints.length > 0 ? (completedCount / safeComplaints.length) * 100 : 0

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Your Previous Complaints</h2>
      </div>

      <Card className="bg-card border-border p-6">
        <div className="space-y-4">
          {isLoading ? (
            <>
              <Skeleton className="h-6 bg-secondary" />
              <Skeleton className="h-2 bg-secondary" />
            </>
          ) : (
            <>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-foreground">Total Complaints</span>
                  <span className="text-2xl font-bold text-accent">{safeComplaints.length}</span>
                </div>
                <Progress value={completionPercentage} className="h-2 bg-secondary" />
                <p className="text-xs text-muted-foreground mt-2">
                  {completedCount} resolved
                </p>
              </div>
            </>
          )}

          <Link href="/citizen/complaints">
            <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
              View All Complaints
            </Button>
          </Link>
        </div>
      </Card>
    </section>
  )
}
