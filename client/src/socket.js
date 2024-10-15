import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.SOCKET_URL;

export const socket = io(SOCKET_URL);

socket.on('connect', () => {
    console.log('connected:', socket.id);
});