import { PlayCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { VideoMeta } from '@/lib/video-catalog';

type VideoCardLayout = 'grid' | 'compact';

interface VideoCardProps {
  video: VideoMeta;
  layout?: VideoCardLayout;
  onSelect?: (videoId: string) => void;
  className?: string;
}

export default function VideoCard({ video, layout = 'grid', onSelect, className }: VideoCardProps) {
  const handleSelect = () => {
    console.info('[VideoCard] select', {
      id: video.id,
      title: video.title,
      src: video.src,
      posterSrc: video.posterSrc,
      layout,
    });
    onSelect?.(video.id);
  };

  const Thumbnail = (
    <div className={cn('relative aspect-video overflow-hidden bg-muted', layout === 'grid' ? '' : 'rounded-md')}>
      {video.posterSrc ? (
        <img
          src={video.posterSrc}
          alt={video.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
          <PlayCircle className="h-10 w-10 text-slate-500" />
        </div>
      )}

      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />

      {video.durationLabel ? (
        <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded font-mono">
          {video.durationLabel}
        </div>
      ) : null}
    </div>
  );

  if (layout === 'compact') {
    return (
      <div
        className={cn(
          'flex flex-col lg:flex-row gap-2 lg:gap-3 group cursor-pointer hover:bg-muted/50 p-2 rounded-lg transition-colors',
          className,
        )}
        onClick={handleSelect}
      >
        <div className="relative w-full lg:w-40 flex-shrink-0">{Thumbnail}</div>
        <div className="flex flex-col gap-1 min-w-0 pt-1 lg:pt-0">
          <h4 className="font-medium text-sm line-clamp-2 leading-tight group-hover:text-primary transition-colors">
            {video.title}
          </h4>
          <div className="text-xs text-muted-foreground flex items-center gap-1">
            <span className="truncate">{video.author}</span>
            <span>•</span>
            <span className="truncate">{video.category}</span>
            {video.viewsLabel ? (
              <>
                <span>•</span>
                <span>{video.viewsLabel}</span>
              </>
            ) : null}
          </div>
        </div>
      </div>
    );
  }

  return (
    <Card
      className={cn('overflow-hidden cursor-pointer group hover:shadow-lg transition-all duration-300 border-none bg-card/50', className)}
      onClick={handleSelect}
    >
      {Thumbnail}
      <CardContent className="p-4 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold leading-tight line-clamp-2 group-hover:text-primary transition-colors">{video.title}</h3>
        </div>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{video.author}</span>
          {video.viewsLabel ? <span>{video.viewsLabel}</span> : null}
        </div>
        <div className="pt-2">
          <Badge variant="secondary" className="text-[10px] h-5">
            {video.category}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
