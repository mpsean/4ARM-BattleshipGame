import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import UserModel from './model/user.js';  // Removed session-related imports
import { createServer } from "http";
import { Server } from "socket.io";
import userRoutes from './routes/user.js';
import resultRoutes from './routes/result.js';

dotenv.config();
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const PORT = 3001;
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['my-custom-header'],
    credentials: true,
  },
});

let count = 0;
let assignedRoom = '';
const rooms = {}; //for creating socket rooms

io.on('connection', (socket) => {
  console.log(
    'a user connected:',
    socket.id,
    'ip address:',
    socket.handshake.headers['x-forwarded-for'],
    'total connected:',
    io.engine.clientsCount
  );
  io.emit('total connected:', io.engine.clientsCount);

  socket.on('joinRoom', ({room,playerName}) => {

    if (!rooms[assignedRoom]) {  // Create the room if it doesn't exist
        rooms[assignedRoom] = [];
    }
  
    // Check if the socket is already in the room
    if (rooms[assignedRoom].some(player => player.id === socket.id)) {
        console.log(`User ${socket.id} is already in room ${assignedRoom}`);
        return; // Prevent joining again
    }
  
    // Check if the requested room has space
    if (rooms[assignedRoom] && rooms[assignedRoom].length < 2) {
      rooms[assignedRoom].push({ id: socket.id, name: playerName });
      socket.join(assignedRoom);
      console.log(`User ${socket.id} joined room ${assignedRoom}`);
  
        // Notify the user that they've joined
        socket.emit('roomJoined', assignedRoom);
  

            // Check if there’s an existing player in the room
    const firstPlayer = rooms[assignedRoom][0];
    if (firstPlayer && firstPlayer.id !== socket.id) {
      socket.emit('userJoined', firstPlayer.name); // Send the first player's name to the new user
    }

    // Notify the existing player about the new player
    socket.to(assignedRoom).emit('userJoined',  playerName );

    } else {
        // If the requested room is full, find a new room or create a new one
      const existingRoom = Object.keys(rooms).find(room => rooms[room].length < 2);

      if(existingRoom) { 
        assignedRoom = existingRoom;
        if (rooms[assignedRoom].some(player => player.id === socket.id)) {
          console.log(`User ${socket.id} is already in room ${assignedRoom}`);
          return; // Prevent joining again
      }
        rooms[assignedRoom].push({ id: socket.id, name: playerName });
        socket.join(assignedRoom);
        console.log(`User ${socket.id} joined existing room ${assignedRoom}`);
        socket.emit('roomJoined', assignedRoom);
        socket.to(assignedRoom).emit('userJoined', socket.id);
      } else {
        // Create a new room if none are available
        assignedRoom = `room_${Date.now()}`; // Create a unique room name
        rooms[assignedRoom] = [{ id: socket.id, name: playerName }]; // Add the new user to the new room
        socket.join(assignedRoom);
        console.log(`User ${socket.id} created and joined new room ${assignedRoom}`);
        socket.emit('roomJoined', assignedRoom);
      }
    }
  });

  socket.on('updateCount', (newCount) => {
    // Emit the updated count to all users in the room
    const roomsList = Object.keys(rooms);
    for (const room of roomsList) {
      if (rooms[room].some(player => player.id === socket.id)) {
        socket.to(room).emit('countUpdated', newCount);
        break; // Exit after finding the user's room
      }
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id,
      'Total connected:', io.engine.clientsCount
    );

    // Remove user from all rooms they are in
  for (const room of Object.keys(rooms)) {
    const index = rooms[room].findIndex(player => player.id === socket.id);
    if (index !== -1) {
      const playerName = rooms[room][index].name; // Get the player's name
      rooms[room].splice(index, 1); // Remove the user from the room
      socket.to(room).emit('userDisconnected', socket.id, playerName); // Notify others
      // If the room is empty, delete it
      if (rooms[room].length === 0) {
        delete rooms[room]; // Clean up empty rooms
      }
      console.log(`User ${socket.id} left room ${room}`);
      break; // Exit after finding the user's room
    }
  }
  });
});

app.use(cors({
    origin: `http://localhost:5173`, // Replace with your frontend's URL
    // No credentials required
}));


app.use(`/user`, userRoutes);
app.use(`/result`, resultRoutes);

mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Failed to connect to MongoDB', err));

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});



// Remove session-based user check and logout
