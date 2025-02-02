import { useAuth, useUser } from "@clerk/clerk-react";
import React, { createContext, useEffect, useState } from "react";
import io, { Socket } from "socket.io-client";

const VITE_BASE_URL = import.meta.env.VITE_BASE_URL;

type SocketStatus =
  | "connected"
  | "disconnected"
  | "connecting"
  | "reconnect_failed";

export interface SocketContextType {
  socket: Socket | null;
  status: SocketStatus;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  status: "disconnected",
});

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [status, setStatus] = useState<SocketStatus>("disconnected");
  const { user, isSignedIn } = useUser();
  const { getToken } = useAuth();

  useEffect(() => {
    let newSocket: Socket | null = null;

    const initializeSocket = async () => {
      if (!isSignedIn || !user) {
        setSocket(null);
        setStatus("disconnected");
        return;
      }

      try {
        const token = await getToken();

        newSocket = io(VITE_BASE_URL, {
          extraHeaders: { authorization: `Bearer ${token}` },
          reconnectionAttempts: 5,
          autoConnect: false,
        });

        setStatus("connecting");
        setSocket(newSocket);

        // Set up event listeners before connecting
        newSocket.on("connect", () => {
          console.log("connected");
          setStatus("connected");
        });

        newSocket.on("disconnect", () => setStatus("disconnected"));
        newSocket.io.on("reconnect_attempt", () => setStatus("connecting"));
        newSocket.io.on("reconnect_failed", () =>
          setStatus("reconnect_failed"),
        );

        // Connect after all listeners are set up
        newSocket.connect();
      } catch (error) {
        console.error("Socket initialization error:", error);
        setStatus("disconnected");
      }
    };

    initializeSocket();

    return () => {
      if (newSocket) {
        newSocket.removeAllListeners();
        newSocket.close();
        setSocket(null);
      }
    };
  }, [user, isSignedIn, getToken]);

  return (
    <SocketContext.Provider value={{ socket, status }}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketContext;
