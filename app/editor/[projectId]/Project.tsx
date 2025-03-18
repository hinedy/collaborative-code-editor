import { useEffect, useState } from "react";

import { Share2 } from "lucide-react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";

import { toast } from "@/hooks/use-toast";
import { useParams } from "next/navigation";
import { IProject, IRoom } from "@/lib/store";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/providers/AuthProvider";
import { EndRoomDialog } from "@/components/room/end-room";
import { FileExplorer } from "@/components/editor/file-explorer";
import { CreateRoomDialog } from "@/components/room/create-room";
import { CollaborationStatus } from "@/components/editor/collaboration-status";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import Editor from "./Editor";

export const Project = ({
  roomDetails,
  roomMembers,
}: {
  roomDetails: IRoom | null;
  roomMembers: string[] | null;
}) => {
  const params = useParams();
  const { user } = useAuth();

  const userId = user?.id;
  const projectId = params.projectId as string;
  const [projectData, setProjectData] = useState<IProject | null>(null);

  const [openAccept, setOpenAccept] = useState(false);

  const shareRoom = () => {
    const shareLink = `${window.location.origin}/editor/${projectId}?roomId=${roomDetails?.id}`;
    navigator.clipboard.writeText(shareLink);
    toast({
      title: "Link Copied!",
      description: "Room link copied to clipboard.",
    });
  };

  async function loadProject(projectId: string) {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("id", projectId)
      .single();
    if (error) {
      toast({
        title: "Error",
        description: "Failed to load project details",
        variant: "destructive",
      });

      return;
    }
    setProjectData(data);
  }

  const handleAcceptJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from("room_members").insert({
      room_id: roomDetails?.id,
      user_id: userId,
    });
    if (error) {
      toast({
        title: "Error",
        description: "Failed to join room",
        variant: "destructive",
      });
    } else {
      setOpenAccept(false);
      loadProject(roomDetails?.project_id!!);
    }
  };
  useEffect(() => {
    if (userId && roomMembers && !roomMembers?.includes(userId))
      setOpenAccept(true);
  }, [userId, roomMembers]);

  return (
    <div className="flex h-[calc(100vh-5rem)]">
      <Dialog open={openAccept} onOpenChange={setOpenAccept}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Accept Collaboration Invite</DialogTitle>
            <DialogDescription>
              Join{" "}
              <span className="font-semibold italic">{roomDetails?.name}</span>?
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAcceptJoin}>
            <DialogFooter>
              <Button type="submit">Join Room</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      <PanelGroup direction="horizontal">
        <Panel defaultSize={20} minSize={20} maxSize={40}>
          <FileExplorer projectName={projectData?.name} />
        </Panel>
        <PanelResizeHandle className="w-1 bg-border transition-colors hover:bg-primary" />
        <Panel defaultSize={80}>
          <div className="flex-1 px-4">
            <div className="mb-4 flex items-center justify-between">
              <CollaborationStatus />

              {roomDetails ? (
                <div className="flex gap-3">
                  <Button variant="outline" size="icon" onClick={shareRoom}>
                    <Share2 />
                  </Button>
                  <EndRoomDialog />
                </div>
              ) : (
                <CreateRoomDialog />
              )}
            </div>
            <Editor />
          </div>
        </Panel>
      </PanelGroup>
    </div>
  );
};
