import { TopNav } from "@/components/dashboard/top-nav";
import { Sidebar } from "@/components/dashboard/sidebar";
import { KPICards } from "@/components/dashboard/kpi-cards";
import { AlertsChart } from "@/components/dashboard/alerts-chart";
import { VulnerabilitiesChart } from "@/components/dashboard/vulnerabilities-chart";
import { RecentAlerts } from "@/components/dashboard/recent-alerts";
import { AgentStatus } from "@/components/dashboard/agent-status";
import { MitreAttack } from "@/components/dashboard/mitre-attack";
import { ComplianceOverview } from "@/components/dashboard/compliance-overview";
import { useState } from "react";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Dashboard() {
  const [timeRange, setTimeRange] = useState("24h");

  const handleExportReport = () => {
    // TODO: Implement report export functionality
    console.log("Exporting report for time range:", timeRange);
  };

  return (
    <div className="min-h-screen bg-wazuh-dark text-white font-roboto">
      <TopNav />
      
      <div className="flex h-screen pt-16">
        <Sidebar />
        
        <main className="flex-1 overflow-auto">
          {/* Header Section */}
          <div className="wazuh-surface border-b border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-medium" data-testid="dashboard-title">Security Overview</h2>
                <p className="text-gray-400 mt-1" data-testid="dashboard-subtitle">
                  Real-time security monitoring and threat detection
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <Select value={timeRange} onValueChange={setTimeRange}>
                  <SelectTrigger className="w-48 wazuh-surface-variant border-gray-600" data-testid="time-range-select">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1h">Last 1 hour</SelectItem>
                    <SelectItem value="24h">Last 24 hours</SelectItem>
                    <SelectItem value="7d">Last 7 days</SelectItem>
                    <SelectItem value="30d">Last 30 days</SelectItem>
                  </SelectContent>
                </Select>
                <Button 
                  onClick={handleExportReport}
                  className="wazuh-primary hover:bg-blue-600"
                  data-testid="button-export-report"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export Report
                </Button>
              </div>
            </div>
          </div>

          <div className="p-6">
            {/* KPI Cards */}
            <KPICards />

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <AlertsChart />
              <VulnerabilitiesChart />
            </div>

            {/* Recent Alerts and Agent Status */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <div className="lg:col-span-2">
                <RecentAlerts />
              </div>
              <AgentStatus />
            </div>

            {/* MITRE ATT&CK and Compliance Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <MitreAttack />
              <ComplianceOverview />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
