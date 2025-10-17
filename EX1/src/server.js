// server.js
import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import { crawlAll } from "./services/crawlService.js";

const app = express();
app.use(cors({ origin: "*", methods: ["GET", "POST"] }));

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST"] },
  transports: ["websocket", "polling"],
});

let waitingPlayer = null;

io.on("connection", (socket) => {
  console.log("🟢 Player connected:", socket.id);

  socket.on("joinGame", () => {
    if (waitingPlayer && waitingPlayer.id === socket.id) return;

    if (waitingPlayer) {
      const player1 = waitingPlayer;
      const player2 = socket;
      const roomId = `room_${player1.id}_${player2.id}`;

      player1.join(roomId);
      player2.join(roomId);

      const white = Math.random() < 0.5 ? player1 : player2;
      const black = white === player1 ? player2 : player1;

      white.data = { color: "w", opponent: black.id, roomId };
      black.data = { color: "b", opponent: white.id, roomId };

      white.emit("assignColor", {
        color: "w",
        selfId: white.id,
        opponentId: black.id,
      });

      black.emit("assignColor", {
        color: "b",
        selfId: black.id,
        opponentId: white.id,
      });

      io.to(roomId).emit("status", "⚔️ Match started!");
      console.log(`✅ Room ${roomId}: ${white.id}(W) vs ${black.id}(B)`);

      waitingPlayer = null;
    } else {
      waitingPlayer = socket;
      socket.emit("status", "⏳ Waiting for opponent...");
    }
  });

  socket.on("move", (move) => {
    const roomId = socket.data?.roomId;
    if (roomId) socket.to(roomId).emit("move", move);
  });

  socket.on("resetGame", () => {
    const roomId = socket.data?.roomId;
    if (roomId) io.to(roomId).emit("resetGame");
  });

  socket.on("disconnect", () => {
    if (waitingPlayer && waitingPlayer.id === socket.id) {
      waitingPlayer = null;
    }

    const roomId = socket.data?.roomId;
    if (roomId) {
      socket.to(roomId).emit("opponentLeft");
    }
    console.log("🔴 Disconnected:", socket.id);
  });
});

server.listen(3001, "0.0.0.0", () => {
  console.log("🚀 Chess socket server running on http://localhost:3001");

  (async () => {
    await crawlAll();
  })();
});
