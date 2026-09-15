import React from 'react';
import { Task, MatrixQuadrant } from '../types';
import { TaskItem } from './TaskItem';
import { Plus, ArrowRightLeft, ShieldAlert, Sparkles, PhoneCall, Trash2 } from 'lucide-react';

interface MatrixViewProps {
  tasks: Task[];
  onAddTask: (task: Omit<Task, 'id' | 'createdAt' | 'completed' | 'subtasks' | 'completedPomodoros'>) => void;
  onToggleComplete: (id: string) => void;
  onTogglePin: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
  onStartFocus: (task: Task) => void;
  onToggleSubtask: (taskId: string, subtaskId: string) => void;
  onChangeQuadrant: (taskId: string, newQuadrant: MatrixQuadrant) => void;
}

export const MatrixView: React.FC<MatrixViewProps> = ({
  tasks,
  onAddTask,
  onToggleComplete,
  onTogglePin,
  onDelete,
  onEdit,
  onStartFocus,
  onToggleSubtask,
  onChangeQuadrant,
}) => {
  const activeTasks = tasks.filter((t) => !t.completed);

  const quadrants: {
    id: MatrixQuadrant;
    title: string;
    subtitle: string;
    description: string;
    badgeColor: string;
    headerBg: string;
    icon: React.ComponentType<{ className?: string }>;
    defaultPriority: 'p1' | 'p2' | 'p3' | 'p4';
  }[] = [
    {
      id: 'q1',
      title: 'Do First',
      subtitle: 'Urgent & Important',
      description: 'Pressing deadlines, critical roadblocks, and emergencies.',
      badgeColor: 'bg-rose-100 text-rose-800 border-rose-200',
      headerBg: 'bg-rose-50/60 border-rose-100',
      icon: ShieldAlert,
      defaultPriority: 'p1',
    },
    {
      id: 'q2',
      title: 'Schedule (Deep Work)',
      subtitle: 'Important, Not Urgent',
      description: 'Strategic planning, proactive development, learning, and self-care.',
      badgeColor: 'bg-purple-100 text-purple-800 border-purple-200',
      headerBg: 'bg-purple-50/60 border-purple-100',
      icon: Sparkles,
      defaultPriority: 'p2',
    },
    {
      id: 'q3',
      title: 'Delegate / Quick Wins',
      subtitle: 'Urgent, Not Important',
      description: 'Quick favors, routine emails, interruptions, or batch tasks.',
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
      headerBg: 'bg-amber-50/60 border-amber-100',
      icon: PhoneCall,
      defaultPriority: 'p3',
    },
    {
      id: 'q4',
      title: 'Eliminate / Backlog',
      subtitle: 'Neither Urgent nor Important',
      description: 'Low-impact requests, low priority ideas, or deferred backlog items.',
      badgeColor: 'bg-stone-100 text-stone-700 border-stone-200',
      headerBg: 'bg-stone-100/70 border-stone-200',
      icon: Trash2,
      defaultPriority: 'p4',
    },
  ];

  return (
    <div id="eisenhower-matrix-container" className="space-y-6">
      {/* Intro Header */}
      <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-2xs">
        <h2 className="text-base font-bold text-stone-900 tracking-tight">Eisenhower Priority Matrix</h2>
        <p className="text-xs text-stone-500 mt-1 max-w-2xl">
          High-productivity individuals invest 60–70% of their effort in <strong>Q2 (Schedule / Deep Work)</strong> to prevent crises before they happen, while knocking out <strong>Q1 (Do First)</strong> with focused precision.
        </p>
      </div>

      {/* 2x2 Responsive Matrix Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {quadrants.map((q) => {
          const Icon = q.icon;
          const quadrantTasks = activeTasks.filter((t) => t.quadrant === q.id);

          return (
            <div
              key={q.id}
              id={`quadrant-card-${q.id}`}
              className="bg-white rounded-2xl border border-stone-200 flex flex-col min-h-[380px] shadow-2xs overflow-hidden"
            >
              {/* Quadrant Header */}
              <div className={`p-4 border-b ${q.headerBg} flex items-start justify-between gap-3`}>
                <div className="flex items-start gap-2.5">
                  <div className={`p-1.5 rounded-lg ${q.badgeColor} border`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-stone-900">{q.title}</h3>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-white/90 text-stone-700 border border-stone-200/80 shadow-2xs">
                        {quadrantTasks.length}
                      </span>
                    </div>
                    <div className="text-[11px] font-semibold text-stone-600 mt-0.5">{q.subtitle}</div>
                    <p className="text-[11px] text-stone-500 mt-0.5">{q.description}</p>
                  </div>
                </div>
              </div>

              {/* Quadrant Tasks List */}
              <div className="p-3.5 flex-1 space-y-2.5 overflow-y-auto max-h-[460px]">
                {quadrantTasks.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center py-10 text-center text-stone-400">
                    <p className="text-xs font-medium">No tasks in this quadrant</p>
                    <p className="text-[11px] text-stone-400 mt-0.5">Use quick add below to file here</p>
                  </div>
                ) : (
                  quadrantTasks.map((task) => (
                    <div key={task.id} className="relative group/matrix-item">
                      <TaskItem
                        task={task}
                        onToggleComplete={onToggleComplete}
                        onTogglePin={onTogglePin}
                        onDelete={onDelete}
                        onEdit={onEdit}
                        onStartFocus={onStartFocus}
                        onToggleSubtask={onToggleSubtask}
                      />

                      {/* Move to another quadrant quick switcher */}
                      <div className="mt-1 flex items-center justify-end gap-1 text-[10px] text-stone-400 pr-1">
                        <span>Move to:</span>
                        {(['q1', 'q2', 'q3', 'q4'] as MatrixQuadrant[])
                          .filter((targetQ) => targetQ !== q.id)
                          .map((targetQ) => {
                            const labels: Record<MatrixQuadrant, string> = {
                              q1: 'Q1 Do',
                              q2: 'Q2 Schedule',
                              q3: 'Q3 Delegate',
                              q4: 'Q4 Backlog',
                            };
                            return (
                              <button
                                key={targetQ}
                                onClick={() => onChangeQuadrant(task.id, targetQ)}
                                className="px-1.5 py-0.5 rounded bg-stone-100 hover:bg-stone-200 text-stone-600 font-medium transition-colors"
                              >
                                {labels[targetQ]}
                              </button>
                            );
                          })}
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Quick Add at bottom of quadrant */}
              <div className="p-3 border-t border-stone-100 bg-stone-50/50">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const input = (e.currentTarget.elements.namedItem(`quick-add-${q.id}`) as HTMLInputElement);
                    if (!input.value.trim()) return;
                    onAddTask({
                      title: input.value.trim(),
                      priority: q.defaultPriority,
                      quadrant: q.id,
                      category: 'Work',
                      estimatedPomodoros: q.id === 'q1' || q.id === 'q2' ? 2 : 1,
                    });
                    input.value = '';
                  }}
                  className="flex items-center gap-2"
                >
                  <input
                    name={`quick-add-${q.id}`}
                    type="text"
                    placeholder={`+ Add to ${q.title}...`}
                    className="w-full text-xs px-3 py-1.5 bg-white border border-stone-200 rounded-lg text-stone-800 placeholder-stone-400 focus:outline-none focus:border-stone-400"
                  />
                  <button
                    type="submit"
                    className="p-1.5 rounded-lg bg-stone-900 text-white hover:bg-stone-800 flex-shrink-0"
                    title="Add task"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </form>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
