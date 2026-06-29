'use client'
import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const PRODUITS = [
  'Plátano', 'Piña', 'Mango', 'Papaya',
  'Maracuyá', 'Lulo', 'Guanábana', 'Uchuva',
  'Café', 'Cacao', 'Tomate de árbol', 'Otro',
]

const MAX_PHOTOS = 5
const MAX_SIZE_MB = 5
const MAX_VIDEO_MB = 100

export default function NouveauLotForm({ cultivateurId }: { cultivateurId: string }) {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoInputRef = useRef<HTMLInputElement>(null)

  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [uploadStep, setUploadStep] = useState('')
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ produit: '', quantite_kg: '', date_disponibilite: '', description: '' })

  const [photos, setPhotos] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const [video, setVideo] = useState<File | null>(null)
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | null>(null)

  const set = (field: string) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm(prev => ({ ...prev, [field]: e.target.value }))

  const today = new Date().toISOString().split('T')[0]

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(e.target.files ?? [])
    const oversized = newFiles.filter(f => f.size > MAX_SIZE_MB * 1024 * 1024)
    if (oversized.length > 0) {
      setError(`Cada foto debe pesar menos de ${MAX_SIZE_MB} MB.`)
      return
    }
    const combined = [...photos, ...newFiles].slice(0, MAX_PHOTOS)
    setPhotos(combined)
    setPreviews(combined.map(f => URL.createObjectURL(f)))
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const removePhoto = (i: number) => {
    URL.revokeObjectURL(previews[i])
    setPhotos(p => p.filter((_, j) => j !== i))
    setPreviews(p => p.filter((_, j) => j !== i))
  }

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > MAX_VIDEO_MB * 1024 * 1024) {
      setError(`El video debe pesar menos de ${MAX_VIDEO_MB} MB.`)
      if (videoInputRef.current) videoInputRef.current.value = ''
      return
    }
    if (videoPreviewUrl) URL.revokeObjectURL(videoPreviewUrl)
    setVideo(file)
    setVideoPreviewUrl(URL.createObjectURL(file))
    if (videoInputRef.current) videoInputRef.current.value = ''
  }

  const removeVideo = () => {
    if (videoPreviewUrl) URL.revokeObjectURL(videoPreviewUrl)
    setVideo(null)
    setVideoPreviewUrl(null)
  }

  const handleClose = () => {
    previews.forEach(url => URL.revokeObjectURL(url))
    if (videoPreviewUrl) URL.revokeObjectURL(videoPreviewUrl)
    setPhotos([])
    setPreviews([])
    setVideo(null)
    setVideoPreviewUrl(null)
    setError('')
    setOpen(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setUploadStep('Publicando el lote…')

    try {
      const supabase = createClient()

      const { data: newLot, error: insertError } = await supabase
        .from('lots')
        .insert({
          cultivateur_id: cultivateurId,
          produit: form.produit,
          quantite_kg: parseFloat(form.quantite_kg),
          date_disponibilite: form.date_disponibilite,
          description: form.description || null,
          statut: 'en_attente',
        })
        .select('id')
        .single()

      if (insertError || !newLot) throw new Error(insertError?.message ?? 'Error al publicar')

      if (photos.length > 0) {
        const photoUrls: string[] = []

        for (let i = 0; i < photos.length; i++) {
          setUploadStep(`Enviando fotos (${i + 1}/${photos.length})…`)
          const file = photos[i]
          const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg'
          const path = `${cultivateurId}/${newLot.id}/${Date.now()}-${i}.${ext}`

          const { error: uploadErr } = await supabase.storage
            .from('lot-photos')
            .upload(path, file, { cacheControl: '3600' })

          if (!uploadErr) {
            const { data: { publicUrl } } = supabase.storage
              .from('lot-photos')
              .getPublicUrl(path)
            photoUrls.push(publicUrl)
          }
        }

        if (photoUrls.length > 0) {
          await supabase.from('lots').update({ photos: photoUrls }).eq('id', newLot.id)
        }
      }

      // Upload vidéo
      if (video) {
        setUploadStep('Subiendo el video…')
        const ext = video.name.split('.').pop()?.toLowerCase() ?? 'mp4'
        const videoPath = `${cultivateurId}/${newLot.id}/video.${ext}`

        const { error: videoErr } = await supabase.storage
          .from('lot-videos')
          .upload(videoPath, video, { cacheControl: '3600', contentType: video.type })

        if (!videoErr) {
          const { data: { publicUrl } } = supabase.storage
            .from('lot-videos')
            .getPublicUrl(videoPath)
          await supabase.from('lots').update({ video_url: publicUrl }).eq('id', newLot.id)
        }
      }

      previews.forEach(url => URL.revokeObjectURL(url))
      if (videoPreviewUrl) URL.revokeObjectURL(videoPreviewUrl)
      setForm({ produit: '', quantite_kg: '', date_disponibilite: '', description: '' })
      setPhotos([])
      setPreviews([])
      setVideo(null)
      setVideoPreviewUrl(null)
      setOpen(false)
      setSuccess(true)
      setTimeout(() => setSuccess(false), 4000)
      try { router.refresh() } catch { /* ignore */ }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error de red. Verifique su conexión e inténtelo de nuevo.')
    } finally {
      setLoading(false)
      setUploadStep('')
    }
  }

  return (
    <div className="mb-8">
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-800 rounded-xl px-4 py-3 mb-4 text-sm flex items-center gap-2">
          <span>✓</span> Lote publicado con éxito — GMC ha sido notificado.
        </div>
      )}

      {!open ? (
        <button
          onClick={() => setOpen(true)}
          className="w-full flex items-center justify-center gap-2 bg-green-700 hover:bg-green-800 text-white font-medium py-3 rounded-2xl transition-colors shadow-sm"
        >
          <span className="text-lg">+</span> Publicar un nuevo lote
        </button>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-gray-900">Nuevo lote</h2>
            <button onClick={handleClose} className="text-gray-400 hover:text-gray-600 text-sm">
              Cancelar
            </button>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 mb-4 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Producto *</label>
              <select
                required value={form.produit} onChange={set('produit')}
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">Seleccionar un producto</option>
                {PRODUITS.map(p => <option key={p}>{p}</option>)}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Cantidad (kg) *</label>
                <input
                  type="number" required min="1" step="0.1"
                  value={form.quantite_kg} onChange={set('quantite_kg')}
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Disponible el *</label>
                <input
                  type="date" required min={today}
                  value={form.date_disponibilite} onChange={set('date_disponibilite')}
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Descripción</label>
              <textarea
                rows={3} value={form.description} onChange={set('description')}
                placeholder="Calibre, embalaje, certificaciones, condiciones de almacenamiento..."
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Fotos de la producción
                <span className="text-gray-400 font-normal ml-1">(máx. {MAX_PHOTOS} fotos · {MAX_SIZE_MB} MB cada una)</span>
              </label>

              {previews.length > 0 && (
                <div className="flex gap-2 mb-2 flex-wrap">
                  {previews.map((src, i) => (
                    <div key={i} className="relative group">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={src}
                        alt=""
                        className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={() => removePhoto(i)}
                        className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center leading-none hover:bg-red-600"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {photos.length < MAX_PHOTOS && (
                <>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/heic"
                    multiple
                    onChange={handlePhotoChange}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full border-2 border-dashed border-gray-300 rounded-xl py-3 text-sm text-gray-500 hover:border-green-400 hover:text-green-600 transition-colors"
                  >
                    📷 {photos.length === 0
                      ? 'Añadir fotos (opcional)'
                      : `Añadir más fotos (${photos.length}/${MAX_PHOTOS})`}
                  </button>
                </>
              )}
            </div>

            {/* Vidéo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Video de la finca
                <span className="text-gray-400 font-normal ml-1">(mp4, mov, webm · máx. {MAX_VIDEO_MB} MB)</span>
              </label>

              {video && videoPreviewUrl ? (
                <div className="mb-2">
                  <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-3 py-2">
                    <span className="text-green-600 shrink-0">🎥</span>
                    <span className="text-sm text-green-700 font-medium flex-1 truncate">{video.name}</span>
                    <button
                      type="button"
                      onClick={removeVideo}
                      className="text-red-400 hover:text-red-600 text-xs shrink-0 ml-1"
                    >
                      ✕ Eliminar
                    </button>
                  </div>
                  <video
                    src={videoPreviewUrl}
                    controls
                    preload="metadata"
                    playsInline
                    className="w-full rounded-xl mt-2 border border-gray-100 bg-black"
                    style={{ maxHeight: '180px' }}
                  />
                </div>
              ) : (
                <>
                  <input
                    ref={videoInputRef}
                    type="file"
                    accept="video/mp4,video/quicktime,video/webm"
                    onChange={handleVideoChange}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => videoInputRef.current?.click()}
                    className="w-full border-2 border-dashed border-gray-300 rounded-xl py-3 text-sm text-gray-500 hover:border-green-400 hover:text-green-600 transition-colors"
                  >
                    🎥 Añadir un video (opcional)
                  </button>
                </>
              )}

              <p className="text-xs text-gray-600 mt-2 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2.5 leading-relaxed">
                🎥 ¡Presenta tu finca al mundo! Los compradores europeos quieren ver de dónde vienen sus frutas. Un video auténtico aumenta tus posibilidades de venta.
              </p>
            </div>

            <div className="flex gap-3 pt-1">
              <button
                type="submit" disabled={loading}
                className="flex-1 bg-green-700 hover:bg-green-800 disabled:bg-green-300 text-white font-medium py-2.5 rounded-xl transition-colors"
              >
                {loading ? (uploadStep || 'Publicando…') : 'Publicar este lote'}
              </button>
              <button
                type="button" onClick={handleClose}
                className="px-5 py-2.5 text-sm text-gray-500 hover:text-gray-700 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
