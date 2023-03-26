import express from "express";
import cors from "cors";
import { PrismaClient } from '@prisma/client'
import { router } from "./routes/routes.js";
import bodyParser from "body-parser";
import { Server } from 'socket.io';
import { createServer } from 'http';

const app = express();
const server = createServer(app); 
export const io = new Server(server, { cors: { origin: '*' } });
io.on('connection', (socket) => {
  // console.log(`Client ${socket.id} connected`);
  
  socket.on('joinRideRoom', (roomId) => {
    // console.log(`Client ${socket.id} left room ${roomId}`);
    socket.leave(roomId);
  });

  // Handler for joining a room
  socket.on('joinRideRoom', (roomId) => {
    // console.log(`Client ${socket.id} joined room ${roomId}`);
    socket.join(roomId);
  });

  
  // Handler for disconnecting
  socket.on('disconnect', () => {
    // console.log(`Client ${socket.id} disconnected`);
  });
});



app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cors({
  origin: " http://127.0.0.1:5173",
  credentials: true,
  optionSuccessStatus: 200
}));

export const prisma = new PrismaClient();
app.use('/api', router);

app.listen(5000, () => {
  console.log(`App started on port 5000`)
});

server.listen(5001, () => {
  console.log(`Server listening on port ${5001}`);
});