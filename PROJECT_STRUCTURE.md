# NammaFix Project Structure

## Overview
This project is organized into two distinct portals: Citizen and Government, each with their own components, pages, and layouts. Shared components are kept separate for reusability.

## Directory Structure

```
app/
├── page.tsx                           # Root redirect to /citizen
├── layout.tsx                         # Root layout (unchanged)
├── globals.css                        # Global styles
├── api/                               # API routes (unchanged)
│
├── citizen/                           # Citizen portal
│   ├── page.tsx                       # Home/dashboard
│   ├── layout.tsx                     # Citizen portal layout
│   ├── complaints/
│   │   └── page.tsx                   # All complaints view
│   └── trending/
│       └── page.tsx                   # Trending problems
│
└── government/                        # Government portal
    ├── page.tsx                       # Dashboard
    ├── layout.tsx                     # Government portal layout
    ├── login/
    │   └── page.tsx                   # Login page
    ├── emergency/
    │   └── page.tsx                   # Emergency problems
    ├── feedback/
    │   └── page.tsx                   # Citizen feedback
    ├── new-problems/
    │   └── page.tsx                   # Recently submitted issues
    └── recurring/
        └── page.tsx                   # Recurring problems

components/
├── citizen/                           # Citizen portal components
│   ├── navbar.tsx                     # Citizen navbar
│   ├── complaint-form.tsx             # Complaint submission form
│   ├── problems-section.tsx           # Problems near you section
│   ├── complaints-section.tsx         # User's complaints summary
│   └── trending-section.tsx           # Trending problems section
│
├── government/                        # Government portal components
│   ├── navbar.tsx                     # Government navbar (with logout)
│   ├── emergency-problem-card.tsx     # Emergency issue card
│   ├── response-panel.tsx             # Government response form
│   ├── feedback-card.tsx              # Citizen feedback card
│   └── problem-card.tsx               # New/recurring problem card
│
├── shared/                            # Reusable components
│   ├── issue-card.tsx                 # Generic issue card
│   └── notification-panel.tsx         # Notifications panel
│
└── ui/                                # shadcn/ui components (unchanged)
    └── *.tsx

lib/
├── types.ts                           # TypeScript types (unchanged)
├── constants.ts                       # Constants (unchanged)
├── utils.ts                           # Utility functions (unchanged)
└── utils-api.ts                       # API utility functions (unchanged)

hooks/
├── use-issues.ts                      # Fetch issues hook (unchanged)
├── use-complaints.ts                  # Complaint management (unchanged)
├── use-notifications.ts               # Notifications hook (unchanged)
├── use-app-context.tsx                # App context (unchanged)
└── use-mobile.tsx                     # Mobile detection (unchanged)
```

## Key Changes

### Component Organization
- **`components/citizen/`** - All citizen-facing components
- **`components/government/`** - All government-facing components  
- **`components/shared/`** - Reusable components used by both portals

### Page Structure
- Citizen portal routes: `/citizen/*`
- Government portal routes: `/government/*`
- Root `/` redirects to `/citizen`

### Import Paths
All components now use full paths from `@/components/`:

```tsx
// Citizen components
import Navbar from '@/components/citizen/navbar'
import ComplaintForm from '@/components/citizen/complaint-form'

// Government components
import GovNavbar from '@/components/government/navbar'
import EmergencyCard from '@/components/government/emergency-problem-card'

// Shared components
import IssueCard from '@/components/shared/issue-card'
import NotificationPanel from '@/components/shared/notification-panel'

// UI components (unchanged)
import { Button } from '@/components/ui/button'
```

## Benefits

1. **No Naming Conflicts** - Clear separation between citizen and government components
2. **Improved Maintainability** - Easy to locate portal-specific code
3. **Reusability** - Shared components clearly identified for both portals
4. **Scalability** - Easy to add new features to either portal
5. **Clear Navigation** - Distinct URL structures for each portal

## Notes

- All hooks, types, utilities, and API routes remain unchanged
- No mock data has been added
- All links have been updated to point to correct portal routes
- Root layout and global styles remain in the root app directory
