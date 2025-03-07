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

    // Generate a realistic pH pattern
    const basePH = 6.2

    // Add some randomness
    const randomVariation = Math.random() * 0.4 - 0.2

    data.push({
      name: days === 1 ? `${date.getHours()}:00` : date.toLocaleDateString(),
      value: +(basePH + randomVariation).toFixed(1),
    })
  }

  return data
}

export default function PHChart() {
  const data = generateData()

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} domain={[5, 7]} />
        <Tooltip formatter={(value) => [`${value}`, "pH"]} labelFormatter={(label) => `Time: ${label}`} />
        <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
      </LineChart>
    </ResponsiveContainer>
  )
}

