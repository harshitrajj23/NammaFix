'use client'

import { HistoricalComplaint } from '@/lib/types'
import HistoricalComplaintCard from './historical-complaint-card'
import { Empty } from '@/components/ui/empty'
import { Skeleton } from '@/components/ui/skeleton'

interface HistoricalSectionProps {
  complaints: HistoricalComplaint[]
  isLoading?: boolean
  error?: string
}

export default function HistoricalSection({
  complaints,
  isLoading = false,
  error,
}: HistoricalSectionProps) {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Past Complaint Analysis</h2>
        <p className="text-sm text-muted-foreground">
          Explore older civic complaints and their resolution timelines
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-72 bg-secondary" />
          ))
        ) : error ? (
          <Empty
            icon="alert-circle"
            title="Error loading complaints"
            description="Failed to load historical complaints. Please try again."
          />
        ) : complaints.length === 0 ? (
          <Empty
            icon="file-text"
            title="No historical complaints"
            description="Past complaints will appear here as they are resolved"
          />
        ) : (
          complaints.map((complaint) => (
            <HistoricalComplaintCard
              key={complaint.id}
              complaint={complaint}
              isLoading={isLoading}
            />
          ))
        )}
      </div>
    </section>
  )
}
