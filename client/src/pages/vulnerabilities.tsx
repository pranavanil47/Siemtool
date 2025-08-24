import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { TopNav } from "@/components/dashboard/top-nav";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, Download, Bug, Eye, ExternalLink } from "lucide-react";
import type { Vulnerability } from "@shared/schema";
import { cn } from "@/lib/utils";

export default function Vulnerabilities() {
  const [searchTerm, setSearchTerm] = useState("");
  const [severityFilter, setSeverityFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  
  const { data: vulnerabilities, isLoading } = useQuery<Vulnerability[]>({
    queryKey: ["/api/vulnerabilities"],
    refetchInterval: 30000,
  });

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-red-500 bg-opacity-20 text-red-400';
      case 'fixed':
        return 'bg-green-400 bg-opacity-20 text-green-400';
      case 'ignored':
        return 'bg-gray-500 bg-opacity-20 text-gray-400';
      default:
        return 'bg-gray-500 bg-opacity-20 text-gray-400';
    }
  };

  const formatTimeAgo = (timestamp: string | Date) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffMs = now.getTime() - time.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    return `${diffDays} days ago`;
  };

  const filteredVulnerabilities = vulnerabilities?.filter(vuln => {
    if (severityFilter !== "all" && vuln.severity !== severityFilter) return false;
    if (statusFilter !== "all" && vuln.status !== statusFilter) return false;
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      return vuln.cve.toLowerCase().includes(search) ||
             vuln.title.toLowerCase().includes(search) ||
             vuln.agentName.toLowerCase().includes(search) ||
             (vuln.package && vuln.package.toLowerCase().includes(search));
    }
    return true;
  }) || [];

  const criticalCount = filteredVulnerabilities.filter(v => v.severity === 'critical').length;
  const highCount = filteredVulnerabilities.filter(v => v.severity === 'high').length;
  const openCount = filteredVulnerabilities.filter(v => v.status === 'open').length;

  return (
    <div className="min-h-screen bg-wazuh-dark text-white font-roboto">
      <TopNav />
      
      <div className="flex h-screen pt-16">
        <Sidebar />
        
        <main className="flex-1 overflow-auto">
          <div className="wazuh-surface border-b border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-medium" data-testid="vulnerabilities-title">Vulnerabilities</h2>
                <p className="text-gray-400 mt-1" data-testid="vulnerabilities-subtitle">
                  Track and remediate security vulnerabilities
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <Button className="wazuh-primary hover:bg-blue-600" data-testid="button-export-vulnerabilities">
                  <Download className="w-4 h-4 mr-2" />
                  Export Report
                </Button>
              </div>
            </div>
          </div>

          <div className="p-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <Card className="wazuh-surface border-gray-700" data-testid="summary-total">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Total Vulnerabilities</p>
                      <p className="text-3xl font-semibold mt-2">{filteredVulnerabilities.length}</p>
                    </div>
                    <Bug className="text-gray-400 w-8 h-8" />
                  </div>
                </CardContent>
              </Card>

              <Card className="wazuh-surface border-gray-700" data-testid="summary-critical">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Critical</p>
                      <p className="text-3xl font-semibold mt-2 text-red-400">{criticalCount}</p>
                    </div>
                    <div className="bg-red-500 bg-opacity-20 p-2 rounded-lg">
                      <Bug className="text-red-400 w-6 h-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="wazuh-surface border-gray-700" data-testid="summary-high">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">High</p>
                      <p className="text-3xl font-semibold mt-2 text-yellow-400">{highCount}</p>
                    </div>
                    <div className="bg-yellow-500 bg-opacity-20 p-2 rounded-lg">
                      <Bug className="text-yellow-400 w-6 h-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="wazuh-surface border-gray-700" data-testid="summary-open">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Open</p>
                      <p className="text-3xl font-semibold mt-2">{openCount}</p>
                    </div>
                    <div className="bg-blue-500 bg-opacity-20 p-2 rounded-lg">
                      <Bug className="text-blue-400 w-6 h-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

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
                      placeholder="Search CVE, title, agent, or package..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="wazuh-surface-variant border-gray-600 w-80"
                      data-testid="input-search-vulnerabilities"
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
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="fixed">Fixed</SelectItem>
                      <SelectItem value="ignored">Ignored</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Vulnerabilities Table */}
            <Card className="wazuh-surface border-gray-700" data-testid="vulnerabilities-table">
              <CardHeader>
                <CardTitle>Vulnerabilities ({filteredVulnerabilities.length})</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {isLoading ? (
                  <div className="p-8 text-center text-gray-400">
                    Loading vulnerabilities...
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="wazuh-surface-variant">
                        <tr>
                          <th className="text-left p-4 font-medium text-sm">CVE</th>
                          <th className="text-left p-4 font-medium text-sm">Severity</th>
                          <th className="text-left p-4 font-medium text-sm">Title</th>
                          <th className="text-left p-4 font-medium text-sm">Agent</th>
                          <th className="text-left p-4 font-medium text-sm">Package</th>
                          <th className="text-left p-4 font-medium text-sm">Detected</th>
                          <th className="text-left p-4 font-medium text-sm">Status</th>
                          <th className="text-left p-4 font-medium text-sm">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredVulnerabilities.map((vuln) => (
                          <tr 
                            key={vuln.id} 
                            className="border-b border-gray-700 hover:bg-wazuh-surface-variant transition-colors"
                            data-testid={`vulnerability-row-${vuln.id}`}
                          >
                            <td className="p-4">
                              <div className="flex items-center space-x-2">
                                <span className="font-mono text-sm text-blue-400" data-testid={`vuln-cve-${vuln.id}`}>
                                  {vuln.cve}
                                </span>
                                <ExternalLink className="w-3 h-3 text-gray-400" />
                              </div>
                            </td>
                            <td className="p-4">
                              <Badge className={cn("text-xs", getSeverityClass(vuln.severity))}>
                                {vuln.severity}
                              </Badge>
                            </td>
                            <td className="p-4 text-sm max-w-xs truncate" data-testid={`vuln-title-${vuln.id}`}>
                              {vuln.title}
                            </td>
                            <td className="p-4 text-sm" data-testid={`vuln-agent-${vuln.id}`}>
                              {vuln.agentName}
                            </td>
                            <td className="p-4 text-sm font-mono text-gray-300" data-testid={`vuln-package-${vuln.id}`}>
                              {vuln.package || 'N/A'}
                            </td>
                            <td className="p-4 text-sm text-gray-400" data-testid={`vuln-detected-${vuln.id}`}>
                              {formatTimeAgo(vuln.detectedAt!)}
                            </td>
                            <td className="p-4">
                              <Badge className={cn("text-xs", getStatusColor(vuln.status || 'open'))}>
                                {vuln.status || 'open'}
                              </Badge>
                            </td>
                            <td className="p-4">
                              <Button 
                                variant="ghost" 
                                size="sm"
                                className="text-wazuh-primary hover:bg-wazuh-primary hover:text-white"
                                data-testid={`button-view-${vuln.id}`}
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
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}