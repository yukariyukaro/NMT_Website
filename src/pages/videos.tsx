import GlobalLayout from '@/components/GlobalLayout';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import VideoCard from '@/components/videos/VideoCard';
import { listVideoCategories, listVideos } from '@/lib/video-catalog';

const VIDEOS = listVideos();
const CATEGORIES = listVideoCategories();

export default function VideosPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('全部');

  const normalizedQuery = searchQuery.trim().toLowerCase();
  const filteredVideos = VIDEOS.filter((video) => {
    const matchesQuery =
      !normalizedQuery ||
      video.title.toLowerCase().includes(normalizedQuery) ||
      video.author.toLowerCase().includes(normalizedQuery);
    const matchesCategory = selectedCategory === '全部' || video.category === selectedCategory;
    return matchesQuery && matchesCategory;
  });

  return (
    <GlobalLayout>
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">教學影片庫</h1>
            <p className="text-muted-foreground">專業的 NMT 復健指導影片</p>
          </div>
          
          <div className="flex w-full md:w-auto items-center gap-2">
            <div className="relative flex-1 md:w-80">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="搜尋影片..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          {CATEGORIES.map((category) => (
            <Badge 
              key={category} 
              variant={selectedCategory === category ? "default" : "outline"}
              className="whitespace-nowrap cursor-pointer px-4 py-1.5 text-sm"
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Badge>
          ))}
        </div>

        {/* Video Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredVideos.map((video) => (
            <VideoCard
              key={video.id}
              video={video}
              onSelect={(videoId) => {
                const to = `/video-player/${videoId}`;
                console.info('[VideosPage] navigate', { from: '/videos', to, videoId });
                navigate(to);
              }}
            />
          ))}
        </div>
      </div>
    </GlobalLayout>
  );
}
