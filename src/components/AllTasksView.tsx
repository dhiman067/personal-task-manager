import React, { useState, useMemo } from 'react';
import { Task, Priority } from '../types';
import { TaskItem } from './TaskItem';
import { QuickAddTask } from './QuickAddTask';
import { DEFAULT_CATEGORIES } from '../data/initialTasks';
import { Filter, ArrowUpDown, CheckCircle2, ListFilter } from 'lucide-react';

interface AllTasksViewProps {
  tasks: Task[];
  onAddTask: (task: Omit<Task, 'id' | 'createdAt' | 'completed' | 'subtasks' | 'completedPomodoros'>) => void;
  onToggleComplete: (id: string) => void;
  onTogglePin: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
  onStartFocus: (task: Task) => void;
  onToggleSubtask: (taskId: string, subtaskId: string) => void;
}

type SortOption = 'priority' | 'dueDate' | 'newest';

export const AllTasksView: React.FC<AllTasksViewProps> = ({
  tasks,
  onAddTask,
  onToggleComplete,
  onTogglePin,
  onDelete,
  onEdit,
  onStartFocus,
  onToggleSubtask,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [sortBy, setSortBy] = useState<SortOption>('priority');

  const filteredTasks = useMemo(() => {
    return tasks
      .filter((t) => !t.completed)
      .filter((t) => {
        if (selectedCategory !== 'all' && t.category !== selectedCategory) return false;
        if (selectedPriority !== 'all' && t.priority !== selectedPriority) return false;
        return true;
      })
      .sort((a, b) => {
        if (a.pinned && !b.pinned) return -1;
        if (!a.pinned && b.pinned) return 1;

        if (sortBy === 'priority') {
          const priorityOrder: Record<Priority, number> = { p1: 1, p2: 2, p3: 3, p4: 4 };
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        } else if (sortBy === 'dueDate') {
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return a.dueDate.localeCompare(b.dueDate);
        } else {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
      });
  }, [tasks, selectedCategory, selectedPriority, sortBy]);

  return (
    <div id="all-tasks-view-container" className="space-y-6">
      {/* Quick Add */}
      <div>
        <QuickAddTask
          onAddTask={onAddTask}
          placeholder="Capture any task or action item..."
        />
      </div>

      {/* Filter and Sort Bar */}
      <div className="bg-white rounded-xl border border-stone-200 p-3.5 flex flex-wrap items-center justify-between gap-3 text-xs shadow-2xs">
        <div className="flex flex-wrap items-center gap-2">
          {/* Category Filter */}
          <div className="flex items-center gap-1">
            <span className="text-stone-400 font-medium">Category:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-stone-50 border border-stone-200 rounded-lg px-2.5 py-1 text-stone-700 font-medium cursor-pointer"
            >
              <option value="all">All Categories</option>
              {DEFAULT_CATEGORIES.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Priority Filter */}
          <div className="flex items-center gap-1">
            <span className="text-stone-400 font-medium">Priority:</span>
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="bg-stone-50 border border-stone-200 rounded-lg px-2.5 py-1 text-stone-700 font-medium cursor-pointer"
            >
              <option value="all">All Priorities</option>
              <option value="p1">P1 Urgent</option>
              <option value="p2">P2 High</option>
              <option value="p3">P3 Medium</option>
              <option value="p4">P4 Low</option>
            </select>
          </div>
        </div>

        {/* Sort selector */}
        <div className="flex items-center gap-1.5">
          <ArrowUpDown className="w-3.5 h-3.5 text-stone-400" />
          <span className="text-stone-400 font-medium">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="bg-stone-50 border border-stone-200 rounded-lg px-2.5 py-1 text-stone-700 font-medium cursor-pointer"
          >
            <option value="priority">Priority First</option>
            <option value="dueDate">Due Date</option>
            <option value="newest">Recently Created</option>
          </select>
        </div>
      </div>

      {/* Task Count & List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-stone-500 font-medium">
          <span>Active Tasks ({filteredTasks.length})</span>
          {(selectedCategory !== 'all' || selectedPriority !== 'all') && (
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSelectedPriority('all');
              }}
              className="text-stone-600 hover:text-stone-900 underline"
            >
              Reset filters
            </button>
          )}
        </div>

        {filteredTasks.length === 0 ? (
          <div className="bg-white rounded-xl border border-dashed border-stone-300 p-8 text-center">
            <p className="text-xs font-semibold text-stone-700">No matching tasks found</p>
            <p className="text-[11px] text-stone-400 mt-1">Adjust filters or create a new task above.</p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {filteredTasks.map((t) => (
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
    </div>
  );
};
