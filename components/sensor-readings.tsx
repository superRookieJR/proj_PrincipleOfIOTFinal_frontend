"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Gauge } from "@/components/ui/gauge"
import { useState, useEffect } from "react"

export default function SensorReadings() {
  // In a real application, you would fetch this data from your IoT backend
  const [sensorData, setSensorData] = useState({
    temperature: 24.5,
    humidity: 65,
    waterLevel: 78,
    ph: 6.2,
    ec: 1.8,
    brightness: 12500,
  })

  // Simulate sensor updates
  useEffect(() => {
    const interval = setInterval(() => {
      setSensorData((prev) => ({
        ...prev,
        temperature: +(prev.temperature + (Math.random() * 0.2 - 0.1)).toFixed(1),
        waterLevel: Math.min(100, Math.max(0, prev.waterLevel + (Math.random() * 2 - 1))),
        ph: +(prev.ph + (Math.random() * 0.1 - 0.05)).toFixed(1),
        ec: +(prev.ec + (Math.random() * 0.1 - 0.05)).toFixed(1),
        brightness: Math.round(prev.brightness + (Math.random() * 500 - 250)),
      }))
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle>Temperature</CardTitle>
          <CardDescription>Current temperature in °C</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <Gauge value={sensorData.temperature} min={10} max={40} label={`${sensorData.temperature}°C`} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Water Level</CardTitle>
          <CardDescription>Current water level in %</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <Gauge value={sensorData.waterLevel} min={0} max={100} label={`${Math.round(sensorData.waterLevel)}%`} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>pH Level</CardTitle>
          <CardDescription>Current pH level</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <Gauge value={sensorData.ph} min={0} max={14} label={`${sensorData.ph}`} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>EC</CardTitle>
          <CardDescription>Electrical conductivity in mS/cm</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <Gauge value={sensorData.ec} min={0} max={5} label={`${sensorData.ec} mS/cm`} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Brightness</CardTitle>
          <CardDescription>Light intensity in lux</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <Gauge value={sensorData.brightness} min={0} max={30000} label={`${sensorData.brightness} lux`} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Humidity</CardTitle>
          <CardDescription>Ambient humidity in %</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <Gauge value={sensorData.humidity} min={0} max={100} label={`${sensorData.humidity}%`} />
        </CardContent>
      </Card>
    </div>
  )
}

