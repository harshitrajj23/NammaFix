'use client'

import React from 'react'
import { 
  BarChart3, 
  Activity, 
  TrendingUp, 
  ShieldCheck,
  Building2,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Users,
  Star,
  ArrowUpRight,
  LogOut,
  Bell
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

// --- STRICT MOCK DATA ---

const stats = {
  totalToday: 148,
  activeAreas: 32,
  resolved: 512,
  satisfaction: 86
};

const recurringProblems = [
  { issue: "Potholes", reports: 48, department: "BBMP" },
  { issue: "Garbage Overflow", reports: 32, department: "Sanitation" },
  { issue: "Traffic Signal Failure", reports: 18, department: "Traffic Police" }
];

const performanceRatings = [
  { area: "Indiranagar", rating: 4.2 },
  { area: "Whitefield", rating: 3.8 },
  { area: "Yelahanka", rating: 4.0 }
];

const monthlyAnalysis = [
  { month: "Jan", complaints: 120, resolved: 95 },
  { month: "Feb", complaints: 160, resolved: 140 },
  { month: "Mar", complaints: 210, resolved: 180 }
];

export default function MediaDashboard() {
  const supabase = createClient()
  const router = useRouter()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.refresh()
    router.push('/login')
  }

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-white flex flex-col font-sans">
      
      {/* Mock Navbar to avoid Supabase dependencies */}
      <nav className="sticky top-0 z-50 border-b border-white/10 bg-black/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded bg-[#FFD700] flex items-center justify-center">
              <span className="text-black font-extrabold text-sm tracking-tighter">NF</span>
            </div>
            <span className="text-xl font-black tracking-tight">NammaFix</span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#FFD700] ml-3 border border-[#FFD700]/30 px-2 py-0.5 rounded">Media Portal</span>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="relative">
              <Bell className="w-5 h-5 text-gray-400" />
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-[#FFD700] rounded-full border-2 border-black" />
            </div>
            <div className="flex items-center gap-3 border-l border-white/10 pl-6 cursor-pointer">
              <div className="text-right hidden sm:block">
                <p className="text-[10px] font-black uppercase tracking-widest text-white">Press Trust</p>
                <p className="text-[9px] font-bold text-[#FFD700] uppercase">Verified Org</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                <Users className="w-4 h-4 text-gray-400" />
              </div>
              <button 
                onClick={handleLogout}
                className="p-1.5 hover:bg-white/5 rounded-lg transition-colors group"
                aria-label="Logout"
              >
                <LogOut className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-1 p-6 md:p-10 space-y-12 max-w-7xl mx-auto w-full">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-5xl font-black tracking-tighter text-white">
              Media <span className="text-[#FFD700]">Analytics</span> Dashboard
            </h1>
            <p className="text-gray-400 text-sm mt-2 uppercase tracking-[0.2em] font-bold">
              Civic Transparency & Departmental Accountability • v2.1.0
            </p>
          </div>
          <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-2 rounded-xl shadow-inner">
            <Calendar className="w-4 h-4 text-[#FFD700]" />
            <span className="text-xs font-black tracking-widest uppercase">March 2026 Audit</span>
            <div className="w-2 h-2 rounded-full bg-[#FFD700] animate-pulse" />
          </div>
        </header>

        {/* 1. Stats Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-[#121214] border border-white/5 p-8 rounded-2xl relative overflow-hidden shadow-2xl">
            <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-2">Total Reported Today</p>
            <div className="flex items-baseline gap-2">
              <h3 className="text-5xl font-black">{stats.totalToday}</h3>
              <span className="text-red-500 text-xs font-bold flex items-center bg-red-500/10 px-1.5 py-0.5 rounded"><ArrowUpRight className="w-3 h-3" /> 12%</span>
            </div>
            <Activity className="absolute -right-6 -bottom-6 w-28 h-28 opacity-5 text-[#FFD700]" />
          </div>

          <div className="bg-[#121214] border border-white/5 p-8 rounded-2xl relative overflow-hidden shadow-2xl">
            <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-2">Areas w/ Active Reports</p>
            <h3 className="text-5xl font-black">{stats.activeAreas}</h3>
            <Building2 className="absolute -right-6 -bottom-6 w-28 h-28 opacity-5 text-[#FFD700]" />
          </div>

          <div className="bg-[#121214] border border-white/5 p-8 rounded-2xl relative overflow-hidden shadow-2xl">
            <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-2">Total Resolved (History)</p>
            <h3 className="text-5xl font-black text-[#FFD700]">{stats.resolved}</h3>
            <CheckCircle2 className="absolute -right-6 -bottom-6 w-28 h-28 opacity-5 text-[#FFD700]" />
          </div>

          <div className="bg-[#121214] border border-white/5 p-8 rounded-2xl relative overflow-hidden shadow-2xl">
            <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-2">Citizen Satisfaction</p>
            <h3 className="text-5xl font-black text-emerald-500">{stats.satisfaction}%</h3>
            <Users className="absolute -right-6 -bottom-6 w-28 h-28 opacity-5 text-emerald-500" />
          </div>
        </section>

        {/* 2. Recurring Problems */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-6 h-6 text-[#FFD700]" />
            <h2 className="text-2xl font-black uppercase tracking-tight">Recurring Civic Issues</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recurringProblems.map((item, i) => (
              <div key={i} className="bg-[#121214] border border-white/5 p-8 rounded-2xl space-y-6 shadow-2xl border-t-4 border-t-[#FFD700]">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-black">{item.issue}</h3>
                    <p className="text-[10px] font-bold text-[#FFD700] uppercase tracking-widest mt-1.5">{item.department}</p>
                  </div>
                  <div className="bg-[#FFD700]/10 text-[#FFD700] px-3 py-1 rounded-full text-[10px] font-black uppercase">{item.reports} REPORTS</div>
                </div>
                <div className="flex items-center gap-2 py-4 border-y border-white/5">
                  <ShieldCheck className="w-4 h-4 text-[#FFD700]" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#FFD700]">
                    Contractor Responsibility Identified
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <AlertCircle className="w-4 h-4" />
                  <span>SLA violation flagged by Media</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 3. Constituency Performance Ratings */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <Star className="w-6 h-6 text-[#FFD700]" />
            <h2 className="text-2xl font-black uppercase tracking-tight">Constituency Performance Ratings</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {performanceRatings.map((area, i) => (
              <div key={i} className="bg-[#121214] border border-white/5 p-8 rounded-2xl space-y-8 shadow-2xl border-l-4 border-l-[#FFD700]">
                <div className="flex justify-between items-center">
                  <h3 className="text-2xl font-black">{area.area}</h3>
                  <div className="flex items-center gap-2 bg-[#FFD700]/10 px-4 py-1.5 rounded-full border border-[#FFD700]/20">
                    <Star className="w-4 h-4 text-[#FFD700] fill-[#FFD700]" />
                    <span className="text-xl font-black text-[#FFD700]">{area.rating}</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-gray-500">
                    <span>Accountability Score</span>
                    <span className="text-[#FFD700]">{Math.round(area.rating * 20)}%</span>
                  </div>
                  <div className="h-2.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[#FFD700] rounded-full transition-all duration-1000" 
                      style={{ width: `${area.rating * 20}%` }}
                    />
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="text-[9px] font-bold py-1 px-2 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 uppercase">Trending Up</div>
                  <div className="text-[9px] font-bold py-1 px-2 rounded bg-white/5 text-gray-400 border border-white/10 uppercase">Verified Audit</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 4. Past Complaint Analysis */}
        <section className="space-y-6 pb-20">
          <div className="flex items-center gap-3">
            <BarChart3 className="w-6 h-6 text-[#FFD700]" />
            <h2 className="text-2xl font-black uppercase tracking-tight">Past Complaint Analysis</h2>
          </div>
          <div className="bg-[#121214] border border-white/5 p-10 rounded-2xl shadow-inner relative overflow-hidden">
            <div className="space-y-12 relative z-10">
              {monthlyAnalysis.map((data, i) => (
                <div key={i} className="space-y-4">
                  <div className="flex justify-between items-end">
                    <div>
                      <span className="text-3xl font-black tracking-tighter">{data.month}</span>
                      <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.3em] mt-1.5">Efficiency Rating</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xl font-black">{data.resolved} <span className="text-gray-600 text-sm font-medium">/ {data.complaints}</span></span>
                      <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mt-1">{Math.round((data.resolved/data.complaints)*100)}% SUCCESS RATE</p>
                    </div>
                  </div>
                  <div className="h-10 w-full bg-black/40 rounded-xl overflow-hidden flex p-1.5 border border-white/5">
                    <div 
                      className="h-full bg-gradient-to-r from-[#FFD700] to-yellow-600 rounded-lg transition-all duration-1000 delay-100 shadow-[0_0_20px_rgba(255,215,0,0.2)]" 
                      style={{ width: `${(data.resolved / 250) * 100}%` }}
                    />
                    <div 
                      className="h-full bg-red-500/20 rounded-lg ml-1" 
                      style={{ width: `${((data.complaints - data.resolved) / 250) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            
            {/* Legend/Context */}
            <div className="mt-16 pt-8 border-t border-white/5 flex flex-wrap gap-8 items-center lg:px-4">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-[#FFD700] rounded" />
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Resolved Efficiency</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-red-500/20 rounded" />
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Ongoing Backlog</span>
              </div>
              <div className="ml-auto p-4 bg-white/[0.02] border border-white/5 rounded-2xl flex items-center gap-4 max-w-sm">
                <AlertCircle className="w-6 h-6 text-[#FFD700] flex-shrink-0" />
                <p className="text-[10px] font-medium text-gray-400 leading-relaxed">
                  Data reflects <strong>Independent Media Investigation</strong> of BBMP archives. Last verified on March 14, 2026.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Global Footer info within main */}
        <footer className="pt-10 pb-6 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 opacity-30">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#FFD700]" />
            <p className="text-[10px] font-black uppercase tracking-[0.4em]">NammaFix Press Core • Portal v3.4</p>
          </div>
          <div className="flex items-center gap-8 text-[10px] font-black uppercase tracking-[0.2em]">
            <span className="hover:text-[#FFD700] cursor-pointer transition-all border-b border-transparent hover:border-[#FFD700]">Internal Audit</span>
            <span className="hover:text-[#FFD700] cursor-pointer transition-all border-b border-transparent hover:border-[#FFD700]">Media Kit</span>
            <span className="hover:text-[#FFD700] cursor-pointer transition-all border-b border-transparent hover:border-[#FFD700]">Contact Press</span>
          </div>
        </footer>

      </main>
    </div>
  )
}
