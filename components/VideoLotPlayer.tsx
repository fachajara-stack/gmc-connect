type Props = {
  url: string
  className?: string
}

export default function VideoLotPlayer({ url, className = '' }: Props) {
  return (
    <video
      src={url}
      controls
      preload="metadata"
      playsInline
      className={`w-full rounded-xl border border-gray-100 bg-black ${className}`}
      style={{ maxHeight: '260px' }}
    />
  )
}
