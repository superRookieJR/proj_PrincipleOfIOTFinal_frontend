"use client"

import Link from "next/link"
import { Droplets, Thermometer, FlaskRoundIcon as Flask, Loader2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "@/components/ui/context-menu"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

import { io, type Socket } from "socket.io-client"
import CameraFeed from "@/components/camera-feed"
import Reports from "@/components/reports"

import { useEffect, useRef, useState } from "react"
import { db } from "@/lib/firebase"
import { doc, onSnapshot } from "firebase/firestore"

type PredictionDetails = {
  confidence: number;
  class_id: number;
};

interface SenSorsData {
  ldr: number
  mix: number
  nutrition_a: number
  nutrition_b: number
  temp: number
}

interface IsError {
  message: string
  isError: boolean
}

export default function Dashboard() {
  const socketRef = useRef<Socket | null>(null)
  const [sensorValue, setSensorValue] = useState<SenSorsData | null>(null)
  const [latestUpdate, setLatestUpdate] = useState<string | null>(null)
  const [nutrition_a, setNutrition_A] = useState<0 | 1>(0)
  const [nutrition_b, setNutrition_B] = useState<0 | 1>(0)
  const [water, setWater] = useState<0 | 1>(0)
  const [out, setOut] = useState<0 | 1>(0)
  const [isError, setIsError] = useState<IsError | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [showAnalysisDialog, setShowAnalysisDialog] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<any>(null)

  const actuator_update = (id: number, mode: number) => {
    console.log("Emitting data:", { id, mode })
    socketRef.current?.emit("actuator_update", { id, mode })
  }

  useEffect(() => {
    const docRef = doc(db, "hydroponic", "hydroponic-001")
    const socket = io("https://proj-principleofiotfinal-bridge.onrender.com", { transports: ["websocket", "polling"] })
    socketRef.current = socket

    socket.on("connect", () => console.log("✅ Connected to Socket.IO"))
    socket.on("connect_error", (err) => console.error("❌ Socket.IO connection error:", err))

    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const { actuators, sensors, updatedAt } = docSnap.data()

        setSensorValue({
          ldr: sensors.ldr,
          mix: sensors.mix,
          nutrition_a: sensors.nutrition_a,
          nutrition_b: sensors.nutrition_b,
          temp: sensors.temp,
        })

        setNutrition_A(actuators.nutrition_a ? 1 : 0)
        setNutrition_B(actuators.nutrition_b ? 1 : 0)
        setWater(actuators.water ? 1 : 0)
        setOut(actuators.out ? 1 : 0)

        setLatestUpdate(updatedAt.toDate().toLocaleString())
      } else {
        setIsError({ isError: true, message: "No document found!" })
      }
    })

    return () => {
      socket.disconnect()
      unsubscribe()
    }
  }, [])

  const analyzeCurrentFrame = async () => {
    setIsAnalyzing(true)
  
    try {
      // For demonstration purposes, we'll use a placeholder image
      const placeholderImage = "/placeholder.svg?height=720&width=1280"
      const response = await fetch(placeholderImage)
      const blob = await response.blob()
      const reader = new FileReader()
  
      reader.onloadend = async () => {
        const base64data = reader.result as string
  
        // Create an Image element to load the base64 image data
        const img = new Image()
        img.onload = async () => {
          // Create a canvas element to convert the image to JPEG
          const canvas = document.createElement('canvas')
          canvas.width = img.width
          canvas.height = img.height
          const ctx = canvas.getContext('2d')
          ctx?.drawImage(img, 0, 0)
  
          // Convert the drawn image on the canvas to a JPEG data URL
          const jpegDataUrl = canvas.toDataURL('image/jpeg')
          const base64Jpeg = jpegDataUrl.split(',')[1]
  
          try {
            // Send the JPEG base64 string to the Roboflow API
            const apiResponse = await fetch(
              "https://classify.roboflow.com/petchay-twtgb/3?api_key=LJFUXPC16gCZi2ddY4rr",
              {
                method: "POST",
                body: base64Jpeg,
                headers: {
                  "Content-Type": "application/x-www-form-urlencoded",
                },
              },
            )
  
            if (!apiResponse.ok) {
              throw new Error("Failed to analyze image")
            }
  
            const result = await apiResponse.json()
            setAnalysisResult({
              image: `data:image/jpeg;base64,${base64data}`, // Now using the JPEG data URL
              predictions: result,
            })
            setShowAnalysisDialog(true)
          } catch (error) {
            console.error("Error analyzing image:", error)
            setIsError({ isError: true, message: "Failed to analyze image" })
          } finally {
            setIsAnalyzing(false)
          }
        }
        
        // Start loading the base64 image into the <img> element
        img.src = base64data
      }
  
      reader.readAsDataURL(blob)
    } catch (error) {
      console.error("Error preparing image:", error)
      setIsError({ isError: true, message: "Failed to prepare image for analysis" })
      setIsAnalyzing(false)
    }
  }  

  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Droplets className="h-6 w-6 text-primary" />
          <span>HydroFlow</span>
        </Link>
        {/* <nav className="ml-auto flex gap-2">
          <Link
            href="/reports"
            className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            <BarChart3 className="h-4 w-4" />
            Reports
          </Link>
        </nav> */}
      </header>
      <main className="flex-1 space-y-4 p-4 md:p-6">
        <div className="w-full text-right">
          <p>Latest Update: {latestUpdate}</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-5">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Nutrition A</CardTitle>
              <Droplets className="h-4 w-4 text-green-400 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{sensorValue?.nutrition_a} L</div>
              <p className="text-xs  text-muted-foreground">Normal range</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Nutrition B</CardTitle>
              <Droplets className="h-4 w-4 text-red-400 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{sensorValue?.nutrition_b} L</div>
              <p className="text-xs text-muted-foreground">Normal range</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Mix Tank</CardTitle>
              <Droplets className="h-4 w-4 text-cyan-400 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{sensorValue?.mix} L</div>
              <p className="text-xs text-muted-foreground">Normal range</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Temperature</CardTitle>
              <Thermometer className="h-4 w-4 text-orange-400 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{sensorValue?.temp}°C</div>
              <p className="text-xs text-muted-foreground">Optimal</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Light Level</CardTitle>
              <Flask className="h-4 w-4 text-yellow-400 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{sensorValue?.ldr}</div>
              <p className="text-xs text-muted-foreground">Slightly acidic</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
            {/* <TabsTrigger value="controls">Controls</TabsTrigger> */}
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>System Status</CardTitle>
                  <CardDescription>Current state of your hydroponics system</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span
                          className={`flex h-2.5 w-2.5 mr-2 rounded-full ${nutrition_a == 0 ? "bg-red-500" : "bg-green-500"}`}
                        ></span>
                        <span className="text-sm">Nutrition A Pump</span>
                      </div>
                      <Switch
                        id="water-pump"
                        checked={nutrition_a == 0 ? false : true}
                        onCheckedChange={(checked) => {
                          setNutrition_A(checked ? 1 : 0), actuator_update(1, checked ? 1 : 0)
                        }}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span
                          className={`flex h-2.5 w-2.5 mr-2 rounded-full ${nutrition_b == 0 ? "bg-red-500" : "bg-green-500"}`}
                        ></span>
                        <span className="text-sm">Nutrition B Pump</span>
                      </div>
                      <Switch
                        id="water-pump"
                        checked={nutrition_b == 0 ? false : true}
                        onCheckedChange={(checked) => {
                          setNutrition_B(checked ? 1 : 0), actuator_update(2, checked ? 1 : 0)
                        }}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span
                          className={`flex h-2.5 w-2.5 mr-2 rounded-full ${water == 0 ? "bg-red-500" : "bg-green-500"}`}
                        ></span>
                        <span className="text-sm">Water Pump</span>
                      </div>
                      <Switch
                        id="water-pump"
                        checked={water == 0 ? false : true}
                        onCheckedChange={(checked) => {
                          setWater(checked ? 1 : 0), actuator_update(3, checked ? 1 : 0)
                        }}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span
                          className={`flex h-2.5 w-2.5 mr-2 rounded-full ${out == 0 ? "bg-red-500" : "bg-green-500"}`}
                        ></span>
                        <span className="text-sm">Water Out Pump</span>
                      </div>
                      <Switch
                        id="water-pump"
                        checked={out == 0 ? false : true}
                        onCheckedChange={(checked) => {
                          setOut(checked ? 1 : 0), actuator_update(4, checked ? 1 : 0)
                        }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="col-span-2">
                <CardHeader>
                  <CardTitle>Main Camera</CardTitle>
                  <CardDescription>Live view of your system</CardDescription>
                </CardHeader>
                <CardContent>
                  <ContextMenu>
                    <ContextMenuTrigger>
                      <div className="aspect-video overflow-hidden rounded-md bg-muted">
                        <CameraFeed link={"https://proj-principleofiotfinal-bridge.onrender.com"} />
                      </div>
                    </ContextMenuTrigger>
                    <ContextMenuContent>
                      <ContextMenuItem onClick={analyzeCurrentFrame} disabled={isAnalyzing}>
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
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="reports" className="space-y-4">
            <Reports />
          </TabsContent>

          {/* <TabsContent value="controls" className="space-y-4">
            <ControlPanel />
          </TabsContent> */}
        </Tabs>
      </main>
      <Dialog open={showAnalysisDialog} onOpenChange={setShowAnalysisDialog}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Plant Analysis Results</DialogTitle>
            <DialogDescription>Classification results from Roboflow AI</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Image Preview */}
            <div className="border rounded-md overflow-hidden">
              {analysisResult?.image && (
                <img
                  src={analysisResult.image || "/placeholder.svg"}
                  alt="Analyzed frame"
                  className="w-full h-auto"
                />
              )}
            </div>

            {/* Predictions */}
            <div className="border rounded-md p-4">
              <h3 className="font-medium mb-2">Predictions</h3>
              {analysisResult?.predictions ? (
                <div className="space-y-2">
                  {/* Access the nested .predictions inside the top-level object */}
                  {analysisResult.predictions.predictions && 
                  typeof analysisResult.predictions.predictions === "object" ? (
                    Object.entries(
                      analysisResult.predictions.predictions
                    ).map(([className, details], index) => {
                      // Cast the details to the correct type
                      const { confidence } = details as { confidence: number; class_id: number };

                      return (
                        <div key={index} className="flex justify-between items-center">
                          <span className="font-medium">{className}</span>
                          <span className="text-sm bg-primary/10 text-primary px-2 py-1 rounded-full">
                            {(confidence * 100).toFixed(1)}%
                          </span>
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-muted-foreground">No predictions available</p>
                  )}
                </div>
              ) : (
                <p className="text-muted-foreground">No analysis data available</p>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

    </div>
  )
}

