import { useQuery } from "@tanstack/react-query";
import { Server, AlertTriangle, Bug, Shield } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { DashboardMetrics } from "@shared/schema";

export function KPICards() {
  const { data: metrics, isLoading } = useQuery<DashboardMetrics>({
    queryKey: ["/api/dashboard/metrics"],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="wazuh-surface border-gray-700">
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-700 rounded w-24 mb-4"></div>
                <div className="h-8 bg-gray-700 rounded w-16 mb-2"></div>
                <div className="h-3 bg-gray-700 rounded w-32"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const kpiData = [
    {
      title: "Active Agents",
      value: metrics?.activeAgents || 0,
      change: "+12 from yesterday",
      changeType: "positive" as const,
      icon: Server,
      iconColor: "text-wazuh-primary",
      bgColor: "bg-wazuh-primary bg-opacity-20",
      testId: "kpi-active-agents"
    },
    {
      title: "Critical Alerts",
      value: metrics?.criticalAlerts || 0,
      change: "+6 in last hour",
      changeType: "negative" as const,
      icon: AlertTriangle,
      iconColor: "text-red-500",
      bgColor: "bg-red-500 bg-opacity-20",
      testId: "kpi-critical-alerts"
    },
    {
      title: "Vulnerabilities",
      value: metrics?.vulnerabilities || 0,
      change: "-8 since last scan",
      changeType: "positive" as const,
      icon: Bug,
      iconColor: "text-yellow-500",
      bgColor: "bg-yellow-500 bg-opacity-20",
      testId: "kpi-vulnerabilities"
    },
    {
      title: "Compliance Score",
      value: `${metrics?.complianceScore || 0}%`,
      change: "+2% this month",
      changeType: "positive" as const,
      icon: Shield,
      iconColor: "text-green-400",
      bgColor: "bg-green-400 bg-opacity-20",
      testId: "kpi-compliance-score"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {kpiData.map((kpi) => (
        <Card key={kpi.title} className="wazuh-surface border-gray-700" data-testid={kpi.testId}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm" data-testid={`${kpi.testId}-title`}>{kpi.title}</p>
                <p className="text-3xl font-semibold mt-2" data-testid={`${kpi.testId}-value`}>{kpi.value}</p>
                <p className={`text-xs mt-1 ${kpi.changeType === 'positive' ? 'text-green-400' : 'text-red-500'}`} data-testid={`${kpi.testId}-change`}>
                  {kpi.change}
                </p>
              </div>
              <div className={`${kpi.bgColor} p-3 rounded-lg`}>
                <kpi.icon className={`${kpi.iconColor} text-xl w-6 h-6`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
