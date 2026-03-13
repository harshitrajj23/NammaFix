'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import GovNavbar from '@/components/government/navbar'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import HeatMap from '@/components/citizen/heat-map'
import MapFilters from '@/components/government/map-filters'
import MapStatsBar from '@/components/government/map-stats-bar'
import { useComplaints } from '@/hooks/use-complaints'
import { Complaint } from '@/lib/types'

export default function GovernmentHeatMapPage() {
  const [filters, setFilters] = useState<any>({ category: null, severity: null, status: null })
  const { complaints, isLoading } = useComplaints(undefined, true) // Government gets all city-wide complaints

  const filteredComplaints = complaints.filter((c: Complaint) => {
    if (filters.category && c.category !== filters.category) return false
    if (filters.severity && c.severity !== filters.severity) return false
    if (filters.status && c.status !== filters.status) return false
    return true
  })

  const stats = {
    total: complaints.length,
    active: complaints.filter((c: Complaint) => c.status !== 'resolved' && c.status !== 'completed' && c.status !== 'rejected').length,
    resolved: complaints.filter((c: Complaint) => c.status === 'resolved' || c.status === 'completed').length,
    highPriority: complaints.filter((c: Complaint) => c.severity === 'critical' || (c as any).votes >= 10).length,
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <GovNavbar governmentName="Government Official" />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Back navigation */}
        <Link href="/government">
          <Button variant="ghost" className="pl-0 gap-2 mb-2 hover:bg-transparent hover:text-accent">
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Button>
        </Link>

        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-3">
            City Problem Heat Map
            <Badge variant="outline" className="bg-amber-400/10 text-amber-500 border-amber-500/20 text-xs font-bold uppercase py-0.5 px-2">LIVE MONITORING</Badge>
          </h1>
          <p className="text-muted-foreground">
            AI powered visualization of civic issue hotspots across Bangalore.
          </p>
        </div>

        {/* Heat Map Monitoring Section */}
        <section className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <MapFilters onFilterChange={(newFilters) => setFilters((prev: any) => ({ ...prev, ...newFilters }))} />
          </div>

          <MapStatsBar stats={stats} />

          <div className="relative">
            <HeatMap complaints={filteredComplaints} mode="government" />
          </div>
        </section>
      </main>
    </div>
  )
}
