"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useEditorStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { socket } from "@/lib/socket";

export function CreateJoinRoomDialog() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [roomName, setRoomName] = useState("");
  const [roomId, setRoomId] = useState("");
  const { currentProject, createProject } = useEditorStore();

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomName.trim()) return;

    // If no project is selected, create a new one
    const projectId = currentProject?.id || crypto.randomUUID();
    if (!currentProject) {
      createProject(roomName);
    }

    const newRoomId = crypto.randomUUID();
    socket.emit("room:create", {
      id: newRoomId,
      name: roomName,
      projectId,
    });

    setOpen(false);
    router.push(`/editor/${newRoomId}`);
  };

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomId.trim()) return;

    setOpen(false);
    router.push(`/editor/${roomId}`);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Start Collaboration</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Collaborate</DialogTitle>
          <DialogDescription>
            Create a new room or join an existing one to start collaborating.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="create">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="create">Create Room</TabsTrigger>
            <TabsTrigger value="join">Join Room</TabsTrigger>
          </TabsList>

          <TabsContent value="create">
            <form onSubmit={handleCreate}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="roomName">Room Name</Label>
                  <Input
                    id="roomName"
                    value={roomName}
                    onChange={(e) => setRoomName(e.target.value)}
                    placeholder="My Coding Session"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Create Room</Button>
              </DialogFooter>
            </form>
          </TabsContent>

          <TabsContent value="join">
            <form onSubmit={handleJoin}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="roomId">Room ID</Label>
                  <Input
                    id="roomId"
                    value={roomId}
                    onChange={(e) => setRoomId(e.target.value)}
                    placeholder="Enter room ID"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Join Room</Button>
              </DialogFooter>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
