// socket.ts
import { io, Socket } from "socket.io-client";

// Declare the socket variable with the Socket type from socket.io-client
let socket: Socket | null = null;

export const getSocket = (): Socket => {
  if (!socket) {
    socket = io(process.env.NEXT_PUBLIC_API_URL);
  }
  // Since socket can be null initially, ensure it's not null before returning
  if (socket === null) {
    throw new Error("Socket connection is not established");
  }
  return socket;
};
