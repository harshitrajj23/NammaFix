# NammaFix Architecture Documentation

## Overview

NammaFix is a civic-tech platform for reporting and tracking infrastructure issues in communities. The application is built with Next.js 16 and follows a modern, production-ready architecture.

## Project Structure

```
app/
├── api/                    # API routes (backend)
│   ├── issues/            # Issue endpoints
│   ├── complaints/        # Complaint endpoints
│   └── notifications/     # Notification endpoints
├── page.tsx               # Main dashboard page
├── complaints/            # Complaints page
├── trending/              # Trending issues page
└── layout.tsx             # Root layout with theme setup

components/
├── navbar.tsx             # Top navigation bar
├── notification-panel.tsx # Notification dropdown panel
├── issue-card.tsx         # Reusable issue display card
├── complaint-form.tsx     # Form for submitting complaints
├── problems-section.tsx   # Section displaying nearby problems
├── complaints-section.tsx # User's complaint summary
├── trending-section.tsx   # Trending issues display
└── ui/                    # shadcn/ui components

hooks/
├── use-issues.ts          # SWR hook for issues data
├── use-complaints.ts      # SWR hook for complaints data
├── use-notifications.ts   # SWR hook for notifications
└── use-app-context.tsx    # App-wide context provider

lib/
├── types.ts               # TypeScript interfaces
├── utils-api.ts           # API utility functions
└── constants.ts           # Application constants

public/                     # Static assets
styles/                    # Global styles (globals.css)
```

## Key Technologies

- **Next.js 16**: Full-stack React framework with App Router
- **React 19**: UI library
- **TypeScript**: Type-safe development
- **Tailwind CSS v4**: Utility-first styling
- **SWR**: Data fetching and client-side caching
- **shadcn/ui**: Accessible UI component library

## Data Flow Architecture

### Client-Side State Management

We use **SWR** for client-side data fetching and caching:

```
Component → SWR Hook (useIssues, useComplaints, etc.)
         → Cached Data + Revalidation
         → Re-render on Data Change
```

Benefits:
- Built-in caching and revalidation
- Real-time synchronization across components
- Automatic error handling and retry logic
- No boilerplate (unlike Redux/Context)

### API Routes

All API routes are in `app/api/` following RESTful conventions:

```
GET    /api/issues              - List issues
POST   /api/issues              - Create issue
GET    /api/issues/:id          - Get issue detail
PATCH  /api/issues/:id          - Update issue

GET    /api/complaints          - List complaints
POST   /api/complaints          - Submit complaint
GET    /api/complaints/:id      - Get complaint detail
PATCH  /api/complaints/:id      - Update complaint
DELETE /api/complaints/:id      - Delete complaint

GET    /api/notifications       - List notifications
PATCH  /api/notifications/:id   - Mark as read
PATCH  /api/notifications/mark-all-read - Mark all as read
```

## Component Architecture

### Presentational Components

Components are organized by responsibility:

1. **Reusable Components**: (`issue-card.tsx`, `complaint-form.tsx`)
   - Accept data via props
   - No hardcoded data
   - Composable and testable

2. **Container Components**: (`problems-section.tsx`, `complaints-section.tsx`)
   - Fetch data using hooks
   - Handle loading/error states
   - Compose reusable components

3. **Page Components**: (`page.tsx`)
   - Top-level route components
   - Orchestrate sections
   - Handle global state

### Props Pattern

Components use explicit prop interfaces:

```typescript
interface IssueCardProps {
  issue: Issue              // Type-safe data
  onConfirm?: () => void    // Optional callbacks
  isLoading?: boolean       // UI state
}
```

## Type System

All data structures are defined in `lib/types.ts`:

```typescript
interface Issue {
  id: string
  title: string
  location: string
  category: string
  status: 'open' | 'in-progress' | 'resolved'
  confirmations: number
  createdAt: Date
  updatedAt: Date
}

interface Complaint {
  id: string
  userId: string
  title: string
  description: string
  location: string
  category: string
  status: 'pending' | 'submitted' | 'under-review' | 'resolved' | 'rejected'
  createdAt: Date
  updatedAt: Date
}
```

## Styling System

### Dark Theme with Gold Accents

Design tokens are defined in `app/globals.css`:

```css
--background: #0a0a0a        /* Pure black */
--foreground: #fafafa        /* Off-white */
--accent: #d4af37            /* Gold */
--secondary: #2a2a2a         /* Dark gray */
--muted: #3a3a3a             /* Muted gray */
```

### Tailwind CSS v4

