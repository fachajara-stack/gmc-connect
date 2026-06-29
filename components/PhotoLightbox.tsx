'use client'
import { useState, useEffect, useCallback } from 'react'

interface Props {
  photos: string[]
  activeIndex: number
  onClose: () => void
  onNext: () => void
  onPrev: () => void
}

export default function PhotoLightbox({ photos, activeIndex, onClose, onNext, onPrev }: Props) {
  const [zoomed, setZoomed] = useState(false)

  // Réinitialise le zoom au changement de photo
  const handleNext = useCallback(() => { setZoomed(false); onNext() }, [onNext])
  const handlePrev = useCallback(() => { setZoomed(false); onPrev() }, [onPrev])
  const handleClose = useCallback(() => { setZoomed(false); onClose() }, [onClose])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose()
      if (e.key === 'ArrowRight') handleNext()
      if (e.key === 'ArrowLeft') handlePrev()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [handleClose, handleNext, handlePrev])

  // Réinitialise le zoom si la photo active change depuis l'extérieur
  useEffect(() => { setZoomed(false) }, [activeIndex])

  return (
    <div
      className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center overflow-hidden"
      onClick={handleClose}
    >
      {/* Bouton fermer */}
      <button
        type="button"
        onClick={handleClose}
        className="absolute top-4 right-5 text-white/70 hover:text-white text-4xl font-light leading-none z-10 w-10 h-10 flex items-center justify-center"
        aria-label="Fermer"
      >
        ×
      </button>

      {/* Compteur */}
      {photos.length > 1 && (
        <p className="absolute top-5 left-1/2 -translate-x-1/2 text-white/50 text-sm tabular-nums select-none z-10">
          {activeIndex + 1} / {photos.length}
        </p>
      )}

      {/* Image — clic pour zoomer, stopPropagation pour ne pas fermer */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={photos[activeIndex]}
        alt=""
        onClick={e => { e.stopPropagation(); setZoomed(z => !z) }}
        style={{
          maxWidth: '90vw',
          maxHeight: '90vh',
          transform: zoomed ? 'scale(2)' : 'scale(1)',
          transition: 'transform 0.25s ease',
        }}
        className={`object-contain rounded-lg shadow-2xl select-none ${
          zoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'
        }`}
      />

      {/* Flèche précédente */}
      {activeIndex > 0 && (
        <button
          type="button"
          onClick={e => { e.stopPropagation(); handlePrev() }}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white text-5xl font-light leading-none z-10 w-12 h-12 flex items-center justify-center"
          aria-label="Photo précédente"
        >
          ‹
        </button>
      )}

      {/* Flèche suivante */}
      {activeIndex < photos.length - 1 && (
        <button
          type="button"
          onClick={e => { e.stopPropagation(); handleNext() }}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white text-5xl font-light leading-none z-10 w-12 h-12 flex items-center justify-center"
          aria-label="Photo suivante"
        >
          ›
        </button>
      )}
    </div>
  )
}
