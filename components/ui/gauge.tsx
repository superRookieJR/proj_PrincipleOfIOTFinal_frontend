"use client"

import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"
import { useEffect, useState } from "react"

const gaugeVariants = cva("relative h-40 w-40 flex items-center justify-center", {
  variants: {
    variant: {
      default: "",
      success: "",
      warning: "",
      danger: "",
    },
  },
  defaultVariants: {
    variant: "default",
  },
})

interface GaugeProps extends VariantProps<typeof gaugeVariants> {
  value: number
  min: number
  max: number
  label: string
  className?: string
}

export function Gauge({ value, min, max, label, variant, className }: GaugeProps) {
  const [displayValue, setDisplayValue] = useState(min)

  // Normalize the value to a percentage
  const percentage = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100))

  useEffect(() => {
    // Animate the gauge value
    const timer = setTimeout(() => {
      setDisplayValue(value)
    }, 100)

    return () => clearTimeout(timer)
  }, [value])

  // Calculate the stroke dash offset based on the percentage
  const circumference = 2 * Math.PI * 45
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  // Determine color based on value
  const getColor = () => {
    if (percentage > 75) return "text-green-500"
    if (percentage > 50) return "text-blue-500"
    if (percentage > 25) return "text-yellow-500"
    return "text-red-500"
  }

  return (
    <div className={cn(gaugeVariants({ variant }), className)}>
      <svg className="w-full h-full" viewBox="0 0 100 100">
        {/* Background circle */}
        <circle
          className="text-muted-foreground/20"
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="currentColor"
          strokeWidth="10"
        />
        {/* Foreground circle */}
        <circle
          className={getColor()}
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="currentColor"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          transform="rotate(-90 50 50)"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold">{label}</span>
      </div>
    </div>
  )
}

