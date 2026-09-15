import React from 'react';
import { Task, MatrixQuadrant, Priority } from '../types';
import { X, Trophy, Timer, CheckCircle2, TrendingUp, Sparkles, PieChart, ShieldAlert } from 'lucide-react';

interface ProductivityStatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  tasks: Task[];
  focusMinutesToday: number;
  totalPomodorosToday: number;
}

export const ProductivityStatsModal: React.FC<ProductivityStatsModalProps> = ({
  isOpen,
  onClose,
  tasks,
  focusMinutesToday,
  totalPomodorosToday,
}) => {
  if (!isOpen) return null;

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.completed);
  const activeTasks = tasks.filter((t) => !t.completed);

  const completionRate = totalTasks > 0 ? Math.round((completedTasks.length / totalTasks) * 100) : 0;

  // Subtask progress
  let totalSubtasks = 0;
  let completedSubtasks = 0;
  tasks.forEach((t) => {
    totalSubtasks += t.subtasks.length;
    completedSubtasks += t.subtasks.filter((s) => s.completed).length;
  });

  // Eisenhower Matrix breakdown for active tasks
  const quadrantCounts: Record<MatrixQuadrant, number> = {
    q1: activeTasks.filter((t) => t.quadrant === 'q1').length,
    q2: activeTasks.filter((t) => t.quadrant === 'q2').length,
    q3: activeTasks.filter((t) => t.quadrant === 'q3').length,
    q4: activeTasks.filter((t) => t.quadrant === 'q4').length,
  };

  const priorityCounts: Record<Priority, number> = {
    p1: activeTasks.filter((t) => t.priority === 'p1').length,
    p2: activeTasks.filter((t) => t.priority === 'p2').length,
    p3: activeTasks.filter((t) => t.priority === 'p3').length,
    p4: activeTasks.filter((t) => t.priority === 'p4').length,
  };

  return (
    <div
      id="stats-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div
        id="stats-modal-card"
        className="bg-white rounded-3xl border border-stone-200 shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto flex flex-col"
      >
        {/* Header */}
        <div className="p-5 border-b border-stone-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-stone-900 text-amber-400 flex items-center justify-center font-bold">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-stone-900">Productivity Insights</h3>
              <p className="text-[11px] text-stone-500">Intentional execution metrics</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Summary 2x2 Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/80">
              <div className="text-[11px] font-semibold text-stone-500 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Completion Rate</span>
              </div>
              <div className="text-2xl font-extrabold text-stone-900 mt-1 font-mono">{completionRate}%</div>
              <div className="text-[11px] text-stone-400 mt-0.5">
                {completedTasks.length} of {totalTasks} tasks resolved
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/80">
              <div className="text-[11px] font-semibold text-stone-500 flex items-center gap-1.5">
                <Timer className="w-3.5 h-3.5 text-amber-600" />
                <span>Focus Minutes</span>
              </div>
              <div className="text-2xl font-extrabold text-stone-900 mt-1 font-mono">{focusMinutesToday}m</div>
              <div className="text-[11px] text-stone-400 mt-0.5">
                {totalPomodorosToday} Pomodoro block{totalPomodorosToday === 1 ? '' : 's'} logged
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/80">
              <div className="text-[11px] font-semibold text-stone-500">Active Workload</div>
              <div className="text-2xl font-extrabold text-stone-900 mt-1 font-mono">{activeTasks.length}</div>
              <div className="text-[11px] text-stone-400 mt-0.5">
                {priorityCounts.p1} critical urgent
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/80">
              <div className="text-[11px] font-semibold text-stone-500">Checklist Subtasks</div>
              <div className="text-2xl font-extrabold text-stone-900 mt-1 font-mono">
                {completedSubtasks}/{totalSubtasks}
              </div>
              <div className="text-[11px] text-stone-400 mt-0.5">
                {totalSubtasks > 0 ? Math.round((completedSubtasks / totalSubtasks) * 100) : 0}% micro-steps done
              </div>
            </div>
          </div>

          {/* Eisenhower Matrix Distribution */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <h4 className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                Matrix Allocation (Active Tasks)
              </h4>
              <span className="text-[11px] text-stone-400">Target: High Q2</span>
            </div>

            <div className="space-y-2 text-xs">
              <div>
                <div className="flex justify-between text-stone-700 mb-1 font-medium">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-rose-500" />
                    <span>Q1: Do First (Urgent & Important)</span>
                  </span>
                  <span className="font-mono">{quadrantCounts.q1}</span>
                </div>
                <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-rose-500 h-full rounded-full"
                    style={{
                      width: `${activeTasks.length ? (quadrantCounts.q1 / activeTasks.length) * 100 : 0}%`,
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-stone-700 mb-1 font-medium">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-purple-500" />
                    <span>Q2: Schedule (Deep Work & Growth)</span>
                  </span>
                  <span className="font-mono">{quadrantCounts.q2}</span>
                </div>
                <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-purple-500 h-full rounded-full"
                    style={{
                      width: `${activeTasks.length ? (quadrantCounts.q2 / activeTasks.length) * 100 : 0}%`,
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-stone-700 mb-1 font-medium">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    <span>Q3: Delegate / Batching</span>
                  </span>
                  <span className="font-mono">{quadrantCounts.q3}</span>
                </div>
                <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-amber-500 h-full rounded-full"
                    style={{
                      width: `${activeTasks.length ? (quadrantCounts.q3 / activeTasks.length) * 100 : 0}%`,
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-stone-700 mb-1 font-medium">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-stone-400" />
                    <span>Q4: Backlog / Eliminate</span>
                  </span>
                  <span className="font-mono">{quadrantCounts.q4}</span>
                </div>
                <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-stone-400 h-full rounded-full"
                    style={{
                      width: `${activeTasks.length ? (quadrantCounts.q4 / activeTasks.length) * 100 : 0}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Productivity Wisdom Tip */}
          <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-xs text-amber-900 flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Productivity Rule of Thumb:</span>
              <p className="mt-0.5 text-[11px] text-amber-800 leading-relaxed">
                Aim to schedule your top 1-3 most demanding Q2 tasks during your peak morning energy window, and batch quick Q3 communications in the afternoon.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-stone-100 bg-stone-50/50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold bg-stone-900 text-white hover:bg-stone-800 rounded-xl transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
