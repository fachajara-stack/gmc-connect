'use client'
import React from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function LogoutButton({ className, label, style }: { className?: string; label?: string; style?: React.CSSProperties }) {
  const router = useRouter()

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <button
      onClick={handleLogout}
      className={className ?? 'text-sm text-gray-500 hover:text-gray-800 underline underline-offset-2 transition-colors'}
      style={style}
    >
      {label ?? 'Se déconnecter'}
    </button>
  )
}
