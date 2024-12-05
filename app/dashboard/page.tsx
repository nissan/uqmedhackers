import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { Suspense } from 'react'
import CarePlanDashboard from '@/components/care-plan-dashboard'
import PatientInfo from '@/components/PatientInfo'
import CareTeamInfo from '@/components/CareTeamInfo'

export default async function DashboardPage() {
  const cookieStore = cookies()
  const supabase = createServerComponentClient({ cookies: () => cookieStore })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return null
  }

  return (
    <main className="container mx-auto p-4">
      <Suspense fallback={<div>Loading...</div>}>
        <CarePlanDashboard />
      </Suspense>
    </main>
  )
} 