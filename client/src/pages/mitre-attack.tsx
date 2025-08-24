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
import { Search, Filter, Download, Target, Eye, ExternalLink } from "lucide-react";
import type { MitreAttackData } from "@shared/schema";

export default function MitreAttack() {
  const [searchTerm, setSearchTerm] = useState("");
  const [tacticFilter, setTacticFilter] = useState("all");
  
  const { data: mitreData, isLoading } = useQuery<MitreAttackData[]>({
    queryKey: ["/api/mitre-attack"],
    refetchInterval: 30000,
  });

  // Extended MITRE ATT&CK data with tactics
  const mitreMatrix = [
    {
      tactic: "Initial Access",
      techniques: [
        { id: "T1190", name: "Exploit Public-Facing Application", alerts: 8 },
        { id: "T1566", name: "Phishing", alerts: 12 },
        { id: "T1078", name: "Valid Accounts", alerts: 5 }
      ]
    },
    {
      tactic: "Execution", 
      techniques: [
        { id: "T1059", name: "Command and Scripting Interpreter", alerts: 15 },
        { id: "T1053", name: "Scheduled Task/Job", alerts: 6 },
        { id: "T1569", name: "System Services", alerts: 3 }
      ]
    },
    {
      tactic: "Persistence",
      techniques: [
        { id: "T1547", name: "Boot or Logon Autostart Execution", alerts: 4 },
        { id: "T1543", name: "Create or Modify System Process", alerts: 7 },
        { id: "T1546", name: "Event Triggered Execution", alerts: 2 }
      ]
    },
    {
      tactic: "Privilege Escalation",
      techniques: [
        { id: "T1068", name: "Exploitation for Privilege Escalation", alerts: 9 },
        { id: "T1548", name: "Abuse Elevation Control Mechanism", alerts: 3 },
        { id: "T1055", name: "Process Injection", alerts: 11 }
      ]
    },
    {
      tactic: "Defense Evasion",
      techniques: [
        { id: "T1070", name: "Indicator Removal", alerts: 13 },
        { id: "T1027", name: "Obfuscated Files or Information", alerts: 8 },
        { id: "T1562", name: "Impair Defenses", alerts: 5 }
      ]
    },
    {
      tactic: "Credential Access",
      techniques: [
        { id: "T1110", name: "Brute Force", alerts: 18 },
        { id: "T1003", name: "OS Credential Dumping", alerts: 6 },
        { id: "T1552", name: "Unsecured Credentials", alerts: 4 }
      ]
    }
  ];

  const getSeverityBadge = (alertCount: number) => {
    if (alertCount >= 15) return { className: "severity-critical", label: `${alertCount} alerts` };
    if (alertCount >= 10) return { className: "severity-high", label: `${alertCount} alerts` };
    if (alertCount >= 5) return { className: "severity-medium", label: `${alertCount} alerts` };
    if (alertCount >= 1) return { className: "severity-low", label: `${alertCount} alert${alertCount > 1 ? 's' : ''}` };
    return { className: "bg-gray-500 bg-opacity-20 text-gray-400", label: "No alerts" };
  };

  const filteredMatrix = mitreMatrix.filter(tactic => {
    if (tacticFilter !== "all" && tactic.tactic !== tacticFilter) return false;
    if (searchTerm) {
      return tactic.tactic.toLowerCase().includes(searchTerm.toLowerCase()) ||
             tactic.techniques.some(t => 
               t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
               t.id.toLowerCase().includes(searchTerm.toLowerCase())
             );
    }
    return true;
  });

  const totalAlerts = mitreMatrix.reduce((sum, tactic) => 
    sum + tactic.techniques.reduce((tacticSum, technique) => tacticSum + technique.alerts, 0), 0
  );

  const topTechniques = mitreMatrix
    .flatMap(tactic => tactic.techniques.map(technique => ({ ...technique, tactic: tactic.tactic })))
    .sort((a, b) => b.alerts - a.alerts)
    .slice(0, 10);

  return (
    <div className="min-h-screen bg-wazuh-dark text-white font-roboto">
      <TopNav />
      
      <div className="flex h-screen pt-16">
        <Sidebar />
        
        <main className="flex-1 overflow-auto">
          <div className="wazuh-surface border-b border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-medium" data-testid="mitre-title">MITRE ATT&CK Framework</h2>
                <p className="text-gray-400 mt-1" data-testid="mitre-subtitle">
                  Track adversary tactics, techniques, and procedures
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <Button 
                  variant="outline" 
                  className="border-gray-600 hover:bg-gray-700"
                  data-testid="button-view-matrix"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View Full Matrix
                </Button>
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
              <Card className="wazuh-surface border-gray-700" data-testid="summary-total-alerts">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Total MITRE Alerts</p>
                      <p className="text-3xl font-semibold mt-2">{totalAlerts}</p>
                      <p className="text-yellow-400 text-xs mt-1">Last 30 days</p>
                    </div>
                    <Target className="text-wazuh-primary w-8 h-8" />
                  </div>
                </CardContent>
              </Card>

              <Card className="wazuh-surface border-gray-700" data-testid="summary-tactics">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Active Tactics</p>
                      <p className="text-3xl font-semibold mt-2">{mitreMatrix.length}</p>
                      <p className="text-green-400 text-xs mt-1">Out of 14 total</p>
                    </div>
                    <div className="bg-green-400 bg-opacity-20 p-2 rounded-lg">
                      <Target className="text-green-400 w-6 h-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="wazuh-surface border-gray-700" data-testid="summary-techniques">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Techniques Detected</p>
                      <p className="text-3xl font-semibold mt-2">
                        {mitreMatrix.reduce((sum, tactic) => sum + tactic.techniques.length, 0)}
                      </p>
                      <p className="text-blue-400 text-xs mt-1">Unique techniques</p>
                    </div>
                    <div className="bg-blue-500 bg-opacity-20 p-2 rounded-lg">
                      <Target className="text-blue-400 w-6 h-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="wazuh-surface border-gray-700" data-testid="summary-critical">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">High Activity</p>
                      <p className="text-3xl font-semibold mt-2 text-red-400">
                        {topTechniques.filter(t => t.alerts >= 15).length}
                      </p>
                      <p className="text-red-400 text-xs mt-1">Techniques ≥15 alerts</p>
                    </div>
                    <div className="bg-red-500 bg-opacity-20 p-2 rounded-lg">
                      <Target className="text-red-400 w-6 h-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="matrix" className="space-y-6">
              <TabsList className="wazuh-surface-variant">
                <TabsTrigger value="matrix" data-testid="tab-matrix">Attack Matrix</TabsTrigger>
                <TabsTrigger value="techniques" data-testid="tab-techniques">Top Techniques</TabsTrigger>
              </TabsList>

              <TabsContent value="matrix" className="space-y-6">
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
                          placeholder="Search tactics or techniques..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="wazuh-surface-variant border-gray-600 w-64"
                          data-testid="input-search-mitre"
                        />
                      </div>
                      
                      <Select value={tacticFilter} onValueChange={setTacticFilter}>
                        <SelectTrigger className="w-48 wazuh-surface-variant border-gray-600" data-testid="select-tactic">
                          <SelectValue placeholder="Select Tactic" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Tactics</SelectItem>
                          {mitreMatrix.map(tactic => (
                            <SelectItem key={tactic.tactic} value={tactic.tactic}>
                              {tactic.tactic}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                {/* MITRE ATT&CK Matrix */}
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredMatrix.map((tactic) => (
                    <Card key={tactic.tactic} className="wazuh-surface border-gray-700" data-testid={`tactic-card-${tactic.tactic}`}>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg flex items-center justify-between">
                          <span>{tactic.tactic}</span>
                          <Badge variant="outline" className="text-xs">
                            {tactic.techniques.length} techniques
                          </Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {tactic.techniques.map((technique) => {
                          const badge = getSeverityBadge(technique.alerts);
                          return (
                            <div 
                              key={technique.id}
                              className="wazuh-surface-variant rounded p-3 hover:bg-opacity-80 transition-colors cursor-pointer"
                              data-testid={`technique-card-${technique.id}`}
                            >
                              <div className="flex items-start justify-between mb-2">
                                <div className="flex-1">
                                  <div className="font-medium text-sm" data-testid={`technique-name-${technique.id}`}>
                                    {technique.name}
                                  </div>
                                  <div className="text-xs text-gray-400 font-mono" data-testid={`technique-id-${technique.id}`}>
                                    {technique.id}
                                  </div>
                                </div>
                                <Badge className={`text-xs ml-2 ${badge.className}`}>
                                  {badge.label}
                                </Badge>
                              </div>
                            </div>
                          );
                        })}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="techniques" className="space-y-6">
                {/* Top Techniques Table */}
                <Card className="wazuh-surface border-gray-700" data-testid="top-techniques-table">
                  <CardHeader>
                    <CardTitle>Top Techniques by Alert Count</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="wazuh-surface-variant">
                          <tr>
                            <th className="text-left p-4 font-medium text-sm">Rank</th>
                            <th className="text-left p-4 font-medium text-sm">Technique ID</th>
                            <th className="text-left p-4 font-medium text-sm">Name</th>
                            <th className="text-left p-4 font-medium text-sm">Tactic</th>
                            <th className="text-left p-4 font-medium text-sm">Alerts</th>
                            <th className="text-left p-4 font-medium text-sm">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {topTechniques.map((technique, index) => {
                            const badge = getSeverityBadge(technique.alerts);
                            return (
                              <tr 
                                key={technique.id} 
                                className="border-b border-gray-700 hover:bg-wazuh-surface-variant transition-colors"
                                data-testid={`top-technique-row-${technique.id}`}
                              >
                                <td className="p-4 font-medium text-wazuh-primary">
                                  #{index + 1}
                                </td>
                                <td className="p-4">
                                  <span className="font-mono text-sm text-blue-400" data-testid={`top-technique-id-${technique.id}`}>
                                    {technique.id}
                                  </span>
                                </td>
                                <td className="p-4 text-sm" data-testid={`top-technique-name-${technique.id}`}>
                                  {technique.name}
                                </td>
                                <td className="p-4 text-sm text-gray-400" data-testid={`top-technique-tactic-${technique.id}`}>
                                  {technique.tactic}
                                </td>
                                <td className="p-4">
                                  <Badge className={`text-xs ${badge.className}`}>
                                    {technique.alerts} alerts
                                  </Badge>
                                </td>
                                <td className="p-4">
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    className="text-wazuh-primary hover:bg-wazuh-primary hover:text-white"
                                    data-testid={`button-view-${technique.id}`}
                                  >
                                    <Eye className="w-4 h-4 mr-1" />
                                    View Alerts
                                  </Button>
                                </td>
                              </tr>
                            );
                          })}
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