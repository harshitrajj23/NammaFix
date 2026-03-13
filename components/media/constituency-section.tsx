'use client'

import { ConstituencyPerformance } from '@/lib/types'
import ConstituencyRatingCard from './constituency-rating-card'
import { Empty } from '@/components/ui/empty'
import { Skeleton } from '@/components/ui/skeleton'

interface ConstituencySectionProps {
  constituencies: ConstituencyPerformance[]
  isLoading?: boolean
  error?: string
}

export default function ConstituencySection({
  constituencies,
  isLoading = false,
  error,
}: ConstituencySectionProps) {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Constituency Performance Ratings
        </h2>
        <p className="text-sm text-muted-foreground">
          Civic performance ratings by constituency
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-56 bg-secondary" />
          ))
        ) : error ? (
          <Empty
            icon="alert-circle"
            title="Error loading constituencies"
            description="Failed to load constituency data. Please try again."
          />
        ) : constituencies.length === 0 ? (
          <Empty
            icon="map-pin"
            title="No constituency data"
            description="Constituency performance ratings will appear here"
          />
        ) : (
          constituencies.map((constituency) => (
            <ConstituencyRatingCard
              key={constituency.id}
              constituency={constituency}
              isLoading={isLoading}
            />
          ))
        )}
      </div>
    </section>
  )
}
