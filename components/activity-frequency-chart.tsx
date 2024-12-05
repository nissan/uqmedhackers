"use client"

import { Bar, BarChart, XAxis, YAxis, Tooltip } from "recharts"
import { ChartContainer, ChartTooltip } from "@/components/ui/chart"

interface Activity {
  detail: {
    code: {
      coding: Array<{
        system: string;
        code: string;
        display: string;
      }>;
    };
    status: string;
    scheduledTiming: {
      repeat: {
        frequency: number;
        period: number;
        periodUnit: string;
      };
    };
  };
}

interface ActivityFrequencyChartProps {
  activities: Activity[];
}

interface FrequencyData {
  activity: string;
  frequency: number;
  period: number;
  periodUnit: string;
}

export function ActivityFrequencyChart({ activities }: ActivityFrequencyChartProps) {
  const frequencyData = activities.map(activity => ({
    activity: activity.detail.code.coding[0].display,
    frequency: activity.detail.scheduledTiming.repeat.frequency,
    period: activity.detail.scheduledTiming.repeat.period,
    periodUnit: activity.detail.scheduledTiming.repeat.periodUnit
  }));

  const chartConfig = {
    frequency: {
      min: 0,
      max: Math.max(...frequencyData.map(d => d.frequency)) + 1,
      label: "Frequency",
      color: "hsl(var(--primary))",
    },
  };

  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: any[] }) => {
    if (!active || !payload?.length) return null;
    
    const data = payload[0].payload as FrequencyData;
    return (
      <div className="rounded-lg border bg-background p-2 shadow-sm">
        <div className="grid grid-cols-2 gap-2">
          <div className="flex flex-col">
            <span className="text-[0.70rem] uppercase text-muted-foreground">
              {data.activity}
            </span>
            <span className="font-bold text-muted-foreground">
              {data.frequency} times per {data.period} {data.periodUnit}
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <ChartContainer config={chartConfig}>
      <BarChart data={frequencyData}>
        <XAxis 
          dataKey="activity"
          tickLine={false}
          axisLine={false}
          fontSize={12}
        />
        <YAxis 
          tickLine={false}
          axisLine={false}
          fontSize={12}
        />
        <Bar
          dataKey="frequency"
          fill="currentColor"
          radius={[4, 4, 0, 0]}
        />
        <Tooltip
          content={({ active, payload }) => (
            <CustomTooltip active={active} payload={payload} />
          )}
        />
      </BarChart>
    </ChartContainer>
  );
}

