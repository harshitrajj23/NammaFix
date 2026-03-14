'use client'

import { useEffect, useRef, useState } from 'react'

interface Particle {
  x: number
  y: number
  radius: number
  vx: number
  vy: number
  opacity: number
}

export default function SnowParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 })

  useEffect(() => {
    // Only run on client
    if (typeof window === 'undefined') return

    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight })
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || windowSize.width === 0) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = windowSize.width
    canvas.height = windowSize.height

    // Determine particle count based on screen width (fewer on mobile)
    const particleCount = windowSize.width < 768 ? 40 : 120
    const particles: Particle[] = []

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 1.5 + 0.5,
        vx: Math.random() * 0.5 - 0.25,
        vy: Math.random() * 0.8 + 0.2,
        opacity: Math.random() * 0.5 + 0.1,
      })
    }

    let animationFrameId: number

    const render = () => {
      if (!ctx || !canvas) return
      
      // Clear with extreme slight fade for trail effect (optional, keep it clean for now)
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.forEach((p) => {
        p.x += p.vx
        p.y += p.vy

        // Wrap around horizontally
        if (p.x < 0) p.x = canvas.width
        if (p.x > canvas.width) p.x = 0

        // Reset to top when falling past bottom
        if (p.y > canvas.height) {
          p.y = 0
          p.x = Math.random() * canvas.width
        }

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 215, 0, ${p.opacity})` // #FFD700
        
        // Add subtle glow
        ctx.shadowBlur = 4
        ctx.shadowColor = 'rgba(255, 215, 0, 0.8)'
        
        ctx.fill()
        
        // Reset shadow for performance
        ctx.shadowBlur = 0
      })

      animationFrameId = window.requestAnimationFrame(render)
    }

    render()

    return () => {
      window.cancelAnimationFrame(animationFrameId)
    }
  }, [windowSize])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-60"
      aria-hidden="true"
    />
  )
}
