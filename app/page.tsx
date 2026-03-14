'use client'

import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import { Users, Building2, Newspaper, ArrowRight, Shield, BarChart3, CheckCircle2, Activity } from 'lucide-react'

// Animated counter hook
function useCounter(target: number, duration: number = 2000) {
  const [count, setCount] = useState(0)
  const [started, setStarted] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStarted(true) },
      { threshold: 0.3 }
    )
    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!started) return
    let start = 0
    const step = target / (duration / 16)
    const timer = setInterval(() => {
      start += step
      if (start >= target) { setCount(target); clearInterval(timer) }
      else setCount(Math.floor(start))
    }, 16)
    return () => clearInterval(timer)
  }, [started, target, duration])

  return { count, ref }
}

// Typing animation hook
const TYPING_SENTENCES = [
  'Empowering citizens to report and track civic issues in real time.',
  'Connecting government, media, and citizens for transparent governance.',
]

function useTypingAnimation() {
  const [display, setDisplay] = useState('')
  const [sentenceIdx, setSentenceIdx] = useState(0)
  const [charIdx, setCharIdx] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)
  const [started, setStarted] = useState(false)

  // Delay start until after mount to avoid hydration mismatch
  useEffect(() => {
    const t = setTimeout(() => setStarted(true), 1200)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    if (!started) return
    const sentence = TYPING_SENTENCES[sentenceIdx]

    if (!isDeleting && charIdx <= sentence.length) {
      // Typing
      const speed = 35 + Math.random() * 25
      const timer = setTimeout(() => {
        setDisplay(sentence.slice(0, charIdx))
        setCharIdx(prev => prev + 1)
      }, charIdx === sentence.length ? 2000 : speed) // Pause at end
      if (charIdx === sentence.length) {
        // After pause, start deleting
        const delTimer = setTimeout(() => setIsDeleting(true), 2000)
        return () => { clearTimeout(timer); clearTimeout(delTimer) }
      }
      return () => clearTimeout(timer)
    }

    if (isDeleting && charIdx >= 0) {
      // Deleting
      const speed = 20
      const timer = setTimeout(() => {
        setDisplay(sentence.slice(0, charIdx))
        setCharIdx(prev => prev - 1)
      }, speed)
      if (charIdx === 0) {
        // Move to next sentence
        const nextTimer = setTimeout(() => {
          setSentenceIdx(prev => (prev + 1) % TYPING_SENTENCES.length)
          setIsDeleting(false)
          setCharIdx(0)
          setDisplay('')
        }, 400)
        return () => { clearTimeout(timer); clearTimeout(nextTimer) }
      }
      return () => clearTimeout(timer)
    }
  }, [started, charIdx, isDeleting, sentenceIdx])

  return display
}

