"use client"

import { Bar, BarChart, XAxis, YAxis, Tooltip } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface Goal {
  resourceType: 'Goal';
  id: string;
  lifecycleStatus: string;
  achievementStatus?: {
    coding: Array<{
      system: string;
      code: string;
      display: string;
    }>;
  };
  description: {
    text: string;
  };
  subject: {
    reference: string;
    display: string;
  };
  target?: Array<{
    measure?: {
      coding: Array<{
        system: string;
        code: string;
        display: string;
      }>;
    };
    detailQuantity?: {
      value: number;
      unit: string;
      system: string;
      code: string;
    };
    dueDate?: string;
  }>;
  startDate?: string;
  statusDate?: string;
  expressedBy?: {
    reference: string;
    display: string;
  };
  addresses?: Array<{
    reference: string;
    display: string;
  }>;
  note?: Array<{
    text: string;
  }>;
  outcomeReference?: Array<{
    reference: string;
    display: string;
  }>;
}

interface GoalProgressChartProps {
  goals: Goal[];
}

export function GoalProgressChart({ goals }: GoalProgressChartProps) {
  const goalData = goals.map((goal) => {
    // Calculate progress based on achievement status
    let progress = 0;
    if (goal.achievementStatus?.coding[0].code === 'achieved') {
      progress = 100;
    } else if (goal.achievementStatus?.coding[0].code === 'in-progress') {
      // For in-progress goals, we could either:
      // 1. Use a fixed value (e.g., 50)
      // 2. Calculate based on time elapsed if target date exists
      // 3. Use any progress notes or outcome references
      progress = 50; // Default to 50% for in-progress
    }
    // Other status codes like 'cancelled', 'not-achieved' would have 0 progress

    return {
      goal: goal.description.text,
      progress,
      status: goal.achievementStatus?.coding[0].display || goal.lifecycleStatus
    };
  });

  const chartConfig = {
    progress: {
      min: 0,
      max: 100,
      label: "Progress (%)",
      color: "hsl(var(--primary))",
    },
  };

  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: any[] }) => {
    if (!active || !payload?.length) return null;
    
    const data = payload[0].payload;
    return (
      <div className="rounded-lg border bg-background p-2 shadow-sm">
        <div className="grid grid-cols-2 gap-2">
          <div className="flex flex-col">
            <span className="text-[0.70rem] uppercase text-muted-foreground">
              Goal
            </span>
            <span className="font-bold text-muted-foreground">
              {data.goal}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-[0.70rem] uppercase text-muted-foreground">
              Status
            </span>
            <span className="font-bold text-muted-foreground">
              {data.status}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-[0.70rem] uppercase text-muted-foreground">
              Progress
            </span>
            <span className="font-bold text-muted-foreground">
              {data.progress}%
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <ChartContainer config={chartConfig}>
      <BarChart data={goalData}>
        <XAxis 
          dataKey="goal"
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
          dataKey="progress"
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

