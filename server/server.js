import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import UserModel from "./model/user.js"; // Removed session-related imports
import { createServer } from "http";
import { Server } from "socket.io";
import userRoutes from "./routes/user.js";
import resultRoutes from "./routes/result.js";

dotenv.config();
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const PORT = 3001;
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true,
  },
});

app.use(express.static("public"));

let clientCount = 0;
let assignedRoom = "test";
const rooms = {}; //for creating socket rooms

io.on("connection", (socket) => {
  console.log(
    "a user connected:",
    socket.id,
    "ip address:",
    socket.handshake.headers["x-forwarded-for"],
    "total connected:",
    io.engine.clientsCount
  );

  clientCount++;
  io.emit("clientCount", clientCount);

  socket.on("joinRoom", ({ room, playerName }) => {
    if (!rooms[assignedRoom]) {
      // Create the room if it doesn't exist
      rooms[assignedRoom] = [];
    }

    // Check if the socket is already in the room
    if (rooms[assignedRoom].some((player) => player.id === socket.id)) {
      console.log(`User ${socket.id} is already in room ${assignedRoom}`);
      return; // Prevent joining again
    }

    // Check the number of players in the room
    const playersInRoom = rooms[assignedRoom].length;

    // Determine player role based on the number of players
    let playerRole;
    if (playersInRoom === 0) {
      playerRole = "player1";
    } else if (playersInRoom === 1) {
      playerRole = "player2";
    }

    // Check if the requested room has space
    if (rooms[assignedRoom] && rooms[assignedRoom].length < 2) {
      console.log(`people`, rooms[assignedRoom].length);
      rooms[assignedRoom].push({
        id: socket.id,
        name: playerName,
        playerRole: playerRole,
        hasPlacedShip: false,
        lastSentData: null,
        lastSentHit: null,
        currentTurn: "player1-turn",
      });
      socket.join(assignedRoom);
      console.log(rooms[assignedRoom]);
      socket.emit("playerAssigned", { role: playerRole });

      // Notify the user that they've joined
      socket.emit("roomJoined", assignedRoom);

      // Check if there’s an existing player in the room
      const firstPlayer = rooms[assignedRoom][0];
      if (firstPlayer && firstPlayer.id !== socket.id) {
        socket.emit("userJoined", firstPlayer.name); // Send the first player's name to the new user
        // console.log(JSON.stringify(rooms[assignedRoom][0]))
      }

      // Notify the existing player about the new player
      socket.to(assignedRoom).emit("userJoined", playerName);
    } else {
      // If the requested room is full, find a new room or create a new one
      const existingRoom = Object.keys(rooms).find(
        (room) => rooms[room].length < 2
      );

      if (existingRoom) {
        assignedRoom = existingRoom;

        const playersInRoom = rooms[assignedRoom].length;

        // Determine player role based on the number of players
        let playerRole;
        if (playersInRoom === 0) {
          playerRole = "player1";
        } else if (playersInRoom === 1) {
          playerRole = "player2";
        }

        if (rooms[assignedRoom].some((player) => player.id === socket.id)) {
          console.log(`User ${socket.id} is already in room ${assignedRoom}`);
          return; // Prevent joining again
        }
        rooms[assignedRoom].push({
          id: socket.id,
          name: playerName,
          playerRole: playerRole,
          hasPlacedShip: false,
          lastSentData: null,
          lastSentHit: null,
          currentTurn: "player1-turn",
        });
        socket.join(assignedRoom);
        console.log(`User ${socket.id} joined existing room ${assignedRoom}`);
        socket.emit("roomJoined", assignedRoom);
        socket.to(assignedRoom).emit("userJoined", socket.id);
        socket.emit("playerAssigned", { role: playerRole });
      } else {
        // Create a new room if none are available
        assignedRoom = `room_${Date.now()}`; // Create a unique room name
        rooms[assignedRoom] = [];
        const playersInRoom = rooms[assignedRoom].length;

        // Determine player role based on the number of players
        let playerRole;
        if (playersInRoom === 0) {
          playerRole = "player1";
        } else if (playersInRoom === 1) {
          playerRole = "player2";
        }
        rooms[assignedRoom].push({
          id: socket.id,
          name: playerName,
          playerRole: playerRole,
          hasPlacedShip: false,
          lastSentData: null,
          lastSentHit: null,
          currentTurn: "player1-turn",
        }); // Add the new user to the new room
        socket.join(assignedRoom);
        console.log(
          `User ${socket.id} created and joined new room ${assignedRoom}`
        );
        socket.emit("roomJoined", assignedRoom);
        socket.emit("playerAssigned", { role: playerRole });
      }
    }
    //socket.emit("playerAssigned", { role: playerRole });
    //console.log(JSON.stringify(rooms[assignedRoom]))
  });

  socket.on("updateCount", (newCount) => {
    // Emit the updated count to all users in the room
    console.log("updateCount");

    const roomsList = Object.keys(rooms);
    for (const room of roomsList) {
      if (rooms[room].some((player) => player.id === socket.id)) {
        console.log(room);
        socket.to(room).emit("countUpdated", newCount);
        break; // Exit after finding the user's room
      }
    }
  });

  //** get placeship */
  // have flag
  socket.on("sendPlayerPlaceShip", (data) => {
    console.log("sendPlayerPlaceShip");

    const roomId = Object.keys(rooms).find((room) =>
      rooms[room].some((player) => player.id === socket.id)
    );
    if (!roomId) {
      console.log("Room ID is null; player is not in any room.");
      return;
    }
    const playerIndex = rooms[roomId].findIndex(
      (player) => player.id === socket.id
    );
    const player = rooms[roomId][playerIndex];

    // Check if the data has changed
    if (JSON.stringify(player.lastSentData) === JSON.stringify(data)) {
      console.log("Data has not changed, skipping emit.");
      return;
    }

    // Update lastSentData and mark player as having placed their ship
    player.lastSentData = data;
    rooms[roomId][playerIndex].hasPlacedShip = true;

    const opponent = rooms[roomId].find((player) => player.id !== socket.id);
    if (opponent) {
      console.log(`Sending data to opponent (ID: ${opponent.id})`);
      socket.to(opponent.id).emit("receiveOppPlaceShip", data);
    } else {
      console.log("Opponent not found in room.");
    }
  });

  //** Timer----------------------------------------------------- */
  // Initialize a timer only once when starting the game.
  let second = 10;
  let isRunning = false;

  socket.on("timerStart", (gameover) => {
    //console.log('timerStart received:', gameover);

    const roomId = Object.keys(rooms).find((room) =>
      rooms[room].some((player) => player.id === socket.id)
    );
    const room = rooms[roomId];

    if (!room) {
      //console.log(`Room with ID ${roomId} does not exist.`);
      return;
    }

    isRunning = true;
    // Only start a new interval if one doesn't already exist for the room
    if (!room.turnInterval && isRunning) {
      console.log("TIMER IS STILL WORKING (EVERY 10 SEC)");
      room.turnInterval = setInterval(() => {
        second -= 1; // Decrement the timer by 1 second
        console.log("Seconds remaining:", second);

        // Check if the timer has reached zero
        if (second === 0) {
          changeTurn(roomId); // Change the turn when timer reaches zero
          console.log(`TIMEUP Turn changed for room ${roomId}`);
          resetTimer(); // Reset the timer for the next turn
        }
      }, 1000); // Run the code every 1 second
    }

    // Handle gameover message
    socket.on("gameover", (isGameOver) => {
      if (isGameOver) {
        console.log("TIMER IS gameover");

        // Stop the interval if the game is truly over
        isRunning = false;
        clearInterval(room.turnInterval);
        room.turnInterval = null; // Clear reference to stop future changes
        io.to(roomId).emit("gameEnded", { message: "Game over!" });
      }
    });
  })

  const resetTimer = () => {
    second = 10;
    console.log("RESETTIMER");
  };

  const changeTurn = (roomId) => {
    const room = rooms[roomId];
    if (!room) return;

    if (isRunning) {
      // Toggle between 'player1-turn' and 'player2-turn'
      room.currentTurn =
        room.currentTurn === "player1-turn" ? "player2-turn" : "player1-turn";
    }

    // Notify players in the room about the turn change
    console.log("TURNCHANGES BITCH");
    io.to(roomId).emit("turnChanged", { currentTurn: room.currentTurn });
    resetTimer();
  };

  //------------------------------------------------------------------------------

  //** control Hit */
  socket.on("sendHitsByPlayer", (data) => {
    console.log("sendHitsByPlayer");

    const roomId = Object.keys(rooms).find((room) =>
      rooms[room].some((player) => player.id === socket.id)
    );
    if (!roomId) {
      console.log("Room ID is null; player is not in any room. (control Hit)");
      return;
    }
    changeTurn(roomId);

    const playerIndex = rooms[roomId].findIndex(
      (player) => player.id === socket.id
    );
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

    const opponent = rooms[roomId].find((player) => player.id !== socket.id);
    if (opponent && player.dataChanged) {
      console.log(`Sending HIT data to opponent (ID: ${opponent.id})`);
      console.log(`checking received data: ${data}`);
      socket.to(opponent.id).emit("receiveHit", data);
      player.dataChanged = false;
    } else {
      console.log("Opponent not found in room. (control Hit)");
    }
  });

  //** sendWinner */
  socket.on("sendWinner", (data) => {
    console.log("sendWinner");

    const roomId = Object.keys(rooms).find((room) =>
      rooms[room].some((player) => player.id === socket.id)
    );
    if (!roomId) {
      console.log("Room ID is null; player is not in any room.");
      return;
    }
    const playerIndex = rooms[roomId].findIndex(
      (player) => player.id === socket.id
    );
    const player = rooms[roomId][playerIndex];

    // // Check if the data has changed

    // Update lastSentData and mark player as having placed their ship
    player.lastSentWinner = data;

    const opponent = rooms[roomId].find((player) => player.id !== socket.id);
    if (opponent) {
      console.log(`Sending data to opponent (ID: ${opponent.id})`);
      socket.to(opponent.id).emit("receiveWinner", data);
    } else {
      console.log("Opponent not found in room.");
    }
  });

  //** checkReady */
  socket.on("checkReady", (data) => {
    console.log("checkReady received:", data);

    const roomId = Object.keys(rooms).find((room) =>
      rooms[room].some((player) => player.id === socket.id)
    );

    if (!roomId) {
      console.log("Room ID is null; player is not in any room.");
      return;
    }

    const playerIndex = rooms[roomId].findIndex(
      (player) => player.id === socket.id
    );
    const player = rooms[roomId][playerIndex];

    // Update player's ready status
    player.ready = data === true;

    // Check if both players in the room are ready
    const allPlayersReady = rooms[roomId].every((player) => player.ready);

    if (allPlayersReady) {
      console.log(`Both players in room ${roomId} are ready.`);
      // Emit 'bothReady' to all players in the room
      io.to(roomId).emit("bothReady", true);
    } else {
      console.log(`Waiting for both players to be ready in room ${roomId}.`);
    }
  });

  socket.on(`resetServer`, () => {
    console.log("resetServer received");
    io.emit(`serverReset`);
  });

  socket.on("disconnect", () => {
    console.log(
      "Client disconnected:",
      socket.id,
      "Total connected:",
      io.engine.clientsCount
    );

    clientCount--;
    io.emit("clientCount", clientCount);

    // Remove user from all rooms they are in
    for (const roomId of Object.keys(rooms)) {
      const room = rooms[roomId];
      const index = room.findIndex((player) => player.id === socket.id);
      if (index !== -1) {
        const playerName = room[index].name;
        room.splice(index, 1);

        // Notify others in the room
        socket.to(roomId).emit("userDisconnected", socket.id, playerName);

        // If the room is empty, clear its interval and delete it
        if (room.length === 0) {
          clearInterval(room.turnInterval);
          delete rooms[roomId];
        }
        break;
      }
    }
  });
});

app.use(
  cors({
    origin: `*`, // Replace with your frontend's URL
    // No credentials required
  })
);

app.use(`/user`, userRoutes);
app.use(`/result`, resultRoutes);

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Failed to connect to MongoDB", err));

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Remove session-based user check and logout
