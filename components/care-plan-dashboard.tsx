"use client"

import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import PatientInfo from './PatientInfo';
import CareTeamInfo from './CareTeamInfo';
import ActivityLog from './ActivityLog';
import CarePlanCharts from './CarePlanCharts';

interface FHIRPatient {
  id: string;
  resourceType: 'Patient';
  meta: any;
  active: boolean;
  name: Array<{
    use: string;
    family: string;
    given: string[];
  }>;
  birthDate: string;
  gender: string;
}

interface FHIRCareTeam {
  id: string;
  resourceType: 'CareTeam';
  status: string;
  name: string;
  participant: Array<{
    role?: Array<{
      coding: Array<{
        system: string;
        code: string;
        display: string;
      }>;
    }>;
    member: {
      reference: string;
      display: string;
    };
    onBehalfOf?: {
      reference: string;
      display: string;
    };
    period?: {
      start: string;
      end?: string;
    };
  }>;
}

interface ActivityLogProps {
  patientId: string;
}

interface CarePlanDashboardProps {
  patientId?: string;
}

export default function CarePlanDashboard({ patientId }: CarePlanDashboardProps) {
  const [patientData, setPatientData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [fhirData, setFhirData] = useState<{
    patient: FHIRPatient;
    careTeam: FHIRCareTeam[];
  } | null>(null);
  const supabase = createClientComponentClient();

  useEffect(() => {
    async function fetchPatientData() {
      try {
        let targetPatientId = patientId;
        console.log('Initial patientId:', targetPatientId);

        if (!targetPatientId) {
          // Only try to get current user's data if no patientId is provided (patient view)
          const { data: { user } } = await supabase.auth.getUser();
          console.log('Current user:', user);

          if (!user) {
            console.log('No user found');
            setLoading(false);
            return;
          }

          // Check if user is a doctor
          const { data: doctor } = await supabase
            .from('doctors')
            .select('*')
            .eq('user_id', user.id)
            .single();

          if (!doctor) {
            // For patients: use their auth user ID directly since that's how we structured the data
            targetPatientId = user.id;
            console.log('Using auth user ID as patient ID:', targetPatientId);
          } else {
            console.log('User is a doctor, but no patient ID provided');
            setLoading(false);
            return;
          }
        }

        if (!targetPatientId) {
          console.log('No target patient ID found');
          setLoading(false);
          return;
        }

        console.log('Fetching patient data for ID:', targetPatientId);
        
        // First, get all entries for this patient
        const { data: allData, error: fetchError } = await supabase
          .from('patient_data')
          .select('*')
          .eq('patient_id', targetPatientId)
          .order('created_at', { ascending: false });

        if (fetchError) {
          console.error('Error fetching patient data:', fetchError);
          setLoading(false);
          return;
        }

        if (!allData || allData.length === 0) {
          console.log('No patient data found');
          setLoading(false);
          return;
        }

        // Merge all FHIR bundles into one
        const mergedData = {
          ...allData[0], // Keep the latest record's metadata
          fhir_resource_bundle: {
            resourceType: "Bundle",
            type: "collection",
            entry: allData.reduce((acc: any[], record: any) => {
              // Add entries from each bundle, avoiding duplicates by resource ID
              const newEntries = record.fhir_resource_bundle.entry.filter((entry: any) => {
                const existingEntry = acc.find((e: any) => 
                  e.resource.id === entry.resource.id && 
                  e.resource.resourceType === entry.resource.resourceType
                );
                return !existingEntry;
              });
              return [...acc, ...newEntries];
            }, [])
          }
        };

        console.log('Merged patient data:', mergedData);
        setPatientData(mergedData);

        // Extract FHIR resources from the merged bundle
        const bundle = mergedData.fhir_resource_bundle;
        console.log('FHIR bundle:', bundle);

        const patient = bundle.entry.find((e: any) => e.resource.resourceType === 'Patient')?.resource;
        const careTeam = bundle.entry
          .filter((e: any) => e.resource.resourceType === 'CareTeam')
          .map((e: any) => e.resource);

        console.log('Extracted patient:', patient);
        console.log('Extracted care team:', careTeam);

        setFhirData({
          patient,
          careTeam
        });

        setLoading(false);
      } catch (error) {
        console.error('Error in fetchPatientData:', error);
        setLoading(false);
      }
    }

    fetchPatientData();
  }, [patientId, supabase]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!patientData || !fhirData) {
    return <div>No patient data found. Please contact support if this issue persists.</div>;
  }

  return (
    <div className="grid gap-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <PatientInfo patient={fhirData.patient} />
        <CareTeamInfo careTeam={fhirData.careTeam} />
      </div>
      <CarePlanCharts carePlan={patientData.fhir_resource_bundle} />
      <ActivityLog patientId={patientData.patient_id} />
    </div>
  );
}

