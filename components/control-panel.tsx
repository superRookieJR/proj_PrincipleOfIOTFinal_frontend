"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Droplet, Fan, Waves, AnvilIcon as Valve, Sun } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

export default function ControlPanel() {
  const [devices, setDevices] = useState({
    waterPump: true,
    airPump: true,
    valve1: true,
    valve2: false,
    lighting: true,
    lightIntensity: 80,
  })

  const toggleDevice = (device: string) => {
    setDevices((prev) => {
      const newState = { ...prev, [device]: !prev[device as keyof typeof prev] }

      // In a real application, you would send this command to your IoT backend
      toast({
        title: `${device} ${newState[device as keyof typeof newState] ? "Enabled" : "Disabled"}`,
        description: `The ${device} has been ${newState[device as keyof typeof newState] ? "turned on" : "turned off"}.`,
      })

      return newState
    })
  }

  const setLightIntensity = (value: number[]) => {
    setDevices((prev) => ({ ...prev, lightIntensity: value[0] }))

    // In a real application, you would send this command to your IoT backend
    toast({
      title: "Light Intensity Updated",
      description: `Light intensity set to ${value[0]}%.`,
    })
  }

  const runCycle = () => {
    toast({
      title: "Ebb & Flow Cycle Started",
      description: "A complete ebb and flow cycle has been initiated.",
    })
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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
            <Label htmlFor="water-pump">Status: {devices.waterPump ? "Running" : "Stopped"}</Label>
            <Switch id="water-pump" checked={devices.waterPump} onCheckedChange={() => toggleDevice("waterPump")} />
          </div>
        </CardContent>
        <CardFooter>
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={() => {
              toast({
                title: "Water Pump Cycle",
                description: "Water pump will run for 5 minutes.",
              })
            }}
          >
            Run for 5 minutes
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Fan className="h-5 w-5 text-gray-500" />
            Air Pump
          </CardTitle>
          <CardDescription>Control the air pump for oxygenation</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <Label htmlFor="air-pump">Status: {devices.airPump ? "Running" : "Stopped"}</Label>
            <Switch id="air-pump" checked={devices.airPump} onCheckedChange={() => toggleDevice("airPump")} />
          </div>
        </CardContent>
        <CardFooter>
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={() => {
              toast({
                title: "Air Pump Boost",
                description: "Air pump will run at maximum for 10 minutes.",
              })
            }}
          >
            Boost for 10 minutes
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Valve className="h-5 w-5 text-green-500" />
            Valve 1
          </CardTitle>
          <CardDescription>Control the main flow valve</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <Label htmlFor="valve-1">Status: {devices.valve1 ? "Open" : "Closed"}</Label>
            <Switch id="valve-1" checked={devices.valve1} onCheckedChange={() => toggleDevice("valve1")} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Valve className="h-5 w-5 text-green-500" />
            Valve 2
          </CardTitle>
          <CardDescription>Control the secondary flow valve</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <Label htmlFor="valve-2">Status: {devices.valve2 ? "Open" : "Closed"}</Label>
            <Switch id="valve-2" checked={devices.valve2} onCheckedChange={() => toggleDevice("valve2")} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sun className="h-5 w-5 text-yellow-500" />
            Lighting
          </CardTitle>
          <CardDescription>Control the grow lights</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="lighting">Status: {devices.lighting ? "On" : "Off"}</Label>
            <Switch id="lighting" checked={devices.lighting} onCheckedChange={() => toggleDevice("lighting")} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="light-intensity">Intensity: {devices.lightIntensity}%</Label>
            <Slider
              id="light-intensity"
              disabled={!devices.lighting}
              min={0}
              max={100}
              step={1}
              value={[devices.lightIntensity]}
              onValueChange={setLightIntensity}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Waves className="h-5 w-5 text-blue-500" />
            Ebb & Flow Cycle
          </CardTitle>
          <CardDescription>Run a complete ebb and flow cycle</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            This will run a complete cycle: fill the grow bed, maintain water level for 15 minutes, then drain.
          </p>
          <Button className="w-full" onClick={runCycle}>
            Start Cycle
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

