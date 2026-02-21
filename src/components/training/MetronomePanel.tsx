import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Play, Pause, Minus, Plus, Volume2 } from 'lucide-react';

interface MetronomePanelProps {
  className?: string;
  compact?: boolean;
}

export default function MetronomePanel({ className, compact = false }: MetronomePanelProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [bpm, setBpm] = useState(60);
  const [count, setCount] = useState(0);
  const [beatsPerMeasure] = useState(4);
  
  // Refs for audio scheduling
  const audioContext = useRef<AudioContext | null>(null);
  const nextNoteTime = useRef(0.0);
  const timerID = useRef<number | null>(null);
  const currentBeatInBar = useRef(0);
  const bpmRef = useRef(bpm);

  const lookahead = 25.0; 
  const scheduleAheadTime = 0.1; 

  useEffect(() => {
    bpmRef.current = bpm;
  }, [bpm]);

  const initAudio = () => {
    if (!audioContext.current) {
      audioContext.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (audioContext.current.state === 'suspended') {
      audioContext.current.resume();
    }
  };

  const nextNote = () => {
    const secondsPerBeat = 60.0 / bpmRef.current;
    nextNoteTime.current += secondsPerBeat;
    currentBeatInBar.current = (currentBeatInBar.current + 1) % beatsPerMeasure;
  };

  const scheduleNote = (beatNumber: number, time: number) => {
    const audioTime = time;
    const currentTime = audioContext.current!.currentTime;
    const timeUntilNote = Math.max(0, audioTime - currentTime);
    
    setTimeout(() => {
        setCount(beatNumber);
    }, timeUntilNote * 1000);
    
    const osc = audioContext.current!.createOscillator();
    const envelope = audioContext.current!.createGain();

    osc.frequency.value = (beatNumber % beatsPerMeasure === 0) ? 1000 : 800;
    envelope.gain.value = 1;
    envelope.gain.exponentialRampToValueAtTime(1, time + 0.001);
    envelope.gain.exponentialRampToValueAtTime(0.001, time + 0.02);

    osc.connect(envelope);
    envelope.connect(audioContext.current!.destination);

    osc.start(time);
    osc.stop(time + 0.03);
  };

  const scheduler = () => {
    while (nextNoteTime.current < audioContext.current!.currentTime + scheduleAheadTime) {
      scheduleNote(currentBeatInBar.current, nextNoteTime.current);
      nextNote();
    }
    timerID.current = window.setTimeout(scheduler, lookahead);
  };

  const togglePlay = () => {
    initAudio();
    
    if (isPlaying) {
      setIsPlaying(false);
      if (timerID.current) {
        window.clearTimeout(timerID.current);
        timerID.current = null;
      }
    } else {
      setIsPlaying(true);
      currentBeatInBar.current = 0;
      nextNoteTime.current = audioContext.current!.currentTime + 0.05;
      scheduler();
    }
  };

  useEffect(() => {
    return () => {
      if (timerID.current) {
        window.clearTimeout(timerID.current);
      }
      if (audioContext.current && audioContext.current.state !== 'closed') {
        audioContext.current.close();
      }
    };
  }, []);

  const handleBpmChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = parseInt(e.target.value);
    if (isNaN(val)) return;
    if (val < 30) val = 30;
    if (val > 250) val = 250;
    setBpm(val);
  };

  const adjustBpm = (delta: number) => {
    setBpm(prev => Math.min(Math.max(prev + delta, 30), 250));
  };

  return (
    <Card className={`shadow-md ${className}`}>
      {!compact && (
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Volume2 className="h-5 w-5" />
            节拍器
          </CardTitle>
        </CardHeader>
      )}
      <CardContent className={compact ? "p-4" : "pt-0"}>
        <div className="space-y-4">
          {/* BPM Display & Visual */}
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-3xl font-bold tabular-nums text-primary">{bpm}</span>
              <span className="text-xs text-muted-foreground font-medium">BPM</span>
            </div>
            
            <div className="flex gap-1">
              {Array.from({ length: beatsPerMeasure }).map((_, i) => (
                <div 
                  key={i} 
                  className={`h-3 w-3 rounded-full transition-all duration-75 ${
                    isPlaying && count === i 
                      ? 'bg-primary scale-125' 
                      : 'bg-muted'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3">
            <Button variant="outline" size="icon" className="h-8 w-8 shrink-0" onClick={() => adjustBpm(-5)}>
              <Minus className="h-4 w-4" />
            </Button>
            
            <input
              type="range"
              min="30"
              max="250"
              value={bpm}
              onChange={handleBpmChange}
              className="flex-1 h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
            />

            <Button variant="outline" size="icon" className="h-8 w-8 shrink-0" onClick={() => adjustBpm(5)}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          <Button 
            className={`w-full ${isPlaying ? 'bg-destructive hover:bg-destructive/90' : ''}`}
            onClick={togglePlay}
          >
            {isPlaying ? (
              <>
                <Pause className="mr-2 h-4 w-4" /> 停止
              </>
            ) : (
              <>
                <Play className="mr-2 h-4 w-4" /> 开始
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
