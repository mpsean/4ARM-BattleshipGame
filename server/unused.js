const rooms = {}; // Stores players in rooms, their hasPlacedShip flag, and lastSentData

io.on('connection', (socket) => {
  console.log(
    'A user connected:',
    socket.id,
    'IP address:',
    socket.handshake.headers['x-forwarded-for'],
    'Total connected:',
    io.engine.clientsCount
  );
  io.emit('total connected:', io.engine.clientsCount);

  socket.on('joinRoom', ({ room, playerName }) => {
    // Initialize the room if it doesn't exist
    if (!rooms[assignedRoom]) {
      rooms[assignedRoom] = [];
    }

    // Prevent rejoining the same room
    if (rooms[assignedRoom].some(player => player.id === socket.id)) {
      console.log(`User ${socket.id} is already in room ${assignedRoom}`);
      return;
    }

    // Add the player to the room with additional flags
    if (rooms[assignedRoom] && rooms[assignedRoom].length < 2) {
      rooms[assignedRoom].push({
        id: socket.id,
        name: playerName,
        hasPlacedShip: false,
        lastSentData: null, // Initialize lastSentData for data tracking
      });
      socket.join(assignedRoom);
      console.log(`User ${socket.id} joined room ${assignedRoom}`);

      // Notify players of the new join
      socket.emit('roomJoined', assignedRoom);
      const firstPlayer = rooms[assignedRoom][0];
      if (firstPlayer && firstPlayer.id !== socket.id) {
        socket.emit('userJoined', firstPlayer.name);
      }
      socket.to(assignedRoom).emit('userJoined', playerName);
    } else {
      // Create or join an available room
      const existingRoom = Object.keys(rooms).find(room => rooms[room].length < 2);
      if (existingRoom) {
        assignedRoom = existingRoom;
        if (rooms[assignedRoom].some(player => player.id === socket.id)) {
          console.log(`User ${socket.id} is already in room ${assignedRoom}`);
          return;
        }
        rooms[assignedRoom].push({
          id: socket.id,
          name: playerName,
          hasPlacedShip: false,
          lastSentData: null, // Initialize lastSentData for data tracking
        });
        socket.join(assignedRoom);
        console.log(`User ${socket.id} joined existing room ${assignedRoom}`);
        socket.emit('roomJoined', assignedRoom);
        socket.to(assignedRoom).emit('userJoined', socket.id);
      } else {
        // Create a new room if none are available
        assignedRoom = `room_${Date.now()}`;
        rooms[assignedRoom] = [{
          id: socket.id,
          name: playerName,
          hasPlacedShip: false,
          lastSentData: null, // Initialize lastSentData for data tracking
        }];
        socket.join(assignedRoom);
        console.log(`User ${socket.id} created and joined new room ${assignedRoom}`);
        socket.emit('roomJoined', assignedRoom);
      }
    }
  });

  // Send PlaceShip only if the data has changed
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

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id, 'Total connected:', io.engine.clientsCount);

    for (const room of Object.keys(rooms)) {
      const index = rooms[room].findIndex(player => player.id === socket.id);
      if (index !== -1) {
        const playerName = rooms[room][index].name;
        rooms[room].splice(index, 1);
        socket.to(room).emit('userDisconnected', socket.id, playerName);

        if (rooms[room].length === 0) {
          delete rooms[room];
        }
        console.log(`User ${socket.id} left room ${room}`);
        break;
      }
    }
  });
});
