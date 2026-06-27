import express from "express";
import http from "http";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { Server } from "socket.io";

import connectDB from "./config/db.js";

dotenv.config();

connectDB();

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: (origin, callBack) => {
    if (!origin) return callBack(null, true);
    let isallowedOrigins = origin.startsWith("http://localhost") || origin === process.env.CLIENT_URL;
    if (isallowedOrigins) return callBack(null, true);
    return callback(new Error('Not allowed by CORS'));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ['GET', 'POST'],
    credentials: true,
  }
});


app.get('/', (req, res) => {
  res.json({ message: "dddd" });
});



server.listen(process.env.PORT, () => {
  console.log(`Server started Successfully in the PORT: ${process.env.PORT}`)
})