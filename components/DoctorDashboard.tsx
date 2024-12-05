'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Button } from './ui/button';
import CarePlanDashboard from './care-plan-dashboard';

interface Patient {
  id: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  email: string;
}

export default function DoctorDashboard() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null);
  const supabase = createClientComponentClient();

  useEffect(() => {
    async function fetchPatients() {
      const { data: patients, error } = await supabase
        .from('patients')
        .select('*')
        .order('last_name', { ascending: true });

      if (error) {
        console.error('Error fetching patients:', error);
        return;
      }

      setPatients(patients || []);
    }

    fetchPatients();
  }, [supabase]);

  return (
    <div className="container mx-auto p-4">
      {!selectedPatient ? (
        <div>
          <h2 className="text-2xl font-bold mb-4">Patient List</h2>
          <div className="grid gap-4">
            {patients.map((patient) => (
              <div
                key={patient.id}
                className="p-4 border rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer bg-white"
                onClick={() => setSelectedPatient(patient.id)}
              >
                <h3 className="font-semibold">
                  {patient.last_name}, {patient.first_name}
                </h3>
                <p className="text-sm text-gray-600">
                  DOB: {new Date(patient.date_of_birth).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-600">Email: {patient.email}</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <Button
            onClick={() => setSelectedPatient(null)}
            className="mb-4"
            variant="outline"
          >
            ← Back to Patient List
          </Button>
          <CarePlanDashboard patientId={selectedPatient} />
        </div>
      )}
    </div>
  );
} 