import { create } from "zustand";

interface Project {
  id: string;
  name: string;
  description?: string;
  files: FileStructure[];
  createdAt: Date;
  updatedAt: Date;
}

interface Room {
  id: string;
  name: string;
  projectId: string;
  participants: Participant[];
  createdBy: string;
}

interface Participant {
  id: string;
  name: string;
  avatar?: string;
  role: "owner" | "editor" | "viewer";
}

interface FileStructure {
  id: string;
  name: string;
  content: string;
  type: "file" | "folder";
  language?: string;
  children?: FileStructure[];
}

interface EditorState {
  // Project State
  projects: Project[];
  currentProject: Project | null;
  // Room State
  currentRoom: Room | null;
  // Editor State
  code: string;
  language: string;
  theme: "vs-dark" | "vs-light";
  files: FileStructure[];
  activeFileId: string | null;
  sidebarOpen: boolean;

  // Project Actions
  setProjects: (projects: Project[]) => void;
  setCurrentProject: (project: Project | null) => void;
  createProject: (name: string, description?: string) => void;
  deleteProject: (id: string) => void;

  // Room Actions
  setCurrentRoom: (room: Room | null) => void;
  joinRoom: (roomId: string) => void;
  leaveRoom: () => void;

  // Editor Actions
  setCode: (code: string) => void;
  setLanguage: (language: string) => void;
  setTheme: (theme: "vs-dark" | "vs-light") => void;
  setFiles: (files: FileStructure[]) => void;
  setActiveFileId: (id: string | null) => void;
  setSidebarOpen: (open: boolean) => void;
  createFile: (
    parentId: string | null,
    name: string,
    type: "file" | "folder",
  ) => void;
  deleteFile: (id: string) => void;
  updateFile: (id: string, content: string) => void;
}

export const useEditorStore = create<EditorState>((set, get) => ({
  // Initial State
  projects: [],
  currentProject: null,
  currentRoom: null,
  code: "",
  language: "typescript",
  theme: "vs-dark",
  files: [],
  activeFileId: null,
  sidebarOpen: false,

  // Project Actions
  setProjects: (projects) => set({ projects }),
  setCurrentProject: (project) => set({ currentProject: project }),
  createProject: (name, description) => {
    const newProject: Project = {
      id: crypto.randomUUID(),
      name,
      description,
      files: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    set((state) => ({
      projects: [...state.projects, newProject],
    }));
  },
  deleteProject: (id) => {
    set((state) => ({
      projects: state.projects.filter((p) => p.id !== id),
    }));
  },

  // Room Actions
  setCurrentRoom: (room) => set({ currentRoom: room }),
  joinRoom: (roomId) => {
    // Socket logic will be handled in the component
    set({
      currentRoom: {
        id: roomId,
        name: "",
        projectId: "",
        participants: [],
        createdBy: "",
      },
    });
  },
  leaveRoom: () => {
    set({ currentRoom: null });
  },

  // Editor Actions
  setCode: (code) => set({ code }),
  setLanguage: (language) => set({ language }),
  setTheme: (theme) => set({ theme }),
  setFiles: (files) => set({ files }),
  setActiveFileId: (activeFileId) => set({ activeFileId }),
  setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
  createFile: (parentId, name, type) => {
    const newFile: FileStructure = {
      id: crypto.randomUUID(),
      name,
      content: "",
      type,
      children: type === "folder" ? [] : undefined,
    };

    set((state) => {
      const updateFiles = (files: FileStructure[]): FileStructure[] => {
        if (!parentId) return [...files, newFile];

        return files.map((file) => {
          if (file.id === parentId && file.type === "folder") {
            return {
              ...file,
              children: [...(file.children || []), newFile],
            };
          }
          if (file.children) {
            return {
              ...file,
              children: updateFiles(file.children),
            };
          }
          return file;
        });
      };

      return { files: updateFiles(state.files) };
    });
  },
  deleteFile: (id) => {
    set((state) => {
      const deleteFromFiles = (files: FileStructure[]): FileStructure[] => {
        return files.filter((file) => {
          if (file.id === id) return false;
          if (file.children) {
            file.children = deleteFromFiles(file.children);
          }
          return true;
        });
      };

      return { files: deleteFromFiles(state.files) };
    });
  },
  updateFile: (id, content) => {
    set((state) => {
      const updateInFiles = (files: FileStructure[]): FileStructure[] => {
        return files.map((file) => {
          if (file.id === id) {
            return { ...file, content };
          }
          if (file.children) {
            return {
              ...file,
              children: updateInFiles(file.children),
            };
          }
          return file;
        });
      };

      return { files: updateInFiles(state.files) };
    });
  },
}));
