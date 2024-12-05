'use client'

import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface Activity {
  id: string
  user_id: string
  action: string
  details: string
  created_at: string
  user_email: string
}

export default function ActivityLog() {
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClientComponentClient()

  useEffect(() => {
    async function loadActivities() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          let query = supabase
            .from('activity_logs')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(10)

          // If not admin, only show own activities
          if (user.user_metadata.role !== 'admin') {
            query = query.eq('user_id', user.id)
          }

          const { data } = await query
          setActivities(data || [])
        }
      } catch (error) {
        console.error('Error loading activities:', error)
      } finally {
        setLoading(false)
      }
    }

    loadActivities()
  }, [supabase])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-100 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No recent activity</p>
          ) : (
            activities.map((activity) => (
              <div key={activity.id} className="border-b border-gray-100 last:border-0 pb-4 last:pb-0">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{activity.action}</span>
                  <span className="text-xs text-gray-500">
                    {new Date(activity.created_at).toLocaleString()}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-1">{activity.details}</p>
                <span className="text-xs text-gray-400 mt-1 block">{activity.user_email}</span>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
} 