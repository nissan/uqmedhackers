'use client'

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts'

interface FHIRGoal {
  resourceType: 'Goal'
  id: string
  lifecycleStatus: string
  description: {
    text: string
  }
  target: Array<{
    measure: {
      text: string
    }
    detailQuantity: {
      value: number
      unit: string
    }
  }>
}

interface FHIRObservation {
  resourceType: 'Observation'
  id: string
  status: string
  code: {
    text: string
  }
  effectiveDateTime: string
  valueQuantity?: {
    value: number
    unit: string
  }
  component?: Array<{
    code: {
      text: string
    }
    valueQuantity: {
      value: number
      unit: string
    }
  }>
}

interface CarePlanProps {
  carePlan: {
    includedResources: {
      goals: FHIRGoal[]
      observations: FHIRObservation[]
    }
  }
}

export default function CarePlanCharts({ carePlan }: CarePlanProps) {
  const { goals, observations } = carePlan.includedResources

  // Process observations to handle both single values and component-based observations (like blood pressure)
  const processedObservations = observations.flatMap(obs => {
    if (obs.valueQuantity) {
      // Single value observation (like blood sugar)
      return [{
        type: obs.code.text,
        value: obs.valueQuantity.value,
        unit: obs.valueQuantity.unit,
        date: new Date(obs.effectiveDateTime).toLocaleDateString()
      }]
    } else if (obs.component) {
      // Component-based observation (like blood pressure)
      return obs.component.map(comp => ({
        type: comp.code.text,
        value: comp.valueQuantity.value,
        unit: comp.valueQuantity.unit,
        date: new Date(obs.effectiveDateTime).toLocaleDateString()
      }))
    }
    return []
  })

  // Group observations by type
  const observationsByType = processedObservations.reduce((acc, obs) => {
    if (!acc[obs.type]) {
      acc[obs.type] = []
    }
    acc[obs.type].push({
      value: obs.value,
      date: obs.date,
      unit: obs.unit
    })
    return acc
  }, {} as Record<string, { value: number; date: string; unit: string }[]>)

  // Process goals to match observation types
  const goalsByType = goals.reduce((acc, goal) => {
    if (goal.target?.[0]) {
      acc[goal.target[0].measure.text] = goal.target[0].detailQuantity.value
    }
    return acc
  }, {} as Record<string, number>)

  // Sort observations by date for each type
  Object.values(observationsByType).forEach(observations => {
    observations.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  })

  return (
    <div className="space-y-8">
      {Object.entries(observationsByType).map(([type, observations]) => (
        <div key={type} className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">{type} Over Time</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={observations}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis 
                  label={{ 
                    value: observations[0]?.unit || '', 
                    angle: -90, 
                    position: 'insideLeft' 
                  }} 
                />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#8884d8"
                  name={type}
                />
                {goalsByType[type] && (
                  <ReferenceLine
                    y={goalsByType[type]}
                    label={`Goal: ${goalsByType[type]}`}
                    stroke="red"
                    strokeDasharray="3 3"
                  />
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>
          {goalsByType[type] && (
            <div className="mt-4 text-sm text-gray-600">
              Target Goal: {goalsByType[type]} {observations[0]?.unit}
            </div>
          )}
        </div>
      ))}
    </div>
  )
} 