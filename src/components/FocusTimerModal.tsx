import React, { useState, useEffect, useRef } from 'react';
import { Task } from '../types';
import { playChimeSound } from '../utils/audio';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  SkipForward, 
  X, 
  CheckCircle2, 
  Timer, 
  Coffee, 
  Sparkles,
  Volume2,
  VolumeX
} from 'lucide-react';

interface FocusTimerModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeTask: Task | null;
  onSessionCompleted: (taskId: string | null, minutes: number) => void;
  onToggleCompleteTask: (taskId: string) => void;
  allActiveTasks: Task[];
  onSelectActiveTask: (task: Task) => void;
}

type TimerMode = 'work' | 'shortBreak' | 'longBreak';

const MODE_DURATIONS: Record<TimerMode, number> = {
  work: 25 * 60,
  shortBreak: 5 * 60,
  longBreak: 15 * 60,
};

export const FocusTimerModal: React.FC<FocusTimerModalProps> = ({
  isOpen,
  onClose,
  activeTask,
  onSessionCompleted,
  onToggleCompleteTask,
  allActiveTasks,
  onSelectActiveTask,
}) => {
  const [mode, setMode] = useState<TimerMode>('work');
  const [timeLeft, setTimeLeft] = useState<number>(MODE_DURATIONS.work);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [completedSessionsCount, setCompletedSessionsCount] = useState<number>(0);

  const timerRef = useRef<number | null>(null);

  // Switch mode
  const handleModeChange = (newMode: TimerMode) => {
    setIsRunning(false);
    setMode(newMode);
    setTimeLeft(MODE_DURATIONS[newMode]);
  };

  // Timer countdown loop
  useEffect(() => {
    if (isRunning) {
      timerRef.current = window.setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            // Timer expired
            if (soundEnabled) playChimeSound('complete');
            if (mode === 'work') {
              const minutesLogged = 25;
              onSessionCompleted(activeTask ? activeTask.id : null, minutesLogged);
              setCompletedSessionsCount((c) => c + 1);
            }
            // Transition to break or work
            const nextMode = mode === 'work' ? (completedSessionsCount % 4 === 3 ? 'longBreak' : 'shortBreak') : 'work';
            setMode(nextMode);
            return MODE_DURATIONS[nextMode];
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, mode, soundEnabled, activeTask, completedSessionsCount, onSessionCompleted]);

  // Format mm:ss
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const totalDuration = MODE_DURATIONS[mode];
  const progressRatio = (totalDuration - timeLeft) / totalDuration;
  const strokeDashoffset = 440 - 440 * progressRatio;

  if (!isOpen) return null;

  return (
    <div
      id="focus-timer-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div
        id="focus-timer-modal-card"
        className="bg-white rounded-3xl border border-stone-200 shadow-xl w-full max-w-lg overflow-hidden flex flex-col"
      >
        {/* Modal Top Bar */}
        <div className="p-4 border-b border-stone-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
              <Timer className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-stone-900">Deep Work Focus Session</h3>
              <p className="text-[11px] text-stone-500">Pomodoro focus engine</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
              title={soundEnabled ? 'Mute sound chime' : 'Enable sound chime'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
              title="Close focus mode"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mode Selector */}
        <div className="px-6 pt-5 pb-2 flex justify-center">
          <div className="inline-flex p-1 bg-stone-100 rounded-xl gap-1">
            <button
              onClick={() => handleModeChange('work')}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                mode === 'work' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              Focus (25m)
            </button>
            <button
              onClick={() => handleModeChange('shortBreak')}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                mode === 'shortBreak' ? 'bg-white text-emerald-800 shadow-xs' : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              Short Break (5m)
            </button>
            <button
              onClick={() => handleModeChange('longBreak')}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                mode === 'longBreak' ? 'bg-white text-sky-800 shadow-xs' : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              Long Break (15m)
            </button>
          </div>
        </div>

        {/* Timer Display with Circular Progress */}
        <div className="py-6 flex flex-col items-center justify-center relative">
          <div className="relative w-52 h-52 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
              <circle
                cx="80"
                cy="80"
                r="70"
                className="stroke-stone-100"
                strokeWidth="7"
                fill="transparent"
              />
              <circle
                cx="80"
                cy="80"
                r="70"
                className={`transition-all duration-500 ease-linear ${
                  mode === 'work' ? 'stroke-amber-600' : mode === 'shortBreak' ? 'stroke-emerald-600' : 'stroke-sky-600'
                }`}
                strokeWidth="7"
                strokeDasharray="440"
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>

            {/* Time readout */}
            <div className="absolute flex flex-col items-center justify-center">
              <span className="font-mono text-4xl font-extrabold tracking-tight text-stone-900">
                {formattedTime}
              </span>
              <span className="text-xs font-medium text-stone-500 mt-1 uppercase tracking-wider">
                {mode === 'work' ? 'Deep Focus' : 'Recharge Break'}
              </span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3 mt-5">
            <button
              id="btn-timer-reset"
              onClick={() => {
                setIsRunning(false);
                setTimeLeft(MODE_DURATIONS[mode]);
              }}
              className="p-2.5 rounded-xl border border-stone-200 text-stone-500 hover:text-stone-800 hover:bg-stone-50 transition-colors"
              title="Reset timer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              id="btn-timer-play-pause"
              onClick={() => {
                if (!isRunning && soundEnabled) playChimeSound('start');
                setIsRunning(!isRunning);
              }}
              className={`px-6 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 shadow-xs transition-colors ${
                isRunning
                  ? 'bg-stone-200 text-stone-800 hover:bg-stone-300'
                  : 'bg-stone-900 text-white hover:bg-stone-800'
              }`}
            >
              {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
              <span>{isRunning ? 'Pause' : 'Start Focus'}</span>
            </button>

            <button
              id="btn-timer-skip"
              onClick={() => {
                setIsRunning(false);
                const nextMode = mode === 'work' ? 'shortBreak' : 'work';
                setMode(nextMode);
                setTimeLeft(MODE_DURATIONS[nextMode]);
              }}
              className="p-2.5 rounded-xl border border-stone-200 text-stone-500 hover:text-stone-800 hover:bg-stone-50 transition-colors"
              title="Skip to next stage"
            >
              <SkipForward className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Task Integration Section */}
        <div className="bg-stone-50 p-4 border-t border-stone-100 flex-1">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
              Linked Task
            </span>
            {activeTask && !activeTask.completed && (
              <button
                onClick={() => onToggleCompleteTask(activeTask.id)}
                className="inline-flex items-center gap-1 text-xs text-emerald-700 font-semibold hover:text-emerald-800"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Mark Task Completed</span>
              </button>
            )}
          </div>

          {activeTask ? (
            <div className="bg-white rounded-xl border border-stone-200 p-3 shadow-2xs">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="text-xs font-bold text-stone-900">{activeTask.title}</h4>
                  {activeTask.notes && (
                    <p className="text-[11px] text-stone-500 mt-0.5 line-clamp-2">{activeTask.notes}</p>
                  )}
                </div>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-stone-100 text-stone-700">
                  {activeTask.category}
                </span>
              </div>

              {/* Subtasks if any */}
              {activeTask.subtasks.length > 0 && (
                <div className="mt-2.5 pt-2 border-t border-stone-100 space-y-1">
                  <div className="text-[10px] font-semibold text-stone-400 uppercase">Sub-goals</div>
                  {activeTask.subtasks.slice(0, 3).map((st) => (
                    <div key={st.id} className="text-xs text-stone-600 flex items-center gap-1.5">
                      <span className={st.completed ? 'text-emerald-600' : 'text-stone-300'}>
                        {st.completed ? '✓' : '○'}
                      </span>
                      <span className={st.completed ? 'line-through text-stone-400' : ''}>{st.title}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-dashed border-stone-300 p-3 text-center">
              <p className="text-xs text-stone-500">No task currently selected for this focus session.</p>
              {allActiveTasks.length > 0 && (
                <div className="mt-2 flex items-center justify-center gap-1.5">
                  <span className="text-[11px] text-stone-400">Attach task:</span>
                  <select
                    onChange={(e) => {
                      const selected = allActiveTasks.find((t) => t.id === e.target.value);
                      if (selected) onSelectActiveTask(selected);
                    }}
                    className="text-xs bg-stone-100 text-stone-800 rounded-md px-2 py-1 border-none outline-none cursor-pointer"
                  >
                    <option value="">Select a task...</option>
                    {allActiveTasks.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.title}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
