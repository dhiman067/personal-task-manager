import { CategoryDef, Task } from '../types';

export const DEFAULT_CATEGORIES: CategoryDef[] = [
  { id: 'Work', name: 'Work', color: 'text-blue-700', bgLight: 'bg-blue-50', borderColor: 'border-blue-200' },
  { id: 'Deep Work', name: 'Deep Work', color: 'text-purple-700', bgLight: 'bg-purple-50', borderColor: 'border-purple-200' },
  { id: 'Personal', name: 'Personal', color: 'text-emerald-700', bgLight: 'bg-emerald-50', borderColor: 'border-emerald-200' },
  { id: 'Learning', name: 'Learning', color: 'text-amber-700', bgLight: 'bg-amber-50', borderColor: 'border-amber-200' },
  { id: 'Health', name: 'Health', color: 'text-rose-700', bgLight: 'bg-rose-50', borderColor: 'border-rose-200' },
];

export const getTodayDateString = (): string => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const getTomorrowDateString = (): string => {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const INITIAL_TASKS: Task[] = [
  {
    id: 'task-1',
    title: "Get started by setting up your task's to organize your daily life.",
    notes: "Don't forget to add your priorities.",
    completed: false,
    createdAt: new Date(Date.now() - 3600 * 1000 * 12).toISOString(),
    dueDate: getTodayDateString(),
    dueTime: '19:00',
    priority: 'p2',
    quadrant: 'q2', // Important, Not Urgent
    category: 'Health',
    subtasks: [
      { id: 'sub-4-1', title: 'Warm-up dynamic mobility', completed: false },
      { id: 'sub-4-2', title: '5km steady pace', completed: false }
    ],
    estimatedPomodoros: 2,
    completedPomodoros: 0,
  },
  // {
  //   id: 'task-1',
  //   title: 'Finalize Q3 roadmap presentation & architecture review',
  //   notes: 'Incorporate feedback from product engineering sync. Highlight key bottlenecks and delivery timelines.',
  //   completed: false,
  //   createdAt: new Date(Date.now() - 3600 * 1000 * 4).toISOString(),
  //   dueDate: getTodayDateString(),
  //   dueTime: '15:00',
  //   priority: 'p1',
  //   quadrant: 'q1', // Urgent & Important
  //   category: 'Work',
  //   subtasks: [
  //     { id: 'sub-1-1', title: 'Review slide 4 system diagram', completed: true },
  //     { id: 'sub-1-2', title: 'Verify capacity metrics with DevOps', completed: false },
  //     { id: 'sub-1-3', title: 'Export speaker notes PDF', completed: false }
  //   ],
  //   estimatedPomodoros: 4,
  //   completedPomodoros: 2,
  //   pinned: true,
  // },
  // {
  //   id: 'task-2',
  //   title: 'Design API contract schema for notification pipeline',
  //   notes: 'Focus on idempotent event dispatch and error retry headers.',
  //   completed: false,
  //   createdAt: new Date(Date.now() - 3600 * 1000 * 24).toISOString(),
  //   dueDate: getTodayDateString(),
  //   dueTime: '17:30',
  //   priority: 'p2',
  //   quadrant: 'q2', // Important, Not Urgent
  //   category: 'Deep Work',
  //   subtasks: [
  //     { id: 'sub-2-1', title: 'Define event payload JSON schema', completed: true },
  //     { id: 'sub-2-2', title: 'Document rate-limiting behavior', completed: false }
  //   ],
  //   estimatedPomodoros: 3,
  //   completedPomodoros: 1,
  // },
  // {
  //   id: 'task-3',
  //   title: 'Reply to vendor renewal quote email',
  //   notes: 'Check if we can request a 15% discount for annual upfront billing.',
  //   completed: false,
  //   createdAt: new Date(Date.now() - 3600 * 1000 * 8).toISOString(),
  //   dueDate: getTodayDateString(),
  //   dueTime: '12:00',
  //   priority: 'p3',
  //   quadrant: 'q3', // Urgent, Not Important
  //   category: 'Work',
  //   subtasks: [],
  //   estimatedPomodoros: 1,
  //   completedPomodoros: 0,
  // },
  // {
  //   id: 'task-5',
  //   title: 'Read chapter 4: Systems Performance & Concurrency',
  //   notes: 'Take concise atomic notes on memory barriers and lock-free rings.',
  //   completed: false,
  //   createdAt: new Date(Date.now() - 3600 * 1000 * 48).toISOString(),
  //   dueDate: getTomorrowDateString(),
  //   priority: 'p3',
  //   quadrant: 'q2',
  //   category: 'Learning',
  //   subtasks: [],
  //   estimatedPomodoros: 2,
  //   completedPomodoros: 0,
  // },
  // {
  //   id: 'task-6',
  //   title: 'Submit monthly insurance claim receipt',
  //   notes: 'Upload dental visit breakdown PDF to provider portal.',
  //   completed: true,
  //   completedAt: new Date(Date.now() - 3600 * 1000 * 2).toISOString(),
  //   createdAt: new Date(Date.now() - 3600 * 1000 * 30).toISOString(),
  //   dueDate: getTodayDateString(),
  //   priority: 'p3',
  //   quadrant: 'q3',
  //   category: 'Personal',
  //   subtasks: [
  //     { id: 'sub-6-1', title: 'Download receipt from clinic email', completed: true },
  //     { id: 'sub-6-2', title: 'Fill reimbursement form', completed: true }
  //   ],
  //   estimatedPomodoros: 1,
  //   completedPomodoros: 1,
  // }
];
