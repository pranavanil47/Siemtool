import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Button } from "@/components/ui/button";

interface VulnerabilityData {
  name: string;
  value: number;
  color: string;
}

export function VulnerabilitiesChart() {
  const { data: vulnData, isLoading } = useQuery<VulnerabilityData[]>({
    queryKey: ["/api/vulnerabilities/distribution"],
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <Card className="wazuh-surface border-gray-700">
        <CardHeader>
          <CardTitle>Vulnerability Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center">
            <div className="animate-pulse text-gray-400">Loading chart data...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const COLORS = ['#EF4444', '#F59E0B', '#FCD34D', '#10B981'];

  return (
    <Card className="wazuh-surface border-gray-700" data-testid="vulnerabilities-chart">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle data-testid="vulnerabilities-chart-title">Vulnerability Distribution</CardTitle>
          <Button 
            variant="link" 
            className="text-wazuh-primary hover:underline text-sm p-0"
            data-testid="button-view-details"
          >
            View Details
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={vulnData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {vulnData?.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#E5E7EB'
                }}
              />
              <Legend 
                wrapperStyle={{ color: '#E5E7EB' }}
                iconType="circle"
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
