import { useState, useEffect, useCallback } from 'react'
import { Complaint } from '@/lib/types'
import { createClient } from '@/lib/supabase/client'

export function useComplaints(userId?: string) {
  const [complaints, setComplaints] = useState<Complaint[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<any>(null)
  const supabase = createClient()

  const fetchComplaints = useCallback(async () => {
    try {
      setIsLoading(true)
      
      let currentUserId = userId
      if (!currentUserId) {
        const { data: { user } } = await supabase.auth.getUser()
        currentUserId = user?.id
      }

      if (!currentUserId) {
        setComplaints([])
        return
      }

      const { data, error } = await supabase
        .from("complaints")
        .select(`
          *,
          responses(*),
          feedback(*)
        `)
        .eq("user_id", currentUserId)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Supabase fetch error:", error.message);
        throw error;
      }

      const formattedData: Complaint[] = (data || []).map(c => ({
        id: c.id,
        userId: c.user_id,
        title: c.title,
        category: c.category,
        description: c.description,
        location: c.location,
        imageUrl: c.image_url,
        audioUrl: c.audio_url,
        status: c.status,
        severity: c.severity,
        createdAt: c.created_at,
        updatedAt: c.created_at,
        responses: c.responses || [],
        feedback: c.feedback || [],
        // Legacy support if anything still uses this field
        governmentResponse: c.responses && c.responses.length > 0 
          ? c.responses[c.responses.length - 1].government_response 
          : undefined
      })) as any

      setComplaints(formattedData)
    } catch (err) {
      console.error("Dashboard load failed:", err)
      setError(err)
      setComplaints([])
    } finally {
      setIsLoading(false)
    }
  }, [userId, supabase])



  useEffect(() => {
    fetchComplaints()
  }, [fetchComplaints])

  return {
    complaints: Array.isArray(complaints) ? complaints : [],
    isLoading,
    error,
    refresh: fetchComplaints,
    setComplaints
  }
}

export function useComplaint(complaintId: string) {
  const [complaint, setComplaint] = useState<Complaint | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<any>(null)
  const supabase = createClient()

  const fetchComplaint = useCallback(async () => {
    if (!complaintId) return
    try {
      setIsLoading(true)
      const { data, error: fetchError } = await supabase
        .from('complaints')
        .select('*, responses(*)')
        .eq('id', complaintId)
        .single()

      if (fetchError) throw fetchError

      const formatted: Complaint = {
        id: data.id,
        userId: data.user_id,
        title: data.title,
        category: data.category,
        description: data.description,
        location: data.location,
        imageUrl: data.image_url,
        audioUrl: data.audio_url,
        status: data.status,
        createdAt: data.created_at,
        updatedAt: data.created_at,
        governmentResponse: data.responses && data.responses.length > 0
          ? data.responses[data.responses.length - 1].government_response
          : undefined
      } as any
      setComplaint(formatted)
    } catch (err) {
      console.error('Error fetching complaint:', err)
      setError(err)
    } finally {
      setIsLoading(false)
    }
  }, [complaintId, supabase])


  useEffect(() => {
    fetchComplaint()
  }, [fetchComplaint])

  return { complaint, isLoading, error, refresh: fetchComplaint }
}

export async function submitComplaint(formData: FormData) {
  // We call the API which already handles the auth check, storage uploads, and DB insert
  const response = await fetch('/api/complaints', {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => null)
    const errMessage = errorData?.error || 'Failed to submit complaint'
    console.error('Complaint submission error:', errMessage)
    throw new Error(errMessage)
  }

  const result = await response.json()
  console.log('complaint inserted', result)
  return result as Complaint
}


