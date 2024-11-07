import { io } from "socket.io-client";
import dotenv from "dotenv";

let socket;

// Function to initialize the socket connection
export const initSocket = () => {
  if (!socket) {
    socket = io(`http://${import.meta.env.VITE_SERVER_IP}:3001`, {
      transports: ['websocket'],
      reconnection: true
    });
  }
  return socket;
};

// Function to disconnect the socket
export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;  // Reset the socket variable to avoid reconnects
  }
};

// Function to get the current socket instance
export const getSocket = () => socket;