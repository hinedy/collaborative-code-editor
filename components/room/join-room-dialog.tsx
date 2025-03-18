"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabaseClient";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function JoinRoomDialog() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [roomId, setRoomId] = useState("");

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomId.trim()) return;

    const { data } = await supabase
      .from("rooms")
      .select("*")
      .eq("id", roomId)
      .single();

    setOpen(false);
    router.push(`/editor/${data.project_id}?roomId=${roomId}`);
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
            Join an existing room to start collaborating.
          </DialogDescription>
        </DialogHeader>

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
      </DialogContent>
    </Dialog>
  );
}
