export enum Category {
  Work = 'Work',
  Personal = 'Personal',
  Urgent = 'Urgent',
  Routine = 'Routine',
  Creative = 'Creative'
}

export enum Priority {
  High = 'High',
  Medium = 'Medium',
  Low = 'Low'
}

export enum TaskStatus {
  Pending = 'pending',
  Completed = 'completed'
}

export interface Task {
  id: string;
  title: string;
  category: Category;
  priority: Priority;
  status: TaskStatus;
  createdAt: Date;
  reasoning?: string;
}

export interface AIAnalysisResult {
  category: Category;
  priority: Priority;
  reasoning: string;
}

export interface User {
  id: string;
  email: string;
  passwordHash: string; // In this demo, this will be the plain password
  hasOnboarded: boolean;
}