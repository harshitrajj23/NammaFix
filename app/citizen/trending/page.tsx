import Navbar from '@/components/citizen/navbar'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import TrendingSection from '@/components/citizen/trending-section'

export default function TrendingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-8">
          <Link href="/citizen">
            <Button variant="outline" className="border-border hover:bg-secondary mb-4">
              ← Back to Home
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-foreground">Trending Problems</h1>
          <p className="text-muted-foreground mt-2">Civic issues detected across various news sources and citizen reports.</p>
        </div>
        
        <TrendingSection limit={10} />
      </main>
    </div>
  )
}
