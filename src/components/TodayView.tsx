import React, { useMemo } from 'react';
import { Task } from '../types';
import { TaskItem } from './TaskItem';
import { QuickAddTask } from './QuickAddTask';
import { getTodayDateString } from '../data/initialTasks';
import { CheckCircle2, Flame, Sparkles, Target, Zap, Coffee } from 'lucide-react';

interface TodayViewProps {
  tasks: Task[];
  onAddTask: (task: Omit<Task, 'id' | 'createdAt' | 'completed' | 'subtasks' | 'completedPomodoros'>) => void;
  onToggleComplete: (id: string) => void;
  onTogglePin: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
  onStartFocus: (task: Task) => void;
  onToggleSubtask: (taskId: string, subtaskId: string) => void;
}

export const TodayView: React.FC<TodayViewProps> = ({
  tasks,
  onAddTask,
  onToggleComplete,
  onTogglePin,
  onDelete,
  onEdit,
  onStartFocus,
  onToggleSubtask,
}) => {
  const todayStr = getTodayDateString();

  // Filter tasks that are due today, pinned, or incomplete with today's focus
  const todayTasks = useMemo(() => {
    return tasks.filter((t) => {
      if (t.dueDate === todayStr) return true;
      if (!t.completed && t.pinned) return true;
      if (t.completed && t.completedAt && t.completedAt.startsWith(todayStr)) return true;
      return false;
    });
  }, [tasks, todayStr]);

  const activeTasks = useMemo(() => {
    return todayTasks.filter((t) => !t.completed).sort((a, b) => {
      // Pinned first
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      // Priority order
      const priorityOrder = { p1: 1, p2: 2, p3: 3, p4: 4 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
  }, [todayTasks]);

  const completedTodayTasks = useMemo(() => {
    return todayTasks.filter((t) => t.completed);
  }, [todayTasks]);

  const totalCount = activeTasks.length + completedTodayTasks.length;
  const progressPercent = totalCount > 0 ? Math.round((completedTodayTasks.length / totalCount) * 100) : 0;

  // Single top priority task (Deep Focus Target)
  const topFocusTask = activeTasks.length > 0 ? activeTasks[0] : null;

  return (
    <div id="view-today-container" className="space-y-6">
      {/* Daily Progress Card */}
      <div id="today-progress-card" className="bg-white rounded-2xl border border-stone-200 p-5 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-stone-900 tracking-tight">Today's Focus</h2>
              <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-stone-100 text-stone-600 border border-stone-200">
                {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
              </span>
            </div>
            <p className="text-xs text-stone-500 mt-1">
              {activeTasks.length === 0 && totalCount > 0
                ? "All tasks cleared for today! Amazing work."
                : `${completedTodayTasks.length} of ${totalCount} tasks completed (${progressPercent}%)`}
            </p>
          </div>

          {/* Progress Bar & Badges */}
          <div className="sm:w-64 space-y-1.5">
            <div className="flex justify-between text-[11px] font-semibold text-stone-600">
              <span>Daily Completion</span>
              <span>{progressPercent}%</span>
            </div>
            <div className="w-full bg-stone-100 h-2.5 rounded-full overflow-hidden border border-stone-200/60">
              <div
                className="bg-emerald-600 h-full rounded-full transition-all duration-300 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Highlight Focus Target (The "One Thing" Rule) */}
        {topFocusTask && (
          <div id="daily-top-focus-banner" className="mt-4 pt-4 border-t border-stone-100 flex items-center justify-between gap-3 bg-stone-50/80 p-3 rounded-xl border border-stone-200/80">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center flex-shrink-0">
                <Target className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-[11px] font-bold text-amber-900 tracking-wide uppercase">Primary Objective</div>
                <div className="text-xs font-semibold text-stone-900 truncate">{topFocusTask.title}</div>
              </div>
            </div>
            <button
              id="btn-today-quick-start-focus"
              onClick={() => onStartFocus(topFocusTask)}
              className="flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 bg-stone-900 text-white rounded-lg text-xs font-semibold hover:bg-stone-800 transition-colors shadow-2xs"
            >
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Enter Focus</span>
            </button>
          </div>
        )}
      </div>

      {/* Quick Add */}
      <div>
        <QuickAddTask
          onAddTask={onAddTask}
          defaultDueDate={todayStr}
          placeholder="Add a task for today (e.g., Review PR notes)..."
        />
      </div>

      {/* Active Tasks List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-stone-500 uppercase tracking-wider">
            Prioritized Plan ({activeTasks.length})
          </h3>
          <span className="text-[11px] text-stone-400">Sorted by urgency & priority</span>
        </div>

        {activeTasks.length === 0 ? (
          <div className="bg-white rounded-xl border border-dashed border-stone-300 p-8 text-center">
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-semibold text-stone-800">Clear Deck!</h4>
            <p className="text-xs text-stone-500 max-w-sm mx-auto mt-1">
              You have no pending tasks scheduled for today. Add a new task above or schedule upcoming tasks from the Priority Matrix.
            </p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {activeTasks.map((t) => (
              <TaskItem
                key={t.id}
                task={t}
                onToggleComplete={onToggleComplete}
                onTogglePin={onTogglePin}
                onDelete={onDelete}
                onEdit={onEdit}
                onStartFocus={onStartFocus}
                onToggleSubtask={onToggleSubtask}
              />
            ))}
          </div>
        )}
      </div>

      {/* Completed Today Section */}
      {completedTodayTasks.length > 0 && (
        <div className="pt-4 border-t border-stone-200 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-stone-500 uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Completed Today ({completedTodayTasks.length})</span>
            </h3>
          </div>

          <div className="space-y-2 opacity-85">
            {completedTodayTasks.map((t) => (
              <TaskItem
                key={t.id}
                task={t}
                onToggleComplete={onToggleComplete}
                onTogglePin={onTogglePin}
                onDelete={onDelete}
                onEdit={onEdit}
                onStartFocus={onStartFocus}
                onToggleSubtask={onToggleSubtask}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
