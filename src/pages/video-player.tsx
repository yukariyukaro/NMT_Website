import { useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { getDefaultVideoId } from '@/lib/video-catalog';

export default function VideoPlayerIndexPage() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const pathName = location.pathname;
    const defaultId = getDefaultVideoId();
    console.info('[VideoPlayerIndexPage] route', { pathName, defaultId });

    const isIndexRoute = pathName === '/video-player' || pathName === '/video-player/';
    if (!isIndexRoute) return;

    if (!defaultId) {
      navigate('/videos', { replace: true });
      return;
    }

    navigate(`/video-player/${defaultId}`, { replace: true });
  }, [location.pathname, navigate]);

  return <Outlet />;
}
