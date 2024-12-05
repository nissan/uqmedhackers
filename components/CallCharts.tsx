'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts'

interface CallData {
  call_json: {
    call_id: string
    timestamp: string
    duration: number
    status: string
  }
  created_at: string
}

export default function CallCharts({ data }: { data: CallData[] }) {
  // Process data for visualizations
  const callStats = data.map(item => ({
    id: `${item.call_json.call_id}-${item.created_at}`,
    duration: item.call_json.duration,
    timestamp: new Date(item.call_json.timestamp).toLocaleDateString(),
    status: item.call_json.status
  }))

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
      <div className="p-6 bg-white rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Call Duration Over Time</h2>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={callStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="timestamp" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="duration" 
                stroke="#8884d8" 
                name="Duration (seconds)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="p-6 bg-white rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Call Status Distribution</h2>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={callStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="status" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="duration" fill="#82ca9d" name="Duration (seconds)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
} 