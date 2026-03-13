'use client'

import { DailyCivicStats } from '@/lib/types'
import StatCard from './stat-card'
import { BarChart3, MapPin, CheckCircle, MessageSquare } from 'lucide-react'

interface DailyCivicSectionProps {
  stats?: DailyCivicStats
  isLoading?: boolean
}

export default function DailyCivicSection({ stats, isLoading = false }: DailyCivicSectionProps) {
  const cards = [
    {
      title: 'Number of Complaints',
      value: stats?.totalComplaints,
      icon: <BarChart3 className="w-5 h-5" />,
      description: 'Total complaints reported today',
    },
    {
      title: 'Constituencies Covered',
      value: stats?.constituenciesCovered,
      icon: <MapPin className="w-5 h-5" />,
      description: 'Areas with active reports',
    },
    {
      title: 'Resolved Issues (Past)',
      value: stats?.resolvedIssues,
      icon: <CheckCircle className="w-5 h-5" />,
      description: 'Previously resolved complaints',
    },
    {
      title: 'Public Feedback',
      value: stats?.publicFeedbackScore,
      icon: <MessageSquare className="w-5 h-5" />,
      description: 'Average citizen satisfaction',
    },
  ]

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Daily Civic Overview</h2>
        <p className="text-sm text-muted-foreground">Key metrics from citizen reports</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => (
          <StatCard
            key={card.title}
            title={card.title}
            value={card.value}
            isLoading={isLoading}
            description={card.description}
            icon={card.icon}
          />
        ))}
      </div>
    </section>
  )
}
