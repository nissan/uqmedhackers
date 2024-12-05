'use client'

import { Card } from './ui/card';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface CarePlanProps {
  carePlan: any; // FHIR Bundle
}

export default function CarePlanCharts({ carePlan }: CarePlanProps) {
  // Extract observations from the bundle
  const observations = carePlan.entry
    .filter((entry: any) => entry.resource.resourceType === 'Observation')
    .map((entry: any) => entry.resource)
    .sort((a: any, b: any) => 
      new Date(a.effectiveDateTime).getTime() - new Date(b.effectiveDateTime).getTime()
    );

  // Process blood sugar observations
  const bloodSugarData = observations
    .filter((obs: any) => 
      obs.code.coding[0].code === '15074-8' && 
      obs.valueQuantity?.value !== undefined
    )
    .map((obs: any) => ({
      date: new Date(obs.effectiveDateTime).toLocaleDateString(),
      value: obs.valueQuantity.value,
    }));

  // Process blood pressure observations
  const bloodPressureData = observations
    .filter((obs: any) => obs.code.coding[0].code === '85354-9')
    .map((obs: any) => {
      const systolic = obs.component.find((c: any) => c.code.coding[0].code === '8480-6');
      const diastolic = obs.component.find((c: any) => c.code.coding[0].code === '8462-4');
      return {
        date: new Date(obs.effectiveDateTime).toLocaleDateString(),
        systolic: systolic?.valueQuantity.value,
        diastolic: diastolic?.valueQuantity.value,
      };
    });

  // Process steps data
  const stepsData = observations
    .filter((obs: any) => 
      obs.code.coding[0].code === '55423-8' && 
      obs.code.text === 'Steps'
    )
    .map((obs: any) => ({
      date: new Date(obs.effectiveDateTime).toLocaleDateString(),
      value: obs.valueQuantity.value,
    }));

  // Process active hours data
  const activeHoursData = observations
    .filter((obs: any) => 
      obs.code.coding[0].code === '55423-8' && 
      obs.code.text === 'Active Hours'
    )
    .map((obs: any) => ({
      date: new Date(obs.effectiveDateTime).toLocaleDateString(),
      value: obs.valueQuantity.value,
    }));

  // Process sleep heart rate data
  const sleepHeartRateData = observations
    .filter((obs: any) => obs.code.coding[0].code === '9279-1')
    .map((obs: any) => ({
      date: new Date(obs.effectiveDateTime).toLocaleDateString(),
      value: obs.valueQuantity.value,
    }));

  return (
    <div className="grid gap-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Blood Sugar Levels</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={bloodSugarData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="value"
                name="Blood Sugar (mg/dL)"
                stroke="#8884d8"
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Blood Pressure</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={bloodPressureData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="systolic"
                name="Systolic (mmHg)"
                stroke="#8884d8"
                activeDot={{ r: 8 }}
              />
              <Line
                type="monotone"
                dataKey="diastolic"
                name="Diastolic (mmHg)"
                stroke="#82ca9d"
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Daily Steps</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={stepsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="value"
                name="Steps"
                stroke="#8884d8"
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Active Hours</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={activeHoursData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="value"
                name="Hours"
                stroke="#8884d8"
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Sleep Heart Rate</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={sleepHeartRateData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="value"
                name="BPM"
                stroke="#8884d8"
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
} 