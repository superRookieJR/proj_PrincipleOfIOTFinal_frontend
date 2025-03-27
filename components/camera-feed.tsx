"use client";

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { RefreshCw, Maximize2 } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import io, { Socket } from "socket.io-client";

export default function CameraFeed() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [image, setImage] = useState("");

  useEffect(() => {
    const socket = io("http://10.107.7.175:5000");
    setSocket(socket);

    socket.on("video_frame", (data) => {
      setImage(`data:image/jpeg;base64,${data.image}`);
    });
  }, []);

  const rotateCamera = (direction: string) => {
    if (socket) {
      socket.emit("rotate", { direction });
    }
  };

  return (
    <div className="relative w-full h-full">
      {/* {loading ? (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-200 opacity-70">
          <RefreshCw className="animate-spin h-6 w-6 text-gray-800" />
        </div>
      ) : (
        <img
          src={imageData}
          alt="Camera feed"
          className="w-full h-full object-cover"
        />
      )} */}
      <img
        src={image}
        alt="Camera feed"
        className="w-full h-full object-cover"
      />
    </div>
  );
}
