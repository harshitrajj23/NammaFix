'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import Link from 'next/link'
import { Users, Building2, Newspaper } from 'lucide-react'

export default function RootPage() {
  const portals = [
    {
      title: 'Citizen Portal',
      description: 'Report and track civic issues in your community',
      icon: Users,
      href: '/citizen',
      color: 'text-blue-400',
    },
    {
      title: 'Government Portal',
      description: 'Manage complaints and respond to citizen issues',
      icon: Building2,
      href: '/government/login',
      color: 'text-green-400',
    },
    {
      title: 'Media Portal',
      description: 'Access civic transparency data and investigate issues',
      icon: Newspaper,
      href: '/media/login',
      color: 'text-yellow-400',
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <div className="flex justify-center mb-6">
            <div className="h-16 w-16 rounded bg-accent flex items-center justify-center">
              <span className="text-accent-foreground font-bold text-2xl">NF</span>
            </div>
          </div>
          <h1 className="text-4xl font-bold text-foreground">NammaFix</h1>
          <p className="text-lg text-muted-foreground">
            Civic transparency platform connecting citizens, government, and media
          </p>
        </div>

        {/* Portals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {portals.map((portal) => {
            const Icon = portal.icon
            return (
              <Link key={portal.href} href={portal.href}>
                <Card className="bg-card border-border h-full p-8 hover:border-accent/50 transition-colors cursor-pointer">
                  <div className="space-y-4">
                    <Icon className={`w-8 h-8 ${portal.color}`} />
                    <div>
                      <h2 className="text-xl font-bold text-foreground mb-2">
                        {portal.title}
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        {portal.description}
                      </p>
                    </div>
                    <Button className="w-full mt-4 bg-accent hover:bg-accent/90 text-accent-foreground">
                      Access
                    </Button>
                  </div>
                </Card>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
