"use client";

import { useState, useEffect } from "react";
import io, { Socket } from "socket.io-client";

export default function CameraFeed({ link }: { link: string }) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [image, setImage] = useState("");

  useEffect(() => {
  const newSocket = io(link, { transports: ["websocket"] });

  newSocket.on("connect", () => {
    console.log("✅ WebSocket Connected:", newSocket.id);
  });

  newSocket.on("connect_error", (error) => {
    console.error("❌ WebSocket Connection Error:", error);
  });

  newSocket.on("video_frame_front", (data) => {
    console.log("📷 Received frame:", data);
    if (data?.image) {
      setImage(`data:image/jpeg;base64,${data.image}`);
    }
  });

  setSocket(newSocket);

  return () => {
    newSocket.disconnect(); // Cleanup to prevent memory leaks
  };
}, [link]);


  const rotateCamera = (direction: string) => {
    socket?.emit("rotate", { direction });
  };

  return (
    <div className="relative w-full h-full">
      <img src={image} alt="Camera feed" className="w-full h-full object-cover" />
    </div>
  );
}
