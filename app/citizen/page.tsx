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
import SnowParticles from '@/components/ui/snow-particles'

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
            <section className="animate-in fade-in slide-in-from-bottom-8 duration-700 fill-mode-both delay-100 content-wrapper mt-5">
              <div className="space-y-1 mb-4">
                <h2 className="text-2xl font-bold text-foreground">Problem Heat Map</h2>
                <p className="text-sm text-muted-foreground">Monitor real-time civic issue hotspots across Bangalore.</p>
              </div>
              <div className="map-card relative w-full h-[420px] mt-4 overflow-hidden rounded-xl border border-[#FFD700]/30 shadow-[0_10px_40px_rgba(255,215,0,0.1)] hover:shadow-[0_10px_50px_rgba(255,215,0,0.15)] transition-shadow duration-500">
                <HeatMap complaints={complaints} />
              </div>
            </section>

            <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 fill-mode-both delay-300">
              <ProblemsSection 
                onIssueConfirm={async (issueId) => {
                  console.log('Issue confirmed:', issueId)
                }}
                onIssueDeny={async (issueId) => {
                  console.log('Issue disputed:', issueId)
                }}
              />
            </div>
            <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 fill-mode-both delay-500">
              <ComplaintsSection complaints={complaints} isLoading={complaintsLoading} />
            </div>
            <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 fill-mode-both delay-700">
              <TrendingSection />
            </div>
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
    <div className="min-h-screen bg-background flex flex-col relative z-0">
      <SnowParticles />
      <div className="relative z-10 w-full">
        <Navbar />
      </div>

      {/* Desktop Navigation Tabs */}
      <div className="hidden md:block border-b border-border sticky top-16 z-[9999] bg-background/95 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-8">
            {(Object.entries(TAB_CONFIG) as [Tab, typeof TAB_CONFIG[Tab]][]).map(([tab, { label }]) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`group relative py-4 px-1 font-medium text-sm transition-colors duration-300 ${
                  activeTab === tab
                    ? 'text-[#FFD700]'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {label}
                {/* Animated active underline */}
                <div 
                  className={`absolute bottom-0 left-0 w-full h-[2px] bg-[#FFD700] transition-transform duration-300 ease-out origin-left ${
                    activeTab === tab ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100 opacity-50'
                  }`}
                />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="relative z-10 flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 pt-16 pb-8">
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
