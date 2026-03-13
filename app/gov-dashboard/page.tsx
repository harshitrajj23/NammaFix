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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="space-y-2 mb-12">
          <h1 className="text-4xl font-bold text-foreground">Government Dashboard</h1>
          <p className="text-muted-foreground">Manage and respond to civic complaints</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sections.map((section) => {
            const Icon = section.icon
            return (
              <Link key={section.id} href={section.href}>
                <Card className="bg-card border-border p-6 h-full hover:border-accent/50 transition-colors cursor-pointer">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <Icon className={`w-6 h-6 ${section.color}`} />
                        <h2 className="text-xl font-bold text-foreground">
                          {section.title}
                        </h2>
                        <p className="text-sm text-muted-foreground">
                          {section.description}
                        </p>
                      </div>
                    </div>
                    <Button
                      className={`w-full ${
                        section.buttonVariant === 'destructive'
                          ? 'bg-red-600 hover:bg-red-700 text-white'
                          : 'bg-accent hover:bg-accent/90 text-accent-foreground'
                      }`}
                    >
                      {section.buttonLabel}
                    </Button>
                  </div>
                </Card>
              </Link>
            )
          })}
        </div>
      </main>
    </div>
  )
}
