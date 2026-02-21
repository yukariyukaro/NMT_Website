import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { PlayCircle, Timer, Home, LogOut } from 'lucide-react';

interface GlobalLayoutProps {
  children?: React.ReactNode;
}

export default function GlobalLayout({ children }: GlobalLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    { name: '首页', path: '/', icon: Home },
    { name: '教学视频', path: '/videos', icon: PlayCircle },
    { name: '节拍器工具', path: '/metronome', icon: Timer },
  ];

  const handleLogout = () => {
    // Clear session logic here if needed
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      {/* Top Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-2 font-bold text-xl cursor-pointer" onClick={() => navigate('/')}>
            <div className="h-9 w-9 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-serif text-lg shadow-md">
              衡
            </div>
            <span className="hidden sm:inline-block tracking-tight text-primary">随音而「衡」</span>
          </div>

          <nav className="flex items-center gap-1 sm:gap-4 overflow-x-auto no-scrollbar max-w-[60%] sm:max-w-none justify-center">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = location.pathname === tab.path || (tab.path !== '/' && location.pathname.startsWith(tab.path));
              return (
                <Button
                  key={tab.path}
                  variant={isActive ? "default" : "ghost"}
                  size="sm"
                  className={`flex flex-col sm:flex-row items-center gap-1 h-auto py-1.5 sm:py-2 px-2 sm:px-4 rounded-full transition-all duration-200 ${isActive ? 'font-bold shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                  onClick={() => navigate(tab.path)}
                >
                  <Icon className={`h-4 w-4 sm:h-4 sm:w-4 ${isActive ? 'animate-pulse-once' : ''}`} />
                  <span className="text-[10px] sm:text-sm whitespace-nowrap">{tab.name}</span>
                </Button>
              );
            })}
          </nav>

          <Button variant="ghost" size="icon" onClick={handleLogout} className="ml-2 text-muted-foreground hover:text-destructive transition-colors">
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto py-6 px-4 md:px-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {children || <Outlet />}
      </main>

      {/* Footer */}
      <footer className="border-t py-6 md:py-0">
        <div className="container mx-auto flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row px-4 md:px-6">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            © 2026 随音而「衡」数位支援平台. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
