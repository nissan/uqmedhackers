'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface FHIRPatient {
  resourceType: 'Patient'
  id: string
  meta: {
    versionId: string
    lastUpdated: string
  }
  active: boolean
  name: Array<{
    use: string
    family: string
    given: string[]
  }>
  gender?: string
  birthDate?: string
  address?: Array<{
    use: string
    type: string
    text: string
    line: string[]
    city: string
    state: string
    postalCode: string
    country: string
  }>
  telecom?: Array<{
    system: string
    value: string
    use: string
  }>
  communication?: Array<{
    language: {
      coding: Array<{
        system: string
        code: string
        display: string
      }>
    }
    preferred: boolean
  }>
}

export default function PatientInfo({ patient }: { patient: FHIRPatient }) {
  if (!patient) return null

  const primaryName = patient.name?.find(n => n.use === 'official') || patient.name?.[0]
  const fullName = primaryName ? `${primaryName.given.join(' ')} ${primaryName.family}` : 'Unknown'
  
  const primaryPhone = patient.telecom?.find(t => t.system === 'phone' && t.use === 'home')
  const primaryAddress = patient.address?.find(a => a.use === 'home') || patient.address?.[0]
  const preferredLanguage = patient.communication?.find(c => c.preferred)?.language.coding[0].display

  return (
    <Card>
      <CardHeader>
        <CardTitle>Patient Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Name</h3>
            <p className="mt-1 text-lg">{fullName}</p>
          </div>

          {patient.birthDate && (
            <div>
              <h3 className="text-sm font-medium text-gray-500">Date of Birth</h3>
              <p className="mt-1">
                {new Date(patient.birthDate).toLocaleDateString()}
              </p>
            </div>
          )}

          {patient.gender && (
            <div>
              <h3 className="text-sm font-medium text-gray-500">Gender</h3>
              <p className="mt-1 capitalize">{patient.gender}</p>
            </div>
          )}

          {primaryPhone && (
            <div>
              <h3 className="text-sm font-medium text-gray-500">Phone</h3>
              <p className="mt-1">{primaryPhone.value}</p>
            </div>
          )}

          {primaryAddress && (
            <div>
              <h3 className="text-sm font-medium text-gray-500">Address</h3>
              <p className="mt-1">
                {primaryAddress.line?.join(', ')}<br />
                {[primaryAddress.city, primaryAddress.state, primaryAddress.postalCode]
                  .filter(Boolean)
                  .join(', ')}
              </p>
            </div>
          )}

          {preferredLanguage && (
            <div>
              <h3 className="text-sm font-medium text-gray-500">Preferred Language</h3>
              <p className="mt-1">{preferredLanguage}</p>
            </div>
          )}

          <div className="pt-2">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              patient.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {patient.active ? 'Active' : 'Inactive'}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 