import { useEffect,  useState } from 'react';
import { cn } from '@/lib/utils';
import { PlayCircle } from 'lucide-react';

interface AutoThumbnailProps {
  src: string;
  alt: string;
  className?: string;
  time?: number; // Time in seconds to capture (default: 1)
}

export default function AutoThumbnail({ src, alt, className, time = 1 }: AutoThumbnailProps) {
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isActive = true;
    const video = document.createElement('video');
    video.src = src;
    video.crossOrigin = 'anonymous';
    video.currentTime = time;
    video.muted = true;
    video.preload = 'metadata'; // Load metadata only first
    
    // We need to wait for enough data to be available to seek
    const handleLoadedData = () => {
      // Once metadata is loaded, we can seek
      video.currentTime = time;
    };

    const handleSeeked = () => {
      if (!isActive) return;
      
      try {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.7); // 70% quality JPEG
          setThumbnailUrl(dataUrl);
        }
      } catch (error) {
        console.error('Failed to generate thumbnail:', error);
      } finally {
        setIsLoading(false);
      }
    };

    const handleError = () => {
      if (!isActive) return;
      setIsLoading(false);
      console.warn('Video failed to load for thumbnail generation:', src);
    };

    video.addEventListener('loadeddata', handleLoadedData);
    video.addEventListener('seeked', handleSeeked);
    video.addEventListener('error', handleError);
    
    // Trigger load
    video.load();

    return () => {
      isActive = false;
      video.removeEventListener('loadeddata', handleLoadedData);
      video.removeEventListener('seeked', handleSeeked);
      video.removeEventListener('error', handleError);
      video.src = ''; // Cleanup
    };
  }, [src, time]);

  if (isLoading) {
    return (
      <div className={cn("flex h-full w-full items-center justify-center bg-gradient-to-br from-secondary/50 to-secondary animate-pulse", className)}>
        <PlayCircle className="h-8 w-8 text-muted-foreground/50" />
      </div>
    );
  }

  if (!thumbnailUrl) {
    return (
      <div className={cn("flex h-full w-full items-center justify-center bg-gradient-to-br from-secondary/50 to-secondary", className)}>
        <PlayCircle className="h-10 w-10 text-muted-foreground" />
      </div>
    );
  }

  return (
    <img 
      src={thumbnailUrl} 
      alt={alt} 
      className={cn("object-cover h-full w-full", className)}
      loading="lazy"
    />
  );
}
