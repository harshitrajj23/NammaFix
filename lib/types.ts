export interface Issue {
  id: string
  title: string
  description?: string
  location: string
  latitude?: number
  longitude?: number
  category: string
  imageUrl?: string
  status: 'open' | 'in-progress' | 'resolved'
  confirmations: number
  createdAt: Date
  updatedAt: Date
}

export interface Complaint {
  id: string
  userId: string
  title: string
  description: string
  location: string
  latitude?: number
  longitude?: number
  category: string
  imageUrl?: string
  audioUrl?: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  status: 'pending' | 'submitted' | 'under-review' | 'in_progress' | 'resolved' | 'completed' | 'rejected'
  createdAt: Date
  updatedAt: Date
}


export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  location?: string
  complaints: string[]
  createdAt: Date
}

export interface Notification {
  id: string
  userId: string
  type: 'issue-update' | 'complaint-update' | 'achievement'
  title: string
  message: string
  relatedId?: string
  read: boolean
  createdAt: Date
}

export interface GovernmentUser {
  id: string
  govId: string
  name: string
  email?: string
  department?: string
  avatar?: string
  createdAt: Date
}

export interface EmergencyProblem {
  id: string
  complaintId: string
  title: string
  description: string
  location: string
  citizenId: string
  priority: 'critical' | 'high' | 'medium'
  status: 'new' | 'assigned' | 'in-progress' | 'resolved'
  createdAt: Date
  updatedAt: Date
}

export interface CitizenFeedback {
  id: string
  citizenId: string
  complaintId: string
  location: string
  feedbackText: string
  rating: 1 | 2 | 3 | 4 | 5
  createdAt: Date
}

export interface RecurringProblem {
  id: string
  title: string
  location: string
  area?: string
  occurrences: number
  lastReportedAt: Date
  category: string
  severity: 'low' | 'medium' | 'high'
}

export interface GovernmentResponse {
  complaintId: string
  responseText: string
  deadlineDate?: Date
  audioUrl?: string
  respondedBy: string
  respondedAt: Date
}

export interface MediaUser {
  id: string
  mediaOrgId: string
  name: string
  organization: string
  email?: string
  avatar?: string
  createdAt: Date
}

export interface DailyCivicStats {
  totalComplaints: number
  constituenciesCovered: number
  resolvedIssues: number
  publicFeedbackScore: number
}

export interface RecurringIssueInvestigation {
  id: string
  title: string
  location: string
  constituency?: string
  occurrences: number
  assignedContractor?: string
  lastReportedAt: Date
  severity: 'low' | 'medium' | 'high'
}

export interface ConstituencyPerformance {
  id: string
  name: string
  rating: number
  maxRating?: number
  summary?: string
  issueCount?: number
  resolutionRate?: number
}

export interface HistoricalComplaint {
  id: string
  complaintId: string
  location: string
  status: 'resolved' | 'pending' | 'rejected' | 'in-progress'
  resolutionTimeline?: string
  createdAt: Date
  resolvedAt?: Date
}
