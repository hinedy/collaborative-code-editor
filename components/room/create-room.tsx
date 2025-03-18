"use client";
import { useEffect, useState } from "react";

import { toast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/providers/AuthProvider";
import { useParams, useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useRoom } from "@/providers/room-prrovider";

export function CreateRoomDialog() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [roomName, setRoomName] = useState("");
  const { user } = useAuth();
  const params = useParams();
  const projectId = params.projectId as string;

  const { isChecking, existingRoom, checkActiveRoom, setExistingRoom } =
    useRoom();

  useEffect(() => {
    if (open) {
      checkActiveRoom(projectId);
    }
  }, [open, checkActiveRoom, projectId]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!roomName.trim() || isChecking || existingRoom) return;
    const { data, error } = await supabase
      .from("rooms")
      .insert({
        name: roomName,
        project_id: projectId,
        created_by: user?.id,
      })
      .select()
      .single();

    if (error) {
      toast({
        title: "Error",
        description: "Failed to create room",
        variant: "destructive",
      });
    } else {
      setExistingRoom(data.id);
      setOpen(false);
      router.push(`/editor/${projectId}?roomId=${data.id}`);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Create Room</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Collaborate</DialogTitle>
          <DialogDescription>
            Create a new room to start collaborating.
          </DialogDescription>
        </DialogHeader>

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
      </DialogContent>
    </Dialog>
  );
}
