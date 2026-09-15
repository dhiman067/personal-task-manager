export type Priority = 'p1' | 'p2' | 'p3' | 'p4';

export type MatrixQuadrant = 'q1' | 'q2' | 'q3' | 'q4';

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  notes?: string;
  completed: boolean;
  completedAt?: string;
  createdAt: string;
  dueDate?: string; // YYYY-MM-DD
  dueTime?: string; // HH:mm
  priority: Priority;
  quadrant: MatrixQuadrant;
  category: string;
  subtasks: Subtask[];
  estimatedPomodoros: number;
  completedPomodoros: number;
  pinned?: boolean;
}

export type ViewMode = 'today' | 'matrix' | 'all' | 'focus' | 'projects' | 'completed';

export interface CategoryDef {
  id: string;
  name: string;
  color: string;
  bgLight: string;
  borderColor: string;
}

export interface ProductivityStats {
  completedTodayCount: number;
  totalActiveCount: number;
  focusMinutesToday: number;
  streakDays: number;
}
