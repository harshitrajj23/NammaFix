import { NextRequest, NextResponse } from 'next/server'
import { Issue } from '@/lib/types'

/**
 * GET /api/issues
 * Fetch issues, optionally filtered by location
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const location = searchParams.get('location')

    // TODO: Implement database query to fetch issues
    // For now, return empty array
    const issues: Issue[] = []

    return NextResponse.json(issues)
  } catch (error) {
    console.error('Error fetching issues:', error)
    return NextResponse.json(
      { error: 'Failed to fetch issues' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/issues
 * Create a new issue (confirm an existing issue)
 */
export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // TODO: Implement database mutation to create issue or increment confirmations
    // Validate required fields: title, location, category
    
    const issue: Issue = {
      id: Math.random().toString(36).substr(2, 9),
      title: data.title,
      location: data.location,
      category: data.category,
      description: data.description,
      status: 'open',
      confirmations: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    return NextResponse.json(issue, { status: 201 })
  } catch (error) {
    console.error('Error creating issue:', error)
    return NextResponse.json(
      { error: 'Failed to create issue' },
      { status: 500 }
    )
  }
}
