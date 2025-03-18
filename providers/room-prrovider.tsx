"use client";

import React, { createContext, useContext } from "react";

import { RoomState, useRoomStore } from "@/lib/store";

const RoomContext = createContext<RoomState | null>(null);

export function RoomProvider({ children }: { children: React.ReactNode }) {
  const roomStore = useRoomStore();

  return (
    <RoomContext.Provider value={roomStore}>{children}</RoomContext.Provider>
  );
}

// Hook to use RoomContext
export function useRoom() {
  const context = useContext(RoomContext);
  if (!context) {
    throw new Error("useRoom must be used within a RoomProvider");
  }
  return context;
}
