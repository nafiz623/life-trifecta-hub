// Local storage utilities for the Life Trifecta app

export interface TasbeehEvent {
  id: string;
  name: string;
  dailyGoal: number;
  dailyCount: number;
  totalCount: number;
  lastUpdated: Date;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  dueDate?: Date;
  reminderTime?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface CalendarEvent {
  id: string;
  date: string; // YYYY-MM-DD format
  title: string;
  description?: string;
  createdAt: Date;
}

export interface FinanceEntry {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  description: string;
  category: string;
  date: Date;
  createdAt: Date;
}

export interface Habit {
  id: string;
  name: string;
  startDate: Date;
  lastRelapseDate?: Date;
  description?: string;
}

export interface Alarm {
  id: string;
  time: string; // HH:MM format
  label: string;
  enabled: boolean;
  daysOfWeek: boolean[]; // [Sun, Mon, Tue, Wed, Thu, Fri, Sat]
}

export interface PrayerTime {
  id: string;
  name: string;
  time: string; // HH:MM format
  enabled: boolean;
}

// Storage keys
const STORAGE_KEYS = {
  TASBEEH_EVENTS: 'life-trifecta-tasbeeh-events',
  NOTES: 'life-trifecta-notes',
  TASKS: 'life-trifecta-tasks',
  CALENDAR_EVENTS: 'life-trifecta-calendar-events',
  FINANCE_ENTRIES: 'life-trifecta-finance-entries',
  HABITS: 'life-trifecta-habits',
  ALARMS: 'life-trifecta-alarms',
  PRAYER_TIMES: 'life-trifecta-prayer-times',
  STOPWATCH_STATE: 'life-trifecta-stopwatch-state',
} as const;

// Generic storage functions
export const saveToStorage = <T>(key: string, data: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving to storage:', error);
  }
};

export const loadFromStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error('Error loading from storage:', error);
    return defaultValue;
  }
};

// Specific storage functions
export const saveTasbeehEvents = (events: TasbeehEvent[]) => {
  saveToStorage(STORAGE_KEYS.TASBEEH_EVENTS, events);
};

export const loadTasbeehEvents = (): TasbeehEvent[] => {
  return loadFromStorage(STORAGE_KEYS.TASBEEH_EVENTS, []);
};

export const saveNotes = (notes: Note[]) => {
  saveToStorage(STORAGE_KEYS.NOTES, notes);
};

export const loadNotes = (): Note[] => {
  return loadFromStorage(STORAGE_KEYS.NOTES, []);
};

export const saveTasks = (tasks: Task[]) => {
  saveToStorage(STORAGE_KEYS.TASKS, tasks);
};

export const loadTasks = (): Task[] => {
  return loadFromStorage(STORAGE_KEYS.TASKS, []);
};

export const saveCalendarEvents = (events: CalendarEvent[]) => {
  saveToStorage(STORAGE_KEYS.CALENDAR_EVENTS, events);
};

export const loadCalendarEvents = (): CalendarEvent[] => {
  return loadFromStorage(STORAGE_KEYS.CALENDAR_EVENTS, []);
};

export const saveFinanceEntries = (entries: FinanceEntry[]) => {
  saveToStorage(STORAGE_KEYS.FINANCE_ENTRIES, entries);
};

export const loadFinanceEntries = (): FinanceEntry[] => {
  return loadFromStorage(STORAGE_KEYS.FINANCE_ENTRIES, []);
};

export const saveHabits = (habits: Habit[]) => {
  saveToStorage(STORAGE_KEYS.HABITS, habits);
};

export const loadHabits = (): Habit[] => {
  return loadFromStorage(STORAGE_KEYS.HABITS, []);
};

export const saveAlarms = (alarms: Alarm[]) => {
  saveToStorage(STORAGE_KEYS.ALARMS, alarms);
};

export const loadAlarms = (): Alarm[] => {
  return loadFromStorage(STORAGE_KEYS.ALARMS, []);
};

export const savePrayerTimes = (prayerTimes: PrayerTime[]) => {
  saveToStorage(STORAGE_KEYS.PRAYER_TIMES, prayerTimes);
};

export const loadPrayerTimes = (): PrayerTime[] => {
  const defaultPrayerTimes: PrayerTime[] = [
    { id: '1', name: 'Fajr', time: '05:30', enabled: true },
    { id: '2', name: 'Dhuhr', time: '12:30', enabled: true },
    { id: '3', name: 'Asr', time: '16:00', enabled: true },
    { id: '4', name: 'Maghrib', time: '18:30', enabled: true },
    { id: '5', name: 'Isha', time: '20:00', enabled: true },
  ];
  return loadFromStorage(STORAGE_KEYS.PRAYER_TIMES, defaultPrayerTimes);
};

export const saveStopwatchState = (state: { time: number; isRunning: boolean; startTime?: number }) => {
  saveToStorage(STORAGE_KEYS.STOPWATCH_STATE, state);
};

export const loadStopwatchState = (): { time: number; isRunning: boolean; startTime?: number } => {
  return loadFromStorage(STORAGE_KEYS.STOPWATCH_STATE, { time: 0, isRunning: false });
};