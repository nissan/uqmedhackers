"use client"

import { Bar, BarChart, XAxis, YAxis, Tooltip } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface CarePlanActivity {
  detail: {
    code?: {
      coding: Array<{
        system: string;
        code: string;
        display: string;
      }>;
    };
    status: string;
    scheduledTiming?: {
      repeat: {
        frequency: number;
        period: number;
        periodUnit: string;
      };
    };
    description?: string;
  };
}

interface CarePlan {
  id: string;
  resourceType: 'CarePlan';
  status: string;
  intent: string;
  title: string;
  description?: string;
  subject: {
    reference: string;
    display: string;
  };
  period: {
    start: string;
    end: string;
  };
  activity?: CarePlanActivity[];
}

interface CarePlanTimelineProps {
  carePlan: CarePlan;
}

export function CarePlanTimeline({ carePlan }: CarePlanTimelineProps) {
  const startDate = new Date(carePlan.period.start);
  const endDate = new Date(carePlan.period.end);
  const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  const daysElapsed = Math.ceil((new Date().getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  const progress = Math.min(Math.round((daysElapsed / totalDays) * 100), 100);

  const chartConfig = {
    progress: {
      min: 0,
      max: 100,
      label: "Progress",
      color: "hsl(var(--primary))",
    },
  };

  const timelineData = [{
    name: carePlan.title,
    progress,
    total: 100,
  }];

  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: any[] }) => {
    if (!active || !payload?.length) return null;
    
    return (
      <div className="rounded-lg border bg-background p-2 shadow-sm">
        <div className="grid grid-cols-2 gap-2">
          <div className="flex flex-col">
            <span className="text-[0.70rem] uppercase text-muted-foreground">
              Progress
            </span>
            <span className="font-bold text-muted-foreground">
              {progress}%
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-[0.70rem] uppercase text-muted-foreground">
              Days Remaining
            </span>
            <span className="font-bold text-muted-foreground">
              {totalDays - daysElapsed}
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <ChartContainer config={chartConfig}>
      <BarChart data={timelineData} layout="vertical" barSize={20}>
        <XAxis type="number" domain={[0, 100]} hide />
        <YAxis type="category" dataKey="name" hide />
        <Bar
          dataKey="progress"
          fill="currentColor"
          radius={4}
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

