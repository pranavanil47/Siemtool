import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface AlertData {
  time: string;
  critical: number;
  high: number;
  medium: number;
  low: number;
}

export function AlertsChart() {
  const { data: alertData, isLoading } = useQuery<AlertData[]>({
    queryKey: ["/api/alerts/timeline"],
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <Card className="wazuh-surface border-gray-700">
        <CardHeader>
          <CardTitle>Security Alerts Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center">
            <div className="animate-pulse text-gray-400">Loading chart data...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="wazuh-surface border-gray-700" data-testid="alerts-chart">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle data-testid="alerts-chart-title">Security Alerts Timeline</CardTitle>
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 bg-red-500 rounded-full"></span>
              <span className="text-gray-400">Critical</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 bg-yellow-500 rounded-full"></span>
              <span className="text-gray-400">High</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={alertData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="time" 
                stroke="#9CA3AF"
                fontSize={12}
              />
              <YAxis 
                stroke="#9CA3AF"
                fontSize={12}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: '1px solid #374151',
                  borderRadius: '8px'
                }}
                labelStyle={{ color: '#E5E7EB' }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="critical" 
                stroke="#EF4444" 
                strokeWidth={2}
                name="Critical"
                dot={{ fill: '#EF4444', strokeWidth: 2, r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="high" 
                stroke="#F59E0B" 
                strokeWidth={2}
                name="High"
                dot={{ fill: '#F59E0B', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
