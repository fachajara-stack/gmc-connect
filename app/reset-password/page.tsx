'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    // La session est déjà établie côté serveur par /auth/callback
    // On vérifie juste qu'elle existe
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      setReady(!!user)
    })
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirm) {
      setError('Les mots de passe ne correspondent pas.')
      return
    }
    if (password.length < 8) {
      setError('Le mot de passe doit comporter au moins 8 caractères.')
      return
    }
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { error: updateError } = await supabase.auth.updateUser({ password })

    if (updateError) {
      setError(updateError.message)
      setLoading(false)
      return
    }

    await supabase.auth.signOut()
    setSuccess(true)
  }

  if (success) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center p-6">
        <div className="w-full max-w-sm text-center">
          <Image src="/GMC_logo_final_transparent.png" alt="GMC" width={56} height={56} className="mb-6 mx-auto" style={{ objectFit: 'contain' }} />
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <p className="text-4xl mb-3">✅</p>
            <h2 className="text-lg font-bold text-gray-900 mb-2">Mot de passe mis à jour</h2>
            <p className="text-sm text-gray-500 mb-6">
              Votre nouveau mot de passe est actif. Vous pouvez maintenant vous connecter.
            </p>
            <Link
              href="/login"
              className="w-full inline-block bg-green-700 hover:bg-green-800 text-white font-medium py-2.5 rounded-xl transition-colors text-sm text-center"
            >
              Se connecter
            </Link>
          </div>
        </div>
      </main>
    )
  }

  if (!ready) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center p-6">
        <div className="text-center">
          <Image src="/GMC_logo_final_transparent.png" alt="GMC" width={56} height={56} className="mb-4 mx-auto" style={{ objectFit: 'contain' }} />
          <p className="text-gray-500 text-sm mt-2">Chargement…</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/">
            <Image src="/GMC_logo_final_transparent.png" alt="GMC" width={56} height={56} className="mb-4 mx-auto" style={{ objectFit: 'contain' }} />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Nouveau mot de passe</h1>
          <p className="text-gray-500 text-sm mt-1">Choisissez un mot de passe sécurisé</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 mb-5 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Nouveau mot de passe
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={8}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 pr-11 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Minimum 8 caractères"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Confirmer le mot de passe
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Répétez le mot de passe"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-700 hover:bg-green-800 disabled:bg-green-300 text-white font-medium py-2.5 rounded-xl transition-colors mt-2"
            >
              {loading ? 'Mise à jour…' : 'Mettre à jour le mot de passe'}
            </button>
          </form>
        </div>
      </div>
    </main>
  )
}
