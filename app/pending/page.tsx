import Link from 'next/link'
import LogoutButton from '@/components/LogoutButton'

export default function PendingPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-yellow-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md text-center">

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10">
          <div className="text-5xl mb-5">⏳</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">Demande en attente</h1>
          <p className="text-gray-600 text-sm leading-relaxed mb-2">
            Votre inscription a bien été reçue par l&apos;équipe GMC.
          </p>
          <p className="text-gray-600 text-sm leading-relaxed mb-6">
            Nous examinons votre dossier et vous contacterons par email <strong>dans un délai de 48h ouvrées</strong>.
          </p>

          <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-8 text-left">
            <p className="text-xs font-semibold text-amber-800 mb-1">Que se passe-t-il ensuite ?</p>
            <ol className="text-xs text-amber-700 space-y-1 list-decimal list-inside">
              <li>GMC examine votre demande</li>
              <li>Vous recevez un email de confirmation</li>
              <li>Vous pouvez accéder à la plateforme</li>
            </ol>
          </div>

          <LogoutButton className="text-sm text-gray-400 hover:text-gray-700 underline underline-offset-2 transition-colors" />
        </div>

        <Link href="/" className="inline-block mt-4 text-xs text-gray-400 hover:text-gray-600">
          ← Retour à l&apos;accueil
        </Link>
      </div>
    </main>
  )
}
