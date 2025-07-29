import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { arrayMove } from "@dnd-kit/sortable";
import type { Project, Task, ColumnId, AppState } from "../lib/types";
import { immer } from "zustand/middleware/immer";

const defaultProject: Project = {
  id: `proj-${Date.now()}`,
  name: "My First Project",
  columns: {
    todo: { id: "todo", title: "To Do", tasks: [] },
    "in-progress": { id: "in-progress", title: "In Progress", tasks: [] },
    done: { id: "done", title: "Done", tasks: [] },
  },
};

const defaultState: AppState = {
  projects: [defaultProject],
  activeProjectId: defaultProject.id,
};

interface Actions {
  // Project Actions
  addProject: (name: string) => void;
  renameProject: (projectId: string, newName: string) => void;
  deleteProject: (projectId: string) => void;
  setActiveProject: (projectId: string) => void;

  // Task Actions
  addTask: (columnId: ColumnId, title: string, description?: string) => void;
  updateTask: (
    taskId: string,
    columnId: ColumnId,
    updates: Partial<Pick<Task, "title" | "description">>
  ) => void;
  deleteTask: (taskId: string, columnId: ColumnId) => void;
  moveTask: (
    taskId: string,
    sourceColumnId: ColumnId,
    destColumnId: ColumnId,
    destIndex: number
  ) => void;
  clearColumn: (columnId: ColumnId) => void;

  // Tag Actions
  addTagToTask: (taskId: string, columnId: ColumnId, tag: string) => void;
  removeTagFromTask: (taskId: string, columnId: ColumnId, tag: string) => void;
}

export const useProjectStore = create<AppState & Actions>()(
  persist(
    immer((set) => ({
      ...defaultState,

      // Project Actions
      addProject: (name) =>
        set((state) => {
          const newProject: Project = {
            id: `proj-${Date.now()}`,
            name,
            columns: {
              todo: { id: "todo", title: "To Do", tasks: [] },
              "in-progress": {
                id: "in-progress",
                title: "In Progress",
                tasks: [],
              },
              done: { id: "done", title: "Done", tasks: [] },
            },
          };
          state.projects.push(newProject);
          state.activeProjectId = newProject.id;
        }),
      renameProject: (projectId, newName) =>
        set((state) => {
          const project = state.projects.find((p) => p.id === projectId);
          if (project) {
            project.name = newName;
          }
        }),
      deleteProject: (projectId) =>
        set((state) => {
          state.projects = state.projects.filter((p) => p.id !== projectId);
          if (state.activeProjectId === projectId) {
            state.activeProjectId =
              state.projects.length > 0 ? state.projects[0].id : null;
          }
        }),
      setActiveProject: (projectId) => set({ activeProjectId: projectId }),

      // Task Actions
      addTask: (columnId, title, description) =>
        set((state) => {
          const project = state.projects.find(
            (p) => p.id === state.activeProjectId
          );
          if (project) {
            const newTask: Task = {
              id: `task-${Date.now()}`,
              title,
              description,
              createdAt: new Date().toISOString(),
              tags: [],
              columnId,
            };
            project.columns[columnId].tasks.unshift(newTask);
          }
        }),
      updateTask: (taskId, columnId, updates) =>
        set((state) => {
          const project = state.projects.find(
            (p) => p.id === state.activeProjectId
          );
          if (project) {
            const task = project.columns[columnId].tasks.find(
              (t) => t.id === taskId
            );
            if (task) {
              Object.assign(task, updates);
            }
          }
        }),
      deleteTask: (taskId, columnId) =>
        set((state) => {
          const project = state.projects.find(
            (p) => p.id === state.activeProjectId
          );
          if (project) {
            project.columns[columnId].tasks = project.columns[
              columnId
            ].tasks.filter((t) => t.id !== taskId);
          }
        }),
      moveTask: (taskId, sourceColumnId, destColumnId, destIndex) =>
        set((state) => {
          const project = state.projects.find(
            (p) => p.id === state.activeProjectId
          );
          if (!project) return;

          const sourceColumn = project.columns[sourceColumnId];
          const taskIndex = sourceColumn.tasks.findIndex(
            (t) => t.id === taskId
          );

          if (taskIndex === -1) return;

          const [taskToMove] = sourceColumn.tasks.splice(taskIndex, 1);

          if (sourceColumnId === destColumnId) {
            sourceColumn.tasks.splice(destIndex, 0, taskToMove);
          } else {
            const destColumn = project.columns[destColumnId];
            taskToMove.columnId = destColumnId;
            destColumn.tasks.splice(destIndex, 0, taskToMove);
          }
        }),
      clearColumn: (columnId) =>
        set((state) => {
          const project = state.projects.find(
            (p) => p.id === state.activeProjectId
          );
          if (project) {
            project.columns[columnId].tasks = [];
          }
        }),

      // Tag Actions
      addTagToTask: (taskId, columnId, tag) =>
        set((state) => {
          const project = state.projects.find(
            (p) => p.id === state.activeProjectId
          );
          if (project) {
            const task = project.columns[columnId].tasks.find(
              (t) => t.id === taskId
            );
            if (task && !task.tags.includes(tag)) {
              task.tags.push(tag);
            }
          }
        }),
      removeTagFromTask: (taskId, columnId, tag) =>
        set((state) => {
          const project = state.projects.find(
            (p) => p.id === state.activeProjectId
          );
          if (project) {
            const task = project.columns[columnId].tasks.find(
              (t) => t.id === taskId
            );
            if (task) {
              task.tags = task.tags.filter((t) => t !== tag);
            }
          }
        }),
    })),
    {
      name: "FlowLane-kanban-data",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
