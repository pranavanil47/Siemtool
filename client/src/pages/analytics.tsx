import { TopNav } from "@/components/dashboard/top-nav";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, Area, AreaChart } from 'recharts';
import { TrendingUp, BarChart3, PieChart as PieChartIcon, Activity } from "lucide-react";

export default function Analytics() {
  // Sample data for analytics charts
  const threatTrendData = [
    { month: 'Jan', malware: 45, phishing: 32, ransomware: 12, apt: 8 },
    { month: 'Feb', malware: 52, phishing: 28, ransomware: 15, apt: 6 },
    { month: 'Mar', malware: 38, phishing: 41, ransomware: 18, apt: 9 },
    { month: 'Apr', malware: 61, phishing: 35, ransomware: 22, apt: 11 },
    { month: 'May', malware: 49, phishing: 39, ransomware: 19, apt: 13 },
    { month: 'Jun', malware: 55, phishing: 44, ransomware: 25, apt: 16 },
  ];

  const agentPerformanceData = [
    { time: '00:00', cpu: 15, memory: 32, network: 8 },
    { time: '04:00', cpu: 18, memory: 28, network: 12 },
    { time: '08:00', cpu: 35, memory: 45, network: 25 },
    { time: '12:00', cpu: 42, memory: 52, network: 31 },
    { time: '16:00', cpu: 38, memory: 48, network: 28 },
    { time: '20:00', cpu: 25, memory: 35, network: 18 },
  ];

  const topAttackVectorsData = [
    { name: 'Web Application', value: 35, color: '#EF4444' },
    { name: 'Email', value: 28, color: '#F59E0B' },
    { name: 'Network', value: 20, color: '#3B82F6' },
    { name: 'Endpoint', value: 17, color: '#10B981' },
  ];

  const complianceMetrics = [
    { framework: 'PCI DSS', current: 94, target: 95, change: '+2%' },
    { framework: 'GDPR', current: 88, target: 90, change: '+5%' },
    { framework: 'HIPAA', current: 92, target: 95, change: '+1%' },
    { framework: 'NIST', current: 85, target: 90, change: '+3%' },
  ];

  return (
    <div className="min-h-screen bg-wazuh-dark text-white font-roboto">
      <TopNav />
      
      <div className="flex h-screen pt-16">
        <Sidebar />
        
        <main className="flex-1 overflow-auto">
          <div className="wazuh-surface border-b border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-medium" data-testid="analytics-title">Security Analytics</h2>
                <p className="text-gray-400 mt-1" data-testid="analytics-subtitle">
                  Advanced security metrics and performance insights
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Analytics KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="wazuh-surface border-gray-700" data-testid="kpi-detection-rate">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Detection Rate</p>
                      <p className="text-3xl font-semibold mt-2">97.8%</p>
                      <p className="text-green-400 text-xs mt-1">+2.1% from last month</p>
                    </div>
                    <div className="bg-green-400 bg-opacity-20 p-3 rounded-lg">
                      <TrendingUp className="text-green-400 w-6 h-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="wazuh-surface border-gray-700" data-testid="kpi-response-time">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Avg Response Time</p>
                      <p className="text-3xl font-semibold mt-2">3.2m</p>
                      <p className="text-green-400 text-xs mt-1">-15% faster</p>
                    </div>
                    <div className="bg-blue-500 bg-opacity-20 p-3 rounded-lg">
                      <Activity className="text-blue-500 w-6 h-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="wazuh-surface border-gray-700" data-testid="kpi-false-positives">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">False Positives</p>
                      <p className="text-3xl font-semibold mt-2">2.1%</p>
                      <p className="text-green-400 text-xs mt-1">-0.8% improvement</p>
                    </div>
                    <div className="bg-yellow-500 bg-opacity-20 p-3 rounded-lg">
                      <BarChart3 className="text-yellow-500 w-6 h-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="wazuh-surface border-gray-700" data-testid="kpi-coverage">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Security Coverage</p>
                      <p className="text-3xl font-semibold mt-2">94.7%</p>
                      <p className="text-green-400 text-xs mt-1">+1.3% expansion</p>
                    </div>
                    <div className="bg-purple-500 bg-opacity-20 p-3 rounded-lg">
                      <PieChartIcon className="text-purple-500 w-6 h-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Charts Row 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="wazuh-surface border-gray-700" data-testid="threat-trends-chart">
                <CardHeader>
                  <CardTitle>Threat Trends (6 Months)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={threatTrendData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="month" stroke="#9CA3AF" fontSize={12} />
                        <YAxis stroke="#9CA3AF" fontSize={12} />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#1F2937', 
                            border: '1px solid #374151',
                            borderRadius: '8px'
                          }}
                        />
                        <Legend />
                        <Area type="monotone" dataKey="malware" stackId="1" stroke="#EF4444" fill="#EF4444" fillOpacity={0.6} />
                        <Area type="monotone" dataKey="phishing" stackId="1" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.6} />
                        <Area type="monotone" dataKey="ransomware" stackId="1" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.6} />
                        <Area type="monotone" dataKey="apt" stackId="1" stroke="#10B981" fill="#10B981" fillOpacity={0.6} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card className="wazuh-surface border-gray-700" data-testid="agent-performance-chart">
                <CardHeader>
                  <CardTitle>Agent Performance Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={agentPerformanceData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="time" stroke="#9CA3AF" fontSize={12} />
                        <YAxis stroke="#9CA3AF" fontSize={12} />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#1F2937', 
                            border: '1px solid #374151',
                            borderRadius: '8px'
                          }}
                        />
                        <Legend />
                        <Line type="monotone" dataKey="cpu" stroke="#3B82F6" strokeWidth={2} name="CPU %" />
                        <Line type="monotone" dataKey="memory" stroke="#10B981" strokeWidth={2} name="Memory %" />
                        <Line type="monotone" dataKey="network" stroke="#F59E0B" strokeWidth={2} name="Network %" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Charts Row 2 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="wazuh-surface border-gray-700" data-testid="attack-vectors-chart">
                <CardHeader>
                  <CardTitle>Top Attack Vectors</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={topAttackVectorsData}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {topAttackVectorsData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#1F2937', 
                            border: '1px solid #374151',
                            borderRadius: '8px'
                          }}
                        />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card className="wazuh-surface border-gray-700" data-testid="compliance-metrics">
                <CardHeader>
                  <CardTitle>Compliance Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {complianceMetrics.map((metric) => (
                      <div key={metric.framework} className="flex items-center justify-between p-4 wazuh-surface-variant rounded">
                        <div>
                          <div className="font-medium">{metric.framework}</div>
                          <div className="text-sm text-gray-400">Target: {metric.target}%</div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-semibold">{metric.current}%</div>
                          <div className="text-sm text-green-400">{metric.change}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}