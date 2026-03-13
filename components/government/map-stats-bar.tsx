'use client'

import { Card } from '@/components/ui/card'
import { FileText, CheckCircle, Clock, AlertTriangle } from 'lucide-react'

interface MapStatsBarProps {
  stats: {
    total: number
    active: number
    resolved: number
    highPriority: number
  }
}

export default function MapStatsBar({ stats }: MapStatsBarProps) {
  const statItems = [
    {
      label: 'Total Complaints',
      value: stats.total,
      icon: FileText,
      color: 'text-blue-400',
    },
    {
      label: 'Active Issues',
      value: stats.active,
      icon: Clock,
      color: 'text-amber-400',
    },
    {
      label: 'Resolved Issues',
      value: stats.resolved,
      icon: CheckCircle,
      color: 'text-green-400',
    },
    {
      label: 'Priority Zones',
      value: stats.highPriority,
      icon: AlertTriangle,
      color: 'text-red-400',
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      {statItems.map((item) => {
        const Icon = item.icon
        return (
          <Card key={item.label} className="bg-card border-border/50 p-3 shadow-md hover:border-accent/30 transition-all group">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg bg-secondary/80 group-hover:bg-secondary ${item.color}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">{item.label}</p>
                <p className="text-xl font-black text-foreground tabular-nums tracking-tighter">
                  {item.value.toLocaleString()}
                </p>
              </div>
            </div>
          </Card>
        )
      })}
    </div>
  )
}
