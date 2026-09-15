import React, { useState } from 'react';
import { Task, CategoryDef } from '../types';
import { TaskItem } from './TaskItem';
import { DEFAULT_CATEGORIES } from '../data/initialTasks';
import { FolderKanban, Plus, ChevronDown, ChevronRight, CheckCircle2 } from 'lucide-react';

interface CategoryProjectsViewProps {
  tasks: Task[];
  onAddTask: (task: Omit<Task, 'id' | 'createdAt' | 'completed' | 'subtasks' | 'completedPomodoros'>) => void;
  onToggleComplete: (id: string) => void;
  onTogglePin: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
  onStartFocus: (task: Task) => void;
  onToggleSubtask: (taskId: string, subtaskId: string) => void;
}

export const CategoryProjectsView: React.FC<CategoryProjectsViewProps> = ({
  tasks,
  onAddTask,
  onToggleComplete,
  onTogglePin,
  onDelete,
  onEdit,
  onStartFocus,
  onToggleSubtask,
}) => {
  const [collapsedCategories, setCollapsedCategories] = useState<Record<string, boolean>>({});

  const toggleCategoryCollapse = (catName: string) => {
    setCollapsedCategories((prev) => ({
      ...prev,
      [catName]: !prev[catName],
    }));
  };

  return (
    <div id="category-projects-view-container" className="space-y-6">
      <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-2xs">
        <h2 className="text-base font-bold text-stone-900 tracking-tight">Category & Project Workspaces</h2>
        <p className="text-xs text-stone-500 mt-1 max-w-xl">
          Maintain cognitive clarity by grouping life and work into intentional buckets. Track progress across each life area.
        </p>
      </div>

      <div className="space-y-5">
        {DEFAULT_CATEGORIES.map((cat) => {
          const categoryTasks = tasks.filter((t) => t.category === cat.name);
          const activeTasks = categoryTasks.filter((t) => !t.completed);
          const completedTasks = categoryTasks.filter((t) => t.completed);
          const total = categoryTasks.length;
          const completionPct = total > 0 ? Math.round((completedTasks.length / total) * 100) : 0;
          const isCollapsed = Boolean(collapsedCategories[cat.name]);

          return (
            <div
              key={cat.id}
              id={`category-section-${cat.id}`}
              className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-2xs"
            >
              {/* Category Header */}
              <div className="p-4 border-b border-stone-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-stone-50/50">
                <button
                  type="button"
                  onClick={() => toggleCategoryCollapse(cat.name)}
                  className="flex items-center gap-2.5 text-left group"
                >
                  <div className={`p-2 rounded-xl ${cat.bgLight} ${cat.color} ${cat.borderColor} border`}>
                    <FolderKanban className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-stone-900 group-hover:text-stone-700">
                        {cat.name}
                      </h3>
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-stone-200/80 text-stone-700">
                        {activeTasks.length} active
                      </span>
                    </div>
                    <div className="text-[11px] text-stone-400">
                      {completedTasks.length} completed ({completionPct}%)
                    </div>
                  </div>
                  {isCollapsed ? (
                    <ChevronRight className="w-4 h-4 text-stone-400 ml-2" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-stone-400 ml-2" />
                  )}
                </button>

                {/* Progress bar */}
                <div className="flex items-center gap-3">
                  <div className="w-32 bg-stone-200/80 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-600 h-full rounded-full transition-all duration-300"
                      style={{ width: `${completionPct}%` }}
                    />
                  </div>
                  <span className="text-[11px] font-mono font-semibold text-stone-500 w-8 text-right">
                    {completionPct}%
                  </span>
                </div>
              </div>

              {/* Category Task List */}
              {!isCollapsed && (
                <div className="p-4 space-y-3">
                  {/* Quick Add into this category */}
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      const input = e.currentTarget.elements.namedItem(`quick-add-cat-${cat.id}`) as HTMLInputElement;
                      if (!input.value.trim()) return;
                      onAddTask({
                        title: input.value.trim(),
                        category: cat.name,
                        priority: 'p2',
                        quadrant: 'q2',
                        estimatedPomodoros: 2,
                      });
                      input.value = '';
                    }}
                    className="flex items-center gap-2 mb-3"
                  >
                    <input
                      name={`quick-add-cat-${cat.id}`}
                      type="text"
                      placeholder={`+ Add task to ${cat.name}...`}
                      className="flex-1 text-xs px-3 py-1.5 bg-stone-50 border border-stone-200 rounded-lg text-stone-800 focus:outline-none focus:border-stone-400"
                    />
                    <button
                      type="submit"
                      className="p-1.5 rounded-lg bg-stone-900 text-white text-xs hover:bg-stone-800 transition-colors"
                      title="Add task"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </form>

                  {/* Tasks */}
                  {categoryTasks.length === 0 ? (
                    <p className="text-xs text-stone-400 py-3 text-center">No tasks in {cat.name} yet.</p>
                  ) : (
                    <div className="space-y-2">
                      {categoryTasks.map((t) => (
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
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
