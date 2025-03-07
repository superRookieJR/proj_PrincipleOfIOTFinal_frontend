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

    // Generate a realistic water level pattern with ebb and flow cycles
    const baseLevel = 75
    const timeOfDay = date.getHours()
    let cycleVariation = 0

    // Simulate ebb and flow cycles
    if (timeOfDay % 6 < 2) {
      // Filling phase
      cycleVariation = 15
    } else if (timeOfDay % 6 < 3) {
      // Full phase
      cycleVariation = 20
    } else if (timeOfDay % 6 < 5) {
      // Draining phase
      cycleVariation = 5
    } else {
      // Empty phase
      cycleVariation = 0
    }

    // Add some randomness
    const randomVariation = Math.random() * 4 - 2

    data.push({
      name: days === 1 ? `${date.getHours()}:00` : date.toLocaleDateString(),
      value: Math.round(baseLevel + cycleVariation + randomVariation),
    })
  }

  return data
}

export default function WaterLevelChart() {
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
          tickFormatter={(value) => `${value}%`}
          domain={[50, 100]}
        />
        <Tooltip formatter={(value) => [`${value}%`, "Water Level"]} labelFormatter={(label) => `Time: ${label}`} />
        <Line type="monotone" dataKey="value" stroke="#0ea5e9" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
      </LineChart>
    </ResponsiveContainer>
  )
}

