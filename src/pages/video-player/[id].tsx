import { useEffect, useMemo, useRef, useState, type SyntheticEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import GlobalLayout from '@/components/GlobalLayout';
import VideoCard from '@/components/videos/VideoCard';
import { getVideoById, listRelatedVideos } from '@/lib/video-catalog';
import MetronomePanel from '@/components/training/MetronomePanel';
import TrainingSession from '@/components/training/TrainingSession';

export default function VideoPlayerPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [playbackError, setPlaybackError] = useState<string | null>(null);

  const video = useMemo(() => {
    if (!id) return undefined;
    return getVideoById(id);
  }, [id]);

  const relatedVideos = useMemo(() => {
    if (!video) return [];
    return listRelatedVideos(video.id);
  }, [video]);

  useEffect(() => {
    console.info('[VideoPlayerPage] route', { id });
  }, [id]);

  useEffect(() => {
    console.info('[VideoPlayerPage] video resolved', {
      id,
      found: Boolean(video),
      src: video?.src,
      posterSrc: video?.posterSrc,
    });
  }, [id, video]);

  useEffect(() => {
    setPlaybackError(null);
  }, [video?.id]);

  const handleVideoError = () => {
    const el = videoRef.current;
    const mediaError = el?.error;
    console.error('[VideoPlayerPage] media error', {
      id: video?.id,
      src: el?.currentSrc,
      errorCode: mediaError?.code,
      errorMessage: (mediaError as unknown as { message?: string } | null)?.message,
      networkState: el?.networkState,
      readyState: el?.readyState,
    });

    const message =
      mediaError?.code === 4
        ? '此影片格式可能不被瀏覽器支援，建議轉為 MP4（H.264 + AAC）後再試。'
        : '影片載入失敗，請確認檔案存在且可被瀏覽器讀取。';
    setPlaybackError(message);
  };

  const handleLoadedMetadata = () => {
    const el = videoRef.current;
    console.info('[VideoPlayerPage] loadedmetadata', {
      id: video?.id,
      currentSrc: el?.currentSrc,
      duration: el?.duration,
      videoWidth: el?.videoWidth,
      videoHeight: el?.videoHeight,
    });
  };

  const handleVideoEvent = (e: SyntheticEvent<HTMLVideoElement, Event>) => {
    const el = e.currentTarget;
    const buffered = el.buffered.length > 0 ? `${el.buffered.start(0)}-${el.buffered.end(0)}` : 'none';
    console.info(`[VideoPlayerPage] event: ${e.type}`, {
      src: el.currentSrc,
      networkState: el.networkState,
      readyState: el.readyState,
      buffered,
    });
  };

  if (!video) {
    return (
      <GlobalLayout>
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <Card className="border-dashed">
            <CardContent className="p-6 space-y-4">
              <div className="space-y-1">
                <h1 className="text-xl font-bold">找不到此影片</h1>
                <p className="text-sm text-muted-foreground">此連結可能已失效，或影片已被移除。</p>
              </div>
              <Button onClick={() => navigate('/videos')}>返回影片庫</Button>
            </CardContent>
          </Card>
        </div>
      </GlobalLayout>
    );
  }

  return (
    <GlobalLayout>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-xl overflow-hidden bg-black aspect-video shadow-lg relative group">
            <video
              key={video.id}
              ref={videoRef}
              controls
              playsInline
              preload="metadata"
              poster={video.posterSrc}
              className="w-full h-full object-contain"
              src={video.src}
              onError={handleVideoError}
              onLoadedMetadata={handleLoadedMetadata}
              onWaiting={handleVideoEvent}
              onStalled={handleVideoEvent}
              onCanPlay={handleVideoEvent}
              onLoadStart={handleVideoEvent}
              crossOrigin="anonymous"
            >
              您的瀏覽器不支援 HTML5 影片。
            </video>
          </div>

          {playbackError ? (
            <Card className="border-dashed">
              <CardContent className="p-4 space-y-2">
                <div className="space-y-1">
                  <h2 className="text-sm font-semibold">無法播放此影片</h2>
                  <p className="text-sm text-muted-foreground">{playbackError}</p>
                </div>
                <div className="text-xs text-muted-foreground">來源：{video.src}</div>
              </CardContent>
            </Card>
          ) : null}

          <div className="space-y-4">
            <h1 className="text-2xl font-bold leading-tight">{video.title}</h1>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center font-bold text-muted-foreground">
                  {video.author[0]}
                </div>
                <div>
                  <h3 className="font-semibold">{video.author}</h3>
                  <p className="text-xs text-muted-foreground">{video.category}</p>
                </div>
              </div>
            </div>
          </div>

          {video.description ? (
            <Card className="bg-muted/30 border-none shadow-sm">
              <CardContent className="p-4 space-y-4">
                {video.dateLabel ? (
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <span>{video.dateLabel}</span>
                  </div>
                ) : null}

                <p className="text-sm leading-relaxed whitespace-pre-wrap">{video.description}</p>

                {video.tags?.length ? (
                  <div className="pt-2 flex flex-wrap gap-2">
                    <span className="text-sm font-medium mr-2 self-center">類型：</span>
                    {video.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="cursor-pointer hover:bg-secondary/80">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                ) : null}
              </CardContent>
            </Card>
          ) : null}
        </div>

        <div className="lg:col-span-1 space-y-6">
          {/* Training Tools Section */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-primary block"></span>
              训练助手
            </h3>
            
            <TrainingSession videoId={video.id} videoTitle={video.title} />
            
            <MetronomePanel />
          </div>

          <div className="space-y-4 pt-4 border-t">
            <h3 className="font-semibold text-lg">接下来播放</h3>

            <div className="flex gap-2 overflow-x-auto pb-2 mb-2 no-scrollbar">
              <Badge variant="default" className="whitespace-nowrap">全部</Badge>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-1 gap-3">
              {relatedVideos.map((v) => (
                <VideoCard key={v.id} video={v} layout="compact" onSelect={(videoId) => navigate(`/video-player/${videoId}`)} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </GlobalLayout>
  );
}
