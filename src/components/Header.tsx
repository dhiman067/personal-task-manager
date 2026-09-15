import React from 'react';
import { ViewMode } from '../types';
import { 
  CalendarCheck2, 
  Grid2X2, 
  ListTodo, 
  FolderKanban, 
  CheckCircle2, 
  Timer, 
  BarChart3, 
  Plus, 
  Search, 
  Download, 
  Upload,
  Sparkles
} from 'lucide-react';

interface HeaderProps {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  completedTodayCount: number;
  totalActiveCount: number;
  focusMinutesToday: number;
  onOpenNewTask: () => void;
  onOpenFocusTimer: () => void;
  onOpenStats: () => void;
  onExport: () => void;
  onImportClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onViewChange,
  searchQuery,
  onSearchChange,
  completedTodayCount,
  totalActiveCount,
  focusMinutesToday,
  onOpenNewTask,
  onOpenFocusTimer,
  onOpenStats,
  onExport,
  onImportClick,
}) => {
  const views: { id: ViewMode; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'today', label: 'Today', icon: CalendarCheck2 },
    { id: 'matrix', label: 'Priority Matrix', icon: Grid2X2 },
    { id: 'all', label: 'All Tasks', icon: ListTodo },
    { id: 'projects', label: 'Categories', icon: FolderKanban },
    { id: 'completed', label: 'Completed', icon: CheckCircle2 },
  ];

  return (
    <header id="app-main-header" className="border-b border-stone-200 bg-white sticky top-0 z-30">
      {/* Top bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Brand and quick stats */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div id="brand-badge-icon" className="w-9 h-9 rounded-xl bg-stone-900 text-amber-400 flex items-center justify-center font-bold shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h1 id="app-heading-title" className="text-lg font-bold text-stone-900 leading-tight tracking-tight">
                Personal Task Manager
              </h1>
              <p className="text-xs text-stone-500 font-medium">
                Intentional daily productivity & focus
              </p>
            </div>
          </div>

          {/* Mobile buttons */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              id="mobile-btn-open-focus"
              onClick={onOpenFocusTimer}
              className="p-2 rounded-lg border border-stone-200 text-stone-700 hover:bg-stone-100 transition-colors"
              title="Focus Timer"
            >
              <Timer className="w-4 h-4 text-amber-600" />
            </button>
            <button
              id="mobile-btn-new-task"
              onClick={onOpenNewTask}
              className="p-2 rounded-lg bg-stone-900 text-white hover:bg-stone-800 transition-colors"
              title="Add Task"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Search bar & Live Productivity Metrics */}
        <div className="flex items-center flex-wrap gap-2.5 sm:gap-3">
          {/* Quick Metrics Badges */}
          <div id="productivity-metrics-bar" className="hidden sm:flex items-center gap-2 text-xs">
            <span 
              id="metric-completed-today"
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-stone-100 text-stone-700 border border-stone-200 font-medium"
              title="Tasks completed today"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>{completedTodayCount} done today</span>
            </span>

            <span 
              id="metric-focus-minutes"
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-stone-100 text-stone-700 border border-stone-200 font-medium"
              title="Focused deep work minutes today"
            >
              <Timer className="w-3.5 h-3.5 text-amber-600" />
              <span>{focusMinutesToday}m focused</span>
            </span>
          </div>

          {/* Search Input */}
          <div className="relative flex-1 sm:w-56 md:w-64">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              id="task-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search tasks..."
              className="w-full pl-9 pr-3 py-1.5 text-sm bg-stone-50 border border-stone-200 rounded-lg text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-400 focus:bg-white transition-all"
            />
          </div>

          {/* Action buttons */}
          <div className="hidden md:flex items-center gap-2">
            <button
              id="btn-open-focus-timer"
              onClick={onOpenFocusTimer}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-stone-200 text-stone-700 hover:bg-stone-50 text-xs font-semibold tracking-wide transition-colors"
            >
              <Timer className="w-3.5 h-3.5 text-amber-600" />
              <span>Focus Timer</span>
            </button>

            <button
              id="btn-open-stats"
              onClick={onOpenStats}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-stone-200 text-stone-700 hover:bg-stone-50 text-xs font-semibold tracking-wide transition-colors"
              title="Productivity Insights"
            >
              <BarChart3 className="w-3.5 h-3.5 text-stone-500" />
              <span>Insights</span>
            </button>

            <button
              id="btn-export-backup"
              onClick={onExport}
              className="p-1.5 rounded-lg border border-stone-200 text-stone-500 hover:text-stone-800 hover:bg-stone-50 transition-colors"
              title="Export backup (JSON)"
            >
              <Download className="w-4 h-4" />
            </button>

            <button
              id="btn-import-backup"
              onClick={onImportClick}
              className="p-1.5 rounded-lg border border-stone-200 text-stone-500 hover:text-stone-800 hover:bg-stone-50 transition-colors"
              title="Import backup (JSON)"
            >
              <Upload className="w-4 h-4" />
            </button>

            <button
              id="btn-open-new-task"
              onClick={onOpenNewTask}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-stone-900 text-white hover:bg-stone-800 text-xs font-semibold shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>New Task</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-1 overflow-x-auto no-scrollbar border-t border-stone-100">
        {views.map((v) => {
          const Icon = v.icon;
          const isActive = currentView === v.id;
          return (
            <button
              key={v.id}
              id={`nav-tab-${v.id}`}
              onClick={() => onViewChange(v.id)}
              className={`inline-flex items-center gap-2 px-3.5 py-2.5 text-xs font-semibold border-b-2 whitespace-nowrap transition-colors ${
                isActive
                  ? 'border-stone-900 text-stone-900'
                  : 'border-transparent text-stone-500 hover:text-stone-800 hover:border-stone-300'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-stone-900' : 'text-stone-400'}`} />
              <span>{v.label}</span>
              {v.id === 'today' && totalActiveCount > 0 && (
                <span className="ml-0.5 px-1.5 py-0.2 rounded-full text-[10px] bg-stone-200 text-stone-700 font-bold">
                  {totalActiveCount}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </header>
  );
};
