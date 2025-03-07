"use client"

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

    // Generate a realistic brightness pattern
    const timeOfDay = date.getHours()
    let brightness = 0

    // Simulate day/night cycle
    if (timeOfDay >= 6 && timeOfDay < 8) {
      // Sunrise
      brightness = (timeOfDay - 6) * 5000
    } else if (timeOfDay >= 8 && timeOfDay < 12) {
      // Morning
      brightness = 10000 + (timeOfDay - 8) * 1000
    } else if (timeOfDay >= 12 && timeOfDay < 16) {
      // Afternoon peak
      brightness = 14000
    } else if (timeOfDay >= 16 && timeOfDay < 20) {
      // Evening
      brightness = 14000 - (timeOfDay - 16) * 3500
    } else {
      // Night
      brightness = 0
    }

    // Add some randomness
    const randomVariation = Math.random() * 2000 - 1000

    data.push({
      name: days === 1 ? `${date.getHours()}:00` : date.toLocaleDateString(),
      value: Math.max(0, Math.round(brightness + randomVariation)),
    })
  }

  return data
}

export default function BrightnessChart() {
  const data = generateData()

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value}`}
          domain={[0, "dataMax + 1000"]}
        />
        <Tooltip formatter={(value) => [`${value} lux`, "Brightness"]} labelFormatter={(label) => `Time: ${label}`} />
        <Line type="monotone" dataKey="value" stroke="#eab308" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
      </LineChart>
    </ResponsiveContainer>
  )
}

