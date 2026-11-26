import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { AuthContext } from './AuthContext';

export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const { token, isAuthenticated } = useContext(AuthContext);
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState(new Set());

  useEffect(() => {
    let newSocket;

    if (isAuthenticated && token) {
      newSocket = io('/', {
        auth: { token },
        transports: ['websocket', 'polling']
      });

      newSocket.on('connect', () => {
        console.log('🌱 Socket.IO connected with ID:', newSocket.id);
      });

      newSocket.on('presence:online_list', (userIds) => {
        setOnlineUsers(new Set(userIds));
      });

      newSocket.on('user:online', ({ userId }) => {
        setOnlineUsers((prev) => new Set([...prev, userId]));
      });

      newSocket.on('user:offline', ({ userId }) => {
        setOnlineUsers((prev) => {
          const next = new Set(prev);
          next.delete(userId);
          return next;
        });
      });

      setSocket(newSocket);

      return () => {
        newSocket.disconnect();
      };
    } else {
      setSocket(null);
      setOnlineUsers(new Set());
    }
  }, [isAuthenticated, token]);

  const isUserOnline = (userId) => {
    return onlineUsers.has(userId);
  };

  return (
    <SocketContext.Provider value={{ socket, onlineUsers, isUserOnline }}>
      {children}
    </SocketContext.Provider>
  );
};
