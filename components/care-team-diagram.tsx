"use client"

import { Bar, BarChart, XAxis, YAxis, Tooltip } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface CareTeamMember {
  reference: string;
  display: string;
  role?: {
    coding: Array<{
      system: string;
      code: string;
      display: string;
    }>;
  };
}

interface CareTeam {
  id: string;
  resourceType: 'CareTeam';
  status: string;
  subject: {
    reference: string;
    display: string;
  };
  participant: CareTeamMember[];
}

interface Activity {
  detail: {
    code?: {
      coding: Array<{
        system: string;
        code: string;
        display: string;
      }>;
    };
    status: string;
    performer: Array<{
      reference: string;
      display: string;
    }>;
    description?: string;
  };
}

interface CareTeamDiagramProps {
  careTeam: CareTeam;
  activities: Activity[];
}

export function CareTeamDiagram({ careTeam, activities }: CareTeamDiagramProps) {
  const teamMembers = activities.map(activity => activity.detail.performer[0].display);
  const uniqueMembers = [...new Set(teamMembers)];
  
  const memberActivities = uniqueMembers.map(member => ({
    name: member,
    activities: activities.filter(activity => 
      activity.detail.performer[0].display === member
    ).length,
  }));

  const chartConfig = {
    activities: {
      min: 0,
      max: Math.max(...memberActivities.map(m => m.activities)) + 1,
      label: "Activities",
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
              Team Member
            </span>
            <span className="font-bold text-muted-foreground">
              {data.name}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-[0.70rem] uppercase text-muted-foreground">
              Activities
            </span>
            <span className="font-bold text-muted-foreground">
              {data.activities}
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <ChartContainer config={chartConfig}>
      <BarChart data={memberActivities}>
        <XAxis 
          dataKey="name"
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
          dataKey="activities"
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

