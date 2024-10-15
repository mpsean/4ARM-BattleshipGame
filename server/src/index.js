import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { createServer } from "http";
import { Server } from "socket.io";

dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    }
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const PORT = process.env.PORT || 8080;


mongoose.connect(process.env.MONGO_URL, { dbName: 'Battleship' })
    .then(() => console.log('Database connected'))
    .catch((err) => console.log(err));

io.on('connection', (socket) => {
    console.log('a user connected:', socket.id);
});

io.on('disconnect', () => {
    console.log('a user disconnected:', socket.id);
});

server.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
