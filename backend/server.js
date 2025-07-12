import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    // origin: "http://localhost:5173",
    origin: ["https://file-transfer-client-ten.vercel.app"],
    methods: ["GET", "POST"],
  },
});

app.use(cors());

// --- WebSocket logic ---
io.on("connection", (socket) => {
  console.log("✅ A user connected:", socket.id);

  socket.on("sender-join", (data) => {
    socket.join(data.uid);
  });

  socket.on("receiver-join", (data) => {
    console.log("📨 Receiver joined:", data.uid, "Sender UID:", data.sender_uid);

    socket.join(data.uid);
    socket.to(data.sender_uid).emit("init", data.uid);
  });

  socket.on("file-meta", (data) => {
    socket.to(data.uid).emit("fs-meta", data.metadata);
  });

  socket.on("fs-start", (data) => {
    socket.to(data.uid).emit("fs-share", {});
  });

  socket.on("file-raw", (data) => {
    socket.to(data.uid).emit("fs-share", data.buffer);
  });

  socket.on("disconnect", () => {
    console.log("❌ A user disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
