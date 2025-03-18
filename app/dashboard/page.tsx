"use client";
import { Users } from "lucide-react";

import { ProjectList } from "@/components/project/project-list";
import { JoinRoomDialog } from "@/components/room/join-room-dialog";

export default function DashboardPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold">Welcome back!</h1>
        <p className="text-muted-foreground">
          Start coding or join a collaboration session.
        </p>
      </div>

      <div className="mb-12 grid gap-6 md:grid-cols-2">
        <div className="rounded-lg border bg-card p-6">
          <div className="mb-4 flex items-center gap-3">
            <Users className="h-5 w-5" />
            <h2 className="text-xl font-semibold">Collaboration</h2>
          </div>
          <p className="mb-4 text-muted-foreground">
            Join an existing room or create a new one to code with others.
          </p>
          <JoinRoomDialog />
        </div>
      </div>

      <div className="mb-8">
        <ProjectList />
      </div>
    </div>
  );
}
