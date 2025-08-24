import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { TopNav } from "@/components/dashboard/top-nav";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Filter, Download, Server, Plus, Eye, Settings, RefreshCw, Trash2 } from "lucide-react";
import type { Agent } from "@shared/schema";

export default function Agents() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [osFilter, setOsFilter] = useState("all");
  
  const { data: agents, isLoading } = useQuery<Agent[]>({
    queryKey: ["/api/agents"],
    refetchInterval: 30000,
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-400 bg-opacity-20 text-green-400';
      case 'disconnected':
        return 'bg-gray-500 bg-opacity-20 text-gray-400';
      case 'pending':
        return 'bg-yellow-500 bg-opacity-20 text-yellow-400';
      default:
        return 'bg-gray-500 bg-opacity-20 text-gray-400';
    }
  };

  const getStatusDot = (status: string) => {
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

  const formatLastSeen = (lastSeen: string | Date | null) => {
    if (!lastSeen) return 'Never';
    const now = new Date();
    const time = new Date(lastSeen);
    const diffMs = now.getTime() - time.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)} hours ago`;
    return `${Math.floor(diffMins / 1440)} days ago`;
  };

  const filteredAgents = agents?.filter(agent => {
    if (statusFilter !== "all" && agent.status !== statusFilter) return false;
    if (osFilter !== "all" && agent.os !== osFilter) return false;
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      return agent.name.toLowerCase().includes(search) ||
             agent.ip.toLowerCase().includes(search) ||
             (agent.os && agent.os.toLowerCase().includes(search)) ||
             (agent.platform && agent.platform.toLowerCase().includes(search));
    }
    return true;
  }) || [];

  const activeAgents = filteredAgents.filter(a => a.status === 'active').length;
  const disconnectedAgents = filteredAgents.filter(a => a.status === 'disconnected').length;
  const pendingAgents = filteredAgents.filter(a => a.status === 'pending').length;

  // Mock deployment configuration
  const deploymentInstructions = {
    linux: "curl -s https://packages.wazuh.com/4.x/linux/wazuh-agent-install.sh | sudo bash",
    windows: "Download and run wazuh-agent-4.x.x.msi from the Wazuh website",
    macos: "Download and install wazuh-agent-4.x.x.pkg from the Wazuh website"
  };

  return (
    <div className="min-h-screen bg-wazuh-dark text-white font-roboto">
      <TopNav />
      
      <div className="flex h-screen pt-16">
        <Sidebar />
        
        <main className="flex-1 overflow-auto">
          <div className="wazuh-surface border-b border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-medium" data-testid="agents-title">Agent Management</h2>
                <p className="text-gray-400 mt-1" data-testid="agents-subtitle">
                  Monitor and manage Wazuh agents across your infrastructure
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <Button variant="outline" className="border-gray-600 hover:bg-gray-700" data-testid="button-refresh-agents">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh
                </Button>
                <Button className="wazuh-primary hover:bg-blue-600" data-testid="button-deploy-agent">
                  <Plus className="w-4 h-4 mr-2" />
                  Deploy Agent
                </Button>
              </div>
            </div>
          </div>

          <div className="p-6">
            {/* Agent Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <Card className="wazuh-surface border-gray-700" data-testid="summary-total">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Total Agents</p>
                      <p className="text-3xl font-semibold mt-2">{filteredAgents.length}</p>
                    </div>
                    <Server className="text-wazuh-primary w-8 h-8" />
                  </div>
                </CardContent>
              </Card>

              <Card className="wazuh-surface border-gray-700" data-testid="summary-active">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Active</p>
                      <p className="text-3xl font-semibold mt-2 text-green-400">{activeAgents}</p>
                    </div>
                    <div className="bg-green-400 bg-opacity-20 p-2 rounded-lg">
                      <Server className="text-green-400 w-6 h-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="wazuh-surface border-gray-700" data-testid="summary-disconnected">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Disconnected</p>
                      <p className="text-3xl font-semibold mt-2 text-gray-400">{disconnectedAgents}</p>
                    </div>
                    <div className="bg-gray-500 bg-opacity-20 p-2 rounded-lg">
                      <Server className="text-gray-400 w-6 h-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="wazuh-surface border-gray-700" data-testid="summary-pending">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Pending</p>
                      <p className="text-3xl font-semibold mt-2 text-yellow-400">{pendingAgents}</p>
                    </div>
                    <div className="bg-yellow-500 bg-opacity-20 p-2 rounded-lg">
                      <Server className="text-yellow-400 w-6 h-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="agents" className="space-y-6">
              <TabsList className="wazuh-surface-variant">
                <TabsTrigger value="agents" data-testid="tab-agents">Agents</TabsTrigger>
                <TabsTrigger value="deployment" data-testid="tab-deployment">Deployment</TabsTrigger>
              </TabsList>

              <TabsContent value="agents" className="space-y-6">
                {/* Filters */}
                <Card className="wazuh-surface border-gray-700">
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
                          placeholder="Search agents..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="wazuh-surface-variant border-gray-600 w-64"
                          data-testid="input-search-agents"
                        />
                      </div>
                      
                      <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-40 wazuh-surface-variant border-gray-600" data-testid="select-status">
                          <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Status</SelectItem>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="disconnected">Disconnected</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                        </SelectContent>
                      </Select>

                      <Select value={osFilter} onValueChange={setOsFilter}>
                        <SelectTrigger className="w-40 wazuh-surface-variant border-gray-600" data-testid="select-os">
                          <SelectValue placeholder="OS" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All OS</SelectItem>
                          <SelectItem value="Linux">Linux</SelectItem>
                          <SelectItem value="Windows">Windows</SelectItem>
                          <SelectItem value="macOS">macOS</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                {/* Agents Table */}
                <Card className="wazuh-surface border-gray-700" data-testid="agents-table">
                  <CardHeader>
                    <CardTitle>Agents ({filteredAgents.length})</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    {isLoading ? (
                      <div className="p-8 text-center text-gray-400">
                        Loading agents...
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead className="wazuh-surface-variant">
                            <tr>
                              <th className="text-left p-4 font-medium text-sm">Status</th>
                              <th className="text-left p-4 font-medium text-sm">Name</th>
                              <th className="text-left p-4 font-medium text-sm">IP Address</th>
                              <th className="text-left p-4 font-medium text-sm">OS</th>
                              <th className="text-left p-4 font-medium text-sm">Version</th>
                              <th className="text-left p-4 font-medium text-sm">Last Seen</th>
                              <th className="text-left p-4 font-medium text-sm">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredAgents.map((agent) => (
                              <tr 
                                key={agent.id} 
                                className="border-b border-gray-700 hover:bg-wazuh-surface-variant transition-colors"
                                data-testid={`agent-row-${agent.id}`}
                              >
                                <td className="p-4">
                                  <div className="flex items-center space-x-2">
                                    <div className={`w-3 h-3 rounded-full ${getStatusDot(agent.status)}`}></div>
                                    <Badge className={`text-xs ${getStatusColor(agent.status)}`}>
                                      {agent.status}
                                    </Badge>
                                  </div>
                                </td>
                                <td className="p-4">
                                  <div className="font-medium" data-testid={`agent-name-${agent.id}`}>
                                    {agent.name}
                                  </div>
                                  <div className="text-xs text-gray-400" data-testid={`agent-platform-${agent.id}`}>
                                    {agent.platform || 'Unknown'}
                                  </div>
                                </td>
                                <td className="p-4 font-mono text-sm" data-testid={`agent-ip-${agent.id}`}>
                                  {agent.ip}
                                </td>
                                <td className="p-4 text-sm" data-testid={`agent-os-${agent.id}`}>
                                  {agent.os || 'Unknown'}
                                </td>
                                <td className="p-4 text-sm" data-testid={`agent-version-${agent.id}`}>
                                  {agent.version || 'N/A'}
                                </td>
                                <td className="p-4 text-sm text-gray-400" data-testid={`agent-last-seen-${agent.id}`}>
                                  {formatLastSeen(agent.lastSeen)}
                                </td>
                                <td className="p-4">
                                  <div className="flex items-center space-x-2">
                                    <Button 
                                      variant="ghost" 
                                      size="sm"
                                      className="text-wazuh-primary hover:bg-wazuh-primary hover:text-white"
                                      data-testid={`button-view-${agent.id}`}
                                    >
                                      <Eye className="w-4 h-4" />
                                    </Button>
                                    <Button 
                                      variant="ghost" 
                                      size="sm"
                                      className="text-gray-400 hover:bg-gray-600 hover:text-white"
                                      data-testid={`button-configure-${agent.id}`}
                                    >
                                      <Settings className="w-4 h-4" />
                                    </Button>
                                    <Button 
                                      variant="ghost" 
                                      size="sm"
                                      className="text-red-400 hover:bg-red-500 hover:text-white"
                                      data-testid={`button-delete-${agent.id}`}
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </Button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="deployment" className="space-y-6">
                {/* Agent Deployment */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <Card className="wazuh-surface border-gray-700" data-testid="deployment-linux">
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Server className="w-5 h-5 mr-2 text-orange-400" />
                        Linux
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-400 mb-4">
                        Deploy Wazuh agent on Linux systems using the automated installer.
                      </p>
                      <div className="bg-black bg-opacity-50 p-3 rounded border font-mono text-xs overflow-x-auto">
                        {deploymentInstructions.linux}
                      </div>
                      <Button 
                        className="w-full mt-4 wazuh-primary hover:bg-blue-600"
                        data-testid="button-deploy-linux"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Deploy Linux Agent
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="wazuh-surface border-gray-700" data-testid="deployment-windows">
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Server className="w-5 h-5 mr-2 text-blue-400" />
                        Windows
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-400 mb-4">
                        Install Wazuh agent on Windows systems using the MSI installer.
                      </p>
                      <div className="bg-black bg-opacity-50 p-3 rounded border font-mono text-xs">
                        {deploymentInstructions.windows}
                      </div>
                      <Button 
                        className="w-full mt-4 wazuh-primary hover:bg-blue-600"
                        data-testid="button-deploy-windows"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download Windows Agent
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="wazuh-surface border-gray-700" data-testid="deployment-macos">
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Server className="w-5 h-5 mr-2 text-gray-400" />
                        macOS
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-400 mb-4">
                        Install Wazuh agent on macOS systems using the PKG installer.
                      </p>
                      <div className="bg-black bg-opacity-50 p-3 rounded border font-mono text-xs">
                        {deploymentInstructions.macos}
                      </div>
                      <Button 
                        className="w-full mt-4 wazuh-primary hover:bg-blue-600"
                        data-testid="button-deploy-macos"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download macOS Agent
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                {/* Deployment Configuration */}
                <Card className="wazuh-surface border-gray-700" data-testid="deployment-config">
                  <CardHeader>
                    <CardTitle>Agent Configuration</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium mb-2 block">Manager IP</label>
                          <Input
                            type="text"
                            placeholder="127.0.0.1"
                            className="wazuh-surface-variant border-gray-600"
                            data-testid="input-manager-ip"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium mb-2 block">Manager Port</label>
                          <Input
                            type="text"
                            placeholder="1514"
                            className="wazuh-surface-variant border-gray-600"
                            data-testid="input-manager-port"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Agent Groups</label>
                        <Input
                          type="text"
                          placeholder="default,web-servers"
                          className="wazuh-surface-variant border-gray-600"
                          data-testid="input-agent-groups"
                        />
                      </div>
                      <Button 
                        className="wazuh-primary hover:bg-blue-600"
                        data-testid="button-save-config"
                      >
                        Save Configuration
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
}