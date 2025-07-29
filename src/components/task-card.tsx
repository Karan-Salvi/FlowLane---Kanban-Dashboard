import * as React from "react";
import type { Task, ColumnId } from "../lib/types";
import {
  MoreHorizontal,
  Edit,
  Trash2,
  MessageSquare,
  Paperclip,
  CheckCircle,
} from "lucide-react";
import TaskEditor from "./task-editor";
import { cn } from "../lib/utils";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface TaskCardProps {
  task: Task;
  columnId: ColumnId;
  actions: {
    addTask: (columnId: ColumnId, title: string, description?: string) => void;
    deleteTask: (taskId: string, columnId: ColumnId) => void;
    updateTask: (
      taskId: string,
      columnId: ColumnId,
      updates: Partial<Task>
    ) => void;
    addTagToTask: (taskId: string, columnId: ColumnId, tag: string) => void;
  };
}

const columnStyles: Record<
  ColumnId,
  { bg: string; border: string; badge: string }
> = {
  todo: {
    bg: "bg-blue-50",
    border: "border-blue-200",
    badge: "bg-blue-100 text-blue-700",
  },
  "in-progress": {
    bg: "bg-orange-50",
    border: "border-orange-200",
    badge: "bg-orange-100 text-orange-700",
  },
  done: {
    bg: "bg-green-50",
    border: "border-green-200",
    badge: "bg-green-100 text-green-700",
  },
};

function TaskCard({ task, columnId, actions }: TaskCardProps) {
  const [isEditorOpen, setEditorOpen] = React.useState(false);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [isMenuOpen, setMenuOpen] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    // This should run only on the client
    setProgress(Math.floor(Math.random() * 100));
  }, []);

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: "Task",
      task: { ...task, columnId },
    },
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="p-4 bg-white rounded-lg shadow-md opacity-50 border-2 border-primary"
      >
        <div className="h-20" />
      </div>
    );
  }

  const cardStyle = columnStyles[columnId] || {
    bg: "bg-gray-100",
    border: "border-gray-200",
    badge: "bg-gray-200 text-gray-700",
  };

  return (
    <>
      <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
        <div
          className={cn(
            "cursor-grab active:cursor-grabbing rounded-xl shadow-sm border p-4 space-y-3",
            cardStyle.bg,
            cardStyle.border
          )}
        >
          <div className="flex items-start justify-between">
            <div className="flex flex-wrap gap-2">
              {task.tags.map((tag) => (
                <div
                  key={tag}
                  className={cn(
                    "text-xs font-medium px-2 py-1 rounded-md",
                    cardStyle.badge
                  )}
                >
                  {tag}
                </div>
              ))}
            </div>
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen(!isMenuOpen)}
                className="p-1 rounded-md hover:bg-black/5 cursor-pointer"
              >
                <MoreHorizontal className="h-4 w-4 text-gray-600" />
              </button>
              {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-xl z-10 overflow-hidden ">
                  <button
                    onClick={() => {
                      setEditorOpen(true);
                      setMenuOpen(false);
                    }}
                    className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 border-b border-gray-200 cursor-pointer"
                  >
                    <Edit className="mr-2 h-4 w-4" /> Edit
                  </button>
                  <button
                    onClick={() => {
                      setDeleteDialogOpen(true);
                      setMenuOpen(false);
                    }}
                    className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 cursor-pointer"
                  >
                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                  </button>
                </div>
              )}
            </div>
          </div>

          <p className="font-semibold text-base text-gray-800">{task.title}</p>

          {task.description && (
            <p className="text-sm text-gray-500">{task.description}</p>
          )}

          {columnId !== "done" && (
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-gray-500">Progress</span>
                <span className="text-xs font-medium text-gray-600">
                  {progress}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          )}

          {columnId === "done" && (
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Branding
              </label>
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Mobile app design
              </label>
            </div>
          )}

          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center -space-x-2">
              <img
                className="h-7 w-7 rounded-full border-2 border-white"
                src="https://i.pravatar.cc/150?img=4"
                alt="User A"
              />
              <img
                className="h-7 w-7 rounded-full border-2 border-white"
                src="https://i.pravatar.cc/150?img=5"
                alt="User B"
              />
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <MessageSquare className="h-4 w-4" />
                <span>{Math.floor(Math.random() * 10)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Paperclip className="h-4 w-4" />
                <span>{Math.floor(Math.random() * 5)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <TaskEditor
        isOpen={isEditorOpen}
        onOpenChange={setEditorOpen}
        task={task}
        columnId={columnId}
        actions={actions}
      />
      {isDeleteDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
            <h2 className="text-lg font-semibold">Are you sure?</h2>
            <p className="text-sm text-gray-600 mt-2">
              This action will permanently delete the task "{task.title}".
            </p>
            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => setDeleteDialogOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  actions.deleteTask(task.id, columnId);
                  setDeleteDialogOpen(false);
                }}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default React.memo(TaskCard);
