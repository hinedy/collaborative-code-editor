"use client";
import { useEffect, useState } from "react";

import { IRoom } from "@/lib/store";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabaseClient";
import { useSearchParams } from "next/navigation";

import { Project } from "./Project";

export default function EditorPage() {
  const searchParams = useSearchParams();
  const roomId = searchParams.get("roomId");
  const [roomDetails, setRoomDetails] = useState<IRoom | null>(null);
  const [roomMembers, setRoomMembers] = useState<string[] | null>(null);

  useEffect(() => {
    async function loadRoomDetails(roomId: string) {
      const { data, error } = await supabase
        .from("rooms")
        .select("*")
        .eq("id", roomId)
        .single();

      if (error) {
        toast({
          title: "Error",
          description: "Failed to load room details",
          variant: "destructive",
        });

        return;
      }
      setRoomDetails(data);
      getRoomMembers(roomId, data.created_by);
    }
    async function getRoomMembers(roomId: string, created_by: string) {
      const { data, error } = await supabase
        .from("room_members")
        .select("*")
        .eq("room_id", roomId);
      if (error) {
        toast({
          title: "Error",
          description: "Failed to load room details",
          variant: "destructive",
        });

        return;
      }
      const members = data.map((member) => member.user_id);
      setRoomMembers([...members, created_by]);
    }

    if (roomId) {
      loadRoomDetails(roomId);
    }
  }, [roomId]);

  return <Project roomDetails={roomDetails} roomMembers={roomMembers} />;
}
