import { useState } from 'react';
import { Box } from 'lucide-react';

interface ModImageProps {
  src: string;
  alt: string;
  title?: string;
  accentTint?: string;
  className?: string;
}

export function ModImage({
  src,
  alt,
  title,
  accentTint = '#2B2A31',
  className = '',
}: ModImageProps) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div
        className={`flex h-full w-full flex-col items-center justify-center gap-2 p-4 text-center ${className}`}
        style={{
          background: `radial-gradient(circle at 30% 25%, ${accentTint}, #1C1B20 85%)`,
        }}
        role="img"
        aria-label={alt}
      >
        <Box className="h-9 w-9 text-[#FF6A5F]/80" aria-hidden="true" />
        {title && (
          <span className="max-w-[20ch] text-xs font-medium text-[#A8A39A] truncate">
            {title}
          </span>
        )}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={`h-full w-full object-cover ${className}`}
      loading="lazy"
    />
  );
}
