"use client";

import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { CreateJoinRoomDialog } from "@/components/room/create-join-room-dialog";
import { ProjectList } from "@/components/project/project-list";
import { CodeIcon, Users } from "lucide-react";

export default function DashboardPage() {
  const { user } = useUser();
  console.log("user", user);

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold">
          Welcome back, {user?.username}!
        </h1>
        <p className="text-muted-foreground">
          Start coding or join a collaboration session.
        </p>
      </div>

      <div className="mb-12 grid gap-6 md:grid-cols-2">
        <div className="rounded-lg border bg-card p-6">
          <div className="mb-4 flex items-center gap-3">
            <CodeIcon className="h-5 w-5" />
            <h2 className="text-xl font-semibold">Quick Start</h2>
          </div>
          <p className="mb-4 text-muted-foreground">
            Start a new coding session or continue where you left off.
          </p>
          <div className="flex gap-3">
            <Button asChild>
              <a href="/editor">Start Coding</a>
            </Button>
            <CreateJoinRoomDialog />
          </div>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <div className="mb-4 flex items-center gap-3">
            <Users className="h-5 w-5" />
            <h2 className="text-xl font-semibold">Collaboration</h2>
          </div>
          <p className="mb-4 text-muted-foreground">
            Join an existing room or create a new one to code with others.
          </p>
          <CreateJoinRoomDialog />
        </div>
      </div>

      <div className="mb-8">
        <h2 className="mb-6 text-2xl font-bold">Your Projects</h2>
        <ProjectList />
      </div>
    </div>
  );
}
