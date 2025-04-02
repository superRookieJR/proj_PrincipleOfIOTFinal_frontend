"use client"

import Link from "next/link"
import { Droplets, Thermometer, Activity, FlaskRoundIcon as Flask, BarChart3 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { io, Socket } from "socket.io-client";
import SensorReadings from "@/components/sensor-readings"
import ControlPanel from "@/components/control-panel"
import CameraFeed from "@/components/camera-feed"
import Reports from "@/components/reports"

import { useEffect, useRef, useState } from "react";
import { db } from "@/lib/firebase";
import { doc, onSnapshot } from "firebase/firestore";

interface SenSorsData {
  ldr: number,
  mix: number,
  nutrition_a: number,
  nutrition_b: number,
  temp: number
}

interface IsError {
  message: string,
  isError: boolean
}

export default function Dashboard() {
  const socketRef = useRef<Socket | null>(null);
  const [sensorValue, setSensorValue] = useState<SenSorsData | null>(null);
  const [latestUpdate, setLatestUpdate] = useState<string | null>(null);
  const [nutrition_a, setNutrition_A] = useState<0 | 1>(0);
  const [nutrition_b, setNutrition_B] = useState<0 | 1>(0);
  const [water, setWater] = useState<0 | 1>(0);
  const [out, setOut] = useState<0 | 1>(0);
  const [isError, setIsError] = useState<IsError | null>(null);

  const actuator_update = (id: number, mode: number) => {
    console.log("Emitting data:", { id, mode });
    socketRef.current?.emit("actuator_update", { id, mode });
  };

  useEffect(() => {
    const docRef = doc(db, "hydroponic", "hydroponic-001");
    const socket = io("https://proj-principleofiotfinal-bridge.onrender.com", { transports: ["websocket", "polling"] });
    socketRef.current = socket;

    socket.on("connect", () => console.log("✅ Connected to Socket.IO"));
    socket.on("connect_error", (err) => console.error("❌ Socket.IO connection error:", err));

    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const { actuators, sensors, updatedAt } = docSnap.data();

        setSensorValue({
          ldr: sensors.ldr,
          mix: sensors.mix,
          nutrition_a: sensors.nutrition_a,
          nutrition_b: sensors.nutrition_b,
          temp: sensors.temp
        });

        setNutrition_A(actuators.nutrition_a ? 1 : 0);
        setNutrition_B(actuators.nutrition_b ? 1 : 0);
        setWater(actuators.water ? 1 : 0);
        setOut(actuators.out ? 1 : 0);

        setLatestUpdate(updatedAt.toDate().toLocaleString());
      } else {
        setIsError({ isError: true, message: "No document found!" });
      }
    });

    return () => {
      socket.disconnect();
      unsubscribe();
    };
  }, []);

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
                        <span className={`flex h-2.5 w-2.5 mr-2 rounded-full ${nutrition_a == 0  ? 'bg-red-500' : 'bg-green-500'}`}></span>
                        <span className="text-sm">Nutrition A Pump</span>
                      </div>
                      <Switch id="water-pump" checked={nutrition_a == 0 ? false : true} onCheckedChange={(checked) => { setNutrition_A(checked ? 1 : 0), actuator_update(1, checked ? 1 : 0)}} />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className={`flex h-2.5 w-2.5 mr-2 rounded-full ${nutrition_b == 0  ? 'bg-red-500' : 'bg-green-500'}`}></span>
                        <span className="text-sm">Nutrition B Pump</span>
                      </div>
                      <Switch id="water-pump" checked={nutrition_b == 0 ? false : true} onCheckedChange={(checked) => {setNutrition_B(checked ? 1 : 0), actuator_update(2, checked ? 1 : 0)}} />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className={`flex h-2.5 w-2.5 mr-2 rounded-full ${water == 0  ? 'bg-red-500' : 'bg-green-500'}`}></span>
                        <span className="text-sm">Water Pump</span>
                      </div>
                      <Switch id="water-pump" checked={water == 0 ? false : true} onCheckedChange={(checked) => {setWater(checked ? 1 : 0), actuator_update(3, checked ? 1 : 0)}} />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className={`flex h-2.5 w-2.5 mr-2 rounded-full ${out == 0  ? 'bg-red-500' : 'bg-green-500'}`}></span>
                        <span className="text-sm">Water Out Pump</span>
                      </div>
                      <Switch id="water-pump" checked={out == 0 ? false : true} onCheckedChange={(checked) => {setOut(checked ? 1 : 0), actuator_update(4, checked ? 1 : 0)}} />
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
                  <div className="aspect-video overflow-hidden rounded-md bg-muted">
                    <CameraFeed link={"https://proj-principleofiotfinal-bridge.onrender.com"} />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="reports" className="space-y-4">
            <Reports/>
          </TabsContent>

          {/* <TabsContent value="controls" className="space-y-4">
            <ControlPanel />
          </TabsContent> */}
        </Tabs>
      </main>
    </div>
  )
}