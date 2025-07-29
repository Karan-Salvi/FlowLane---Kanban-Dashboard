import * as React from "react";
import type { Project, ColumnId, Task } from "../lib/types";
import KanbanColumn from "./kanban-column";
import type {
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
} from "@dnd-kit/core";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
} from "@dnd-kit/core";
import { createPortal } from "react-dom";
import TaskCard from "./task-card";

interface KanbanBoardProps {
  project: Project | null;
  actions: {
    moveTask: (
      taskId: string,
      sourceColumnId: ColumnId,
      destColumnId: ColumnId,
      destIndex: number
    ) => void;
    deleteTask: (taskId: string, columnId: ColumnId) => void;
    updateTask: (
      taskId: string,
      columnId: ColumnId,
      updates: Partial<Task>
    ) => void;
    addTagToTask: (taskId: string, columnId: ColumnId, tag: string) => void;
    openTaskEditor: (columnId: ColumnId) => void;
    clearColumn: (columnId: ColumnId) => void;
    addTask: (columnId: ColumnId, title: string, description?: string) => void;
  };
}

const columnOrder: ColumnId[] = ["todo", "in-progress", "done"];

export default function KanbanBoard({ project, actions }: KanbanBoardProps) {
  const [activeTask, setActiveTask] = React.useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    })
  );

  const onDragStart = React.useCallback((event: DragStartEvent) => {
    if (event.active.data.current?.type === "Task") {
      setActiveTask(event.active.data.current.task);
    }
  }, []);

  const onDragEnd = React.useCallback(
    (event: DragEndEvent) => {
      setActiveTask(null);

      const { active, over } = event;
      if (!over || !project) return;

      const activeId = active.id.toString();
      const overId = over.id.toString();

      const isActiveATask = active.data.current?.type === "Task";
      if (!isActiveATask) return;

      if (
        activeId === overId &&
        active.data.current?.task.columnId === over.data.current?.task.columnId
      )
        return;

      const sourceColumnId = active.data.current?.task.columnId as ColumnId;
      let destColumnId: ColumnId;
      let destIndex: number;

      const isOverAColumn = over.data.current?.type === "Column";
      if (isOverAColumn) {
        destColumnId = over.id as ColumnId;
        destIndex = project.columns[destColumnId].tasks.length;
      } else {
        const overTask = over.data.current?.task;
        if (!overTask) return;
        destColumnId = overTask.columnId as ColumnId;
        const overTaskIndex = project.columns[destColumnId].tasks.findIndex(
          (t) => t.id === overId
        );
        destIndex =
          overTaskIndex >= 0
            ? overTaskIndex
            : project.columns[destColumnId].tasks.length;
      }

      if (sourceColumnId && destColumnId) {
        actions.moveTask(activeId, sourceColumnId, destColumnId, destIndex);
      }
    },
    [project, actions]
  );

  const onDragOver = React.useCallback(
    (event: DragOverEvent) => {
      const { active, over } = event;
      if (!over || !project) return;

      const activeId = active.id.toString();
      const overId = over.id.toString();

      if (activeId === overId) return;

      const isActiveATask = active.data.current?.type === "Task";
      if (!isActiveATask) return;

      const sourceColumnId = active.data.current?.task.columnId as ColumnId;
      const overData = over.data.current;

      let destColumnId: ColumnId | undefined;
      let destIndex: number | undefined;

      if (overData?.type === "Column") {
        destColumnId = over.id as ColumnId;
        destIndex = project.columns[destColumnId].tasks.length;
      } else if (overData?.type === "Task") {
        const overTask = overData.task;
        destColumnId = overTask.columnId as ColumnId;
        destIndex = project.columns[destColumnId].tasks.findIndex(
          (t) => t.id === overId
        );
      }

      if (
        sourceColumnId &&
        destColumnId &&
        destIndex !== undefined &&
        sourceColumnId !== destColumnId
      ) {
        actions.moveTask(activeId, sourceColumnId, destColumnId, destIndex);
      }
    },
    [project, actions]
  );

  if (!project) return null;

  return (
    <DndContext
      sensors={sensors}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragOver={onDragOver}
      collisionDetection={closestCenter}
    >
      <div className="flex-1 p-4 sm:p-6 overflow-x-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 h-full min-w-full lg:min-w-[1000px]">
          {columnOrder.map((columnId) => {
            const column = project.columns[columnId];
            return (
              <KanbanColumn key={column.id} column={column} actions={actions} />
            );
          })}
        </div>
      </div>
      {typeof document !== "undefined" &&
        createPortal(
          <DragOverlay>
            {activeTask && (
              <TaskCard
                task={activeTask}
                columnId={activeTask.columnId as ColumnId}
                actions={actions}
              />
            )}
          </DragOverlay>,
          document.body
        )}
    </DndContext>
  );
}
