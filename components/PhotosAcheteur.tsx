'use client'
import { useState, useCallback } from 'react'
import PhotoLightbox from '@/components/PhotoLightbox'

interface Props {
  photos: string[]
  produit: string
  emoji: string
  disponibleLabel?: string
  isVendu?: boolean
  venduLabel?: string
}

export default function PhotosAcheteur({ photos, produit, emoji, disponibleLabel = 'Disponible', isVendu = false, venduLabel = 'VENDU' }: Props) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  const close = useCallback(() => setActiveIndex(null), [])
  const next = useCallback(() =>
    setActiveIndex(prev => prev !== null && prev < photos.length - 1 ? prev + 1 : prev),
    [photos.length])
  const prev = useCallback(() =>
    setActiveIndex(prev => prev !== null && prev > 0 ? prev - 1 : prev),
    [])

  if (!photos || photos.length === 0) {
    return (
      <div className="h-28 bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center relative overflow-hidden text-4xl">
        {emoji}
        {isVendu && (
          <span className="absolute bottom-0 left-0 right-0 bg-red-600 text-white text-center text-xs font-black py-1.5 tracking-widest">
            {venduLabel}
          </span>
        )}
      </div>
    )
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setActiveIndex(0)}
        className="relative w-full block cursor-zoom-in"
        aria-label={`Voir les photos de ${produit}`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={photos[0]}
          alt={produit}
          className="w-full h-44 object-cover"
        />
        {photos.length > 1 && (
          <span className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded-full">
            +{photos.length - 1}
          </span>
        )}
        {isVendu ? (
          <span className="absolute bottom-0 left-0 right-0 bg-red-600 text-white text-center text-xs font-black py-1.5 tracking-widest">
            {venduLabel}
          </span>
        ) : (
          <span className="absolute top-2 right-2 text-xs bg-green-600 text-white font-medium px-2.5 py-1 rounded-full">
            {disponibleLabel}
          </span>
        )}
      </button>

      {activeIndex !== null && (
        <PhotoLightbox
          photos={photos}
          activeIndex={activeIndex}
          onClose={close}
          onNext={next}
          onPrev={prev}
        />
      )}
    </>
  )
}
