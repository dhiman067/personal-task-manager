import React, { useState } from 'react';
import { Priority, MatrixQuadrant, Task } from '../types';
import { Plus, Calendar, Flag, Folder, Sparkles, Clock, Check } from 'lucide-react';
import { getTodayDateString, getTomorrowDateString, DEFAULT_CATEGORIES } from '../data/initialTasks';

interface QuickAddTaskProps {
  onAddTask: (task: Omit<Task, 'id' | 'createdAt' | 'completed' | 'subtasks' | 'completedPomodoros'>) => void;
  defaultQuadrant?: MatrixQuadrant;
  defaultCategory?: string;
  defaultDueDate?: string;
  placeholder?: string;
}

export const QuickAddTask: React.FC<QuickAddTaskProps> = ({
  onAddTask,
  defaultQuadrant = 'q2',
  defaultCategory = 'Work',
  defaultDueDate,
  placeholder = 'Add a new task (press Enter)...',
}) => {
  const [title, setTitle] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [dueDate, setDueDate] = useState<string>(defaultDueDate || getTodayDateString());
  const [priority, setPriority] = useState<Priority>('p2');
  const [quadrant, setQuadrant] = useState<MatrixQuadrant>(defaultQuadrant);
  const [category, setCategory] = useState<string>(defaultCategory);
  const [estimatedPomodoros, setEstimatedPomodoros] = useState<number>(1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAddTask({
      title: title.trim(),
      dueDate: dueDate || undefined,
      priority,
      quadrant,
      category,
      estimatedPomodoros: Math.max(1, estimatedPomodoros),
    });

    setTitle('');
    // Keep expanded options but ready for next quick entry
  };

  const handlePrioritySelect = (p: Priority) => {
    setPriority(p);
    // Suggest appropriate Eisenhower quadrant based on priority
    if (p === 'p1') setQuadrant('q1'); // Urgent & Important
    else if (p === 'p2') setQuadrant('q2'); // Important, Not Urgent
    else if (p === 'p3') setQuadrant('q3'); // Urgent, Not Important
    else setQuadrant('q4'); // Low / Backlog
  };

  return (
    <div id="quick-add-task-container" className="bg-white rounded-xl border border-stone-200 shadow-xs p-3 transition-all">
      <form onSubmit={handleSubmit}>
        <div className="flex items-center gap-2">
          <div className="flex-shrink-0 text-stone-400 pl-1">
            <Plus className="w-5 h-5" />
          </div>
          <input
            id="quick-add-title-input"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onFocus={() => setIsExpanded(true)}
            placeholder={placeholder}
            className="flex-1 text-sm bg-transparent border-none outline-none text-stone-900 placeholder-stone-400 py-1.5 focus:ring-0"
          />
          <button
            id="btn-quick-add-submit"
            type="submit"
            disabled={!title.trim()}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-stone-900 text-white text-xs font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-stone-800 transition-colors"
          >
            <span>Add</span>
          </button>
        </div>

        {/* Quick Attribute Badges & Selectors */}
        {(isExpanded || title.length > 0) && (
          <div className="mt-3 pt-2.5 border-t border-stone-100 flex flex-wrap items-center justify-between gap-2.5 text-xs animate-in fade-in duration-150">
            <div className="flex flex-wrap items-center gap-2">
              {/* Due Date Chips */}
              <div className="flex items-center gap-1 bg-stone-100 p-0.5 rounded-lg">
                <button
                  type="button"
                  id="chip-due-today"
                  onClick={() => setDueDate(getTodayDateString())}
                  className={`px-2 py-1 rounded-md text-[11px] font-medium transition-colors ${
                    dueDate === getTodayDateString()
                      ? 'bg-white text-stone-900 shadow-2xs font-semibold'
                      : 'text-stone-500 hover:text-stone-800'
                  }`}
                >
                  Today
                </button>
                <button
                  type="button"
                  id="chip-due-tomorrow"
                  onClick={() => setDueDate(getTomorrowDateString())}
                  className={`px-2 py-1 rounded-md text-[11px] font-medium transition-colors ${
                    dueDate === getTomorrowDateString()
                      ? 'bg-white text-stone-900 shadow-2xs font-semibold'
                      : 'text-stone-500 hover:text-stone-800'
                  }`}
                >
                  Tomorrow
                </button>
                <input
                  type="date"
                  id="quick-add-custom-date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="px-1.5 py-0.5 text-[11px] bg-transparent text-stone-600 border-none outline-none cursor-pointer"
                  title="Pick specific date"
                />
              </div>

              {/* Priority Chips */}
              <div className="flex items-center gap-1 bg-stone-100 p-0.5 rounded-lg">
                {(['p1', 'p2', 'p3', 'p4'] as Priority[]).map((p) => {
                  const labels: Record<Priority, string> = { p1: 'P1 Urgent', p2: 'P2 High', p3: 'P3 Med', p4: 'P4 Low' };
                  const isSel = priority === p;
                  return (
                    <button
                      key={p}
                      type="button"
                      id={`chip-priority-${p}`}
                      onClick={() => handlePrioritySelect(p)}
                      className={`px-2 py-1 rounded-md text-[11px] font-medium transition-colors ${
                        isSel
                          ? p === 'p1'
                            ? 'bg-rose-100 text-rose-800 font-bold shadow-2xs'
                            : p === 'p2'
                            ? 'bg-amber-100 text-amber-800 font-bold shadow-2xs'
                            : p === 'p3'
                            ? 'bg-sky-100 text-sky-800 font-bold shadow-2xs'
                            : 'bg-white text-stone-800 font-bold shadow-2xs'
                          : 'text-stone-500 hover:text-stone-800'
                      }`}
                    >
                      {labels[p]}
                    </button>
                  );
                })}
              </div>

              {/* Category selector */}
              <div className="flex items-center gap-1">
                <select
                  id="quick-add-category-select"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="text-[11px] font-medium bg-stone-100 text-stone-700 border-none rounded-lg px-2 py-1 outline-none cursor-pointer hover:bg-stone-200/70 transition-colors"
                >
                  {DEFAULT_CATEGORIES.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Estimated Focus Time */}
              <div className="flex items-center gap-1 text-[11px] text-stone-600 bg-stone-100 px-2 py-1 rounded-lg">
                <span>⏱</span>
                <select
                  id="quick-add-pomodoro-select"
                  value={estimatedPomodoros}
                  onChange={(e) => setEstimatedPomodoros(Number(e.target.value))}
                  className="bg-transparent border-none outline-none font-medium text-stone-700 cursor-pointer text-[11px]"
                  title="Estimated focus sessions (25min each)"
                >
                  <option value={1}>1 session (25m)</option>
                  <option value={2}>2 sessions (50m)</option>
                  <option value={3}>3 sessions (75m)</option>
                  <option value={4}>4 sessions (100m)</option>
                  <option value={6}>6 sessions (2.5h)</option>
                </select>
              </div>
            </div>

            {/* Hint */}
            <span className="text-[10px] text-stone-400">
              Press Enter to create
            </span>
          </div>
        )}
      </form>
    </div>
  );
};
