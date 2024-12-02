const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

// Store room data
const rooms = new Map();

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Handle room creation
  socket.on("room:create", ({ id, name, projectId }) => {
    rooms.set(id, {
      id,
      name,
      projectId,
      participants: new Set([socket.id]),
      code: "",
    });
    socket.join(id);
    console.log(`Room created: ${id}`);
  });

  // Handle room joining
  socket.on("room:join", (roomId) => {
    const room = rooms.get(roomId);
    if (room) {
      room.participants.add(socket.id);
      socket.join(roomId);
      // Send current code to the new participant
      socket.emit("code:init", room.code);
      console.log(`User ${socket.id} joined room: ${roomId}`);
    }
  });

  // Handle code changes
  socket.on("code:change", ({ roomId, code }) => {
    const room = rooms.get(roomId);
    if (room) {
      room.code = code;
      socket.to(roomId).emit("code:update", code);
    }
  });

  // Handle room leaving
  socket.on("room:leave", (roomId) => {
    const room = rooms.get(roomId);
    if (room) {
      room.participants.delete(socket.id);
      socket.leave(roomId);
      if (room.participants.size === 0) {
        rooms.delete(roomId);
      }
      console.log(`User ${socket.id} left room: ${roomId}`);
    }
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    rooms.forEach((room, roomId) => {
      if (room.participants.has(socket.id)) {
        room.participants.delete(socket.id);
        if (room.participants.size === 0) {
          rooms.delete(roomId);
        }
      }
    });
    console.log("User disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Socket.IO server running on port ${PORT}`);
});
