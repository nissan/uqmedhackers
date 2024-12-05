'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface FHIRCareTeam {
  resourceType: 'CareTeam'
  id: string
  status: string
  name?: string
  category?: Array<{
    coding: Array<{
      system: string
      code: string
      display: string
    }>
  }>
  participant: Array<{
    role?: Array<{
      coding: Array<{
        system: string
        code: string
        display: string
      }>
    }>
    member: {
      reference: string
      display: string
    }
    onBehalfOf?: {
      reference: string
      display: string
    }
    period?: {
      start: string
      end?: string
    }
  }>
  reasonCode?: Array<{
    coding: Array<{
      system: string
      code: string
      display: string
    }>
    text?: string
  }>
  managingOrganization?: Array<{
    reference: string
    display: string
  }>
}

export default function CareTeamInfo({ careTeam }: { careTeam: FHIRCareTeam[] }) {
  if (!careTeam?.length) return null

  return (
    <Card>
      <CardHeader>
        <CardTitle>Care Team</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {careTeam.map((team) => (
            <div key={team.id} className="space-y-4">
              {team.name && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Team Name</h3>
                  <p className="mt-1 text-lg">{team.name}</p>
                </div>
              )}

              {team.category && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Category</h3>
                  <div className="mt-1 flex flex-wrap gap-2">
                    {team.category.map((cat, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        {cat.coding[0].display}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h3 className="text-sm font-medium text-gray-500">Team Members</h3>
                <div className="mt-2 space-y-3">
                  {team.participant.map((participant, idx) => (
                    <div key={idx} className="flex items-start space-x-3 text-sm">
                      <div className="flex-1">
                        <p className="font-medium">{participant.member.display}</p>
                        {participant.role && (
                          <p className="text-gray-500">
                            {participant.role[0].coding[0].display}
                          </p>
                        )}
                        {participant.onBehalfOf && (
                          <p className="text-gray-500 text-xs">
                            {participant.onBehalfOf.display}
                          </p>
                        )}
                      </div>
                      {participant.period && (
                        <div className="text-xs text-gray-500">
                          Since {new Date(participant.period.start).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {team.managingOrganization && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Managing Organization</h3>
                  <div className="mt-1">
                    {team.managingOrganization.map((org, idx) => (
                      <p key={idx}>{org.display}</p>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-2">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  team.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {team.status.charAt(0).toUpperCase() + team.status.slice(1)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
} 