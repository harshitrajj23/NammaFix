import useSWR from 'swr'
import { Issue } from '@/lib/types'

const fetcher = (url: string) => fetch(url).then(res => res.json())

export function useIssues(location?: string) {
  const query = location ? `?location=${encodeURIComponent(location)}` : ''
  const { data, error, isLoading, mutate } = useSWR<Issue[]>(
    `/api/issues${query}`,
    fetcher
  )

  return {
    issues: data || [],
    isLoading,
    error,
    mutate,
  }
}

export function useIssue(issueId: string) {
  const { data, error, isLoading, mutate } = useSWR<Issue>(
    issueId ? `/api/issues/${issueId}` : null,
    fetcher
  )

  return {
    issue: data,
    isLoading,
    error,
    mutate,
  }
}
