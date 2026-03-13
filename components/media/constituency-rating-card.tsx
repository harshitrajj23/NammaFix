'use client'

import { Card } from '@/components/ui/card'
import { Star } from 'lucide-react'
import { ConstituencyPerformance } from '@/lib/types'

interface ConstituencyRatingCardProps {
  constituency: ConstituencyPerformance
  isLoading?: boolean
}

export default function ConstituencyRatingCard({
  constituency,
  isLoading = false,
}: ConstituencyRatingCardProps) {
  const maxRating = constituency.maxRating || 5
  const displayRating = constituency.rating || 0

  return (
    <Card className="bg-card border-border overflow-hidden hover:border-accent/50 transition-colors">
      <div className="p-6 space-y-4">
        <h3 className="font-semibold text-foreground text-lg">{constituency.name}</h3>

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            {Array.from({ length: maxRating }).map((_, i) => (
              <Star
                key={i}
                className={`w-5 h-5 transition-colors ${
                  i < displayRating
                    ? 'fill-accent text-accent'
                    : 'text-muted-foreground'
                }`}
              />
            ))}
            <span className="ml-2 text-sm text-muted-foreground">
              {displayRating || '—'} / {maxRating}
            </span>
          </div>

          {constituency.summary && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {constituency.summary}
            </p>
          )}

          <div className="grid grid-cols-2 gap-3 text-xs">
            {constituency.issueCount !== undefined && (
              <div>
                <p className="text-muted-foreground">Issues Reported</p>
                <p className="font-medium text-foreground">{constituency.issueCount}</p>
              </div>
            )}
            {constituency.resolutionRate !== undefined && (
              <div>
                <p className="text-muted-foreground">Resolution Rate</p>
                <p className="font-medium text-foreground">{constituency.resolutionRate}%</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  )
}
