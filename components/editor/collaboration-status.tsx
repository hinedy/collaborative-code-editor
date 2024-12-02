"use client"

import { useEffect, useState } from "react"
import { socket } from "@/lib/socket"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

interface Collaborator {
  id: string
  name: string
  avatar?: string
}

export function CollaborationStatus() {
  const [collaborators, setCollaborators] = useState<Collaborator[]>([])

  useEffect(() => {
    socket.on("collaborator:join", (user: Collaborator) => {
      setCollaborators((prev) => [...prev, user])
    })

    socket.on("collaborator:leave", (userId: string) => {
      setCollaborators((prev) => prev.filter((u) => u.id !== userId))
    })

    return () => {
      socket.off("collaborator:join")
      socket.off("collaborator:leave")
    }
  }, [])

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
  )
}