import { Task } from '../types';
import { INITIAL_TASKS } from '../data/initialTasks';

const STORAGE_KEY = 'personal_task_manager_tasks_v1';
const FOCUS_STATS_KEY = 'personal_task_manager_focus_v1';

export interface StoredFocusStats {
  date: string;
  focusMinutes: number;
  completedPomodoros: number;
  history: Record<string, number>; // date -> minutes
}

export function loadTasksFromStorage(): Task[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return INITIAL_TASKS;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
  } catch (e) {
    console.error('Failed to parse tasks from localStorage', e);
  }
  return INITIAL_TASKS;
}

export function saveTasksToStorage(tasks: Task[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (e) {
    console.error('Failed to save tasks to localStorage', e);
  }
}

export function loadFocusStats(): StoredFocusStats {
  const today = new Date().toISOString().split('T')[0];
  try {
    const raw = localStorage.getItem(FOCUS_STATS_KEY);
    if (raw) {
      const parsed: StoredFocusStats = JSON.parse(raw);
      if (parsed.date === today) {
        return parsed;
      } else {
        // new day, rollover
        return {
          date: today,
          focusMinutes: 0,
          completedPomodoros: 0,
          history: parsed.history || {},
        };
      }
    }
  } catch (e) {
    console.error('Failed to load focus stats', e);
  }
  return {
    date: today,
    focusMinutes: 0,
    completedPomodoros: 0,
    history: {},
  };
}

export function saveFocusStats(stats: StoredFocusStats): void {
  try {
    localStorage.setItem(FOCUS_STATS_KEY, JSON.stringify(stats));
  } catch (e) {
    console.error('Failed to save focus stats', e);
  }
}

export function exportTasksAsJSON(tasks: Task[]): void {
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(tasks, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', dataStr);
  downloadAnchor.setAttribute('download', `tasks-backup-${new Date().toISOString().split('T')[0]}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}
