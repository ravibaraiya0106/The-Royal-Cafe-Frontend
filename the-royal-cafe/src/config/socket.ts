import { io, Socket } from "socket.io-client";
import { getToken } from "@/utils/storage";

const SOCKET_URL = import.meta.env.VITE_API_URL
  ? import.meta.env.VITE_API_URL.replace("/api/v1", "")
  : "http://localhost:5000";

let socket: Socket | null = null;

export const getSocket = (): Socket => {
  const token = getToken();

  if (!socket) {
    socket = io(SOCKET_URL, {
      autoConnect: true,
      transports: ["websocket", "polling"],
      auth: {
        token: token || "",
      },
    });
    return socket;
  }

  // If the user logged in/out and token changed, refresh the socket auth.
  // (We keep this small and safe: disconnect+recreate only when necessary.)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const currentToken = (socket as any)?.auth?.token;
  if ((token || "") !== (currentToken || "")) {
    socket.disconnect();
    socket = io(SOCKET_URL, {
      autoConnect: true,
      transports: ["websocket", "polling"],
      auth: {
        token: token || "",
      },
    });
  }

  return socket;
};
