import { create } from "zustand";
import { persist } from "zustand/middleware";
import { supabase } from "./supabaseClient";

export interface IProject {
  created_at: string;
  created_by: string;
  deleted_at: string | null;
  id: string;
  name: string;
  description: string;
  updated_at: string;
}

export interface IRoom {
  id: string;
  name: string;
  project_id: string;
  created_by: string;
  is_active: boolean;
  deleted_at: string | null;
  updated_at: string;
}

export type RoomState = {
  isChecking: boolean;
  existingRoom: string | null;
  setIsChecking: (checking: boolean) => void;
  setExistingRoom: (roomId: string | null) => void;
  checkActiveRoom: (projectId: string) => Promise<void>;
};
export const useRoomStore = create<RoomState>()(
  persist(
    (set) => ({
      isChecking: false,
      existingRoom: null,
      setIsChecking: (checking) => set({ isChecking: checking }),
      setExistingRoom: (roomId) => set({ existingRoom: roomId }),
      checkActiveRoom: async (projectId) => {
        set({ isChecking: true });
        const { data, error } = await supabase.rpc("check_active_room", {
          p_project_id: projectId,
        });

        if (error) {
        } else if (data?.[0]?.has_active_room) {
          set({ existingRoom: data[0].room_id });
        } else {
          set({ existingRoom: null });
        }
        set({ isChecking: false });
      },
    }),
    {
      name: "room-storage", // Key to persist in localStorage
    },
  ),
);
interface EditorState {
  projects: IProject[];
  theme: "vs-dark" | "vs-light";
  activeFileId: string | null;
  setActiveFileId: (activeFileId: string | null) => void;
  setProjects: (projects: IProject[]) => void;
  setTheme: (theme: "vs-dark" | "vs-light") => void;
}

export const useEditorStore = create<EditorState>((set) => ({
  projects: [],
  theme: "vs-dark",
  activeFileId: null,
  setActiveFileId: (activeFileId) => set({ activeFileId }),
  setProjects: (projects) => set({ projects }),
  setTheme: (theme) => set({ theme }),
}));
