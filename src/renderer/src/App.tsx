import { useState, useEffect, useRef } from 'react';
import './assets/main.css';

type TimerState = 'idle' | 'ready' | 'solving' | 'finished';

function App() {
  const [timerState, setTimerState] = useState<TimerState>('idle');
  const [time, setTime] = useState<number>(0);
  
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault(); 
        
        if (e.repeat) return; 
        
        setTimerState((prev) => {
          if (prev === 'idle' || prev === 'finished') return 'ready';
          if (prev === 'solving') return 'finished';
          return prev;
        });
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        setTimerState((prev) => {
          if (prev === 'ready') return 'solving';
          return prev;
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useEffect(() => {
    if (timerState === 'ready') {
      setTime(0);
    } 
    else if (timerState === 'solving') {
      startTimeRef.current = Date.now();
      intervalRef.current = setInterval(() => {
        setTime(Date.now() - startTimeRef.current);
      }, 10);
    } 
    else if (timerState === 'finished') {
      if (intervalRef.current) clearInterval(intervalRef.current);
      
      const finalTime = Date.now() - startTimeRef.current;
      setTime(finalTime);
      
      if (window.api && window.api.saveSolve) {
        window.api.saveSolve(finalTime).catch(err => console.error("DB Save Failed:", err));
      }
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [timerState]);

  const formatTime = (ms: number) => {
    return (ms / 1000).toFixed(2);
  };

  const isFocusMode = timerState === 'ready' || timerState === 'solving';

  return (
    <div className="app-container">
      <div className={`letterbox top ${isFocusMode ? 'fade-out' : ''}`}>
        <div className="toolbar">
          <span>Notation</span>
          <div className="dropdowns">
            <select><option>3x3</option></select>
            <select><option>CFOP</option></select>
          </div>
        </div>
      </div>

      <div className="timer-container">
        <h1 className={`timer-text ${timerState === 'ready' ? 'text-ready' : ''}`}>
          {formatTime(time)}
        </h1>
      </div>

      <div className={`letterbox bottom ${isFocusMode ? 'fade-out' : ''}`}>
        <div className="scramble-display">
          R U R' U' R' F R2 U' R' U' R U R' F'
        </div>
      </div>
    </div>
  );
}

export default App;