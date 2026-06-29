'use client'
import { useState, useCallback } from 'react'
import PhotoLightbox from '@/components/PhotoLightbox'

interface Props {
  photos: string[]
  thumbnailSize?: 'sm' | 'md'
}

export default function PhotoGallery({ photos, thumbnailSize = 'md' }: Props) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  const close = useCallback(() => setActiveIndex(null), [])
  const next = useCallback(() =>
    setActiveIndex(prev => prev !== null && prev < photos.length - 1 ? prev + 1 : prev),
    [photos.length])
  const prev = useCallback(() =>
    setActiveIndex(prev => prev !== null && prev > 0 ? prev - 1 : prev),
    [])

  if (!photos || photos.length === 0) return null

  const thumb = thumbnailSize === 'sm' ? 'w-16 h-16' : 'w-20 h-20'

  return (
    <>
      <div className="flex gap-2 overflow-x-auto pb-1">
        {photos.map((url, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setActiveIndex(i)}
            className={`${thumb} flex-shrink-0 rounded-lg overflow-hidden border border-gray-100 hover:opacity-80 transition-opacity cursor-zoom-in`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={url} alt={`Photo ${i + 1}`} className="w-full h-full object-cover" />
          </button>
        ))}
      </div>

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
