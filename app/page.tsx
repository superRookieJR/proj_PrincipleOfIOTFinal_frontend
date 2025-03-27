"use client"

import Link from "next/link"
import { Droplets, Thermometer, Activity, FlaskRoundIcon as Flask, BarChart3 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import SensorReadings from "@/components/sensor-readings"
import ControlPanel from "@/components/control-panel"
import CameraFeed from "@/components/camera-feed"

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { doc, onSnapshot } from "firebase/firestore";

export default function Dashboard() {
  const [sensorValue, setSensorValue] = useState('');

  useEffect(() => {
      const docRef = doc(db, "hydroponic", "hydroponic-001");

      // Listen for real-time updates
      const unsubscribe = onSnapshot(docRef, (docSnap) => {
          if (docSnap.exists()) {
              const data = docSnap.data();
              setSensorValue(data.sensors?.test || "No value found");
          } else {
              setSensorValue("No document found!");
          }
      });

      // Cleanup function to unsubscribe from Firestore listener when component unmounts
      return () => unsubscribe();
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
        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-5">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Nutrition A</CardTitle>
              <Droplets className="h-4 w-4 text-blue-400 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{sensorValue}</div>
              <p className="text-xs text-muted-foreground">Normal range</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Nutrition B</CardTitle>
              <Droplets className="h-4 w-4 text-blue-400 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{sensorValue}</div>
              <p className="text-xs text-muted-foreground">Normal range</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Temperature</CardTitle>
              <Thermometer className="h-4 w-4 text-orange-400 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24.5°C</div>
              <p className="text-xs text-muted-foreground">Optimal</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">pH Level</CardTitle>
              <Flask className="h-4 w-4 text-gray-400 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">6.2</div>
              <p className="text-xs text-muted-foreground">Slightly acidic</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">EC</CardTitle>
              <Activity className="h-4 w-4 text-amber-400 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1.8 mS/cm</div>
              <p className="text-xs text-muted-foreground">Good nutrient level</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="sensors">Sensors</TabsTrigger>
            <TabsTrigger value="controls">Controls</TabsTrigger>
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
                      <span className="text-sm">Water Pump</span>
                      <span className="flex h-2.5 w-2.5 rounded-full bg-green-500"></span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Air Pump</span>
                      <span className="flex h-2.5 w-2.5 rounded-full bg-green-500"></span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Valve 1</span>
                      <span className="flex h-2.5 w-2.5 rounded-full bg-green-500"></span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Valve 2</span>
                      <span className="flex h-2.5 w-2.5 rounded-full bg-red-500"></span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Lighting</span>
                      <span className="flex h-2.5 w-2.5 rounded-full bg-green-500"></span>
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
                    <CameraFeed />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="sensors" className="space-y-4">
            <SensorReadings />
          </TabsContent>

          <TabsContent value="controls" className="space-y-4">
            <ControlPanel />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

