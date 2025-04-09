"use client"

import Link from "next/link"
import { Droplets, Thermometer, FlaskRoundIcon as Flask, SunDim } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import CameraFeed from "@/components/camera-feed"
import Reports from "@/components/reports"

import { useEffect, useState } from "react"
import { db } from "@/lib/firebase"
import { doc, onSnapshot } from "firebase/firestore"
import ControlPanel from "@/components/control-panel"
import { Gauge } from "@/components/ui/gauge"
import { Loader2 } from "lucide-react"

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
  const [sensorValue, setSensorValue] = useState<SenSorsData | null>(null)
  const [latestUpdate, setLatestUpdate] = useState<string | null>(null)
  const [nutrition_a, setNutrition_A] = useState<0 | 1>(0)
  const [nutrition_b, setNutrition_B] = useState<0 | 1>(0)
  const [water, setWater] = useState<0 | 1>(0)
  const [out, setOut] = useState<0 | 1>(0)
  const [isError, setIsError] = useState<IsError | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const docRef = doc(db, "hydroponic", "hydroponic-001")
  
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
  
      setLoading(false) // ✅ Turn off loading after first fetch
    })
  
    return () => unsubscribe()
  }, [])
  
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-gray-400" />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Droplets className="h-6 w-6 text-primary" />
          <span>HydroFlow Dashboard</span>
        </Link>
      </header>
      <main className="flex-1 space-y-4 p-4 md:p-6">
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            {/* <TabsTrigger value="sensors">Sensors</TabsTrigger> */}
            <TabsTrigger value="controls">Controls</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
              <Card>
                <CardHeader>
                  <CardTitle className="flex">Temperature <Thermometer className="ml-2"/></CardTitle>
                  <CardDescription>Current temperature in °C</CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center">
                  <Gauge value={sensorValue?.temp!} min={10} max={40} label={`${sensorValue?.temp}°C`} />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex">Main tank Level <Droplets className="ml-2"/></CardTitle>
                  <CardDescription>Current main tank level in %</CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center">
                  <Gauge value={sensorValue?.mix!} min={0} max={100} label={`${Math.round(sensorValue?.mix!)}%`} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex">Nutrition A Level <Flask className="ml-2"/></CardTitle>
                  <CardDescription>Current nutrition A level in %</CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center">
                  <Gauge value={sensorValue?.nutrition_a!} min={0} max={100} label={`${Math.round(sensorValue?.nutrition_a!)}%`} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex">Nutrition B Level <Flask className="ml-2"/></CardTitle>
                  <CardDescription>Current butrition B level in %</CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center">
                  <Gauge value={sensorValue?.nutrition_b!} min={0} max={100} label={`${Math.round(sensorValue?.nutrition_b!)}%`} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex">Brightness<SunDim className="ml-2"/></CardTitle>
                  <CardDescription>Light intensity in lux</CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center">
                  <Gauge value={sensorValue?.ldr!} min={0} max={30000} label={`${sensorValue?.ldr} lux`} />
                </CardContent>
              </Card>
            </div>
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
                      <span className={`flex h-2.5 w-2.5 rounded-full ${water == 1 ? 'bg-green-500' : 'bg-red-500'}`}></span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Nutrition A Pump</span>
                      <span className={`flex h-2.5 w-2.5 rounded-full ${nutrition_a == 1 ? 'bg-green-500' : 'bg-red-500'}`}></span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Nutrition B Pump</span>
                      <span className={`flex h-2.5 w-2.5 rounded-full ${nutrition_b == 1 ? 'bg-green-500' : 'bg-red-500'}`}></span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Main tank Pump (out)</span>
                      <span className={`flex h-2.5 w-2.5 rounded-full ${out == 1 ? 'bg-green-500' : 'bg-red-500'}`}></span>
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

          <TabsContent value="controls" className="space-y-4">
            <ControlPanel />
          </TabsContent>

          <TabsContent value="reports" className="space-y-4">
            <Reports />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

