import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { AgentStatusCounts, Agent } from "@shared/schema";

export function AgentStatus() {
  const { data: statusCounts, isLoading: statusLoading } = useQuery<AgentStatusCounts>({
    queryKey: ["/api/agents/status"],
    refetchInterval: 30000,
  });

  const { data: recentActivity, isLoading: activityLoading } = useQuery<Agent[]>({
    queryKey: ["/api/agents/recent"],
    refetchInterval: 30000,
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-400';
      case 'disconnected':
        return 'bg-gray-500';
      case 'pending':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active':
        return 'Connected';
      case 'disconnected':
        return 'Disconnected';
      case 'pending':
        return 'Reconnected';
      default:
        return status;
    }
  };

  if (statusLoading || activityLoading) {
    return (
      <Card className="wazuh-surface border-gray-700">
        <CardHeader>
          <CardTitle>Agent Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-4 bg-gray-700 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="wazuh-surface border-gray-700" data-testid="agent-status">
      <CardHeader className="border-b border-gray-700">
        <CardTitle data-testid="agent-status-title">Agent Status</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              <span className="text-sm">Active</span>
            </div>
            <span className="text-sm font-medium" data-testid="agent-status-active">
              {statusCounts?.active || 0}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
              <span className="text-sm">Disconnected</span>
            </div>
            <span className="text-sm font-medium" data-testid="agent-status-disconnected">
              {statusCounts?.disconnected || 0}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span className="text-sm">Pending</span>
            </div>
            <span className="text-sm font-medium" data-testid="agent-status-pending">
              {statusCounts?.pending || 0}
            </span>
          </div>
        </div>
        
        <div className="mt-6">
          <h4 className="text-sm font-medium mb-4">Recent Agent Activity</h4>
          <div className="space-y-3">
            {recentActivity?.slice(0, 3).map((agent) => (
              <div key={agent.id} className="flex items-center justify-between text-sm" data-testid={`agent-activity-${agent.id}`}>
                <span className="text-gray-400" data-testid={`agent-name-${agent.id}`}>{agent.name}</span>
                <span className={`text-sm ${
                  agent.status === 'active' ? 'text-green-400' : 
                  agent.status === 'pending' ? 'text-yellow-500' : 'text-gray-400'
                }`} data-testid={`agent-status-label-${agent.id}`}>
                  {getStatusLabel(agent.status)}
                </span>
              </div>
            ))}
          </div>
        </div>
        
        <Button 
          className="w-full mt-6 wazuh-primary hover:bg-blue-600"
          data-testid="button-manage-agents"
        >
          Manage Agents
        </Button>
      </CardContent>
    </Card>
  );
}
