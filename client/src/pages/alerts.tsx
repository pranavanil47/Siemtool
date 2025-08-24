import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { TopNav } from "@/components/dashboard/top-nav";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, Download, AlertTriangle, AlertCircle, Info, Eye } from "lucide-react";
import type { Alert } from "@shared/schema";
import { cn } from "@/lib/utils";

export default function Alerts() {
  const [searchTerm, setSearchTerm] = useState("");
  const [severityFilter, setSeverityFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  
  const { data: alerts, isLoading } = useQuery<Alert[]>({
    queryKey: ["/api/alerts", { search: searchTerm, page: currentPage, limit: 50 }],
    refetchInterval: 30000,
  });

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <AlertTriangle className="w-4 h-4" />;
      case 'high':
        return <AlertCircle className="w-4 h-4" />;
      case 'medium':
        return <Info className="w-4 h-4" />;
      default:
        return <Info className="w-4 h-4" />;
    }
  };

  const getSeverityClass = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'severity-critical';
      case 'high':
        return 'severity-high';
      case 'medium':
        return 'severity-medium';
      case 'low':
        return 'severity-low';
      default:
        return 'severity-low';
    }
  };

  const formatTimeAgo = (timestamp: string | Date) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffMs = now.getTime() - time.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)} hours ago`;
    return `${Math.floor(diffMins / 1440)} days ago`;
  };

  const filteredAlerts = alerts?.filter(alert => {
    if (severityFilter !== "all" && alert.severity !== severityFilter) return false;
    if (statusFilter === "resolved" && !alert.resolved) return false;
    if (statusFilter === "unresolved" && alert.resolved) return false;
    return true;
  }) || [];

  return (
    <div className="min-h-screen bg-wazuh-dark text-white font-roboto">
      <TopNav />
      
      <div className="flex h-screen pt-16">
        <Sidebar />
        
        <main className="flex-1 overflow-auto">
          <div className="wazuh-surface border-b border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-medium" data-testid="alerts-title">Security Alerts</h2>
                <p className="text-gray-400 mt-1" data-testid="alerts-subtitle">
                  Monitor and investigate security incidents
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <Button className="wazuh-primary hover:bg-blue-600" data-testid="button-export-alerts">
                  <Download className="w-4 h-4 mr-2" />
                  Export Alerts
                </Button>
              </div>
            </div>
          </div>

          <div className="p-6">
            {/* Filters */}
            <Card className="wazuh-surface border-gray-700 mb-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Filter className="w-5 h-5 mr-2" />
                  Filters
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center space-x-2">
                    <Search className="w-4 h-4 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Search alerts..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="wazuh-surface-variant border-gray-600 w-64"
                      data-testid="input-search-alerts"
                    />
                  </div>
                  
                  <Select value={severityFilter} onValueChange={setSeverityFilter}>
                    <SelectTrigger className="w-40 wazuh-surface-variant border-gray-600" data-testid="select-severity">
                      <SelectValue placeholder="Severity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Severities</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-40 wazuh-surface-variant border-gray-600" data-testid="select-status">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="unresolved">Unresolved</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Alerts Table */}
            <Card className="wazuh-surface border-gray-700" data-testid="alerts-table">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>All Alerts ({filteredAlerts.length})</CardTitle>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="text-red-400 border-red-400">
                      {filteredAlerts.filter(a => a.severity === 'critical').length} Critical
                    </Badge>
                    <Badge variant="outline" className="text-yellow-400 border-yellow-400">
                      {filteredAlerts.filter(a => a.severity === 'high').length} High
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {isLoading ? (
                  <div className="p-8 text-center text-gray-400">
                    Loading alerts...
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="wazuh-surface-variant">
                        <tr>
                          <th className="text-left p-4 font-medium text-sm">Severity</th>
                          <th className="text-left p-4 font-medium text-sm">Rule</th>
                          <th className="text-left p-4 font-medium text-sm">Agent</th>
                          <th className="text-left p-4 font-medium text-sm">Description</th>
                          <th className="text-left p-4 font-medium text-sm">Time</th>
                          <th className="text-left p-4 font-medium text-sm">Status</th>
                          <th className="text-left p-4 font-medium text-sm">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredAlerts.map((alert) => (
                          <tr 
                            key={alert.id} 
                            className="border-b border-gray-700 hover:bg-wazuh-surface-variant transition-colors"
                            data-testid={`alert-row-${alert.id}`}
                          >
                            <td className="p-4">
                              <Badge className={cn("inline-flex items-center px-2 py-1 rounded-full text-xs gap-1", getSeverityClass(alert.severity))}>
                                {getSeverityIcon(alert.severity)}
                                {alert.severity}
                              </Badge>
                            </td>
                            <td className="p-4 text-sm font-medium" data-testid={`alert-rule-${alert.id}`}>
                              {alert.rule}
                            </td>
                            <td className="p-4 text-sm" data-testid={`alert-agent-${alert.id}`}>
                              {alert.agentName}
                            </td>
                            <td className="p-4 text-sm text-gray-300 max-w-xs truncate" data-testid={`alert-description-${alert.id}`}>
                              {alert.description}
                            </td>
                            <td className="p-4 text-sm text-gray-400" data-testid={`alert-time-${alert.id}`}>
                              {formatTimeAgo(alert.timestamp!)}
                            </td>
                            <td className="p-4">
                              <Badge variant={alert.resolved ? "default" : "destructive"} className="text-xs">
                                {alert.resolved ? "Resolved" : "Open"}
                              </Badge>
                            </td>
                            <td className="p-4">
                              <Button 
                                variant="ghost" 
                                size="sm"
                                className="text-wazuh-primary hover:bg-wazuh-primary hover:text-white"
                                data-testid={`button-view-${alert.id}`}
                              >
                                <Eye className="w-4 h-4 mr-1" />
                                View
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}