"use client";

import * as React from "react";
import type { Column, ColumnId, Task } from "../lib/types";
import TaskCard from "./task-card";
import { cn } from "../lib/utils";
import { SortableContext } from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";
import { Plus, MoreHorizontal } from "lucide-react";

interface KanbanColumnProps {
  column: Column;
  actions: {
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

const columnStyles: Record<ColumnId, { bg: string; text: string }> = {
  todo: { bg: "bg-blue-50", text: "text-blue-600" },
  "in-progress": { bg: "bg-orange-50", text: "text-orange-600" },
  done: { bg: "bg-green-50", text: "text-green-600" },
};

function KanbanColumn({ column, actions }: KanbanColumnProps) {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);

  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
    data: {
      type: "Column",
      column: column,
    },
  });

  const tasksIds = React.useMemo(() => {
    return column.tasks.map((task) => task.id);
  }, [column.tasks]);

  const style = columnStyles[column.id] || {
    bg: "bg-gray-50",
    text: "text-gray-600",
  };

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex flex-col h-full max-h-full bg-slate-50 rounded-xl">
      <div className="flex items-center justify-between p-4">
        <h3 className="text-base font-semibold flex items-center gap-2">
          <span className={cn(style.text)}>{column.title}</span>
          <span className="text-sm text-gray-400 bg-gray-200 px-2 py-0.5 rounded-full">
            {column.tasks.length}
          </span>
        </h3>
        <div className="flex items-center gap-1">
          <button
            onClick={() => actions.openTaskEditor(column.id)}
            className="p-2 rounded-md hover:bg-gray-200 transition-colors cursor-pointer"
          >
            <Plus className="h-4 w-4 text-gray-500" />
          </button>
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md hover:bg-gray-200 transition-colors cursor-pointer"
            >
              <MoreHorizontal className="h-4 w-4 text-gray-500" />
            </button>
            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-xl overflow-hidden z-10 border border-gray-200">
                <button
                  onClick={() => {
                    actions.clearColumn(column.id);
                    setIsMenuOpen(false);
                  }}
                  className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 cursor-pointer"
                >
                  Clear all
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 pt-0" ref={setNodeRef}>
        <div
          className={cn(
            "min-h-[200px] h-full transition-colors duration-200",
            isOver ? "bg-gray-200" : ""
          )}
        >
          <SortableContext items={tasksIds}>
            {column.tasks.length > 0 ? (
              <div className="space-y-4">
                {column.tasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    columnId={column.id}
                    actions={actions}
                  />
                ))}
              </div>
            ) : (
              <div
                className={cn(
                  "flex items-center justify-center h-full text-sm text-gray-500 rounded-lg border-2 border-dashed",
                  isOver ? "border-primary" : "border-gray-300"
                )}
              >
                Drop tasks here
              </div>
            )}
          </SortableContext>
        </div>
      </div>
    </div>
  );
}

export default React.memo(KanbanColumn);
