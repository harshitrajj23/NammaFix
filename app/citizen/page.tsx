'use client'

import { useState } from 'react'
import Navbar from '@/components/citizen/navbar'
import ProblemsSection from '@/components/citizen/problems-section'
import ComplaintsSection from '@/components/citizen/complaints-section'
import TrendingSection from '@/components/citizen/trending-section'
import ComplaintForm from '@/components/citizen/complaint-form'
import { useComplaints, submitComplaint } from '@/hooks/use-complaints'
import { Complaint } from '@/lib/types'
import { useRouter } from 'next/navigation'
import { useToast } from '@/hooks/use-toast'
import HeatMap from '@/components/citizen/heat-map'

type Tab = 'home' | 'complaints' | 'trending' | 'report'

const TAB_CONFIG: Record<Tab, { label: string; icon?: string }> = {
  home: { label: 'Home' },
  complaints: { label: 'Complaints' },
  trending: { label: 'Trending' },
  report: { label: 'Report' },
}

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>('home')
  const [isSubmittingComplaint, setIsSubmittingComplaint] = useState(false)
  const { complaints, setComplaints, isLoading: complaintsLoading } = useComplaints()

  const router = useRouter()
  const { toast } = useToast()

  const handleComplaintSubmit = async (formData: FormData) => {
    setIsSubmittingComplaint(true)
    try {
      const newComplaint = await submitComplaint(formData)
      
      // Immediately update UI state
      setComplaints((prev: Complaint[]) => [newComplaint, ...prev])
      
      toast({
        title: "Complaint submitted",
        description: "Your complaint has been successfully reported.",
      })
      
      // The user can stay on home or redirect. 
      // User requested "Immediately update the UI state... Redirect to /complaints OR automatically refresh"
      // I'll keep the redirect but the state update handles the "immediate" feel on the dashboard if they stay.
      router.push('/citizen/complaints')
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Submission failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
      })
    } finally {
      setIsSubmittingComplaint(false)
    }
  }


  const renderTabContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <div className="space-y-10">
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">Problem Heat Map</h2>
              <p className="text-sm text-muted-foreground">Monitor real-time civic issue hotspots across Bangalore.</p>
              <HeatMap complaints={complaints} />
            </section>

            <ProblemsSection 
              onIssueConfirm={async (issueId) => {
                console.log('Issue confirmed:', issueId)
              }}
              onIssueDeny={async (issueId) => {
                console.log('Issue disputed:', issueId)
              }}
            />
            <ComplaintsSection complaints={complaints} isLoading={complaintsLoading} />
            <TrendingSection />
          </div>
        )
      case 'complaints':
        return (
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-8">Your Complaints</h1>
            <ComplaintsSection complaints={complaints} isLoading={complaintsLoading} />
          </div>
        )
      case 'trending':
        return (
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-8">Trending Problems</h1>
            <TrendingSection limit={12} />
          </div>
        )
      case 'report':
        return (
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-8">Report a Problem</h1>
            <div className="max-w-2xl">
              <ComplaintForm 
                onSubmit={handleComplaintSubmit}
                isLoading={isSubmittingComplaint}
              />
            </div>
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      {/* Desktop Navigation Tabs */}
      <div className="hidden md:block border-b border-border sticky top-16 z-30 bg-background/95 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-8">
            {(Object.entries(TAB_CONFIG) as [Tab, typeof TAB_CONFIG[Tab]][]).map(([tab, { label }]) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab
                    ? 'border-accent text-accent'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-8">
        {renderTabContent()}
      </main>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 border-t border-border bg-card flex items-center justify-around h-16 z-40">
        {(Object.entries(TAB_CONFIG) as [Tab, typeof TAB_CONFIG[Tab]][]).map(([tab, { label }]) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 flex items-center justify-center py-3 font-medium text-xs transition-colors ${
              activeTab === tab
                ? 'text-accent'
                : 'text-muted-foreground'
            }`}
            aria-current={activeTab === tab ? 'page' : undefined}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Mobile spacing for bottom nav */}
      <div className="md:hidden h-16" />
    </div>
  )
}
