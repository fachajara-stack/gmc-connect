'use client'
import { useTransition } from 'react'
import { accepterInteret, refuserInteret } from '@/app/dashboard/cultivateur/offres/actions'

export default function ReponseGMCButtons({ lotId }: { lotId: string }) {
  const [isPending, startTransition] = useTransition()

  const handleAccepter = () => {
    startTransition(async () => {
      try { await accepterInteret(lotId) } catch { /* revalidatePath gère le refresh */ }
    })
  }

  const handleRefuser = () => {
    startTransition(async () => {
      try { await refuserInteret(lotId) } catch { /* revalidatePath gère le refresh */ }
    })
  }

  return (
    <div className="flex gap-2 mt-2">
      <button
        onClick={handleAccepter}
        disabled={isPending}
        className="flex-1 bg-green-700 hover:bg-green-800 disabled:opacity-50 text-white text-sm font-semibold py-2 rounded-xl transition-colors"
      >
        {isPending ? '…' : '✓ Confirmar'}
      </button>
      <button
        onClick={handleRefuser}
        disabled={isPending}
        className="flex-1 border border-red-200 text-red-600 hover:bg-red-50 disabled:opacity-50 text-sm font-medium py-2 rounded-xl transition-colors"
      >
        {isPending ? '…' : 'Rechazar'}
      </button>
    </div>
  )
}
