import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, AlertTriangle, AlertCircle, Info } from "lucide-react";
import type { Alert } from "@shared/schema";
import { cn } from "@/lib/utils";

export function RecentAlerts() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  
  const { data: alerts, isLoading } = useQuery<Alert[]>({
    queryKey: ["/api/alerts", { search: searchTerm, page: currentPage, limit: 10 }],
    refetchInterval: 30000,
  });

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <AlertTriangle className="w-4 h-4 mr-1" />;
      case 'high':
        return <AlertCircle className="w-4 h-4 mr-1" />;
      case 'medium':
        return <Info className="w-4 h-4 mr-1" />;
      default:
        return <Info className="w-4 h-4 mr-1" />;
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

  if (isLoading) {
    return (
      <Card className="wazuh-surface border-gray-700">
        <CardHeader>
          <CardTitle>Recent Security Alerts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-700 rounded w-full mb-2"></div>
                <div className="h-3 bg-gray-700 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="wazuh-surface border-gray-700" data-testid="recent-alerts">
      <CardHeader className="border-b border-gray-700">
        <div className="flex items-center justify-between">
          <CardTitle data-testid="recent-alerts-title">Recent Security Alerts</CardTitle>
          <div className="flex items-center space-x-2">
            <Input
              type="text"
              placeholder="Search alerts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="wazuh-surface-variant border-gray-600 w-48"
              data-testid="input-search-alerts"
            />
            <Button size="sm" className="wazuh-primary" data-testid="button-search">
              <Search className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="wazuh-surface-variant">
              <tr>
                <th className="text-left p-4 font-medium text-sm">Severity</th>
                <th className="text-left p-4 font-medium text-sm">Rule</th>
                <th className="text-left p-4 font-medium text-sm">Agent</th>
                <th className="text-left p-4 font-medium text-sm">Time</th>
                <th className="text-left p-4 font-medium text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {alerts?.map((alert) => (
                <tr 
                  key={alert.id} 
                  className="border-b border-gray-700 hover:bg-wazuh-surface-variant transition-colors"
                  data-testid={`alert-row-${alert.id}`}
                >
                  <td className="p-4">
                    <Badge className={cn("inline-flex items-center px-2 py-1 rounded-full text-xs", getSeverityClass(alert.severity))}>
                      {getSeverityIcon(alert.severity)}
                      {alert.severity}
                    </Badge>
                  </td>
                  <td className="p-4 text-sm" data-testid={`alert-rule-${alert.id}`}>{alert.rule}</td>
                  <td className="p-4 text-sm" data-testid={`alert-agent-${alert.id}`}>{alert.agentName}</td>
                  <td className="p-4 text-sm text-gray-400" data-testid={`alert-time-${alert.id}`}>
                    {formatTimeAgo(alert.timestamp!)}
                  </td>
                  <td className="p-4">
                    <Button 
                      variant="link" 
                      className="text-wazuh-primary hover:underline text-sm p-0"
                      data-testid={`button-investigate-${alert.id}`}
                    >
                      Investigate
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-gray-700 flex items-center justify-between">
          <span className="text-sm text-gray-400" data-testid="alerts-pagination-info">
            Showing {alerts?.length || 0} alerts
          </span>
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="wazuh-surface-variant border-gray-600"
              data-testid="button-prev-page"
            >
              Previous
            </Button>
            <Button 
              size="sm"
              onClick={() => setCurrentPage(currentPage + 1)}
              className="wazuh-primary"
              data-testid="button-next-page"
            >
              Next
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
