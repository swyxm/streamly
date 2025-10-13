'client';

interface HLSPlayerProps {
  src: string;
  className?: string;
}

export default function HLSPlayer({ src, className = '' }: HLSPlayerProps) {
  const streamKey = src.split('/').filter(Boolean).pop()?.replace('/index.m3u8', '');
  const encodedSrc = encodeURIComponent(src);
  const hlsPlayerUrl = `https://hlsplayer.net/embed?type=m3u8&src=${encodedSrc}`;
  
  return (
    <div className={`w-full aspect-video bg-black ${className}`}>
      <iframe
        src={hlsPlayerUrl}
        className="w-full h-full border-0"
        allowFullScreen
        allow="autoplay"
        title={`Stream Player - ${streamKey}`}
      />
    </div>
  );
}
