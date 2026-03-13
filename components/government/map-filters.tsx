'use client'

import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface MapFiltersProps {
  onFilterChange: (filters: any) => void
}

export default function MapFilters({ onFilterChange }: MapFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-3 bg-card p-3 rounded-lg border border-border/50 shadow-sm">
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider">Category:</span>
        <Select onValueChange={(v) => onFilterChange({ category: v === 'all' ? null : v })}>
          <SelectTrigger className="w-[130px] h-8 text-xs bg-secondary border-border">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent className="bg-card border-border">
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="Pothole">Pothole</SelectItem>
            <SelectItem value="Garbage">Garbage</SelectItem>
            <SelectItem value="Water Leakage">Water Leakage</SelectItem>
            <SelectItem value="Street Light">Street Light</SelectItem>
            <SelectItem value="Traffic">Traffic</SelectItem>
            <SelectItem value="Infrastructure">Infrastructure</SelectItem>
            <SelectItem value="Other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider">Severity:</span>
        <Select onValueChange={(v) => onFilterChange({ severity: v === 'all' ? null : v })}>
          <SelectTrigger className="w-[120px] h-8 text-xs bg-secondary border-border">
            <SelectValue placeholder="All Severities" />
          </SelectTrigger>
          <SelectContent className="bg-card border-border">
            <SelectItem value="all">All Severities</SelectItem>
            <SelectItem value="critical">Critical</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider">Status:</span>
        <Select onValueChange={(v) => onFilterChange({ status: v === 'all' ? null : v })}>
          <SelectTrigger className="w-[130px] h-8 text-xs bg-secondary border-border">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent className="bg-card border-border">
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="submitted">Submitted</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button 
        variant="ghost" 
        size="sm" 
        className="h-8 text-[10px] uppercase font-bold text-accent hover:text-accent/80 ml-auto"
        onClick={() => onFilterChange({ category: null, severity: null, status: null })}
      >
        Reset Filters
      </Button>
    </div>
  )
}
