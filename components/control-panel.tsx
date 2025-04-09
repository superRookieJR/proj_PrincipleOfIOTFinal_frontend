"use client"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Droplet, Waves, FlaskRoundIcon as Flask } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { io, Socket } from "socket.io-client"
import { doc, onSnapshot } from "@firebase/firestore"
import { db } from "@/lib/firebase"

interface IsError {
  message: string
  isError: boolean
}

export default function ControlPanel() {
  const socketRef = useRef<Socket | null>(null)
  const [status, setStatus] = useState<boolean>(false)
  const [nutrition_a, setNutrition_A] = useState<0 | 1>(0)
  const [nutrition_b, setNutrition_B] = useState<0 | 1>(0)
  const [water, setWater] = useState<0 | 1>(0)
  const [out, setOut] = useState<0 | 1>(0)
  const [isError, setIsError] = useState<IsError | null>(null)

  const actuator_update = (id: number, mode: 0 | 1) => {
    console.log("Emitting data:", { id, mode })
    switch(id){
      case 1:
        setNutrition_A(mode); break
      case 2:
        setNutrition_B(mode); break
      case 3:
        setWater(mode); break
      case 4:
        setOut(mode); break
    }
    
    socketRef.current?.emit("actuator_update", { id, mode })
  }

  useEffect(() => {
    const docRef = doc(db, "hydroponic", "hydroponic-001")
    const socket = io("10.107.0.22:10000", { 
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 5,

    })
    socketRef.current = socket

    socket.on("connect", () => console.log("✅ Connected to Socket.IO"))
    socket.on("connect_error", (err) => console.error("❌ Socket.IO connection error:", err))

    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const { actuators, sensors, updatedAt } = docSnap.data()

        setNutrition_A(actuators.nutrition_a ? 1 : 0)
        setNutrition_B(actuators.nutrition_b ? 1 : 0)
        setWater(actuators.water ? 1 : 0)
        setOut(actuators.out ? 1 : 0)
      } else {
        setIsError({ isError: true, message: "No document found!" })
      }
    })

    return () => {
      socket.disconnect()
      unsubscribe()
    }
  }, [])

  return (
    <div className="flex flex-col gap-4">
      {/* <p className="text-3xl font-bold">Main System</p>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Waves className="h-5 w-5 text-blue-500" />
              Nutrient Film Cycle
            </CardTitle>
            <CardDescription>Run a complete ebb and flow cycle</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              This will run a complete cycle: fill the grow bed, maintain water level for 15 minutes, then drain.
            </p>
            <Button className="w-full" onClick={() => {
              toast({
                title: "Nutrient Film Cycle Started",
                description: "A complete ebb and flow cycle has been initiated.",
              })
              socketRef.current?.emit(status ? "cycle_stop" : "cycle_start")
            }}>
              {status ? "Stop Cycle" : "Start Cycle"}
            </Button>
          </CardContent>
        </Card>
      </div>
      <p className="text-3xl font-bold">Actuators</p> */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Flask className="h-5 w-5 text-red-500" />
              Nutrition A Pump
            </CardTitle>
            <CardDescription>Control the main water pump</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <Label htmlFor="water-pump">Status: {nutrition_a == 1 ? "Running" : "Stopped"}</Label>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              variant="outline"
              size="sm"
              className={`w-full ${nutrition_a == 1 ? 'bg-red-500' : 'bg-green-500'}`}
              onClick={() => {
                toast({
                  title: "Water Pump Cycle",
                  description: "Start Water pump",
                })
                actuator_update(1, nutrition_a == 1 ? 0 : 1)
              }}
            >
              {nutrition_a == 1 ? "Stop" : "Start"}
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Flask className="h-5 w-5 text-yellow-500" />
              Nutrition B Pump
            </CardTitle>
            <CardDescription>Control the main water pump</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <Label htmlFor="water-pump">Status: {nutrition_b == 1 ? "Running" : "Stopped"}</Label>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              variant="outline"
              size="sm"
              className={`w-full ${nutrition_b == 1 ? 'bg-red-500' : 'bg-green-500'}`}
              onClick={() => {
                toast({
                  title: "Water Pump Cycle",
                  description: "Water pump",
                })
                actuator_update(2, nutrition_b == 1 ? 0 : 1)
              }}
            >
              {nutrition_b == 1 ? "Stop" : "Start"}
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Droplet className="h-5 w-5 text-blue-500" />
              Water Pump
            </CardTitle>
            <CardDescription>Control the main water pump</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <Label htmlFor="water-pump">Status: {water == 1 ? "Running" : "Stopped"}</Label>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              variant="outline"
              size="sm"
              className={`w-full ${water == 1 ? 'bg-red-500' : 'bg-green-500'}`}
              onClick={() => {
                toast({
                  title: "Water Pump Cycle",
                  description: "Water pump",
                })
                actuator_update(3, water == 1 ? 0 : 1)
              }}
            >
              {water == 1 ? "Stop" : "Start"}
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Droplet className="h-5 w-5 text-green-500" />
              Main tank Pump (out)
            </CardTitle>
            <CardDescription>Control the main water pump</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <Label htmlFor="water-pump">Status: {out == 1 ? "Running" : "Stopped"}</Label>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              variant="outline"
              size="sm"
              className={`w-full ${out == 1 ? 'bg-red-500' : 'bg-green-500'}`}
              onClick={() => {
                toast({
                  title: "Water Pump Cycle",
                  description: "Water pump",
                })
                actuator_update(4, out == 1 ? 0 : 1)
              }}
            >
              {out == 1 ? "Stop" : "Start"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

