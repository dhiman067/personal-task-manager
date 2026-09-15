/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Task, ViewMode, MatrixQuadrant } from './types';
import { 
  loadTasksFromStorage, 
  saveTasksToStorage, 
  loadFocusStats, 
  saveFocusStats, 
  exportTasksAsJSON,
  StoredFocusStats 
} from './utils/storage';
import { Header } from './components/Header';
import { TodayView } from './components/TodayView';
import { MatrixView } from './components/MatrixView';
import { AllTasksView } from './components/AllTasksView';
import { CategoryProjectsView } from './components/CategoryProjectsView';
import { CompletedView } from './components/CompletedView';
import { FocusTimerModal } from './components/FocusTimerModal';
import { TaskDetailModal } from './components/TaskDetailModal';
import { ProductivityStatsModal } from './components/ProductivityStatsModal';
import { getTodayDateString } from './data/initialTasks';
import { Sparkles, CheckCircle2, ListFilter } from 'lucide-react';

export default function App() {
  const [tasks, setTasks] = useState<Task[]>(() => loadTasksFromStorage());
  const [focusStats, setFocusStats] = useState<StoredFocusStats>(() => loadFocusStats());
  const [currentView, setCurrentView] = useState<ViewMode>('today');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [isFocusModalOpen, setIsFocusModalOpen] = useState(false);
  const [activeFocusTask, setActiveFocusTask] = useState<Task | null>(null);
  const [isTaskDetailModalOpen, setIsTaskDetailModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isStatsModalOpen, setIsStatsModalOpen] = useState(false);

  // Hidden file input for backup import
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Save tasks on changes
  useEffect(() => {
    saveTasksToStorage(tasks);
  }, [tasks]);

  // Save focus stats on changes
  useEffect(() => {
    saveFocusStats(focusStats);
  }, [focusStats]);

  // Task Mutations
  const handleAddTask = (newTaskData: Omit<Task, 'id' | 'createdAt' | 'completed' | 'subtasks' | 'completedPomodoros'>) => {
    const newTask: Task = {
      ...newTaskData,
      id: `task-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString(),
      completed: false,
      subtasks: [],
      completedPomodoros: 0,
    };
    setTasks((prev) => [newTask, ...prev]);
  };

  const handleSaveTaskDetail = (updatedTask: Task) => {
    setTasks((prev) => {
      const exists = prev.some((t) => t.id === updatedTask.id);
      if (exists) {
        return prev.map((t) => (t.id === updatedTask.id ? updatedTask : t));
      } else {
        return [updatedTask, ...prev];
      }
    });
    // If updating currently active focus task, sync it
    if (activeFocusTask && activeFocusTask.id === updatedTask.id) {
      setActiveFocusTask(updatedTask);
    }
  };

  const handleToggleComplete = (id: string) => {
    const today = getTodayDateString();
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const nextCompleted = !t.completed;
          return {
            ...t,
            completed: nextCompleted,
            completedAt: nextCompleted ? new Date().toISOString() : undefined,
          };
        }
        return t;
      })
    );
  };

  const handleTogglePin = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, pinned: !t.pinned } : t))
    );
  };

  const handleDeleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    if (activeFocusTask && activeFocusTask.id === id) {
      setActiveFocusTask(null);
    }
  };

  const handleToggleSubtask = (taskId: string, subtaskId: string) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id === taskId) {
          const updatedSubtasks = task.subtasks.map((sub) =>
            sub.id === subtaskId ? { ...sub, completed: !sub.completed } : sub
          );
          return { ...task, subtasks: updatedSubtasks };
        }
        return task;
      })
    );
  };

  const handleChangeQuadrant = (taskId: string, newQuadrant: MatrixQuadrant) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, quadrant: newQuadrant } : t))
    );
  };

  const handleClearAllCompleted = () => {
    setTasks((prev) => prev.filter((t) => !t.completed));
  };

  // Focus Timer actions
  const handleStartFocus = (task: Task) => {
    setActiveFocusTask(task);
    setIsFocusModalOpen(true);
  };

  const handleSessionCompleted = (taskId: string | null, minutes: number) => {
    // Update focus stats
    setFocusStats((prev) => {
      const today = getTodayDateString();
      const prevMinutes = prev.date === today ? prev.focusMinutes : 0;
      const prevPomodoros = prev.date === today ? prev.completedPomodoros : 0;
      const history = { ...prev.history };
      history[today] = (history[today] || 0) + minutes;

      return {
        date: today,
        focusMinutes: prevMinutes + minutes,
        completedPomodoros: prevPomodoros + 1,
        history,
      };
    });

    // If attached to a task, increment task's completedPomodoros
    if (taskId) {
      setTasks((prev) =>
        prev.map((t) =>
          t.id === taskId
            ? { ...t, completedPomodoros: (t.completedPomodoros || 0) + 1 }
            : t
        )
      );
      if (activeFocusTask && activeFocusTask.id === taskId) {
        setActiveFocusTask((prev) =>
          prev ? { ...prev, completedPomodoros: (prev.completedPomodoros || 0) + 1 } : null
        );
      }
    }
  };

  // Export / Import
  const handleExport = () => {
    exportTasksAsJSON(tasks);
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (Array.isArray(parsed)) {
          setTasks(parsed);
          alert(`Successfully imported ${parsed.length} tasks!`);
        } else {
          alert('Invalid backup file format: expected an array of tasks.');
        }
      } catch (err) {
        alert('Could not parse the backup JSON file.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Metrics calculations
  const todayStr = getTodayDateString();
  const completedTodayCount = useMemo(() => {
    return tasks.filter(
      (t) => t.completed && t.completedAt && t.completedAt.startsWith(todayStr)
    ).length;
  }, [tasks, todayStr]);

  const activeTasks = useMemo(() => tasks.filter((t) => !t.completed), [tasks]);

  // Global search filtering
  const visibleTasks = useMemo(() => {
    if (!searchQuery.trim()) return tasks;
    const q = searchQuery.toLowerCase();
    return tasks.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        (t.notes && t.notes.toLowerCase().includes(q)) ||
        t.category.toLowerCase().includes(q)
    );
  }, [tasks, searchQuery]);

  return (
    <div className="min-h-screen bg-stone-50/60 text-stone-900 flex flex-col">
      {/* Hidden File Input for Backup Import */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImportFile}
        accept=".json,application/json"
        className="hidden"
      />

      {/* Main App Navigation Header */}
      <Header
        currentView={currentView}
        onViewChange={(v) => {
          setCurrentView(v);
          setSearchQuery('');
        }}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        completedTodayCount={completedTodayCount}
        totalActiveCount={activeTasks.length}
        focusMinutesToday={focusStats.focusMinutes}
        onOpenNewTask={() => {
          setEditingTask(null);
          setIsTaskDetailModalOpen(true);
        }}
        onOpenFocusTimer={() => setIsFocusModalOpen(true)}
        onOpenStats={() => setIsStatsModalOpen(true)}
        onExport={handleExport}
        onImportClick={() => fileInputRef.current?.click()}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* If searching, render a dedicated search results header */}
        {searchQuery.trim() && (
          <div className="mb-6 p-4 bg-white rounded-xl border border-stone-200 flex items-center justify-between shadow-2xs">
            <div className="flex items-center gap-2 text-xs">
              <span className="font-bold text-stone-700">Search results for:</span>
              <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-semibold">
                "{searchQuery}"
              </span>
              <span className="text-stone-400">({visibleTasks.length} found)</span>
            </div>
            <button
              onClick={() => setSearchQuery('')}
              className="text-xs font-semibold text-stone-500 hover:text-stone-900"
            >
              Clear search
            </button>
          </div>
        )}

        {/* View Switcher */}
        {currentView === 'today' && (
          <TodayView
            tasks={visibleTasks}
            onAddTask={handleAddTask}
            onToggleComplete={handleToggleComplete}
            onTogglePin={handleTogglePin}
            onDelete={handleDeleteTask}
            onEdit={(t) => {
              setEditingTask(t);
              setIsTaskDetailModalOpen(true);
            }}
            onStartFocus={handleStartFocus}
            onToggleSubtask={handleToggleSubtask}
          />
        )}

        {currentView === 'matrix' && (
          <MatrixView
            tasks={visibleTasks}
            onAddTask={handleAddTask}
            onToggleComplete={handleToggleComplete}
            onTogglePin={handleTogglePin}
            onDelete={handleDeleteTask}
            onEdit={(t) => {
              setEditingTask(t);
              setIsTaskDetailModalOpen(true);
            }}
            onStartFocus={handleStartFocus}
            onToggleSubtask={handleToggleSubtask}
            onChangeQuadrant={handleChangeQuadrant}
          />
        )}

        {currentView === 'all' && (
          <AllTasksView
            tasks={visibleTasks}
            onAddTask={handleAddTask}
            onToggleComplete={handleToggleComplete}
            onTogglePin={handleTogglePin}
            onDelete={handleDeleteTask}
            onEdit={(t) => {
              setEditingTask(t);
              setIsTaskDetailModalOpen(true);
            }}
            onStartFocus={handleStartFocus}
            onToggleSubtask={handleToggleSubtask}
          />
        )}

        {currentView === 'projects' && (
          <CategoryProjectsView
            tasks={visibleTasks}
            onAddTask={handleAddTask}
            onToggleComplete={handleToggleComplete}
            onTogglePin={handleTogglePin}
            onDelete={handleDeleteTask}
            onEdit={(t) => {
              setEditingTask(t);
              setIsTaskDetailModalOpen(true);
            }}
            onStartFocus={handleStartFocus}
            onToggleSubtask={handleToggleSubtask}
          />
        )}

        {currentView === 'completed' && (
          <CompletedView
            tasks={visibleTasks}
            onToggleComplete={handleToggleComplete}
            onDelete={handleDeleteTask}
            onEdit={(t) => {
              setEditingTask(t);
              setIsTaskDetailModalOpen(true);
            }}
            onClearAllCompleted={handleClearAllCompleted}
          />
        )}
      </main>

      {/* Focus Timer Modal (Pomodoro / Deep Work) */}
      <FocusTimerModal
        isOpen={isFocusModalOpen}
        onClose={() => setIsFocusModalOpen(false)}
        activeTask={activeFocusTask}
        onSessionCompleted={handleSessionCompleted}
        onToggleCompleteTask={(id) => {
          handleToggleComplete(id);
          setIsFocusModalOpen(false);
        }}
        allActiveTasks={activeTasks}
        onSelectActiveTask={(task) => setActiveFocusTask(task)}
      />

      {/* Task Create / Edit Detail Modal */}
      <TaskDetailModal
        isOpen={isTaskDetailModalOpen}
        onClose={() => {
          setIsTaskDetailModalOpen(false);
          setEditingTask(null);
        }}
        task={editingTask}
        onSave={handleSaveTaskDetail}
        onDelete={handleDeleteTask}
      />

      {/* Productivity Insights / Stats Modal */}
      <ProductivityStatsModal
        isOpen={isStatsModalOpen}
        onClose={() => setIsStatsModalOpen(false)}
        tasks={tasks}
        focusMinutesToday={focusStats.focusMinutes}
        totalPomodorosToday={focusStats.completedPomodoros}
      />

      {/* Subtle Footer */}
      <footer className="border-t border-stone-200 bg-white py-4 mt-12 text-center text-xs text-stone-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Personal Task Manager &middot; Designed for intentional productivity</span>
          <div className="flex items-center gap-4 text-stone-500">
            <span>Local data storage active</span>
            <span>&middot;</span>
            <button
              onClick={handleExport}
              className="hover:text-stone-800 underline transition-colors"
            >
              Export JSON Backup
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
