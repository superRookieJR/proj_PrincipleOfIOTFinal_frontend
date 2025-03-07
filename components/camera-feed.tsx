"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { RefreshCw, Maximize2 } from "lucide-react"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"

interface CameraFeedProps {
  cameraId: string
}

export default function CameraFeed({ cameraId }: CameraFeedProps) {
  const [loading, setLoading] = useState(true)
  const [timestamp, setTimestamp] = useState(Date.now())

  // In a real application, you would connect to a real camera feed
  // Here we're simulating with placeholder images
  const cameraUrls: Record<string, string> = {
    main: `/placeholder.svg?height=480&width=640&text=Main+Camera`,
    camera1: `/placeholder.svg?height=480&width=640&text=Camera+1`,
    camera2: `/placeholder.svg?height=480&width=640&text=Camera+2`,
    camera3: `/placeholder.svg?height=480&width=640&text=Camera+3`,
  }

  useEffect(() => {
    // Simulate camera loading
    setLoading(true)
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const refreshFeed = () => {
    setTimestamp(Date.now())
  }

  return (
    <div className="relative w-full h-full">
      {loading ? (
        <div className="absolute inset-0 flex items-center justify-center bg-muted">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <img
          src={`${cameraUrls[cameraId]}&timestamp=${timestamp}`}
          alt={`Camera feed from ${cameraId}`}
          className="w-full h-full object-cover"
        />
      )}

      <div className="absolute bottom-2 right-2 flex gap-2">
        <Button
          variant="secondary"
          size="icon"
          className="h-8 w-8 rounded-full opacity-80 hover:opacity-100"
          onClick={refreshFeed}
        >
          <RefreshCw className="h-4 w-4" />
          <span className="sr-only">Refresh</span>
        </Button>

        <Dialog>
          <DialogTrigger asChild>
            <Button variant="secondary" size="icon" className="h-8 w-8 rounded-full opacity-80 hover:opacity-100">
              <Maximize2 className="h-4 w-4" />
              <span className="sr-only">Fullscreen</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl">
            <div className="aspect-video w-full">
              <img
                src={`${cameraUrls[cameraId]}&timestamp=${timestamp}`}
                alt={`Camera feed from ${cameraId}`}
                className="w-full h-full object-cover"
              />
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

