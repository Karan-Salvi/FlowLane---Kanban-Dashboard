"use client";
import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  FileText,
  Plus,
  Settings,
  MoreHorizontal,
  Edit,
  Trash2,
  LifeBuoy,
  LogOut,
} from "lucide-react";
import type { Project } from "../../lib/types";
import { cn } from "../../lib/utils";

interface ModernSidebarProps {
  className?: string;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  projects: Project[];
  activeProjectId: string | null;
  actions: any;
}

export function ModernSidebar({
  className = "",
  isOpen,
  setIsOpen,
  projects,
  activeProjectId,
  actions,
}: ModernSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const [isAddDialogOpen, setAddDialogOpen] = React.useState(false);
  const [isRenameDialogOpen, setRenameDialogOpen] = React.useState(false);
  const [projectToRename, setProjectToRename] = React.useState<Project | null>(
    null
  );
  const [newProjectName, setNewProjectName] = React.useState("");
  const [isAlertOpen, setAlertOpen] = React.useState(false);
  const [projectToDelete, setProjectToDelete] = React.useState<Project | null>(
    null
  );
  const [menuOpen, setMenuOpen] = React.useState<string | null>(null);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsOpen(true);
        setIsCollapsed(false);
      } else {
        setIsOpen(false);
        setIsCollapsed(true);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [setIsOpen]);

  const toggleSidebar = () => setIsOpen(!isOpen);
  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
    if (window.innerWidth < 1024) {
      setIsOpen(false);
    }
  };

  const handleItemClick = (projectId: string) => {
    actions.setActiveProject(projectId);
    if (window.innerWidth < 1024) {
      setIsOpen(false);
    }
  };

  const handleAddProject = () => {
    if (newProjectName.trim()) {
      actions.addProject(newProjectName.trim());
      setNewProjectName("");
      setAddDialogOpen(false);
    }
  };

  const handleRenameProject = () => {
    if (projectToRename && newProjectName.trim()) {
      actions.renameProject(projectToRename.id, newProjectName.trim());
      setNewProjectName("");
      setRenameDialogOpen(false);
      setProjectToRename(null);
    }
  };

  const openRenameDialog = (project: Project) => {
    setProjectToRename(project);
    setNewProjectName(project.name);
    setRenameDialogOpen(true);
  };

  const openDeleteDialog = (project: Project) => {
    setProjectToDelete(project);
    setAlertOpen(true);
  };

  const confirmDelete = () => {
    if (projectToDelete) {
      actions.deleteProject(projectToDelete.id);
      setAlertOpen(false);
      setProjectToDelete(null);
    }
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 lg:hidden transition-opacity duration-300"
          onClick={toggleSidebar}
        />
      )}

      <div
        className={cn(
          `
          fixed top-0 left-0 h-full bg-white z-40 transition-all duration-300 ease-in-out flex flex-col
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          ${isCollapsed ? "w-20" : "w-64"}
          lg:translate-x-0 lg:static lg:z-auto
          `,
          "border-r border-gray-200",
          className
        )}
      >
        <div className="flex items-center justify-between p-4 border-b border-slate-200">
          {!isCollapsed && (
            <div className="flex items-center gap-2">
              <svg
                width="32"
                height="32"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  width="32"
                  height="32"
                  rx="8"
                  fill="url(#paint0_linear_1_2)"
                />
                <path
                  d="M16.25 21.5C18.8525 21.5 21 19.3525 21 16.75C21 14.1475 18.8525 12 16.25 12C13.6475 12 11.5 14.1475 11.5 16.75C11.5 19.3525 13.6475 21.5 16.25 21.5Z"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M16.25 12V8.5"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <defs>
                  <linearGradient
                    id="paint0_linear_1_2"
                    x1="16"
                    y1="0"
                    x2="16"
                    y2="32"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#6A33F5" />
                    <stop offset="1" stopColor="#411D96" />
                  </linearGradient>
                </defs>
              </svg>
              <span className="font-bold text-xl text-gray-800">FlowLane</span>
            </div>
          )}

          <button
            onClick={toggleCollapse}
            className="p-1.5 rounded-md hover:bg-slate-100 transition-all duration-200 hidden lg:block cursor-pointer"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? (
              <ChevronRight className="h-5 w-5 text-slate-500" />
            ) : (
              <ChevronLeft className="h-5 w-5 text-slate-500" />
            )}
          </button>
        </div>

        <nav
          className={cn("flex-1 px-3 py-4", !isCollapsed && "overflow-y-auto")}
        >
          <div className="space-y-4">
            <div>
              <p
                className={`text-xs font-semibold text-slate-400 uppercase tracking-wider ${
                  isCollapsed ? "text-center" : "px-2 pb-2"
                }`}
              >
                Projects
              </p>
              <ul className="space-y-0.5">
                {projects.map((project) => {
                  const isActive = activeProjectId === project.id;
                  return (
                    <li key={project.id} className="relative group">
                      <button
                        onClick={() => handleItemClick(project.id)}
                        className={cn(
                          `
                              w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-left transition-all duration-200 cursor-pointer
                              ${
                                isActive
                                  ? "bg-primary/10 text-primary font-semibold"
                                  : "text-slate-600 hover:bg-slate-100"
                              }`,
                          isCollapsed ? "justify-center" : ""
                        )}
                        title={isCollapsed ? project.name : undefined}
                      >
                        <FileText
                          className={cn(
                            "h-5 w-5 flex-shrink-0",
                            isActive ? "text-primary" : "text-slate-500"
                          )}
                        />
                        {!isCollapsed && (
                          <div className="flex items-center justify-between w-full">
                            <span className="text-sm truncate">
                              {project.name}
                            </span>
                            <span className="text-xs text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-full">
                              {project.columns.todo.tasks.length +
                                project.columns["in-progress"].tasks.length}
                            </span>
                          </div>
                        )}
                      </button>
                      {!isCollapsed && (
                        <div className="absolute right-1 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="relative">
                            <button
                              onClick={() =>
                                setMenuOpen(
                                  menuOpen === project.id ? null : project.id
                                )
                              }
                              className="p-1.5 rounded-md hover:bg-slate-200 cursor-pointer"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </button>
                            {menuOpen === project.id && (
                              <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-xl z-10  overflow-hidden ">
                                <button
                                  onClick={() => {
                                    openRenameDialog(project);
                                    setMenuOpen(null);
                                  }}
                                  className="w-full text-left flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 border-b border-gray-200 cursor-pointer"
                                >
                                  <Edit className="mr-2 h-4 w-4" /> Rename
                                </button>
                                <button
                                  onClick={() => {
                                    openDeleteDialog(project);
                                    setMenuOpen(null);
                                  }}
                                  className="w-full text-left flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 cursor-pointer"
                                >
                                  <Trash2 className="mr-2 h-4 w-4" /> Delete
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {isCollapsed && (
                        <div className="absolute left-full ml-2 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50">
                          {project.name}
                          <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-1.5 h-1.5 bg-slate-800 rotate-45" />
                        </div>
                      )}
                    </li>
                  );
                })}
                <li>
                  <button
                    onClick={() => setAddDialogOpen(true)}
                    className={cn(
                      `
                            w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-left transition-all duration-200 text-slate-500 hover:bg-slate-100 cursor-pointer`,
                      isCollapsed ? "justify-center" : ""
                    )}
                    title={isCollapsed ? "Add Project" : undefined}
                  >
                    <Plus className="h-5 w-5 flex-shrink-0" />
                    {!isCollapsed && (
                      <span className="text-sm">Add Project</span>
                    )}
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </nav>

        <div className="mt-auto border-t border-slate-200 p-3">
          <div className="space-y-1">
            <button
              className={cn(
                `w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-left transition-all duration-200 text-slate-600 hover:bg-slate-100 cursor-pointer`,
                isCollapsed ? "justify-center" : ""
              )}
            >
              <Settings className="h-5 w-5 text-slate-500" />
              {!isCollapsed && <span className="text-sm">Settings</span>}
            </button>
            <button
              className={cn(
                `w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-left transition-all duration-200 text-slate-600 hover:bg-slate-100 cursor-pointer`,
                isCollapsed ? "justify-center" : ""
              )}
            >
              <LifeBuoy className="h-5 w-5 text-slate-500" />
              {!isCollapsed && <span className="text-sm">Support</span>}
            </button>
          </div>
          <div className="border-t my-3" />
          <div className="flex items-center gap-3">
            <img
              src="/images/avatar.jpg"
              alt="Karan Salvi"
              className={cn(
                "rounded-full",
                isCollapsed ? "h-10 w-10" : "h-9 w-9"
              )}
            />
            {!isCollapsed && (
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-semibold truncate">Karan Salvi</p>
                <p className="text-xs text-slate-500 truncate">
                  karansalviwork@gmail.com
                </p>
              </div>
            )}
            {!isCollapsed && (
              <LogOut className="h-5 w-5 text-slate-500 cursor-pointer" />
            )}
          </div>
        </div>
      </div>

      {isAddDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-sm">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold">Create a new project</h2>
            </div>
            <div className="p-4">
              <label
                htmlFor="project-name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Name
              </label>
              <input
                id="project-name"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary"
                placeholder="e.g. Website Redesign"
                onKeyDown={(e) => e.key === "Enter" && handleAddProject()}
              />
            </div>
            <div className="p-4 border-t flex justify-end gap-2 border-gray-200 bg-gray-100">
              <button
                onClick={() => setAddDialogOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-300 rounded-md hover:bg-gray-200 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleAddProject}
                className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary/90 cursor-pointer"
              >
                Create Project
              </button>
            </div>
          </div>
        </div>
      )}

      {isRenameDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 ">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-sm overflow-hidden">
            <div className="p-4 border-b border-gray-300">
              <h2 className="text-lg font-semibold">Rename project</h2>
            </div>
            <div className="p-4">
              <label
                htmlFor="rename-project-name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Name
              </label>
              <input
                id="rename-project-name"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary"
                onKeyDown={(e) => e.key === "Enter" && handleRenameProject()}
              />
            </div>
            <div className="p-4 border-t border-gray-300 flex justify-end gap-2 bg-gray-100">
              <button
                onClick={() => setRenameDialogOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-300 rounded-md hover:bg-gray-200 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleRenameProject}
                className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary/90 cursor-pointer"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {isAlertOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
            <h2 className="text-lg font-semibold">Are you sure?</h2>
            <p className="text-sm text-gray-600 mt-2">
              This action cannot be undone. This will permanently delete the
              project "{projectToDelete?.name}" and all its tasks.
            </p>
            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => setAlertOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
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
