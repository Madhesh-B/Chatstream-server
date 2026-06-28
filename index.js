import express from "express";
import http from "http";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { Server } from "socket.io";

import connectDB from "./config/db.js";
import User from "./models/user.model.js";

dotenv.config();
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

app.get('/', (req, res) => {
  res.json({ message: "dddd" });
});

server.listen(process.env.PORT, () => {
  console.log(`Server started Successfully in the PORT: ${process.env.PORT}`)
})