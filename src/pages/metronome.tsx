import { useState, useEffect, useRef } from 'react';
import GlobalLayout from '@/components/GlobalLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Play, Pause, Minus, Plus, Volume2 } from 'lucide-react';

export default function MetronomePage() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [bpm, setBpm] = useState(60);
  const [count, setCount] = useState(0);
  const [beatsPerMeasure] = useState(4);
  
  // Refs for audio scheduling to avoid closure staleness
  const audioContext = useRef<AudioContext | null>(null);
  const nextNoteTime = useRef(0.0);
  const timerID = useRef<number | null>(null);
  const currentBeatInBar = useRef(0);
  const bpmRef = useRef(bpm); // Ref to hold current BPM for the scheduler loop

  // Configuration constants
  const lookahead = 25.0; // How frequently to call scheduling function (in milliseconds)
  const scheduleAheadTime = 0.1; // How far ahead to schedule audio (sec)

  // Keep bpmRef in sync with bpm state
  useEffect(() => {
    bpmRef.current = bpm;
  }, [bpm]);

  // Initialize AudioContext on user interaction
  const initAudio = () => {
    if (!audioContext.current) {
      audioContext.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (audioContext.current.state === 'suspended') {
      audioContext.current.resume();
    }
  };

  const nextNote = () => {
    const secondsPerBeat = 60.0 / bpmRef.current; // Use ref to get the latest BPM
    nextNoteTime.current += secondsPerBeat;
    currentBeatInBar.current = (currentBeatInBar.current + 1) % beatsPerMeasure;
  };

  const scheduleNote = (beatNumber: number, time: number) => {
    // For visual feedback (might be slightly off sync with audio due to React render cycle)
    // We use a timeout to sync the visual update with the audio time
    const audioTime = time;
    const currentTime = audioContext.current!.currentTime;
    const timeUntilNote = Math.max(0, audioTime - currentTime);
    
    // Use setTimeout to trigger visual update closer to the actual sound
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
    // while there are notes that will need to play before the next interval,
    // schedule them and advance the pointer.
    while (nextNoteTime.current < audioContext.current!.currentTime + scheduleAheadTime) {
      scheduleNote(currentBeatInBar.current, nextNoteTime.current);
      nextNote();
    }
    timerID.current = window.setTimeout(scheduler, lookahead);
  };

  const togglePlay = () => {
    initAudio();
    
    if (isPlaying) {
      // Stop
      setIsPlaying(false);
      if (timerID.current) {
        window.clearTimeout(timerID.current);
        timerID.current = null;
      }
    } else {
      // Start
      setIsPlaying(true);
      currentBeatInBar.current = 0;
      nextNoteTime.current = audioContext.current!.currentTime + 0.05;
      scheduler();
    }
  };

  // Cleanup on unmount
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
    <GlobalLayout>
      <div className="max-w-md mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">節拍器</h1>
          <p className="text-muted-foreground">保持節奏，提升練習效果</p>
        </div>

        <Card className="border-t-4 border-t-primary shadow-lg">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-6xl font-black text-primary tabular-nums tracking-tighter">
              {bpm}
            </CardTitle>
            <CardDescription className="uppercase tracking-widest font-semibold text-xs">
              BPM (每分鐘節拍數)
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-8 pt-6">
            {/* Visual Indicator */}
            <div className="flex justify-center gap-2 mb-8">
              {Array.from({ length: beatsPerMeasure }).map((_, i) => (
                <div 
                  key={i} 
                  className={`h-4 w-4 rounded-full transition-all duration-100 ${
                    isPlaying && count === i 
                      ? 'bg-primary scale-125 shadow-[0_0_10px_var(--color-primary)]' 
                      : 'bg-muted'
                  }`}
                />
              ))}
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between gap-4">
              <Button variant="outline" size="icon" className="h-12 w-12 rounded-full" onClick={() => adjustBpm(-1)}>
                <Minus className="h-6 w-6" />
              </Button>
              
              <div className="flex-1 px-2">
                <input
                  type="range"
                  min="30"
                  max="250"
                  value={bpm}
                  onChange={handleBpmChange}
                  className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                />
              </div>

              <Button variant="outline" size="icon" className="h-12 w-12 rounded-full" onClick={() => adjustBpm(1)}>
                <Plus className="h-6 w-6" />
              </Button>
            </div>

            <div className="flex justify-center pt-4">
              <Button 
                size="lg" 
                className={`h-20 w-20 rounded-full shadow-xl transition-all duration-300 ${
                  isPlaying ? 'bg-destructive hover:bg-destructive/90' : 'bg-primary hover:bg-primary/90'
                }`}
                onClick={togglePlay}
              >
                {isPlaying ? (
                  <Pause className="h-8 w-8 fill-current" />
                ) : (
                  <Play className="h-8 w-8 fill-current ml-1" />
                )}
              </Button>
            </div>

            <div className="text-center pt-4">
               <div className="inline-flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 px-3 py-1 rounded-full">
                <Volume2 className="h-3 w-3" />
                <span>建議佩戴耳機使用以獲得最佳效果</span>
               </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </GlobalLayout>
  );
}
