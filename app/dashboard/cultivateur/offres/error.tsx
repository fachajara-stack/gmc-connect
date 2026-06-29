'use client'
import Link from 'next/link'

export default function OffresError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 max-w-sm w-full text-center">
        <p className="text-4xl mb-4">⚠️</p>
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Error de carga</h2>
        <p className="text-sm text-gray-500 mb-6 leading-relaxed">
          {error.message || 'Se ha producido un error inesperado. Inténtelo de nuevo o contacte a GMC si el problema persiste.'}
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={reset}
            className="bg-green-700 hover:bg-green-800 text-white text-sm font-medium px-5 py-2.5 rounded-xl transition-colors"
          >
            Reintentar
          </button>
          <Link
            href="/dashboard/cultivateur"
            className="border border-gray-200 hover:bg-gray-50 text-gray-600 text-sm px-5 py-2.5 rounded-xl transition-colors"
          >
            Volver
          </Link>
        </div>
      </div>
    </div>
  )
}
