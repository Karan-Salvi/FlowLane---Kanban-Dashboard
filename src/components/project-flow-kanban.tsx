import { useProjectStore } from "../store/project-store";
import { ModernSidebar } from "../components/ui/modern-side-bar";
import KanbanBoard from "./kanban-board";
import { Plus, Filter, Menu, X } from "lucide-react";
import { useState, useEffect, useMemo, useCallback } from "react";
import TaskEditor from "./task-editor";
import { format } from "date-fns";
import FilterPopover from "./filter-popover";
import type { Project, ColumnId } from "../lib/types";
import { useIsMobile } from "../hooks/use-mobile";
// import { shallow } from "zustand/shallow";

export default function FlowLaneKanban() {
  const projects = useProjectStore((state) => state.projects);
  const activeProjectId = useProjectStore((state) => state.activeProjectId);
  const setActiveProject = useProjectStore((state) => state.setActiveProject);
  const addProject = useProjectStore((state) => state.addProject);
  const renameProject = useProjectStore((state) => state.renameProject);
  const deleteProject = useProjectStore((state) => state.deleteProject);
  const addTask = useProjectStore((state) => state.addTask);
  const updateTask = useProjectStore((state) => state.updateTask);
  const deleteTask = useProjectStore((state) => state.deleteTask);
  const moveTask = useProjectStore((state) => state.moveTask);
  const addTagToTask = useProjectStore((state) => state.addTagToTask);
  const clearColumn = useProjectStore((state) => state.clearColumn);

  const activeProject = useMemo(
    () => projects.find((p) => p.id === activeProjectId),
    [projects, activeProjectId]
  );

  const [isTaskEditorOpen, setIsTaskEditorOpen] = useState(false);
  const [editingColumnId, setEditingColumnId] = useState<ColumnId | undefined>(
    undefined
  );
  const [isClient, setIsClient] = useState(false);
  const [currentDate, setCurrentDate] = useState("");
  const [isFilterOpen, setFilterOpen] = useState(false);
  const [filter, setFilter] = useState<{ title: string }>({ title: "" });
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    setIsClient(true);
    setCurrentDate(format(new Date(), "EEEE, MMM d, yyyy"));
  }, []);

  useEffect(() => {
    if (!isMobile) {
      setSidebarOpen(true);
    } else {
      setSidebarOpen(false);
    }
  }, [isMobile]);

  const filteredProject = useMemo(() => {
    if (!activeProject) return null;
    if (!filter.title) return activeProject;

    const newProject: Project = JSON.parse(JSON.stringify(activeProject));
    for (const columnId in newProject.columns) {
      newProject.columns[columnId as keyof typeof newProject.columns].tasks =
        newProject.columns[
          columnId as keyof typeof newProject.columns
        ].tasks.filter((task) =>
          task.title.toLowerCase().includes(filter.title.toLowerCase())
        );
    }
    return newProject;
  }, [activeProject, filter]);

  const handleOpenTaskEditor = useCallback((columnId?: ColumnId) => {
    setEditingColumnId(columnId);
    setIsTaskEditorOpen(true);
  }, []);

  const handleToggleFilter = useCallback(() => {
    setFilterOpen((prev) => !prev);
  }, []);

  const handleCloseFilter = useCallback(() => {
    setFilterOpen(false);
  }, []);

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  if (!isClient) {
    return (
      <div className="flex h-screen bg-background">
        <ModernSidebar
          isOpen={false}
          setIsOpen={setSidebarOpen}
          projects={[]}
          activeProjectId={null}
          actions={{}}
        />
        <main className="flex-1 flex flex-col h-full overflow-hidden">
          <div className="flex-1 flex items-center justify-center">
            {/* Skeleton or loading state can go here */}
          </div>
        </main>
      </div>
    );
  }

  const boardActions = {
    openTaskEditor: handleOpenTaskEditor,
    updateTask,
    deleteTask,
    moveTask,
    addTagToTask,
    clearColumn,
    addTask,
  };

  const sidebarActions = {
    addProject,
    renameProject,
    deleteProject,
    setActiveProject,
  };

  const taskEditorActions = {
    addTask,
    updateTask,
  };

  return (
    <div className="flex h-screen bg-background text-foreground font-sans">
      <ModernSidebar
        isOpen={isSidebarOpen}
        setIsOpen={setSidebarOpen}
        projects={projects}
        activeProjectId={activeProjectId}
        actions={sidebarActions}
      />
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        <div className="flex-1 flex flex-col h-full bg-white rounded-2xl shadow-sm m-2 sm:m-4">
          {activeProject ? (
            <div className="flex flex-col h-full">
              <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-4 sm:p-6 border-b border-gray-200">
                <div className="flex items-center gap-4">
                  <button
                    onClick={toggleSidebar}
                    className="p-2 rounded-lg bg-white shadow-md border border-slate-100 lg:hidden hover:bg-slate-50 transition-all duration-200 cursor-pointer"
                    aria-label="Toggle sidebar"
                  >
                    {isSidebarOpen ? (
                      <X className="h-5 w-5 text-slate-600" />
                    ) : (
                      <Menu className="h-5 w-5 text-slate-600" />
                    )}
                  </button>
                  <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
                      {activeProject.name}
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">{currentDate}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 sm:gap-4 w-full md:w-auto">
                  <div className="hidden sm:flex items-center -space-x-2">
                    <img
                      className="w-8 h-8 rounded-full border-2 border-white"
                      src="https://i.pravatar.cc/150?img=1"
                      alt="User 1"
                    />
                    <img
                      className="w-8 h-8 rounded-full border-2 border-white"
                      src="https://i.pravatar.cc/150?img=2"
                      alt="User 2"
                    />
                    <img
                      className="w-8 h-8 rounded-full border-2 border-white"
                      src="https://i.pravatar.cc/150?img=3"
                      alt="User 3"
                    />
                    <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center text-xs font-semibold text-gray-600">
                      +2
                    </div>
                  </div>
                  <div className="relative">
                    <button
                      onClick={handleToggleFilter}
                      className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 text-gray-600 w-full sm:w-auto cursor-pointer"
                    >
                      <Filter className="mr-2 h-4 w-4" />
                      Filters
                    </button>
                    {isFilterOpen && (
                      <FilterPopover
                        onClose={handleCloseFilter}
                        filter={filter}
                        setFilter={setFilter}
                      />
                    )}
                  </div>
                  <button
                    onClick={() => handleOpenTaskEditor()}
                    className="inline-flex items-center justify-center  whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-3 py-2 w-full sm:w-auto cursor-pointer"
                  >
                    <Plus className="mr-1 h-5 w-5" />
                    Create Task
                  </button>
                </div>
              </header>
              <KanbanBoard project={filteredProject} actions={boardActions} />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
              <div className="max-w-md">
                <h2 className="text-2xl font-semibold text-foreground mb-2">
                  No Project Selected
                </h2>
                <p className="text-muted-foreground mb-4">
                  Create a new project from the sidebar to get started.
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
      <TaskEditor
        isOpen={isTaskEditorOpen}
        onOpenChange={setIsTaskEditorOpen}
        actions={taskEditorActions}
        columnId={editingColumnId}
      />
    </div>
  );
}
