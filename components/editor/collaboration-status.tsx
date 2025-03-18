"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Collaborator {
  id: string;
  name: string;
  avatar?: string;
}

export function CollaborationStatus() {
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);

  return (
    <div className="flex -space-x-2">
      {collaborators.map((user) => (
        <Tooltip key={user.id}>
          <TooltipTrigger>
            <Avatar className="h-8 w-8 border-2 border-background">
              <AvatarImage src={user.avatar} />
              <AvatarFallback>
                {user.name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </TooltipTrigger>
          <TooltipContent>
            <p>{user.name}</p>
          </TooltipContent>
        </Tooltip>
      ))}
    </div>
  );
}
