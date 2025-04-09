"use client";

import { useState, useEffect } from "react";
import io, { Socket } from "socket.io-client";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";

type PredictionDetails = {
  confidence: number;
  class_id: number;
};

interface IsError {
  message: string;
  isError: boolean;
}

export default function CameraFeed() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [image, setImage] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showAnalysisDialog, setShowAnalysisDialog] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [isError, setIsError] = useState<IsError | null>(null);
  const [isImageLoading, setIsImageLoading] = useState(true);

  useEffect(() => {
    const newSocket = io("http://10.107.0.22:10000", {
      transports: ["websocket"],
    });

    newSocket.on("connect", () => {
      console.log("✅ WebSocket Connected:", newSocket.id);
    });

    newSocket.on("connect_error", (error) => {
      console.error("❌ WebSocket Connection Error:", error);
    });

    newSocket.on("video_frame_front", (data) => {
      if (data?.image) {
        setImage(`data:image/jpeg;base64,${data.image}`);
        setIsImageLoading(false); // 👈 Image received, turn off loading
      }
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const analyzeCurrentFrame = async () => {
    if (!image) {
      setIsError({ isError: true, message: "No image to analyze" });
      return;
    }

    setIsAnalyzing(true);
    const base64data = image;

    try {
      const img = new Image();
      img.onload = async () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;

        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0);

        const jpegDataUrl = canvas.toDataURL("image/jpeg");
        const base64Jpeg = jpegDataUrl.split(",")[1];

        try {
          const apiResponse = await fetch(
            "https://classify.roboflow.com/petchay-twtgb/3?api_key=LJFUXPC16gCZi2ddY4rr",
            {
              method: "POST",
              body: base64Jpeg,
              headers: {
                "Content-Type": "application/x-www-form-urlencoded",
              },
            }
          );

          if (!apiResponse.ok) {
            throw new Error("Failed to analyze image");
          }

          const result = await apiResponse.json();

          setAnalysisResult({
            image: base64data,
            predictions: result,
          });
          setShowAnalysisDialog(true);
        } catch (error) {
          console.error("Error analyzing image:", error);
          setIsError({ isError: true, message: "Failed to analyze image" });
        } finally {
          setIsAnalyzing(false);
        }
      };

      img.onerror = () => {
        setIsError({ isError: true, message: "Failed to load image" });
        setIsAnalyzing(false);
      };

      img.src = base64data;
    } catch (error) {
      console.error("Error preparing image:", error);
      setIsError({ isError: true, message: "Failed to prepare image for analysis" });
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="relative w-full h-full">
      <ContextMenu>
        <ContextMenuTrigger className="w-full h-full flex items-center justify-center bg-gray-100">
          {isImageLoading ? (
            <div className="flex flex-col items-center justify-center">
              <Loader2 className="h-10 w-10 animate-spin text-gray-400" />
              <span className="text-sm text-muted-foreground mt-2">Waiting for camera feed...</span>
            </div>
          ) : (
            <img
              src={image}
              alt="Camera feed"
              className="w-full h-full object-cover"
            />
          )}
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem onClick={analyzeCurrentFrame} disabled={isAnalyzing || isImageLoading}>
            {isAnalyzing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              "Analyze"
            )}
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>

      <Dialog open={showAnalysisDialog} onOpenChange={setShowAnalysisDialog}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Plant Analysis Results</DialogTitle>
            <DialogDescription>Classification results from Roboflow AI</DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border rounded-md overflow-hidden">
              {analysisResult?.image && (
                <img
                  src={analysisResult.image}
                  alt="Analyzed frame"
                  className="w-full h-auto"
                />
              )}
            </div>

            <div className="border rounded-md p-4">
              <h3 className="font-medium mb-2">Predictions</h3>
              {Array.isArray(analysisResult?.predictions?.predictions) ? (
                <div className="space-y-2">
                  {analysisResult.predictions.predictions.map(
                    (item: PredictionDetails, index: number) => (
                      <div
                        key={index}
                        className="flex justify-between items-center"
                      >
                        <span className="font-medium">Class {item.class_id}</span>
                        <span className="text-sm bg-primary/10 text-primary px-2 py-1 rounded-full">
                          {(item.confidence * 100).toFixed(1)}%
                        </span>
                      </div>
                    )
                  )}
                </div>
              ) : (
                <p className="text-muted-foreground">No predictions available</p>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}