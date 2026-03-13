'use client'

import Link from 'next/link'
import { AlertTriangle, MessageSquare, Plus, TrendingUp } from 'lucide-react'
import GovNavbar from '@/components/government/navbar'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export default function GovDashboard() {
  const sections = [
    {
      id: 'emergency',
      title: 'Emergency Problems',
      description: 'Critical issues requiring immediate attention',
      icon: AlertTriangle,
      href: '/government/emergency',
      buttonLabel: 'Emergency Cases',
      buttonVariant: 'destructive' as const,
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

  return (
    <div className="min-h-screen bg-background">
      <GovNavbar governmentName="Government Official" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of complaints and citizen feedback
          </p>
        </div>

        {/* Sections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {sections.map((section) => {
            const Icon = section.icon
            const isEmergency = section.id === 'emergency'

            return (
              <Link key={section.id} href={section.href}>
                <Card
                  className={`bg-card border-border p-6 h-full hover:border-accent/50 transition-all cursor-pointer group ${
                    isEmergency ? 'md:col-span-2 lg:col-span-2 relative overflow-hidden' : ''
                  }`}
                >
                  {/* Background accent for emergency */}
                  {isEmergency && (
                    <div className="absolute inset-0 bg-gradient-to-br from-red-900/10 to-transparent pointer-events-none" />
                  )}

                  <div className="relative z-10 space-y-4 h-full flex flex-col justify-between">
                    <div className="space-y-2">
                      <div
                        className={`inline-flex p-2 rounded-lg bg-secondary group-hover:bg-accent/20 transition-colors ${
                          isEmergency ? section.color : 'text-accent'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <h2 className="text-lg font-semibold text-foreground">
                        {section.title}
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        {section.description}
                      </p>
                    </div>

                    {isEmergency ? (
                      <Button
                        className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold"
                        size="lg"
                      >
                        {section.buttonLabel}
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        className="w-full border-border hover:bg-secondary"
                      >
                        {section.buttonLabel}
                      </Button>
                    )}
                  </div>
                </Card>
              </Link>
            )
          })}
        </div>

        {/* Stats Section (Optional) */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-card border-border p-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Total Issues</p>
              <p className="text-3xl font-bold text-foreground">-</p>
            </div>
          </Card>
          <Card className="bg-card border-border p-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Resolved Today</p>
              <p className="text-3xl font-bold text-foreground">-</p>
            </div>
          </Card>
          <Card className="bg-card border-border p-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Avg Response Time</p>
              <p className="text-3xl font-bold text-foreground">-</p>
            </div>
          </Card>
        </div>
      </main>
    </div>
  )
}
