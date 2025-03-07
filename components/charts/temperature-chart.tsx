"use client"

import { useState } from "react"
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

// Generate sample data for the chart
const generateData = (days = 1) => {
  const data = []
  const now = new Date()
  const interval = days === 1 ? 1 : days === 7 ? 6 : 24
  const points = days === 1 ? 24 : days === 7 ? 7 : 30

  for (let i = points - 1; i >= 0; i--) {
    const date = new Date(now)
    date.setHours(now.getHours() - i * interval)

    // Generate a realistic temperature pattern
    const baseTemp = 23
    const timeOfDay = date.getHours()
    let tempVariation = 0

    // Simulate daily temperature cycle
    if (timeOfDay >= 6 && timeOfDay <= 12) {
      // Morning rise
      tempVariation = (timeOfDay - 6) * 0.4
    } else if (timeOfDay > 12 && timeOfDay <= 18) {
      // Afternoon peak
      tempVariation = 2.4 - (timeOfDay - 12) * 0.1
    } else if (timeOfDay > 18 && timeOfDay <= 24) {
      // Evening drop
      tempVariation = 1.8 - (timeOfDay - 18) * 0.3
    } else {
      // Night low
      tempVariation = 0
    }

    // Add some randomness
    const randomVariation = Math.random() * 0.6 - 0.3

    data.push({
      name: days === 1 ? `${date.getHours()}:00` : date.toLocaleDateString(),
      value: +(baseTemp + tempVariation + randomVariation).toFixed(1),
    })
  }

  return data
}

export default function TemperatureChart() {
  const [data, setData] = useState(generateData())

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value}°C`}
          domain={["dataMin - 1", "dataMax + 1"]}
        />
        <Tooltip formatter={(value) => [`${value}°C`, "Temperature"]} labelFormatter={(label) => `Time: ${label}`} />
        <Line type="monotone" dataKey="value" stroke="#f97316" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
      </LineChart>
    </ResponsiveContainer>
  )
}

