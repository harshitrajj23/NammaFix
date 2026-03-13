'use client'

import { useState } from 'react'
import MediaNavbar from '@/components/media/navbar'
import DailyCivicSection from '@/components/media/daily-civic-section'
import RecurringProblemsSection from '@/components/media/recurring-problems-section'
import ConstituencySection from '@/components/media/constituency-section'
import HistoricalSection from '@/components/media/historical-section'
import { useRouter } from 'next/navigation'
import { DailyCivicStats, RecurringIssueInvestigation, ConstituencyPerformance, HistoricalComplaint } from '@/lib/types'

export default function MediaDashboardPage() {
  const router = useRouter()
  const [isLoadingStats, setIsLoadingStats] = useState(false)
  const [isLoadingIssues, setIsLoadingIssues] = useState(false)
  const [isLoadingConstituencies, setIsLoadingConstituencies] = useState(false)
  const [isLoadingComplaints, setIsLoadingComplaints] = useState(false)

  // TODO: Connect to actual APIs
  const [stats] = useState<DailyCivicStats | undefined>(undefined)
  const [recurringIssues] = useState<RecurringIssueInvestigation[]>([])
  const [constituencies] = useState<ConstituencyPerformance[]>([])
  const [historicalComplaints] = useState<HistoricalComplaint[]>([])

  const handleLogout = () => {
    router.push('/media/login')
  }

  const handleViewDetails = async (issueId: string) => {
    // TODO: Implement navigation or modal for issue details
    console.log('View details for issue:', issueId)
  }

  return (
    <div className="min-h-screen bg-background">
      <MediaNavbar organizationName="Media Organization" onLogout={handleLogout} />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-8 space-y-12">
        {/* Section 1: Daily Civic Data */}
        <DailyCivicSection stats={stats} isLoading={isLoadingStats} />

        {/* Section 2: Recurring Problems */}
        <RecurringProblemsSection
          issues={recurringIssues}
          isLoading={isLoadingIssues}
          onViewDetails={handleViewDetails}
        />

        {/* Section 3: Constituency Performance */}
        <ConstituencySection
          constituencies={constituencies}
          isLoading={isLoadingConstituencies}
        />

        {/* Section 4: Historical Investigation */}
        <HistoricalSection
          complaints={historicalComplaints}
          isLoading={isLoadingComplaints}
        />
      </main>
    </div>
  )
}
