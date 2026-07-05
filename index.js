import "dotenv/config";
import express from "express";
import http from "http";
import cors from "cors";
import cookie from "cookie";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import { Server } from "socket.io";

import connectDB from "./config/db.js";
import isAuth from "./middlewares/auth.middleware.js";

import authRoutes from "./routes/auth.route.js";
import accountRoutes from "./routes/account.route.js";
import uploadRoutes from "./routes/upload.route.js";

connectDB();

const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET_KEY));
app.use(cors({
  origin: (origin, callBack) => {
    if (!origin) return callBack(null, true);
    let isallowedOrigins = origin.startsWith("http://localhost") || origin === process.env.CLIENT_URL;
    if (isallowedOrigins) return callBack(null, true);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));


const socket = new Server(server, {
  cors: {
    origin: (origin, callBack) => {
      if (!origin) return callBack(null, true);
      let isallowedOrigins = origin.startsWith("http://localhost") || origin === process.env.CLIENT_URL;
      if (isallowedOrigins) return callBack(null, true);
      return callback(new Error('Not allowed by CORS'));
    },
    methods: ['GET', 'POST'],
    credentials: true,
  }
});

const chatsSocket = socket.of('/chats');

chatsSocket.use((socket, next) => {
  const cookies = cookie.parse(socket.handshake.headers.cookie || "");
  if (!cookies) return next(new Error("Unauthorized"));
  const token = cookieParser.signedCookie(cookies, process.env.COOKIE_SECRET_KEY);
  if (!token) return next(new Error("Unauthorized"));
  try {
    const { id } = jwt.verify(token, process.env.JWT_SECRET_KEY);
    socket.userId = id;
    next();
  } catch (error) {
    return next(new Error("Unauthorized"));
  }
  next();
});

app.use("/api/auth/", authRoutes);
app.use("/api/account/", isAuth, accountRoutes);
app.use("/api/upload/", isAuth, uploadRoutes);

server.listen(process.env.PORT, () => {
  console.log(`Server started Successfully in the PORT: ${process.env.PORT}`);
})