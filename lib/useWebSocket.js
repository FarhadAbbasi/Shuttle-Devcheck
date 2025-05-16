import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const SOCKET_URL = "ws://localhost:3001/ws"; // Update this with your deployed backend later
// const SOCKET_URL = "ws://192.168.0.107:3001"; // Change this!

export const useWebSocket = () => {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  // console.log('Messages in socket:', messages);

  useEffect(() => {
    const newSocket = io(SOCKET_URL, {
      transports: ["websocket"], // Ensure WebSocket transport
    });

    newSocket.on("connect", () => {
      console.log("✅ Connected to WebSocket. ID : ", newSocket.id);
    });

    newSocket.on("message", (msg) => {
      console.log("📩 New message:", msg);
      setMessages((prev) => [...prev, msg]);
    });

    newSocket.on("disconnect", () => {
      console.log("❌ Disconnected from WebSocket");
    });

    newSocket.on('reply', (msg) => {
      console.log('Server replied:', msg);
      setMessages((prev)=> [...prev, 
        {sender: 'Server' , content: msg}]);
        // msg ]);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect(); // Cleanup on unmount
    };
  }, []);

  const sendMessage = (msg) => {
    if (socket) {
      setMessages((prev) => [...prev, 
        { sender: "Client", content: msg }]);
        // msg ]);

      socket.emit("message", msg);
    }
  };

  return { socket, messages, sendMessage };
};
