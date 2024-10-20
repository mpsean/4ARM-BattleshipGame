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





  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id,
      'total connected:', io.engine.clientsCount
    );
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
