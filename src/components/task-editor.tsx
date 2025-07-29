import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import type { Task, ColumnId } from "../lib/types";
import { X } from "lucide-react";

interface TaskEditorProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  task?: Task;
  columnId?: ColumnId;
  actions: {
    addTask: (columnId: ColumnId, title: string, description?: string) => void;
    updateTask: (
      taskId: string,
      columnId: ColumnId,
      updates: Partial<Task>
    ) => void;
  };
}

const formSchema = z.object({
  title: z.string().min(1, "Title is required").max(100),
  description: z.string().max(500).optional(),
  status: z.enum(["todo", "in-progress", "done"]),
});

export default function TaskEditor({
  isOpen,
  onOpenChange,
  task,
  columnId,
  actions,
}: TaskEditorProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: task?.title || "",
      description: task?.description || "",
      status: columnId || "todo",
    },
  });

  React.useEffect(() => {
    if (isOpen) {
      form.reset({
        title: task?.title || "",
        description: task?.description || "",
        status: columnId || "todo",
      });
    }
  }, [isOpen, task, columnId, form]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (task && columnId) {
      actions.updateTask(task.id, columnId, {
        title: values.title,
        description: values.description,
      });
    } else {
      actions.addTask(values.status, values.title, values.description);
    }
    onOpenChange(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">
              {task ? "Edit Task" : "Add New Task"}
            </h2>
            <button
              onClick={() => onOpenChange(false)}
              className="p-1 rounded-full hover:bg-gray-100 cursor-pointer"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>
        </div>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="p-6 space-y-4">
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Title
              </label>
              <input
                id="title"
                type="text"
                placeholder="e.g. Design the landing page"
                {...form.register("title")}
                className="block w-full px-3 py-2 text-base border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              />
              {form.formState.errors.title && (
                <p className="text-red-500 text-xs mt-1">
                  {form.formState.errors.title.message}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Description (Optional)
              </label>
              <textarea
                id="description"
                rows={4}
                placeholder="Add more details about the task..."
                {...form.register("description")}
                className="block w-full px-3 py-2 text-base border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              />
            </div>
            {!task && (
              <div>
                <label
                  htmlFor="status"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Status
                </label>

                <select
                  id="status"
                  {...form.register("status")}
                  className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-gray-400 sm:text-sm rounded-md shadow-sm cursor-pointer bg-white text-black"
                >
                  <option value="todo">To Do</option>
                  <option value="in-progress">In Progress</option>
                  <option value="done">Done</option>
                </select>

                {/* <select
                  id="status"
                  {...form.register("status")}
                  className="block w-full pl-3 pr-10 py-2 text-base border-gray-500 focus:outline-none focus:ring-purple-50 focus:border-purple-500 sm:text-sm rounded-md shadow-sm cursor-pointer"
                >
                  <option
                    value="todo"
                    className="text-black bg-white checked:bg-gray-200 cursor-pointer hover:bg-gray-200"
                  >
                    To Do
                  </option>
                  <option
                    value="in-progress"
                    className="text-black bg-white checked:bg-gray-200 cursor-pointer hover:bg-gray-200"
                  >
                    In Progress
                  </option>
                  <option
                    value="done"
                    className="text-black bg-white checked:bg-gray-200 cursor-pointer rounded-3xl hover:bg-gray-200"
                  >
                    Done
                  </option>
                </select> */}
              </div>
            )}
          </div>
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary cursor-pointer"
            >
              {task ? "Save Changes" : "Create Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
