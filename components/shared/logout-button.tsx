'use client'

import { LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'

interface LogoutButtonProps {
  variant?: 'ghost' | 'outline' | 'default' | 'secondary'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  className?: string
  showText?: boolean
  children?: React.ReactNode
  onLogout?: () => void
}

export default function LogoutButton({ 
  variant = 'ghost', 
  size = 'sm', 
  className, 
  showText = true,
  children,
  onLogout 
}: LogoutButtonProps) {
  const supabase = createClient()
  const router = useRouter()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    if (onLogout) onLogout()
    router.refresh()
    router.push('/login')
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleLogout}
      className={cn("flex items-center gap-2", className)}
    >
      {children || (
        <>
          <LogOut className="h-4 w-4" />
          {showText && <span>Logout</span>}
        </>
      )}
    </Button>
  )
}
