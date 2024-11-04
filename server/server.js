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
let assignedRoom = 'test';
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

    // Check the number of players in the room
    const playersInRoom = rooms[assignedRoom].length;

    // Determine player role based on the number of players
    let playerRole;
    if (playersInRoom === 0) {
      playerRole = 'player1';
    } else if (playersInRoom === 1) {
      playerRole = 'player2';
    } else {
      // Room is full (2 players)
      socket.emit('roomFull');
      return;
    }

  
    // Check if the requested room has space
    if (rooms[assignedRoom] && rooms[assignedRoom].length < 2) {
      rooms[assignedRoom].push({ 
        id: socket.id, 
        playerRole: playerRole,
        hasPlacedShip: false,
        lastSentData: null, 
        lastSentHit: null,
        currentTurn: 'player1-turn'
      });
      socket.join(assignedRoom);
      console.log(`User ${socket.id} joined room ${assignedRoom}`);
  
        // Notify the user that they've joined
        socket.emit('roomJoined', assignedRoom);
  

            // Check if there’s an existing player in the room
    const firstPlayer = rooms[assignedRoom][0];
    if (firstPlayer && firstPlayer.id !== socket.id) {
      socket.emit('userJoined', firstPlayer.name); // Send the first player's name to the new user
      // console.log(JSON.stringify(rooms[assignedRoom][0]))
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
        rooms[assignedRoom].push(
          { id: socket.id, 
          name: playerName,
          playerRole: playerRole,
          hasPlacedShip: false,
          lastSentData: null, 
          lastSentHit: null,
          currentTurn: 'player1-turn' }
        );
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
    socket.emit('playerAssigned', { role: playerRole });
    console.log(JSON.stringify(rooms[assignedRoom]))
  });

  socket.on('updateCount', (newCount) => {
    // Emit the updated count to all users in the room
    console.log('updateCount')

    const roomsList = Object.keys(rooms);
    for (const room of roomsList) {
      if (rooms[room].some(player => player.id === socket.id)) {
        console.log(room)
        socket.to(room).emit('countUpdated', newCount);
        break; // Exit after finding the user's room
      }
    }
  });

  //** get placeship */
    // have flag
    socket.on('sendPlayerPlaceShip', (data) => {
      console.log("sendPlayerPlaceShip");
  
      const roomId = Object.keys(rooms).find(room => rooms[room].some(player => player.id === socket.id));
      if (!roomId) {
        console.log("Room ID is null; player is not in any room.");
        return;
      }
      const playerIndex = rooms[roomId].findIndex(player => player.id === socket.id);
      const player = rooms[roomId][playerIndex];
  
      // Check if the data has changed
      if (JSON.stringify(player.lastSentData) === JSON.stringify(data)) {
        console.log("Data has not changed, skipping emit.");
        return;
      }
  
      // Update lastSentData and mark player as having placed their ship
      player.lastSentData = data;
      rooms[roomId][playerIndex].hasPlacedShip = true;
  
      const opponent = rooms[roomId].find(player => player.id !== socket.id);
      if (opponent) {
        console.log(`Sending data to opponent (ID: ${opponent.id})`);
        socket.to(opponent.id).emit('receiveOppPlaceShip', data);
      } else {
        console.log("Opponent not found in room.");
      }
    });

    //** Timer */
    socket.on('timerStart', (bool) => {
      console.log('timerStart', bool)
      const roomId = Object.keys(rooms).find(room => rooms[room].some(player => player.id === socket.id));
      
      const room = rooms[roomId];
      if (!room) {
        console.log(`Room with ID ${roomId} does not exist.`);
        return;
      }
      
      while(bool){
        io.to(roomId).emit("turnChanged", { currentTurn: rooms[roomId].currentTurn }); //send inital state
      
        setTimeout(() => {
          changeTurn(roomId);
        }, 10000); // 10-second delay
      }
    });

      const changeTurn = (roomId) => {

        const room = rooms[roomId];
        if (!room) return;

        // Toggle between player1 and player2
        room.currentTurn = room.currentTurn === "'player1-turn'" ? "'player2-turn'" : "'player1-turn'";

        // Notify players in the room about the turn change
        io.to(roomId).emit("turnChanged", { currentTurn: room.currentTurn });
      };


    //** control Hit */
    socket.on('sendHitsByPlayer', (data) => {
      console.log("sendHitsByPlayer");
  
      const roomId = Object.keys(rooms).find(room => rooms[room].some(player => player.id === socket.id));
      if (!roomId) {
        console.log("Room ID is null; player is not in any room. (control Hit)");
        return;
      }
      const playerIndex = rooms[roomId].findIndex(player => player.id === socket.id);
      const player = rooms[roomId][playerIndex];
  
      // Check if the data has changed
      if (JSON.stringify(player.lastSentHit) === JSON.stringify(data)) {
        console.log("Data has not changed, skipping emit. (control Hit)");
        return;
      }
  
      // Update lastSentData 
      player.lastSentHit = data;
      player.dataChanged = true;
      // rooms[roomId][playerIndex].hasPlacedShip = true;
  
      const opponent = rooms[roomId].find(player => player.id !== socket.id);
      if (opponent&&player.dataChanged) {
        console.log(`Sending HIT data to opponent (ID: ${opponent.id})`);
        socket.to(opponent.id).emit('receiveHit', data);
        player.dataChanged = false;
      } else {
        console.log("Opponent not found in room. (control Hit)");
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
    origin: `*`, // Replace with your frontend's URL
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
