import GlobalLayout from '@/components/GlobalLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlayCircle, Timer, Activity, Heart, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <GlobalLayout>
      <div className="space-y-8 animate-in fade-in duration-700">
        {/* Mission Statement Hero */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary to-primary/80 text-primary-foreground p-8 md:p-12 shadow-2xl hover:shadow-3xl transition-shadow duration-300">
          <div className="relative z-10 max-w-2xl mx-auto text-center space-y-4">
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl drop-shadow-md">
              随音而「衡」
            </h1>
            <p className="text-lg sm:text-xl font-light leading-relaxed opacity-90">
              以音乐的力量在心理和健康上支持患者
            </p>
            <div className="flex items-center justify-center gap-2 text-sm font-medium mt-4">
              <Heart className="h-5 w-5 text-red-200 animate-pulse" />
              <span>延续性照护 · 全方位支持</span>
            </div>
          </div>
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1511379938547-c1f69419868d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')] opacity-10 mix-blend-overlay bg-cover bg-center" />
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-all duration-300 border-t-4 border-t-blue-500 cursor-pointer group" onClick={() => navigate('/videos')}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 group-hover:text-blue-600 transition-colors">
                <PlayCircle className="h-6 w-6 text-blue-500" />
                教学视频
              </CardTitle>
              <CardDescription>
                浏览NMT治疗示范影片，随时随地进行康复练习。
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="aspect-video rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 group-hover:scale-[1.02] transition-transform duration-300">
                <PlayCircle className="h-12 w-12 opacity-50" />
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" className="w-full group-hover:bg-blue-50 group-hover:text-blue-600">
                开始观看 <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-300 border-t-4 border-t-green-500 cursor-pointer group" onClick={() => navigate('/metronome')}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 group-hover:text-green-600 transition-colors">
                <Timer className="h-6 w-6 text-green-500" />
                节拍器工具
              </CardTitle>
              <CardDescription>
                精准节奏控制，辅助您的每一次练习。
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="aspect-video rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 group-hover:scale-[1.02] transition-transform duration-300">
                <Timer className="h-12 w-12 opacity-50" />
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" className="w-full group-hover:bg-green-50 group-hover:text-green-600">
                开始练习 <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-300 border-t-4 border-t-purple-500 cursor-pointer group" onClick={() => navigate('/training')}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 group-hover:text-purple-600 transition-colors">
                <Activity className="h-6 w-6 text-purple-500" />
                我要训练
              </CardTitle>
              <CardDescription>
                记录每日进度，追踪康复旅程。
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="aspect-video rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 group-hover:scale-[1.02] transition-transform duration-300">
                <Activity className="h-12 w-12 opacity-50" />
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" className="w-full group-hover:bg-purple-50 group-hover:text-purple-600">
                查看进度 <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Recent Activity / Motivational Quote */}
        <Card className="bg-gradient-to-br from-slate-50 to-white border-dashed">
          <CardContent className="p-8 text-center">
            <blockquote className="text-xl font-medium italic text-slate-700">
              "每一个音符，都是通往康复的一步。"
            </blockquote>
            <p className="mt-4 text-sm text-slate-500">- 随音而「衡」团队</p>
          </CardContent>
        </Card>
      </div>
    </GlobalLayout>
  );
}
