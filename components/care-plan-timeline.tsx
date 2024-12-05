"use client"

import { Line, LineChart, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

export function CarePlanTimeline({ carePlan }) {
  const startDate = new Date(carePlan.period.start)
  const endDate = new Date(carePlan.period.end)
  const totalDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24))

  const timelineData = carePlan.activity.map((activity, index) => {
    const activityDate = new Date(startDate.getTime() + (totalDays / 2) * (index + 1) * 24 * 60 * 60 * 1000)
    return {
      date: activityDate.toISOString().split('T')[0],
      activity: activity.detail.code.coding[0].display,
    }
  })

  return (
    <ChartContainer
      config={{
        activity: {
          label: "Activity",
          color: "hsl(var(--chart-1))",
        },
      }}
      className="h-[300px]"
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={timelineData}>
          <XAxis dataKey="date" />
          <YAxis dataKey="activity" type="category" />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Line type="stepAfter" dataKey="activity" stroke="var(--color-activity)" />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}

