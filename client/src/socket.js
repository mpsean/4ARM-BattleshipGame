import { io } from "socket.io-client";

let socket;

// Function to initialize the socket connection
export const initSocket = () => {
  if (!socket) {
    socket = io("http://localhost:3001", {
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