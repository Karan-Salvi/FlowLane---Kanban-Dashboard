export interface Task {
  id: string;
  title: string;
  description?: string;
  createdAt: string;
  tags: string[];
  columnId: ColumnId;
}

export type ColumnId = 'todo' | 'in-progress' | 'done';

export interface Column {
  id: ColumnId;
  title: string;
  tasks: Task[];
}

export interface Project {
  id: string;
  name: string;
  columns: Record<ColumnId, Column>;
}

export interface AppState {
  projects: Project[];
  activeProjectId: string | null;
}
