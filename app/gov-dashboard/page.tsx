'use client'

import Link from 'next/link'
import { useState } from 'react'
import { AlertTriangle, MessageSquare, Plus, TrendingUp, Shield, TrafficCone, Siren, Car, Trash2, Droplets, Wind, Waves } from 'lucide-react'
import GovNavbar from '@/components/government/navbar'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import HeatMap from '@/components/citizen/heat-map'
import MapFilters from '@/components/government/map-filters'
import MapStatsBar from '@/components/government/map-stats-bar'
import { useComplaints } from '@/hooks/use-complaints'
import { Complaint } from '@/lib/types'

export default function GovDashboard() {
  const departments = [
    {
      name: 'BBMP (Municipal Corporation)',
      id: 'bbmp',
      cards: [
        {
          id: 'emergency',
          title: 'Emergency Problems',
          description: 'Critical issues requiring immediate attention',
          icon: AlertTriangle,
          href: '/government/emergency',
          buttonLabel: 'Emergency Cases',
          isEmergency: true,
          color: 'text-red-400',
        },
        {
          id: 'feedback',
          title: 'Citizen Feedback',
          description: 'Reviews and feedback from citizens',
          icon: MessageSquare,
          href: '/government/feedback',
          buttonLabel: 'View Feedback',
        },
        {
          id: 'new-problems',
          title: 'New Problems',
          description: 'Recently submitted complaints',
          icon: Plus,
          href: '/government/new-problems',
          buttonLabel: 'View New Problems',
        },
        {
          id: 'recurring',
          title: 'Recurring Problems',
          description: 'Issues detected multiple times',
          icon: TrendingUp,
          href: '/government/recurring',
          buttonLabel: 'View Recurring Issues',
        },
      ]
    },
    {
      name: 'Traffic Police',
      id: 'traffic',
      cards: [
        {
          id: 'traffic-complaints',
          title: 'Traffic Complaints',
          description: 'Violation reports and general complaints',
          icon: TrafficCone,
          href: '#',
          buttonLabel: 'View Traffic Reports',
        },
        {
          id: 'accident-reports',
          title: 'Accident Reports',
          description: 'Recent traffic accident incidents',
          icon: Siren,
          href: '#',
          buttonLabel: 'View Accidents',
        },
        {
          id: 'signal-problems',
          title: 'Signal Problems',
          description: 'Malfunctioning traffic lights and signals',
          icon: Shield,
          href: '#',
          buttonLabel: 'Manage Signals',
        },
        {
          id: 'traffic-congestion',
          title: 'Traffic Congestion',
          description: 'Real-time road congestion monitoring',
          icon: Car,
          href: '#',
          buttonLabel: 'Monitor Traffic',
        },
      ]
    },
    {
      name: 'Cleaning Work / Sanitation',
      id: 'sanitation',
      cards: [
        {
          id: 'garbage-collection',
          title: 'Garbage Collection',
          description: 'Waste management and collection schedules',
          icon: Trash2,
          href: '#',
          buttonLabel: 'View Cleaning Issues',
        },
        {
          id: 'waste-overflow',
          title: 'Waste Overflow',
          description: 'Reports of overflowing community bins',
          icon: Wind,
          href: '#',
          buttonLabel: 'Manage Cleanup',
        },
        {
          id: 'drainage-issues',
          title: 'Drainage Issues',
          description: 'Blocked drains and sewage leakage',
          icon: Waves,
          href: '#',
          buttonLabel: 'Inspect Drainage',
        },
        {
          id: 'street-cleaning',
          title: 'Street Cleaning',
          description: 'Routine maintenance and sweeping',
          icon: Droplets,
          href: '#',
          buttonLabel: 'Check Schedules',
        },
      ]
    }
  ]

  const [filters, setFilters] = useState<any>({ category: null, severity: null, status: null })
  const { complaints, isLoading } = useComplaints(undefined, true)

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
    <div className="min-h-screen bg-background">
      <GovNavbar governmentName="Government Official" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-12">
        {/* Header */}
        <div className="mb-0">
          <h1 className="text-3xl font-bold text-foreground mb-2">Government Portal</h1>
          <p className="text-muted-foreground">
            Monitor and manage civic infrastructure across the city by department.
          </p>
        </div>

        {/* Department Sections */}
        {departments.map((dept) => (
          <div key={dept.id} className="space-y-6">
            <h2 className="text-2xl font-black text-foreground border-l-4 border-accent pl-4 uppercase tracking-tighter">
              {dept.name}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {dept.cards.map((section) => {
                const Icon = section.icon
                const isEmergency = section.isEmergency

                return (
                  <Link key={section.id} href={section.href}>
                    <Card className="bg-card border-border p-5 h-full hover:border-accent/40 transition-all cursor-pointer group relative overflow-hidden shadow-sm">
                      {/* Background accent for emergency */}
                      {isEmergency && (
                        <div className="absolute inset-0 bg-gradient-to-br from-red-900/10 to-transparent pointer-events-none" />
                      )}

                      <div className="relative z-10 space-y-4 h-full flex flex-col justify-between">
                        <div className="flex items-start gap-4">
                          <div className={`p-2.5 rounded-lg bg-secondary group-hover:bg-accent/20 transition-colors shrink-0 ${isEmergency ? section.color : 'text-accent'}`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-foreground leading-none mb-2">
                              {section.title}
                            </h3>
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {section.description}
                            </p>
                          </div>
                        </div>

                        <div className="pt-2">
                          <Button
                            className={`w-full font-bold uppercase text-[10px] tracking-widest ${isEmergency ? 'bg-red-600 hover:bg-red-700 text-white' : 'border-border hover:bg-secondary text-foreground'}`}
                            size="sm"
                            variant={isEmergency ? 'default' : 'outline'}
                          >
                            {section.buttonLabel}
                          </Button>
                        </div>
                      </div>
                    </Card>
                  </Link>
                )
              })}
            </div>
          </div>
        ))}

        {/* Heat Map Monitoring Section */}
        <section className="mt-[40px] space-y-6 border-t border-border/50 pt-12">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-foreground">City Problem Heat Map</h2>
            <p className="text-muted-foreground">Live civic issue hotspots across Bangalore.</p>
          </div>

          <MapStatsBar stats={stats} />

          <Card className="w-full min-h-[500px] bg-card border-border overflow-hidden relative rounded-xl shadow-2xl">
             <HeatMap complaints={filteredComplaints} mode="government" />
          </Card>
        </section>
      </main>
    </div>
  )
}
