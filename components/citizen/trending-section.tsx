'use client'

import Link from 'next/link'
import useSWR from 'swr'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Empty, 
  EmptyHeader, 
  EmptyTitle, 
  EmptyDescription, 
  EmptyMedia 
} from '@/components/ui/empty'
import { Skeleton } from '@/components/ui/skeleton'
import { TrendingUp, ArrowUpRight, AlertCircle } from 'lucide-react'

const fetcher = (url: string) => fetch(url).then(res => res.json())

interface TrendingIssue {
  issue: string
  count: number
  source?: 'news' | 'complaints' | 'combined'
  trend?: 'high' | 'medium' | 'low'
}

interface TrendingSectionProps {
  limit?: number
}

export default function TrendingSection({ limit = 3 }: TrendingSectionProps) {
  const { data, error, isLoading } = useSWR<{ trending: TrendingIssue[] }>(
    '/api/ai/trending',
    fetcher,
    { refreshInterval: 60000 } // Auto-refresh every minute
  )
  
  const trendingIssues = data?.trending?.slice(0, limit) || []

  const getTrendColor = (trend?: string) => {
    switch (trend) {
      case 'high': return 'text-red-500'
      case 'medium': return 'text-orange-500'
      default: return 'text-green-500'
    }
  }

  return (
    <section className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Trending Problems</h2>
          <p className="text-sm text-muted-foreground mt-1">AI-detected from live news & citizen reports</p>
        </div>
        <Link href="/citizen/trending">
          <Button variant="ghost" size="sm" className="text-accent hover:text-accent hover:bg-accent/10">
            View All
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-40 rounded-xl bg-secondary" />
          ))
        ) : error ? (
          <Empty className="col-span-full py-12">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <AlertCircle className="size-6" />
              </EmptyMedia>
              <EmptyTitle>Analysis delayed</EmptyTitle>
              <EmptyDescription>Our AI engine is processing current reports. Check back soon.</EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : trendingIssues.length === 0 ? (
          <Empty className="col-span-full py-12">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <TrendingUp className="size-6" />
              </EmptyMedia>
              <EmptyTitle>Clean Streets</EmptyTitle>
              <EmptyDescription>No major repeating issues detected in your area currently.</EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          trendingIssues.map((item, index) => (
            <Card key={index} className="p-5 bg-card border-border hover:border-accent/40 transition-all group flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <Badge variant="secondary" className="bg-accent/10 text-accent border-none rounded-full px-3 py-1 capitalize">
                    {item.source || 'AI Analyzed'}
                  </Badge>
                  <TrendingUp size={16} className={getTrendColor(item.trend)} />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-1 group-hover:text-accent transition-colors">
                  {item.issue}
                </h3>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-muted-foreground mt-4">
                <span className="font-semibold text-foreground">{item.count} reports</span>
                <span>•</span>
                <span className={`flex items-center gap-0.5 font-medium ${getTrendColor(item.trend)}`}>
                  {item.trend === 'high' ? 'High Impact' : item.trend === 'medium' ? 'Rising' : 'Monitoring'}{' '}
                  <ArrowUpRight size={14} />
                </span>
              </div>

            </Card>
          ))
        )}
      </div>
    </section>
  )
}

