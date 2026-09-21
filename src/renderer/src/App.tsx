import { useState, useEffect, useRef } from 'react';
import './assets/main.css';

type TimerState = 'idle' | 'ready' | 'solving' | 'finished';

function App() {
  const [timerState, setTimerState] = useState<TimerState>('idle');
  const [time, setTime] = useState<number>(0);
  
  // Refs preserve values without triggering React re-renders
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(0);

  // 1. Keyboard Event Listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault(); 
        
        setTimerState((currentState) => {
          if (currentState === 'idle') {
            setTime(0);
            return 'ready';
          }
          if (currentState === 'solving') {
            if (intervalRef.current) clearInterval(intervalRef.current);
            return 'finished'; // Simply change the state here, do NOT save to DB yet
          }
          return currentState;
        });
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        setTimerState((currentState) => {
          if (currentState === 'ready') {
            startTimeRef.current = Date.now();
            intervalRef.current = setInterval(() => {
              setTime(Date.now() - startTimeRef.current);
            }, 10);
            return 'solving';
          }
          if (currentState === 'finished') {
            return 'idle';
          }
          return currentState;
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  // 2. Database Side-Effect Hook
  useEffect(() => {
    if (timerState === 'finished') {
      // Calculate exact final time using the ref to avoid stale closures
      const finalTime = Date.now() - startTimeRef.current;
      setTime(finalTime);
      
      // Defensive check: only save if the bridge was successfully built
      if (window.api && window.api.saveSolve) {
        window.api.saveSolve(finalTime).catch(err => console.error("DB Save Failed:", err));
      } else {
        console.error("IPC Bridge is not connected!");
      }
    }
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