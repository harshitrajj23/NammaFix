'use client'

import { 
  User, 
  MapPin, 
  Award, 
  CheckCircle, 
  FileText, 
  Trophy,
  ChevronDown
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import LogoutButton from '@/components/shared/logout-button'

// Mock User Data for Demo
const MOCK_USER = {
  name: "Harshit Raj",
  email: "harshit78@gmail.com",
  role: "Citizen Reporter",
  avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Harshit",
  stats: {
    reported: 7,
    resolved: 4,
    credits: 120
  }
}

export default function ProfileCard() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-3 p-1.5 pr-3 rounded-full bg-secondary/50 hover:bg-secondary border border-border/50 transition-all group outline-none">
          <Avatar className="h-8 w-8 border border-accent/20">
            <AvatarImage src={MOCK_USER.avatarUrl} alt={MOCK_USER.name} />
            <AvatarFallback className="bg-accent text-accent-foreground">
              {MOCK_USER.name.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          
          <div className="hidden lg:flex flex-col items-start leading-tight">
            <span className="text-sm font-bold text-foreground">{MOCK_USER.name}</span>
            <div className="flex items-center gap-1">
              <span className="text-[10px] text-amber-400 font-bold flex items-center gap-0.5">
                <Trophy className="w-2.5 h-2.5" />
                {MOCK_USER.stats.credits} CREDITS
              </span>
            </div>
          </div>
          
          <ChevronDown className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors ml-1 hidden lg:block" />
        </button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent className="w-64 bg-card border-border shadow-2xl" align="end" sideOffset={8}>
        <DropdownMenuLabel className="p-4">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-bold leading-none text-foreground">{MOCK_USER.name}</p>
            <p className="text-xs leading-none text-muted-foreground">{MOCK_USER.email}</p>
            <Badge variant="secondary" className="w-fit mt-2 text-[10px] uppercase font-bold px-1.5 py-0 bg-accent/10 text-accent border-accent/20">
              {MOCK_USER.role}
            </Badge>
          </div>
        </DropdownMenuLabel>
        
        <DropdownMenuSeparator className="bg-border" />
        
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-secondary/30 p-2 rounded-lg border border-border/50 text-center">
              <div className="flex justify-center mb-1">
                <FileText className="w-4 h-4 text-blue-400" />
              </div>
              <p className="text-lg font-bold text-foreground leading-none">{MOCK_USER.stats.reported}</p>
              <p className="text-[9px] text-muted-foreground uppercase font-bold pt-1">Reports</p>
            </div>
            
            <div className="bg-secondary/30 p-2 rounded-lg border border-border/50 text-center">
              <div className="flex justify-center mb-1">
                <CheckCircle className="w-4 h-4 text-green-400" />
              </div>
              <p className="text-lg font-bold text-foreground leading-none">{MOCK_USER.stats.resolved}</p>
              <p className="text-[9px] text-muted-foreground uppercase font-bold pt-1">Resolved</p>
            </div>
          </div>
          
          <div className="bg-amber-400/5 p-3 rounded-lg border border-amber-400/20 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-amber-400/10 flex items-center justify-center">
                <Award className="w-5 h-5 text-amber-400" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-amber-400">{MOCK_USER.stats.credits} Credits</span>
                <span className="text-[10px] text-muted-foreground italic leading-none">Helping improve the city.</span>
              </div>
            </div>
          </div>
        </div>
        
        <DropdownMenuSeparator className="bg-border" />
        
        <DropdownMenuItem className="p-0 focus:bg-transparent">
          <LogoutButton className="w-full justify-start px-4 py-2 text-sm text-destructive hover:text-destructive hover:bg-destructive/10 rounded-none border-0" />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
