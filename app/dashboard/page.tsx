import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { Suspense } from 'react'
import { CarePlanDashboard } from '@/components/care-plan-dashboard'
import PatientInfo from '@/components/PatientInfo'
import CareTeamInfo from '@/components/CareTeamInfo'

async function getData() {
  const cookieStore = cookies()
  const supabase = createServerComponentClient({ cookies: () => cookieStore })
  
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    console.log('No session found')
    return null
  }

  console.log('Session user ID:', session.user.id)

  // Get all FHIR resources for the patient
  const { data: resourceBundles, error } = await supabase
    .from('patient_data')
    .select('*')
    .eq('patient_id', session.user.id)
    .order('created_at', { ascending: false })
    .limit(1)

  if (error) {
    console.error('Error fetching resource bundles:', error)
    return null
  }

  if (!resourceBundles?.length) {
    console.log('No resource bundles found for user:', session.user.id)
    return null
  }

  console.log('Found resource bundle:', resourceBundles[0])

  const latestBundle = resourceBundles[0].fhir_resource_bundle
  
  // Extract resources by type from the bundle
  const getResourcesByType = (type: string) => {
    const resources = latestBundle.entry
      ?.filter((entry: any) => entry.resource.resourceType === type)
      .map((entry: any) => entry.resource) || []
    console.log(`Found ${resources.length} resources of type ${type}:`, resources)
    return resources
  }

  // Get the active care plan
  const carePlans = getResourcesByType('CarePlan')
  const activePlan = carePlans.find((plan: any) => plan.status === 'active')

  if (!activePlan) {
    console.log('No active care plan found in bundle')
    return null
  }

  console.log('Found active care plan:', activePlan)

  // Get patient data
  const patients = getResourcesByType('Patient')
  const patient = patients.find((p: any) => 
    p.id === activePlan.subject.reference.split('/')[1]
  )

  if (!patient) {
    console.log('No matching patient found for reference:', activePlan.subject.reference)
    return null
  }

  // Get care team data
  const careTeams = getResourcesByType('CareTeam')
  const relevantCareTeams = careTeams.filter((ct: any) => 
    activePlan.careTeam?.some((ref: any) => 
      ref.reference === `CareTeam/${ct.id}`
    )
  )

  // Get goals
  const goals = getResourcesByType('Goal').filter((goal: any) => 
    goal.subject.reference === `Patient/${patient.id}`
  )

  // Get observations
  const observations = getResourcesByType('Observation')
    .filter((obs: any) => obs.subject.reference === `Patient/${patient.id}`)
    .sort((a: any, b: any) => 
      new Date(b.effectiveDateTime).getTime() - new Date(a.effectiveDateTime).getTime()
    )
    .slice(0, 10)

  // Combine all data
  const fullCarePlan = {
    ...activePlan,
    includedResources: {
      patient,
      careTeam: relevantCareTeams,
      goals,
      observations
    }
  }

  console.log('Returning full care plan:', fullCarePlan)
  return fullCarePlan
}

export default async function DashboardPage() {
  const data = await getData()

  if (!data) {
    return (
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-8">Care Plan Dashboard</h1>
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <p className="text-yellow-700">No active care plan found.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main content - Care Plan Dashboard */}
        <div className="lg:col-span-3">
          <Suspense fallback={<div className="p-8">Loading care plan data...</div>}>
            <CarePlanDashboard carePlan={data} />
          </Suspense>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          <Suspense fallback={<div>Loading patient info...</div>}>
            <PatientInfo patient={data.includedResources.patient} />
          </Suspense>
          
          <Suspense fallback={<div>Loading care team...</div>}>
            <CareTeamInfo careTeam={data.includedResources.careTeam} />
          </Suspense>
        </div>
      </div>
    </div>
  )
} 