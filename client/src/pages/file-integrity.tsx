import { useState } from "react";
import { TopNav } from "@/components/dashboard/top-nav";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Filter, Download, Shield, File, Folder, Eye, AlertTriangle } from "lucide-react";

export default function FileIntegrity() {
  const [searchTerm, setSearchTerm] = useState("");
  const [actionFilter, setActionFilter] = useState("all");

  // Mock data for file integrity monitoring
  const fileChanges = [
    {
      id: "1",
      path: "/etc/passwd",
      action: "modified",
      agent: "web-server-01",
      timestamp: new Date(Date.now() - 300000),
      checksum: "a1b2c3d4...",
      previousChecksum: "e5f6g7h8...",
      size: 2048,
      permissions: "644",
      severity: "high"
    },
    {
      id: "2",
      path: "/var/www/html/config.php",
      action: "created",
      agent: "web-server-02", 
      timestamp: new Date(Date.now() - 600000),
      checksum: "x9y8z7w6...",
      previousChecksum: null,
      size: 1024,
      permissions: "644",
      severity: "medium"
    },
    {
      id: "3",
      path: "/home/admin/.ssh/authorized_keys",
      action: "deleted",
      agent: "db-server-01",
      timestamp: new Date(Date.now() - 900000),
      checksum: null,
      previousChecksum: "m5n4o3p2...",
      size: 0,
      permissions: null,
      severity: "critical"
    }
  ];

  const monitoredPaths = [
    { path: "/etc", recursive: true, enabled: true, agents: 15 },
    { path: "/var/log", recursive: true, enabled: true, agents: 12 },
    { path: "/home", recursive: false, enabled: true, agents: 8 },
    { path: "/usr/bin", recursive: true, enabled: false, agents: 0 },
    { path: "/var/www", recursive: true, enabled: true, agents: 5 }
  ];

  const getActionColor = (action: string) => {
    switch (action) {
      case 'created':
        return 'bg-green-500 bg-opacity-20 text-green-400';
      case 'modified':
        return 'bg-yellow-500 bg-opacity-20 text-yellow-400';
      case 'deleted':
        return 'bg-red-500 bg-opacity-20 text-red-400';
      default:
        return 'bg-gray-500 bg-opacity-20 text-gray-400';
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

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - timestamp.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)} hours ago`;
    return `${Math.floor(diffMins / 1440)} days ago`;
  };

  const filteredChanges = fileChanges.filter(change => {
    if (actionFilter !== "all" && change.action !== actionFilter) return false;
    if (searchTerm) {
      return change.path.toLowerCase().includes(searchTerm.toLowerCase()) ||
             change.agent.toLowerCase().includes(searchTerm.toLowerCase());
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-wazuh-dark text-white font-roboto">
      <TopNav />
      
      <div className="flex h-screen pt-16">
        <Sidebar />
        
        <main className="flex-1 overflow-auto">
          <div className="wazuh-surface border-b border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-medium" data-testid="file-integrity-title">File Integrity Monitoring</h2>
                <p className="text-gray-400 mt-1" data-testid="file-integrity-subtitle">
                  Monitor and detect unauthorized file system changes
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <Button className="wazuh-primary hover:bg-blue-600" data-testid="button-export-report">
                  <Download className="w-4 h-4 mr-2" />
                  Export Report
                </Button>
              </div>
            </div>
          </div>

          <div className="p-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <Card className="wazuh-surface border-gray-700" data-testid="summary-total-changes">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Total Changes</p>
                      <p className="text-3xl font-semibold mt-2">{fileChanges.length}</p>
                      <p className="text-yellow-400 text-xs mt-1">Last 24 hours</p>
                    </div>
                    <Shield className="text-wazuh-primary w-8 h-8" />
                  </div>
                </CardContent>
              </Card>

              <Card className="wazuh-surface border-gray-700" data-testid="summary-critical">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Critical</p>
                      <p className="text-3xl font-semibold mt-2 text-red-400">
                        {fileChanges.filter(c => c.severity === 'critical').length}
                      </p>
                    </div>
                    <div className="bg-red-500 bg-opacity-20 p-2 rounded-lg">
                      <AlertTriangle className="text-red-400 w-6 h-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="wazuh-surface border-gray-700" data-testid="summary-monitored-paths">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Monitored Paths</p>
                      <p className="text-3xl font-semibold mt-2">
                        {monitoredPaths.filter(p => p.enabled).length}
                      </p>
                    </div>
                    <Folder className="text-green-400 w-8 h-8" />
                  </div>
                </CardContent>
              </Card>

              <Card className="wazuh-surface border-gray-700" data-testid="summary-agents-monitoring">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Agents Monitoring</p>
                      <p className="text-3xl font-semibold mt-2">
                        {monitoredPaths.reduce((sum, p) => sum + p.agents, 0)}
                      </p>
                    </div>
                    <File className="text-blue-400 w-8 h-8" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="changes" className="space-y-6">
              <TabsList className="wazuh-surface-variant">
                <TabsTrigger value="changes" data-testid="tab-changes">File Changes</TabsTrigger>
                <TabsTrigger value="configuration" data-testid="tab-configuration">Configuration</TabsTrigger>
              </TabsList>

              <TabsContent value="changes" className="space-y-6">
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
                          placeholder="Search path or agent..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="wazuh-surface-variant border-gray-600 w-64"
                          data-testid="input-search-changes"
                        />
                      </div>
                      
                      <Select value={actionFilter} onValueChange={setActionFilter}>
                        <SelectTrigger className="w-40 wazuh-surface-variant border-gray-600" data-testid="select-action">
                          <SelectValue placeholder="Action" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Actions</SelectItem>
                          <SelectItem value="created">Created</SelectItem>
                          <SelectItem value="modified">Modified</SelectItem>
                          <SelectItem value="deleted">Deleted</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                {/* File Changes Table */}
                <Card className="wazuh-surface border-gray-700" data-testid="file-changes-table">
                  <CardHeader>
                    <CardTitle>Recent File Changes ({filteredChanges.length})</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="wazuh-surface-variant">
                          <tr>
                            <th className="text-left p-4 font-medium text-sm">Path</th>
                            <th className="text-left p-4 font-medium text-sm">Action</th>
                            <th className="text-left p-4 font-medium text-sm">Agent</th>
                            <th className="text-left p-4 font-medium text-sm">Severity</th>
                            <th className="text-left p-4 font-medium text-sm">Size</th>
                            <th className="text-left p-4 font-medium text-sm">Time</th>
                            <th className="text-left p-4 font-medium text-sm">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredChanges.map((change) => (
                            <tr 
                              key={change.id} 
                              className="border-b border-gray-700 hover:bg-wazuh-surface-variant transition-colors"
                              data-testid={`change-row-${change.id}`}
                            >
                              <td className="p-4">
                                <div className="font-mono text-sm text-blue-400" data-testid={`change-path-${change.id}`}>
                                  {change.path}
                                </div>
                              </td>
                              <td className="p-4">
                                <Badge className={`text-xs ${getActionColor(change.action)}`}>
                                  {change.action}
                                </Badge>
                              </td>
                              <td className="p-4 text-sm" data-testid={`change-agent-${change.id}`}>
                                {change.agent}
                              </td>
                              <td className="p-4">
                                <Badge className={`text-xs ${getSeverityClass(change.severity)}`}>
                                  {change.severity}
                                </Badge>
                              </td>
                              <td className="p-4 text-sm text-gray-400" data-testid={`change-size-${change.id}`}>
                                {change.size > 0 ? `${change.size} bytes` : '-'}
                              </td>
                              <td className="p-4 text-sm text-gray-400" data-testid={`change-time-${change.id}`}>
                                {formatTimeAgo(change.timestamp)}
                              </td>
                              <td className="p-4">
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  className="text-wazuh-primary hover:bg-wazuh-primary hover:text-white"
                                  data-testid={`button-view-${change.id}`}
                                >
                                  <Eye className="w-4 h-4 mr-1" />
                                  Details
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="configuration" className="space-y-6">
                {/* Monitored Paths */}
                <Card className="wazuh-surface border-gray-700" data-testid="monitored-paths-table">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Monitored Paths</CardTitle>
                      <Button className="wazuh-primary hover:bg-blue-600" data-testid="button-add-path">
                        Add Path
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="wazuh-surface-variant">
                          <tr>
                            <th className="text-left p-4 font-medium text-sm">Path</th>
                            <th className="text-left p-4 font-medium text-sm">Recursive</th>
                            <th className="text-left p-4 font-medium text-sm">Status</th>
                            <th className="text-left p-4 font-medium text-sm">Agents</th>
                            <th className="text-left p-4 font-medium text-sm">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {monitoredPaths.map((path, index) => (
                            <tr 
                              key={index} 
                              className="border-b border-gray-700 hover:bg-wazuh-surface-variant transition-colors"
                              data-testid={`path-row-${index}`}
                            >
                              <td className="p-4">
                                <div className="font-mono text-sm text-blue-400" data-testid={`path-name-${index}`}>
                                  {path.path}
                                </div>
                              </td>
                              <td className="p-4">
                                <Badge variant={path.recursive ? "default" : "secondary"} className="text-xs">
                                  {path.recursive ? "Yes" : "No"}
                                </Badge>
                              </td>
                              <td className="p-4">
                                <Badge 
                                  variant={path.enabled ? "default" : "secondary"}
                                  className={`text-xs ${path.enabled ? 'bg-green-500 bg-opacity-20 text-green-400' : 'bg-gray-500 bg-opacity-20 text-gray-400'}`}
                                >
                                  {path.enabled ? "Enabled" : "Disabled"}
                                </Badge>
                              </td>
                              <td className="p-4 text-sm" data-testid={`path-agents-${index}`}>
                                {path.agents} agents
                              </td>
                              <td className="p-4">
                                <div className="flex items-center space-x-2">
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    className="text-wazuh-primary hover:bg-wazuh-primary hover:text-white"
                                    data-testid={`button-edit-${index}`}
                                  >
                                    Edit
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    className="text-red-400 hover:bg-red-500 hover:text-white"
                                    data-testid={`button-delete-${index}`}
                                  >
                                    Delete
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
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