import React, { useState } from "react";
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
import { useRoomStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "@/hooks/use-toast";

export const EndRoomDialog = () => {
  const [open, setOpen] = useState(false);
  const { existingRoom, setExistingRoom } = useRoomStore();
  const router = useRouter();

  const handleEndRoom = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!existingRoom) return;

    const { error } = await supabase
      .from("rooms")
      .update({ is_active: false, deleted_at: new Date() })
      .eq("id", existingRoom);
    if (error) {
      toast({
        title: "Error",
        description: "Failed to end the room session.",
        variant: "destructive",
      });
      console.error("Error ending room session:", error.message);
      return;
    }
    setExistingRoom(null);

    router.push(`/projects`);
    toast({
      title: "Room Ended",
      description: "The room session has been ended successfully.",
    });
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive">End Room</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>End Room</DialogTitle>
          <DialogDescription>
            Are you sure you want to end this room seesion
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleEndRoom}>
          <DialogFooter>
            <Button variant="destructive" type="submit">
              End Room
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
