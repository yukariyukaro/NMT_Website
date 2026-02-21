import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PlayCircle, StopCircle, Clock, CheckCircle2 } from 'lucide-react';

interface TrainingSessionProps {
  videoId: string;
  videoTitle: string;
}

export default function TrainingSession({ videoId }: TrainingSessionProps) {
  const [isTraining, setIsTraining] = useState(false);
  const [duration, setDuration] = useState(0);
  const [sessionCount, setSessionCount] = useState(0);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (isTraining) {
      timerRef.current = window.setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isTraining]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleTraining = () => {
    if (isTraining) {
      setIsTraining(false);
      setSessionCount(prev => prev + 1);
      // Here you could save the session to local storage or backend
      console.log(`Training session completed for video ${videoId}: ${duration}s`);
    } else {
      setIsTraining(true);
      setDuration(0);
    }
  };

  return (
    <Card className="shadow-md bg-muted/20">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Clock className="h-5 w-5" />
          训练记录
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between bg-background p-3 rounded-lg border">
          <div>
            <div className="text-sm text-muted-foreground">本次时长</div>
            <div className={`text-2xl font-bold tabular-nums ${isTraining ? 'text-primary animate-pulse' : ''}`}>
              {formatTime(duration)}
            </div>
          </div>
          {sessionCount > 0 && (
            <div className="text-right">
              <div className="text-xs text-muted-foreground">已完成</div>
              <Badge variant="secondary" className="flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3" /> {sessionCount} 次
              </Badge>
            </div>
          )}
        </div>

        <Button 
          className={`w-full ${isTraining ? 'bg-destructive hover:bg-destructive/90' : 'bg-green-600 hover:bg-green-700'}`}
          onClick={toggleTraining}
        >
          {isTraining ? (
            <>
              <StopCircle className="mr-2 h-4 w-4" /> 结束训练
            </>
          ) : (
            <>
              <PlayCircle className="mr-2 h-4 w-4" /> 开始跟练
            </>
          )}
        </Button>
        
        {isTraining && (
          <p className="text-xs text-center text-muted-foreground animate-in fade-in">
            正在记录训练时间...
          </p>
        )}
      </CardContent>
    </Card>
  );
}

import { useRef } from 'react';
