import Navbar from '@/components/citizen/navbar'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function TrendingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <Link href="/citizen">
          <Button variant="outline" className="border-border hover:bg-secondary mb-8">
            ← Back to Home
          </Button>
        </Link>

        <h1 className="text-3xl font-bold text-foreground mb-8">Trending Problems</h1>
        
        <div className="text-center py-12 bg-card border border-border rounded-lg">
          <p className="text-muted-foreground mb-4">No trending issues right now</p>
          <p className="text-sm text-muted-foreground mb-4">Check back later for AI-detected trending problems in your area</p>
        </div>
      </main>
    </div>
  )
}