Uses semantic tokens instead of raw colors:

```jsx
// ✅ Good - uses design tokens
<button className="bg-accent text-accent-foreground" />

// ❌ Avoid - raw colors
<button className="bg-[#d4af37] text-white" />
```

## Adding New Features

### 1. Define Types

Add new types in `lib/types.ts`:

```typescript
interface Review {
  id: string
  issueId: string
  rating: number
  comment: string
  createdAt: Date
}
```

### 2. Create API Route

Add endpoint in `app/api/reviews/route.ts`:

```typescript
export async function GET(request: NextRequest) {
  // TODO: Implement database query
  return NextResponse.json([])
}

export async function POST(request: NextRequest) {
  const data = await request.json()
  // TODO: Implement database mutation
  return NextResponse.json(data, { status: 201 })
}
```

### 3. Create Data Hook

Add hook in `hooks/use-reviews.ts`:

```typescript
export function useReviews(issueId: string) {
  const { data, error, isLoading, mutate } = useSWR<Review[]>(
    `/api/reviews?issueId=${issueId}`,
    fetcher
  )
  return { reviews: data || [], isLoading, error, mutate }
}
```

### 4. Create Components

Create reusable components:

```typescript
// ReviewCard - presentational
function ReviewCard({ review }: { review: Review }) {
  return <div>{review.comment}</div>
}

// ReviewsSection - container
function ReviewsSection({ issueId }: { issueId: string }) {
  const { reviews, isLoading } = useReviews(issueId)
  return <div>{reviews.map(r => <ReviewCard key={r.id} review={r} />)}</div>
}
```

## Constants and Configuration

Application-wide constants are in `lib/constants.ts`:

```typescript
export const ISSUE_CATEGORIES = [
  'Pothole',
  'Street Light',
  'Water Leakage',
  // ...
]

export const VALIDATION = {
  MIN_COMPLAINT_TITLE_LENGTH: 5,
  MAX_COMPLAINT_DESCRIPTION_LENGTH: 1000,
}
```

## Error Handling

### API Error Handling

Use `APIError` class for consistent error handling:

```typescript
import { APIError, apiFetch } from '@/lib/utils-api'

try {
  const data = await apiFetch<Issue>('/api/issues/123')
} catch (error) {
  if (error instanceof APIError) {
    if (error.status === 404) {
      // Handle not found
    }
  }
}
```

### Component Error Boundaries

Components show user-friendly error messages:

```jsx
{error ? (
  <Empty 
    icon="alert-circle"
    title="Error loading data"
    description="Please try again"
  />
) : null}
```

## Performance Optimization

1. **SWR Caching**: Data is automatically cached and revalidated
2. **Skeleton Loading**: Show placeholders while loading
3. **Debouncing**: Input changes are debounced
4. **Image Optimization**: Use Next.js Image component (future)
5. **Code Splitting**: Route-based code splitting built-in

## Security Considerations

- **API Routes**: TODO - Implement authentication and authorization
- **Input Validation**: Validate all user inputs before API calls
- **SQL Injection Prevention**: Use parameterized queries (in database integration)
- **CSRF Protection**: Use SameSite cookie attributes
- **XSS Prevention**: React automatically escapes content

## Database Integration (TODO)

When connecting a database:

1. Install database client (e.g., `@vercel/postgres`, `@neondatabase/serverless`)
2. Create connection pool in server utils
3. Replace TODO comments in API routes with actual queries
4. Add environment variables for connection strings
5. Implement Row-Level Security (RLS) if using Supabase

## Testing Strategy (TODO)

```
tests/
├── unit/
│   ├── utils-api.test.ts
│   └── constants.test.ts
├── components/
│   ├── issue-card.test.tsx
│   └── complaint-form.test.tsx
└── integration/
    └── api/
        └── issues.test.ts
```

## Deployment

### Vercel Deployment

```bash
vercel deploy
```

Environment variables:
- `DATABASE_URL` - Database connection string
- `NEXTAUTH_URL` - Auth callback URL (if using NextAuth)
- `NEXTAUTH_SECRET` - Auth secret

### Environment Variables

Create `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
DATABASE_URL=postgresql://...
```

## Future Enhancements

- [ ] User authentication (NextAuth.js)
- [ ] Image upload to cloud storage (Vercel Blob, AWS S3)
- [ ] Real-time updates (WebSockets, Server-Sent Events)
- [ ] Location-based filtering (Geospatial queries)
- [ ] Admin dashboard
- [ ] Email notifications
- [ ] Mobile app (React Native)
- [ ] Advanced analytics
