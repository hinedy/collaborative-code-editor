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
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, {user?.username}!
        </h1>
        <p className="text-muted-foreground">
          Start coding or join a collaboration session.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-12">
        <div className="p-6 border rounded-lg bg-card">
          <div className="flex items-center gap-3 mb-4">
            <CodeIcon className="h-5 w-5" />
            <h2 className="text-xl font-semibold">Quick Start</h2>
          </div>
          <p className="text-muted-foreground mb-4">
            Start a new coding session or continue where you left off.
          </p>
          <div className="flex gap-3">
            <Button asChild>
              <a href="/editor">Start Coding</a>
            </Button>
            <CreateJoinRoomDialog />
          </div>
        </div>

        <div className="p-6 border rounded-lg bg-card">
          <div className="flex items-center gap-3 mb-4">
            <Users className="h-5 w-5" />
            <h2 className="text-xl font-semibold">Collaboration</h2>
          </div>
          <p className="text-muted-foreground mb-4">
            Join an existing room or create a new one to code with others.
          </p>
          <CreateJoinRoomDialog />
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-6">Your Projects</h2>
        <ProjectList />
      </div>
    </div>
  );
}
