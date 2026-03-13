/**
 * Application-wide constants
 */

export const ISSUE_CATEGORIES = [
  'Pothole',
  'Street Light',
  'Water Leakage',
  'Garbage',
  'Traffic',
  'Sidewalk Damage',
  'Drainage',
  'Vegetation',
  'Other',
] as const

export const ISSUE_STATUS = {
  OPEN: 'open',
  IN_PROGRESS: 'in-progress',
  RESOLVED: 'resolved',
} as const

export const COMPLAINT_STATUS = {
  PENDING: 'pending',
  SUBMITTED: 'submitted',
  UNDER_REVIEW: 'under-review',
  RESOLVED: 'resolved',
  REJECTED: 'rejected',
} as const

export const NOTIFICATION_TYPES = {
  ISSUE_UPDATE: 'issue-update',
  COMPLAINT_UPDATE: 'complaint-update',
  ACHIEVEMENT: 'achievement',
} as const

/**
 * Pagination
 */
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
} as const

/**
 * Cache
 */
export const CACHE_DURATION = {
  SHORT: 60 * 5, // 5 minutes
  MEDIUM: 60 * 15, // 15 minutes
  LONG: 60 * 60, // 1 hour
} as const

/**
 * Validation
 */
export const VALIDATION = {
  MIN_COMPLAINT_TITLE_LENGTH: 5,
  MAX_COMPLAINT_TITLE_LENGTH: 100,
  MIN_COMPLAINT_DESCRIPTION_LENGTH: 10,
  MAX_COMPLAINT_DESCRIPTION_LENGTH: 1000,
  MIN_LOCATION_LENGTH: 3,
  MAX_LOCATION_LENGTH: 200,
} as const

/**
 * UI
 */
export const UI = {
  TRANSITION_DURATION: 300, // milliseconds
  DEBOUNCE_DELAY: 500, // milliseconds
} as const
