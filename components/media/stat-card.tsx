'use client'

import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

interface StatCardProps {
  title: string
  value?: number | string
  isLoading?: boolean
  description?: string
  icon?: React.ReactNode
}

export default function StatCard({
  title,
  value,
  isLoading = false,
  description,
  icon,
}: StatCardProps) {
  return (
    <Card className="bg-card border-border p-6">
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
          {icon && <div className="text-accent">{icon}</div>}
        </div>

        {isLoading ? (
          <Skeleton className="h-8 bg-secondary w-24" />
        ) : (
          <div className="space-y-2">
            <p className="text-3xl font-bold text-accent">{value || '—'}</p>
            {description && <p className="text-xs text-muted-foreground">{description}</p>}
          </div>
        )}
      </div>
    </Card>
  )
}
