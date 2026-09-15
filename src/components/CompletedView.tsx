import React from 'react';
import { Task } from '../types';
import { TaskItem } from './TaskItem';
import { CheckCircle2, Trash2, RotateCcw } from 'lucide-react';

interface CompletedViewProps {
  tasks: Task[];
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
  onClearAllCompleted: () => void;
}

export const CompletedView: React.FC<CompletedViewProps> = ({
  tasks,
  onToggleComplete,
  onDelete,
  onEdit,
  onClearAllCompleted,
}) => {
  const completedTasks = tasks
    .filter((t) => t.completed)
    .sort((a, b) => {
      const timeA = a.completedAt ? new Date(a.completedAt).getTime() : 0;
      const timeB = b.completedAt ? new Date(b.completedAt).getTime() : 0;
      return timeB - timeA;
    });

  return (
    <div id="completed-view-container" className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-2xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-stone-900 tracking-tight">Completed Archive</h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              {completedTasks.length} archived
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Review completed work, track retrospective progress, or restore items back to your active workflow.
          </p>
        </div>

        {completedTasks.length > 0 && (
          <button
            onClick={() => {
              if (window.confirm('Clear all completed tasks from archive?')) {
                onClearAllCompleted();
              }
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-semibold transition-colors self-start sm:self-auto"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Completed</span>
          </button>
        )}
      </div>

      {/* List */}
      {completedTasks.length === 0 ? (
        <div className="bg-white rounded-xl border border-dashed border-stone-300 p-10 text-center">
          <div className="w-12 h-12 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center mx-auto mb-3">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-semibold text-stone-800">No completed tasks yet</h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto mt-1">
            Tasks marked as done in Today or Priority Matrix views will be archived here.
          </p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {completedTasks.map((t) => (
            <TaskItem
              key={t.id}
              task={t}
              onToggleComplete={onToggleComplete}
              onDelete={onDelete}
              onEdit={onEdit}
              onStartFocus={() => {}}
            />
          ))}
        </div>
      )}
    </div>
  );
};