export default function RootPage() {
  const [mounted, setMounted] = useState(false)
  const typedText = useTypingAnimation()

  useEffect(() => {
    setMounted(true)
  }, [])

  const portals = [
    {
      title: 'Citizen Portal',
      description: 'Report and track civic issues in your community. Submit complaints with photos, voice notes, and geotagging.',
      icon: Users,
      signinHref: '/login',
      signupHref: '/signup/citizen',
      gradient: 'from-blue-500/20 to-cyan-500/10',
      borderGlow: 'hover:shadow-[0_0_30px_rgba(59,130,246,0.15)]',
      iconColor: 'text-blue-400',
      accentBg: 'bg-blue-500/10',
    },
    {
      title: 'Government Portal',
      description: 'Manage complaints, assign deadlines, and respond to citizens with full accountability tracking.',
      icon: Building2,
      signinHref: '/government/login',
      signupHref: '/signup/government',
      gradient: 'from-emerald-500/20 to-green-500/10',
      borderGlow: 'hover:shadow-[0_0_30px_rgba(16,185,129,0.15)]',
      iconColor: 'text-emerald-400',
      accentBg: 'bg-emerald-500/10',
    },
    {
      title: 'Media Portal',
      description: 'Access civic transparency dashboards, investigate recurring issues, and monitor government accountability.',
      icon: Newspaper,
      signinHref: '/media/login',
      signupHref: '/signup/media',
      gradient: 'from-amber-500/20 to-yellow-500/10',
      borderGlow: 'hover:shadow-[0_0_30px_rgba(245,158,11,0.15)]',
      iconColor: 'text-amber-400',
      accentBg: 'bg-amber-500/10',
    },
  ]

  const stats = [
    { label: 'Complaints Reported', value: 2847, icon: Activity },
    { label: 'Issues Resolved', value: 1923, icon: CheckCircle2 },
    { label: 'Govt Responses', value: 864, icon: Shield },
    { label: 'Media Investigations', value: 156, icon: BarChart3 },
  ]

  const s1 = useCounter(stats[0].value)
  const s2 = useCounter(stats[1].value)
  const s3 = useCounter(stats[2].value)
  const s4 = useCounter(stats[3].value)
  const counters = [s1, s2, s3, s4]

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-white overflow-hidden relative">

      {/* Animated background grid */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,215,0,0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,215,0,0.3) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
          }}
        />
        {/* Radial glow behind hero */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-radial from-[#FFD700]/5 via-transparent to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-gradient-radial from-blue-500/5 via-transparent to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-gradient-radial from-emerald-500/5 via-transparent to-transparent rounded-full blur-3xl" />
      </div>

      {/* Main content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">

        {/* Hero Section */}
        <div className="pt-20 pb-16 sm:pt-28 sm:pb-20 text-center">

          {/* Animated NF Logo */}
          <div
            className={`flex justify-center mb-8 transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
          >
            <div className="relative group">
              <div className="absolute inset-0 bg-orange-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500 animate-pulse" />
              <div className="relative h-24 w-24 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 flex items-center justify-center shadow-[0_0_40px_rgba(255,165,0,0.1)] hover:shadow-[0_0_60px_rgba(255,165,0,0.2)] transition-shadow duration-500">
                <img src="/nammafix-logo.png" alt="NammaFix" className="h-20 w-20 object-contain p-2" />
              </div>
            </div>
          </div>

          {/* Title with fade-in */}
          <h1
            className={`text-5xl sm:text-7xl font-black tracking-tighter transition-all duration-1000 delay-200 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
          >
            Namma<span className="text-orange-500">Fix</span>
          </h1>

          {/* Animated typing subtitle */}
          <div
            className={`mt-5 h-14 sm:h-8 max-w-2xl mx-auto transition-all duration-1000 delay-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
          >
            <p className="text-base sm:text-lg text-gray-400 leading-relaxed font-medium">
              {typedText}
              <span className="typing-cursor" />
            </p>
          </div>

          {/* Cursor blink animation */}
          <style dangerouslySetInnerHTML={{ __html: `
            .typing-cursor {
              display: inline-block;
              width: 2px;
              height: 1.2em;
              background: #FFD700;
              margin-left: 2px;
              vertical-align: middle;
              animation: cursor-blink 1s step-end infinite;
            }
            @keyframes cursor-blink {
              0%, 100% { opacity: 1; }
              50% { opacity: 0; }
            }
          `}} />

          {/* Decorative line */}
          <div
            className={`mt-8 flex justify-center transition-all duration-1000 delay-700 ${mounted ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'}`}
          >
            <div className="h-px w-32 bg-gradient-to-r from-transparent via-[#FFD700]/50 to-transparent" />
          </div>
        </div>

        {/* Portal Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto pb-20">
          {portals.map((portal, i) => {
            const Icon = portal.icon
            return (
              <div key={portal.title} className="block group">
                <div
                  className={`
                    relative h-full p-8 rounded-2xl
                    bg-white/[0.03] backdrop-blur-sm
                    border border-white/[0.06]
                    hover:border-[#FFD700]/30
                    ${portal.borderGlow}
                    transition-all duration-500 ease-out
                    hover:-translate-y-2
                    overflow-hidden flex flex-col
                    ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}
                  `}
                  style={{ transitionDelay: `${800 + i * 150}ms` }}
                >
                  {/* Internal gradient overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${portal.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl`} />

                  <div className="relative z-10 space-y-6 flex-grow flex flex-col">
                    {/* Icon */}
                    <div className={`w-14 h-14 rounded-xl ${portal.accentBg} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className={`w-7 h-7 ${portal.iconColor}`} />
                    </div>

                    {/* Text */}
                    <div className="flex-grow">
                      <h2 className="text-xl font-bold text-white mb-2 group-hover:text-[#FFD700] transition-colors duration-300">
                        {portal.title}
                      </h2>
                      <p className="text-sm text-gray-400 leading-relaxed">
                        {portal.description}
                      </p>
                    </div>

                    {/* CTA Buttons */}
                    <div className="pt-4 flex flex-col sm:flex-row gap-3">
                      <Link 
                        href={portal.signinHref} 
                        className="
                          flex-1 py-3 mb-1 sm:mb-0 rounded-xl text-sm font-bold text-center
                          bg-gradient-to-r from-[#FFD700] to-amber-500
                          text-black
                          hover:shadow-[0_4px_20px_rgba(255,215,0,0.3)]
                          hover:scale-[1.02] active:scale-[0.98]
                          transition-all duration-300
                          flex items-center justify-center gap-2
                        "
                      >
                        Sign In
                      </Link>
                      <Link 
                        href={portal.signupHref} 
                        className="
                          flex-1 py-3 rounded-xl text-sm font-bold text-center
                          bg-white/5 border border-white/10
                          text-white hover:bg-white/10 hover:border-white/20
                          hover:scale-[1.02] active:scale-[0.98]
                          transition-all duration-300
                          flex items-center justify-center gap-2
                        "
                      >
                        Sign Up
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Live Stats Section */}
        <div className="max-w-5xl mx-auto pb-24">
          <div className="text-center mb-10">
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#FFD700]/60">Platform Analytics</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
            {stats.map((stat, i) => {
              const StatIcon = stat.icon
              const counter = counters[i]
              return (
                <div
                  key={stat.label}
                  ref={counter.ref}
                  className="text-center p-6 rounded-2xl bg-white/[0.02] border border-white/[0.05] hover:border-[#FFD700]/20 transition-all duration-300"
                >
                  <StatIcon className="w-5 h-5 text-[#FFD700]/60 mx-auto mb-3" />
                  <div className="text-3xl sm:text-4xl font-black text-white tabular-nums">
                    {counter.count.toLocaleString()}
                  </div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mt-2">
                    {stat.label}
                  </p>
                </div>
              )
            })}
          </div>
        </div>

        {/* Footer */}
        <footer className="pb-10 pt-6 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4 opacity-30">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#FFD700]" />
            <p className="text-[10px] font-black uppercase tracking-[0.4em]">NammaFix Platform • v3.4</p>
          </div>
          <p className="text-[10px] font-medium text-gray-500">AI-Powered Civic Governance</p>
        </footer>
      </div>
    </div>
  )
}
