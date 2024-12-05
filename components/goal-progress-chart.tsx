"use client"

import { Bar, BarChart, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

export function GoalProgressChart({ goals }) {
  const goalData = goals.map((goal, index) => ({
    goal: goal.display,
    progress: Math.random() * 100, // Simulated progress data
  }))

  return (
    <ChartContainer
      config={{
        progress: {
          label: "Progress",
          color: "hsl(var(--chart-2))",
        },
      }}
      className="h-[300px]"
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={goalData} layout="vertical">
          <XAxis type="number" domain={[0, 100]} />
          <YAxis dataKey="goal" type="category" width={150} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar dataKey="progress" fill="var(--color-progress)" />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}

