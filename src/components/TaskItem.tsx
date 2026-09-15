import React, { useState } from 'react';
import { Task, Priority, MatrixQuadrant } from '../types';
import { 
  Check, 
  Clock, 
  Calendar, 
  Pin, 
  MoreVertical, 
  Play, 
  CheckSquare, 
  ChevronDown, 
  ChevronRight,
  Trash2,
  Edit3
} from 'lucide-react';
import { getTodayDateString } from '../data/initialTasks';

interface TaskItemProps {
  task: Task;
  onToggleComplete: (id: string) => void;
  onTogglePin?: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
  onStartFocus: (task: Task) => void;
  onToggleSubtask?: (taskId: string, subtaskId: string) => void;
}

export const getPriorityBadge = (priority: Priority) => {
  switch (priority) {
    case 'p1':
      return { label: 'P1 Urgent', bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200' };
    case 'p2':
      return { label: 'P2 High', bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' };
    case 'p3':
      return { label: 'P3 Medium', bg: 'bg-sky-50', text: 'text-sky-700', border: 'border-sky-200' };
    case 'p4':
    default:
      return { label: 'P4 Low', bg: 'bg-stone-100', text: 'text-stone-600', border: 'border-stone-200' };
  }
};

export const getQuadrantLabel = (quadrant: MatrixQuadrant) => {
  switch (quadrant) {
    case 'q1':
      return { label: 'Do First', hint: 'Urgent & Important' };
    case 'q2':
      return { label: 'Schedule', hint: 'Not Urgent & Important' };
    case 'q3':
      return { label: 'Delegate', hint: 'Urgent & Not Important' };
    case 'q4':
      return { label: 'Backlog', hint: 'Neither' };
  }
};

export const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onToggleComplete,
  onTogglePin,
  onDelete,
  onEdit,
  onStartFocus,
  onToggleSubtask,
}) => {
  const [subtasksExpanded, setSubtasksExpanded] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const priorityBadge = getPriorityBadge(task.priority);
  const quadrantInfo = getQuadrantLabel(task.quadrant);
  const today = getTodayDateString();

  const isOverdue = task.dueDate && !task.completed && task.dueDate < today;
  const isDueToday = task.dueDate && task.dueDate === today;

  const completedSubtasks = task.subtasks.filter((s) => s.completed).length;
  const totalSubtasks = task.subtasks.length;

  return (
    <div
      id={`task-item-${task.id}`}
      className={`group relative rounded-xl border bg-white p-4 transition-all duration-150 ${
        task.completed
          ? 'border-stone-200 bg-stone-50/70 opacity-75'
          : task.pinned
          ? 'border-stone-300 ring-1 ring-stone-900/5 shadow-xs'
          : 'border-stone-200 hover:border-stone-300 hover:shadow-xs'
      }`}
    >
      <div className="flex items-start gap-3.5">
        {/* Custom Checkbox */}
        <button
          id={`btn-toggle-task-${task.id}`}
          onClick={() => onToggleComplete(task.id)}
          aria-label={task.completed ? 'Mark task incomplete' : 'Mark task completed'}
          className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
            task.completed
              ? 'bg-emerald-600 border-emerald-600 text-white'
              : 'border-stone-300 hover:border-stone-500 bg-stone-50'
          }`}
        >
          {task.completed && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
        </button>

        {/* Content Body */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <div className="flex items-center gap-2 flex-wrap">
              {/* Category pill */}
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 border border-stone-200">
                {task.category}
              </span>

              {/* Priority badge */}
              <span
                className={`text-[11px] font-semibold px-2 py-0.5 rounded-md border ${priorityBadge.bg} ${priorityBadge.text} ${priorityBadge.border}`}
              >
                {priorityBadge.label}
              </span>

              {/* Quadrant badge */}
              <span 
                title={`Eisenhower: ${quadrantInfo.hint}`}
                className="hidden sm:inline-block text-[11px] font-medium px-2 py-0.5 rounded-md bg-stone-100 text-stone-600 border border-stone-200"
              >
                {quadrantInfo.label}
              </span>

              {/* Pinned icon */}
              {task.pinned && (
                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded-md">
                  <Pin className="w-3 h-3 fill-amber-700" />
                  <span className="hidden xs:inline">Pinned</span>
                </span>
              )}
            </div>

            {/* Quick Actions (Desktop Hover & Mobile Dropdown) */}
            <div className="flex items-center gap-1">
              {!task.completed && (
                <button
                  id={`btn-start-focus-${task.id}`}
                  onClick={() => onStartFocus(task)}
                  className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-amber-100 hover:text-amber-900 border border-stone-200 hover:border-amber-300 transition-colors"
                  title="Start Focus Timer for this task"
                >
                  <Play className="w-3 h-3 text-amber-600 fill-amber-600" />
                  <span className="hidden sm:inline">Focus</span>
                  {task.estimatedPomodoros > 0 && (
                    <span className="text-[10px] text-stone-500 font-mono">
                      {task.completedPomodoros}/{task.estimatedPomodoros}
                    </span>
                  )}
                </button>
              )}

              {onTogglePin && (
                <button
                  id={`btn-pin-${task.id}`}
                  onClick={() => onTogglePin(task.id)}
                  aria-label={task.pinned ? 'Unpin task' : 'Pin task to top'}
                  className={`p-1.5 rounded-md transition-colors ${
                    task.pinned ? 'text-amber-700 bg-amber-50' : 'text-stone-400 hover:text-stone-700 hover:bg-stone-100'
                  }`}
                  title={task.pinned ? 'Unpin task' : 'Pin to top'}
                >
                  <Pin className={`w-3.5 h-3.5 ${task.pinned ? 'fill-current' : ''}`} />
                </button>
              )}

              <button
                id={`btn-edit-${task.id}`}
                onClick={() => onEdit(task)}
                aria-label="Edit task details"
                className="p-1.5 rounded-md text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
                title="Edit task"
              >
                <Edit3 className="w-3.5 h-3.5" />
              </button>

              <button
                id={`btn-delete-${task.id}`}
                onClick={() => onDelete(task.id)}
                aria-label="Delete task"
                className="p-1.5 rounded-md text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                title="Delete task"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Title */}
          <h2
            onClick={() => onEdit(task)}
            className={`text-sm font-semibold cursor-pointer transition-colors ${
              task.completed
                ? 'line-through text-stone-400'
                : 'text-stone-900 hover:text-stone-700'
            }`}
          >
            {task.title}
          </h2>

          {/* Notes summary */}
          {task.notes && (
            <p className={`text-xs mt-1 text-stone-500 line-clamp-2 ${task.completed ? 'opacity-60' : ''}`}>
              {task.notes}
            </p>
          )}

          {/* Meta footer: Due date, time, subtasks */}
          <div className="flex items-center flex-wrap gap-3 mt-2.5 text-xs text-stone-500">
            {task.dueDate && (
              <div
                className={`inline-flex items-center gap-1 font-medium ${
                  isOverdue
                    ? 'text-rose-600'
                    : isDueToday
                    ? 'text-amber-700 font-semibold'
                    : 'text-stone-600'
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>
                  {isDueToday
                    ? 'Due Today'
                    : isOverdue
                    ? `Overdue (${task.dueDate})`
                    : `Due ${task.dueDate}`}
                </span>
                {task.dueTime && (
                  <span className="flex items-center gap-0.5 ml-1 text-stone-500 font-normal">
                    <Clock className="w-3 h-3" />
                    <span>{task.dueTime}</span>
                  </span>
                )}
              </div>
            )}

            {/* Subtasks summary & toggle */}
            {totalSubtasks > 0 && (
              <button
                id={`btn-toggle-subtasks-${task.id}`}
                onClick={() => setSubtasksExpanded(!subtasksExpanded)}
                className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors"
              >
                <CheckSquare className="w-3.5 h-3.5 text-stone-500" />
                <span>
                  {completedSubtasks}/{totalSubtasks} subtasks
                </span>
                {subtasksExpanded ? (
                  <ChevronDown className="w-3 h-3 text-stone-400" />
                ) : (
                  <ChevronRight className="w-3 h-3 text-stone-400" />
                )}
              </button>
            )}

            {/* Pomodoro indicator */}
            {task.completedPomodoros > 0 && (
              <span className="inline-flex items-center gap-1 text-[11px] text-stone-500 font-medium bg-stone-100 px-1.5 py-0.5 rounded">
                ⏱ {task.completedPomodoros} session{task.completedPomodoros > 1 ? 's' : ''} logged
              </span>
            )}
          </div>

          {/* Expandable inline subtasks list */}
          {subtasksExpanded && totalSubtasks > 0 && (
            <div className="mt-3 pl-2 border-l-2 border-stone-200 space-y-1.5 py-1">
              {task.subtasks.map((sub) => (
                <div
                  key={sub.id}
                  id={`subtask-item-${sub.id}`}
                  className="flex items-center gap-2 text-xs text-stone-700"
                >
                  <input
                    type="checkbox"
                    id={`subtask-checkbox-${sub.id}`}
                    checked={sub.completed}
                    onChange={() => onToggleSubtask && onToggleSubtask(task.id, sub.id)}
                    className="w-3.5 h-3.5 rounded border-stone-300 text-stone-900 focus:ring-stone-400 cursor-pointer"
                  />
                  <label
                    htmlFor={`subtask-checkbox-${sub.id}`}
                    className={`cursor-pointer ${sub.completed ? 'line-through text-stone-400' : 'text-stone-800'}`}
                  >
                    {sub.title}
                  </label>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
