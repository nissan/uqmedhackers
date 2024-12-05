'use client'

import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

interface ActivityLogProps {
  patientId: string
}

interface Activity {
  id: string
  created_at: string
  patient_id: string
  activity_type: string
  description: string
}

export default function ActivityLog({ patientId }: ActivityLogProps) {
  const [activities, setActivities] = useState<Activity[]>([])
  const supabase = createClientComponentClient()

  useEffect(() => {
    async function fetchActivities() {
      const { data, error } = await supabase
        .from('activity_log')
        .select('*')
        .eq('patient_id', patientId)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching activities:', error)
        return
      }

      setActivities(data || [])
    }

    fetchActivities()
  }, [patientId, supabase])

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Activity Log</h2>
      <div className="space-y-2">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="p-4 bg-white rounded-lg shadow"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">{activity.activity_type}</h3>
                <p className="text-sm text-gray-600">{activity.description}</p>
              </div>
              <span className="text-xs text-gray-500">
                {new Date(activity.created_at).toLocaleString()}
              </span>
            </div>
          </div>
        ))}
        {activities.length === 0 && (
          <p className="text-gray-500 text-center py-4">No activities recorded yet.</p>
        )}
      </div>
    </div>
  )
} 