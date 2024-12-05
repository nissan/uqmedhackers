'use client'

import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface UserProfile {
  id: string
  email: string
  role: string
  name: string
  last_login?: string
}

export default function UserProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClientComponentClient()

  useEffect(() => {
    async function loadProfile() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          const { data: profile } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('id', user.id)
            .single()

          setProfile({
            id: user.id,
            email: user.email!,
            role: user.user_metadata.role || 'patient',
            name: user.user_metadata.name || 'Anonymous',
            last_login: new Date(user.last_sign_in_at || '').toLocaleString(),
            ...profile
          })
        }
      } catch (error) {
        console.error('Error loading profile:', error)
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [supabase])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!profile) return null

  const roleColors = {
    patient: 'bg-blue-100 text-blue-800',
    practitioner: 'bg-green-100 text-green-800',
    admin: 'bg-purple-100 text-purple-800'
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Name</h3>
            <p className="mt-1 text-lg">{profile.name}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Email</h3>
            <p className="mt-1">{profile.email}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Role</h3>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-1 ${roleColors[profile.role as keyof typeof roleColors]}`}>
              {profile.role.charAt(0).toUpperCase() + profile.role.slice(1)}
            </span>
          </div>
          {profile.last_login && (
            <div>
              <h3 className="text-sm font-medium text-gray-500">Last Login</h3>
              <p className="mt-1 text-sm text-gray-600">{profile.last_login}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
} 