"use client"

import { Bar, BarChart, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

export function ActivityFrequencyChart({ activities }) {
  const frequencyData = activities.map(activity => ({
    activity: activity.detail.code.coding[0].display,
    frequency: activity.detail.scheduledTiming.repeat.frequency,
    period: activity.detail.scheduledTiming.repeat.period,
    periodUnit: activity.detail.scheduledTiming.repeat.periodUnit,
  }))

  return (
    <ChartContainer
      config={{
        frequency: {
          label: "Frequency",
          color: "hsl(var(--chart-3))",
        },
      }}
      className="h-[300px]"
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={frequencyData}>
          <XAxis dataKey="activity" />
          <YAxis />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar dataKey="frequency" fill="var(--color-frequency)" />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}

