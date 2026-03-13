'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { AlertCircle } from 'lucide-react'

export default function GovLoginPage() {
  const router = useRouter()
  const [govId, setGovId] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!govId.trim() || !password.trim()) {
      setError('Please enter both Government ID and Password')
      return
    }

    setIsLoading(true)

    try {
      // TODO: Replace with actual authentication API call
      console.log('Login attempt with:', { govId, password })
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // TODO: Store authentication token/session
      router.push('/gov-dashboard')
    } catch (err) {
      setError('Failed to login. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <Card className="w-full max-w-md bg-card border-border p-8">
        <div className="mb-8 text-center">
          <div className="h-12 w-12 rounded bg-accent flex items-center justify-center mx-auto mb-4">
            <span className="text-accent-foreground font-bold">NF</span>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">NammaFix</h1>
          <p className="text-sm text-muted-foreground">Government Portal</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          {error && (
            <div className="p-3 bg-destructive/10 border border-destructive/50 rounded-lg flex items-center gap-2 text-sm text-destructive">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground">
              Government ID
            </label>
            <Input
              type="text"
              value={govId}
              onChange={(e) => setGovId(e.target.value)}
              placeholder="Enter your Government ID"
              className="bg-secondary border-border text-foreground placeholder:text-muted-foreground"
              disabled={isLoading}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground">
              Password
            </label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="bg-secondary border-border text-foreground placeholder:text-muted-foreground"
              disabled={isLoading}
              required
            />
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-medium"
            size="lg"
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </Button>
        </form>

        <p className="text-xs text-muted-foreground text-center mt-4">
          For government officials only
        </p>
      </Card>
    </div>
  )
}
