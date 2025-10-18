import express from "express";
import http from "http";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import cors from "cors";

const app = express();
app.use(cors());
const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "http://localhost:5173" }, // your React app URL
});

const SECRET = "supersecretkey"; // use env var in production

// ✅ Middleware: Authenticate socket connection
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) return next(new Error("No token provided"));

  try {
    const user = jwt.verify(token, SECRET);
    socket.user = user; // attach user info to socket
    next();
  } catch {
    next(new Error("Invalid token"));
  }
});

// ✅ Handle connections
io.on("connection", (socket) => {
  console.log(`${socket.user.email} connected`);

  // Send welcome message
  socket.emit("serverMessage", `Welcome ${socket.user.email}!`);

  // When client sends a chat message
  socket.on("chatMessage", (message) => {
    const payload = {
      user: socket.user.email,
      message,
      time: new Date().toLocaleTimeString(),
    };

    // Broadcast message to everyone
    io.emit("chatMessage", payload);
  });

  socket.on("disconnect", () => {
    console.log(`${socket.user.email} disconnected`);
  });
});

server.listen(5500, () => console.log("Server running on port 5500"));
