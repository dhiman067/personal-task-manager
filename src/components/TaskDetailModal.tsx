import React, { useState, useEffect } from 'react';
import { Task, Priority, MatrixQuadrant, Subtask } from '../types';
import { DEFAULT_CATEGORIES } from '../data/initialTasks';
import { X, Plus, Trash2, Calendar, Clock, Flag, Folder, Pin, Check } from 'lucide-react';

interface TaskDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null; // null means create new task
  onSave: (task: Task) => void;
  onDelete?: (id: string) => void;
}

export const TaskDetailModal: React.FC<TaskDetailModalProps> = ({
  isOpen,
  onClose,
  task,
  onSave,
  onDelete,
}) => {
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [dueTime, setDueTime] = useState('');
  const [priority, setPriority] = useState<Priority>('p2');
  const [quadrant, setQuadrant] = useState<MatrixQuadrant>('q2');
  const [category, setCategory] = useState('Work');
  const [subtasks, setSubtasks] = useState<Subtask[]>([]);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [estimatedPomodoros, setEstimatedPomodoros] = useState(1);
  const [pinned, setPinned] = useState(false);

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setNotes(task.notes || '');
      setDueDate(task.dueDate || '');
      setDueTime(task.dueTime || '');
      setPriority(task.priority);
      setQuadrant(task.quadrant);
      setCategory(task.category);
      setSubtasks(task.subtasks || []);
      setEstimatedPomodoros(task.estimatedPomodoros || 1);
      setPinned(Boolean(task.pinned));
    } else {
      // Reset defaults for new task
      setTitle('');
      setNotes('');
      setDueDate(new Date().toISOString().split('T')[0]);
      setDueTime('');
      setPriority('p2');
      setQuadrant('q2');
      setCategory('Work');
      setSubtasks([]);
      setEstimatedPomodoros(1);
      setPinned(false);
    }
  }, [task, isOpen]);

  const handleAddSubtask = () => {
    if (!newSubtaskTitle.trim()) return;
    const newSub: Subtask = {
      id: `sub-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      title: newSubtaskTitle.trim(),
      completed: false,
    };
    setSubtasks([...subtasks, newSub]);
    setNewSubtaskTitle('');
  };

  const handleToggleSubtask = (id: string) => {
    setSubtasks(subtasks.map((s) => (s.id === id ? { ...s, completed: !s.completed } : s)));
  };

  const handleDeleteSubtask = (id: string) => {
    setSubtasks(subtasks.filter((s) => s.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const savedTask: Task = {
      id: task ? task.id : `task-${Date.now()}`,
      title: title.trim(),
      notes: notes.trim() || undefined,
      completed: task ? task.completed : false,
      completedAt: task ? task.completedAt : undefined,
      createdAt: task ? task.createdAt : new Date().toISOString(),
      dueDate: dueDate || undefined,
      dueTime: dueTime || undefined,
      priority,
      quadrant,
      category,
      subtasks,
      estimatedPomodoros: Math.max(1, estimatedPomodoros),
      completedPomodoros: task ? task.completedPomodoros : 0,
      pinned,
    };

    onSave(savedTask);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      id="task-detail-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div
        id="task-detail-modal-card"
        className="bg-white rounded-3xl border border-stone-200 shadow-xl w-full max-w-xl max-h-[90vh] overflow-y-auto flex flex-col"
      >
        <form onSubmit={handleSubmit} className="flex flex-col flex-1">
          {/* Header */}
          <div className="p-5 border-b border-stone-100 flex items-center justify-between">
            <h3 className="text-base font-bold text-stone-900">
              {task ? 'Edit Task' : 'Create New Task'}
            </h3>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Form Body */}
          <div className="p-5 space-y-4 flex-1">
            {/* Title */}
            <div>
              <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider mb-1.5">
                Task Title *
              </label>
              <input
                id="task-form-title-input"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="What needs to be accomplished?"
                required
                autoFocus
                className="w-full px-3.5 py-2 text-sm bg-stone-50 border border-stone-200 rounded-xl text-stone-900 focus:outline-none focus:ring-2 focus:ring-stone-400 focus:bg-white transition-all font-medium"
              />
            </div>

            {/* Notes / Description */}
            <div>
              <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider mb-1.5">
                Notes & Context
              </label>
              <textarea
                id="task-form-notes-input"
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add sub-points, requirements, or links..."
                className="w-full px-3.5 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl text-stone-900 focus:outline-none focus:ring-2 focus:ring-stone-400 focus:bg-white transition-all resize-y"
              />
            </div>

            {/* Priority & Eisenhower Quadrant Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Priority */}
              <div>
                <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Flag className="w-3.5 h-3.5 text-stone-400" />
                  <span>Priority Level</span>
                </label>
                <select
                  id="task-form-priority-select"
                  value={priority}
                  onChange={(e) => {
                    const val = e.target.value as Priority;
                    setPriority(val);
                    if (val === 'p1') setQuadrant('q1');
                    else if (val === 'p2') setQuadrant('q2');
                    else if (val === 'p3') setQuadrant('q3');
                    else setQuadrant('q4');
                  }}
                  className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl text-stone-800 font-medium focus:outline-none focus:border-stone-400 cursor-pointer"
                >
                  <option value="p1">P1 - Urgent & Critical</option>
                  <option value="p2">P2 - High Priority</option>
                  <option value="p3">P3 - Medium Priority</option>
                  <option value="p4">P4 - Low / Someday</option>
                </select>
              </div>

              {/* Eisenhower Matrix Quadrant */}
              <div>
                <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider mb-1.5">
                  Eisenhower Quadrant
                </label>
                <select
                  id="task-form-quadrant-select"
                  value={quadrant}
                  onChange={(e) => setQuadrant(e.target.value as MatrixQuadrant)}
                  className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl text-stone-800 font-medium focus:outline-none focus:border-stone-400 cursor-pointer"
                >
                  <option value="q1">Q1: Do First (Urgent & Important)</option>
                  <option value="q2">Q2: Schedule (Important, Not Urgent)</option>
                  <option value="q3">Q3: Delegate (Urgent, Not Important)</option>
                  <option value="q4">Q4: Backlog (Neither)</option>
                </select>
              </div>
            </div>

            {/* Category & Date Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Category */}
              <div>
                <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Folder className="w-3.5 h-3.5 text-stone-400" />
                  <span>Category / Area</span>
                </label>
                <select
                  id="task-form-category-select"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl text-stone-800 font-medium focus:outline-none focus:border-stone-400 cursor-pointer"
                >
                  {DEFAULT_CATEGORIES.map((cat) => (
                    <option key={cat.id} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Due Date & Time */}
              <div>
                <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-stone-400" />
                  <span>Due Date & Time</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="date"
                    id="task-form-duedate-input"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="flex-1 px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl text-stone-800 focus:outline-none focus:border-stone-400 cursor-pointer"
                  />
                  <input
                    type="time"
                    id="task-form-duetime-input"
                    value={dueTime}
                    onChange={(e) => setDueTime(e.target.value)}
                    className="w-24 px-2 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl text-stone-800 focus:outline-none focus:border-stone-400 cursor-pointer"
                    placeholder="Time"
                  />
                </div>
              </div>
            </div>

            {/* Pomodoro Focus Sessions Estimate & Pin */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-stone-600 uppercase tracking-wider">
                  Target Focus Blocks:
                </span>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 6].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setEstimatedPomodoros(num)}
                      className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-colors ${
                        estimatedPomodoros === num
                          ? 'bg-amber-100 text-amber-900 border border-amber-300 font-bold'
                          : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                      }`}
                    >
                      {num * 25}m
                    </button>
                  ))}
                </div>
              </div>

              {/* Pin Toggle */}
              <button
                type="button"
                onClick={() => setPinned(!pinned)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                  pinned
                    ? 'bg-amber-50 text-amber-800 border-amber-200 font-semibold'
                    : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
                }`}
              >
                <Pin className={`w-3.5 h-3.5 ${pinned ? 'fill-current' : ''}`} />
                <span>{pinned ? 'Pinned to top' : 'Pin to top'}</span>
              </button>
            </div>

            {/* Checklist / Subtasks */}
            <div className="pt-3 border-t border-stone-100">
              <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider mb-2">
                Checklist / Subtasks ({subtasks.filter((s) => s.completed).length}/{subtasks.length})
              </label>

              {/* Subtask list */}
              <div className="space-y-2 mb-3 max-h-36 overflow-y-auto">
                {subtasks.map((sub) => (
                  <div
                    key={sub.id}
                    className="flex items-center justify-between gap-2 p-2 rounded-lg bg-stone-50 border border-stone-200 text-xs"
                  >
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <input
                        type="checkbox"
                        checked={sub.completed}
                        onChange={() => handleToggleSubtask(sub.id)}
                        className="w-4 h-4 rounded border-stone-300 text-stone-900 cursor-pointer"
                      />
                      <span className={`truncate ${sub.completed ? 'line-through text-stone-400' : 'text-stone-800'}`}>
                        {sub.title}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeleteSubtask(sub.id)}
                      className="text-stone-400 hover:text-rose-600 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Add subtask input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newSubtaskTitle}
                  onChange={(e) => setNewSubtaskTitle(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddSubtask();
                    }
                  }}
                  placeholder="Add a step (press Enter)..."
                  className="flex-1 px-3 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-lg text-stone-800 focus:outline-none focus:border-stone-400"
                />
                <button
                  type="button"
                  onClick={handleAddSubtask}
                  className="px-3 py-1.5 text-xs bg-stone-200 text-stone-700 font-semibold rounded-lg hover:bg-stone-300 transition-colors"
                >
                  Add Step
                </button>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-4 border-t border-stone-100 bg-stone-50/50 flex items-center justify-between">
            {task && onDelete ? (
              <button
                type="button"
                onClick={() => {
                  if (window.confirm('Delete this task?')) {
                    onDelete(task.id);
                    onClose();
                  }
                }}
                className="text-xs text-rose-600 hover:text-rose-700 font-semibold px-2 py-1"
              >
                Delete Task
              </button>
            ) : (
              <div />
            )}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-100 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                id="btn-save-task-detail"
                className="px-5 py-2 text-xs font-semibold bg-stone-900 text-white hover:bg-stone-800 rounded-xl shadow-xs transition-colors"
              >
                {task ? 'Save Changes' : 'Create Task'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
