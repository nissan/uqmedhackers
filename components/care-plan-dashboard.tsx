"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'

interface FHIRCarePlan {
  resourceType: 'CarePlan'
  id: string
  status: string
  intent: string
  title: string
  description?: string
  subject: {
    reference: string
    display: string
  }
  period: {
    start: string
    end: string
  }
  activity?: Array<{
    detail: {
      code?: {
        coding: Array<{
          system: string
          code: string
          display: string
        }>
      }
      status: string
      scheduledTiming?: {
        repeat: {
          frequency: number
          period: number
          periodUnit: string
        }
      }
      description?: string
    }
  }>
  includedResources: {
    patient: any
    careTeam: any[]
    goals: any[]
    observations: any[]
  }
}

export function CarePlanDashboard({ carePlan }: { carePlan: FHIRCarePlan }) {
  if (!carePlan) return null

  const startDate = new Date(carePlan.period.start)
  const endDate = new Date(carePlan.period.end)
  const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
  const daysElapsed = Math.ceil((new Date().getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
  const progress = Math.min(Math.round((daysElapsed / totalDays) * 100), 100)

  const activeGoals = carePlan.includedResources.goals.filter(goal => goal.status === 'active')
  const achievedGoals = carePlan.includedResources.goals.filter(goal => goal.status === 'achieved')
  const totalGoals = carePlan.includedResources.goals.length

  const recentObservations = carePlan.includedResources.observations
    .sort((a, b) => new Date(b.effectiveDateTime).getTime() - new Date(a.effectiveDateTime).getTime())
    .slice(0, 5)

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>{carePlan.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">{carePlan.description}</p>
            </div>
            
            <div>
              <div className="flex justify-between text-sm text-gray-500 mb-2">
                <span>Progress</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="w-full" />
            </div>

            <div className="grid grid-cols-3 gap-4 pt-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{totalGoals}</div>
                <div className="text-sm text-gray-500">Total Goals</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{activeGoals.length}</div>
                <div className="text-sm text-gray-500">Active Goals</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{achievedGoals.length}</div>
                <div className="text-sm text-gray-500">Achieved Goals</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="goals">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="goals">Goals</TabsTrigger>
          <TabsTrigger value="activities">Activities</TabsTrigger>
          <TabsTrigger value="observations">Observations</TabsTrigger>
        </TabsList>

        <TabsContent value="goals" className="space-y-4">
          {carePlan.includedResources.goals.map((goal) => (
            <Card key={goal.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium">{goal.description}</h3>
                    {goal.target && (
                      <p className="text-sm text-gray-500 mt-1">
                        Target: {goal.target[0].detail.value} {goal.target[0].detail.unit}
                      </p>
                    )}
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    goal.status === 'achieved' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {goal.status.charAt(0).toUpperCase() + goal.status.slice(1)}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="activities" className="space-y-4">
          {carePlan.activity?.map((activity, index) => (
            <Card key={index}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium">
                      {activity.detail.code?.coding[0].display || activity.detail.description}
                    </h3>
                    {activity.detail.scheduledTiming && (
                      <p className="text-sm text-gray-500 mt-1">
                        {activity.detail.scheduledTiming.repeat.frequency} times per {
                          activity.detail.scheduledTiming.repeat.period
                        } {activity.detail.scheduledTiming.repeat.periodUnit}
                      </p>
                    )}
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    activity.detail.status === 'in-progress' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {activity.detail.status.charAt(0).toUpperCase() + activity.detail.status.slice(1)}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="observations" className="space-y-4">
          {recentObservations.map((observation) => (
            <Card key={observation.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium">{observation.code.coding[0].display}</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {observation.valueQuantity.value} {observation.valueQuantity.unit}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(observation.effectiveDateTime).toLocaleString()}
                    </p>
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    observation.status === 'final' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {observation.status.charAt(0).toUpperCase() + observation.status.slice(1)}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}

