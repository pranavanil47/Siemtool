import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { TopNav } from "@/components/dashboard/top-nav";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, CreditCard, CheckCircle, XCircle, AlertTriangle, Eye } from "lucide-react";
import type { ComplianceResult } from "@shared/schema";

export default function PciDss() {
  const { data: complianceResults, isLoading } = useQuery<ComplianceResult[]>({
    queryKey: ["/api/compliance"],
    refetchInterval: 30000,
  });

  // PCI DSS Requirements
  const pciRequirements = [
    { 
      id: "1", 
      title: "Install and maintain a firewall configuration",
      status: "pass",
      details: "Firewall rules properly configured and maintained",
      tests: 12,
      passed: 11,
      agents: 25
    },
    { 
      id: "2", 
      title: "Do not use vendor-supplied defaults for system passwords",
      status: "pass",
      details: "Default passwords have been changed on all systems",
      tests: 8,
      passed: 8,
      agents: 25
    },
    { 
      id: "3", 
      title: "Protect stored cardholder data",
      status: "fail",
      details: "Some systems lack proper encryption for cardholder data",
      tests: 15,
      passed: 12,
      agents: 18
    },
    { 
      id: "4", 
      title: "Encrypt transmission of cardholder data",
      status: "pass",
      details: "All transmissions properly encrypted with TLS 1.2+",
      tests: 6,
      passed: 6,
      agents: 15
    },
    { 
      id: "5", 
      title: "Protect all systems against malware",
      status: "pass",
      details: "Anti-malware solutions deployed and updated",
      tests: 10,
      passed: 9,
      agents: 25
    },
    { 
      id: "6", 
      title: "Develop and maintain secure systems and applications",
      status: "fail",
      details: "Some applications missing security patches",
      tests: 20,
      passed: 16,
      agents: 22
    },
    { 
      id: "7", 
      title: "Restrict access to cardholder data by business need to know",
      status: "pass",
      details: "Access controls properly implemented",
      tests: 14,
      passed: 13,
      agents: 20
    },
    { 
      id: "8", 
      title: "Identify and authenticate access to system components",
      status: "pass",
      details: "Multi-factor authentication in place",
      tests: 18,
      passed: 17,
      agents: 25
    },
    { 
      id: "9", 
      title: "Restrict physical access to cardholder data",
      status: "not_applicable",
      details: "Cloud-based infrastructure, physical access controlled by provider",
      tests: 0,
      passed: 0,
      agents: 0
    },
    { 
      id: "10", 
      title: "Track and monitor all access to network resources",
      status: "pass",
      details: "Comprehensive logging and monitoring in place",
      tests: 16,
      passed: 15,
      agents: 25
    },
    { 
      id: "11", 
      title: "Regularly test security systems and processes",
      status: "pass",
      details: "Regular vulnerability scans and penetration testing",
      tests: 8,
      passed: 7,
      agents: 25
    },
    { 
      id: "12", 
      title: "Maintain a policy that addresses information security",
      status: "pass",
      details: "Security policies documented and enforced",
      tests: 5,
      passed: 5,
      agents: 25
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'fail':
        return <XCircle className="w-5 h-5 text-red-400" />;
      case 'not_applicable':
        return <AlertTriangle className="w-5 h-5 text-yellow-400" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pass':
        return 'bg-green-400 bg-opacity-20 text-green-400';
      case 'fail':
        return 'bg-red-400 bg-opacity-20 text-red-400';
      case 'not_applicable':
        return 'bg-yellow-400 bg-opacity-20 text-yellow-400';
      default:
        return 'bg-gray-400 bg-opacity-20 text-gray-400';
    }
  };

  const passedRequirements = pciRequirements.filter(r => r.status === 'pass').length;
  const failedRequirements = pciRequirements.filter(r => r.status === 'fail').length;
  const notApplicableRequirements = pciRequirements.filter(r => r.status === 'not_applicable').length;
  const totalRequirements = pciRequirements.length - notApplicableRequirements;
  const complianceScore = Math.round((passedRequirements / totalRequirements) * 100);

  return (
    <div className="min-h-screen bg-wazuh-dark text-white font-roboto">
      <TopNav />
      
      <div className="flex h-screen pt-16">
        <Sidebar />
        
        <main className="flex-1 overflow-auto">
          <div className="wazuh-surface border-b border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-medium flex items-center" data-testid="pci-title">
                  <CreditCard className="w-8 h-8 text-wazuh-primary mr-3" />
                  PCI DSS Compliance
                </h2>
                <p className="text-gray-400 mt-1" data-testid="pci-subtitle">
                  Payment Card Industry Data Security Standard
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <Button className="wazuh-primary hover:bg-blue-600" data-testid="button-export-pci-report">
                  <Download className="w-4 h-4 mr-2" />
                  Export Report
                </Button>
              </div>
            </div>
          </div>

          <div className="p-6">
            {/* Compliance Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <Card className="wazuh-surface border-gray-700" data-testid="summary-score">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Compliance Score</p>
                      <p className="text-3xl font-semibold mt-2">{complianceScore}%</p>
                      <div className="mt-2">
                        <Progress value={complianceScore} className="h-2" />
                      </div>
                    </div>
                    <div className="bg-green-400 bg-opacity-20 p-3 rounded-lg">
                      <CreditCard className="text-green-400 w-6 h-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="wazuh-surface border-gray-700" data-testid="summary-passed">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Passed</p>
                      <p className="text-3xl font-semibold mt-2 text-green-400">{passedRequirements}</p>
                      <p className="text-gray-400 text-xs mt-1">Requirements</p>
                    </div>
                    <CheckCircle className="text-green-400 w-8 h-8" />
                  </div>
                </CardContent>
              </Card>

              <Card className="wazuh-surface border-gray-700" data-testid="summary-failed">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Failed</p>
                      <p className="text-3xl font-semibold mt-2 text-red-400">{failedRequirements}</p>
                      <p className="text-gray-400 text-xs mt-1">Requirements</p>
                    </div>
                    <XCircle className="text-red-400 w-8 h-8" />
                  </div>
                </CardContent>
              </Card>

              <Card className="wazuh-surface border-gray-700" data-testid="summary-not-applicable">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Not Applicable</p>
                      <p className="text-3xl font-semibold mt-2 text-yellow-400">{notApplicableRequirements}</p>
                      <p className="text-gray-400 text-xs mt-1">Requirements</p>
                    </div>
                    <AlertTriangle className="text-yellow-400 w-8 h-8" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="requirements" className="space-y-6">
              <TabsList className="wazuh-surface-variant">
                <TabsTrigger value="requirements" data-testid="tab-requirements">Requirements</TabsTrigger>
                <TabsTrigger value="evidence" data-testid="tab-evidence">Evidence</TabsTrigger>
              </TabsList>

              <TabsContent value="requirements" className="space-y-6">
                {/* Requirements Table */}
                <Card className="wazuh-surface border-gray-700" data-testid="requirements-table">
                  <CardHeader>
                    <CardTitle>PCI DSS Requirements Assessment</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    {isLoading ? (
                      <div className="p-8 text-center text-gray-400">
                        Loading compliance data...
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead className="wazuh-surface-variant">
                            <tr>
                              <th className="text-left p-4 font-medium text-sm">Requirement</th>
                              <th className="text-left p-4 font-medium text-sm">Title</th>
                              <th className="text-left p-4 font-medium text-sm">Status</th>
                              <th className="text-left p-4 font-medium text-sm">Test Results</th>
                              <th className="text-left p-4 font-medium text-sm">Agents</th>
                              <th className="text-left p-4 font-medium text-sm">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {pciRequirements.map((requirement) => (
                              <tr 
                                key={requirement.id} 
                                className="border-b border-gray-700 hover:bg-wazuh-surface-variant transition-colors"
                                data-testid={`requirement-row-${requirement.id}`}
                              >
                                <td className="p-4">
                                  <div className="flex items-center space-x-2">
                                    {getStatusIcon(requirement.status)}
                                    <span className="font-medium" data-testid={`requirement-id-${requirement.id}`}>
                                      {requirement.id}
                                    </span>
                                  </div>
                                </td>
                                <td className="p-4">
                                  <div className="max-w-md">
                                    <div className="text-sm font-medium" data-testid={`requirement-title-${requirement.id}`}>
                                      {requirement.title}
                                    </div>
                                    <div className="text-xs text-gray-400 mt-1" data-testid={`requirement-details-${requirement.id}`}>
                                      {requirement.details}
                                    </div>
                                  </div>
                                </td>
                                <td className="p-4">
                                  <Badge className={`text-xs ${getStatusColor(requirement.status)}`}>
                                    {requirement.status.replace('_', ' ').toUpperCase()}
                                  </Badge>
                                </td>
                                <td className="p-4 text-sm">
                                  {requirement.status !== 'not_applicable' && (
                                    <span data-testid={`requirement-tests-${requirement.id}`}>
                                      {requirement.passed}/{requirement.tests} passed
                                    </span>
                                  )}
                                </td>
                                <td className="p-4 text-sm" data-testid={`requirement-agents-${requirement.id}`}>
                                  {requirement.agents > 0 ? `${requirement.agents} agents` : 'N/A'}
                                </td>
                                <td className="p-4">
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    className="text-wazuh-primary hover:bg-wazuh-primary hover:text-white"
                                    data-testid={`button-view-${requirement.id}`}
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
              </TabsContent>

              <TabsContent value="evidence" className="space-y-6">
                {/* Evidence Collection */}
                <Card className="wazuh-surface border-gray-700" data-testid="evidence-table">
                  <CardHeader>
                    <CardTitle>Compliance Evidence</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="wazuh-surface-variant rounded p-4">
                        <h4 className="font-medium mb-2">Log Collection Evidence</h4>
                        <p className="text-sm text-gray-400 mb-2">
                          Logs collected from all in-scope systems demonstrating compliance with PCI DSS requirements.
                        </p>
                        <div className="flex items-center space-x-2">
                          <Badge className="text-xs bg-green-400 bg-opacity-20 text-green-400">
                            ✓ Complete
                          </Badge>
                          <span className="text-xs text-gray-400">Last updated: 2 hours ago</span>
                        </div>
                      </div>
                      
                      <div className="wazuh-surface-variant rounded p-4">
                        <h4 className="font-medium mb-2">Network Security Scans</h4>
                        <p className="text-sm text-gray-400 mb-2">
                          Quarterly vulnerability scans and penetration testing results.
                        </p>
                        <div className="flex items-center space-x-2">
                          <Badge className="text-xs bg-green-400 bg-opacity-20 text-green-400">
                            ✓ Complete
                          </Badge>
                          <span className="text-xs text-gray-400">Last scan: 1 week ago</span>
                        </div>
                      </div>
                      
                      <div className="wazuh-surface-variant rounded p-4">
                        <h4 className="font-medium mb-2">Access Control Documentation</h4>
                        <p className="text-sm text-gray-400 mb-2">
                          Documentation of access controls and user management processes.
                        </p>
                        <div className="flex items-center space-x-2">
                          <Badge className="text-xs bg-yellow-400 bg-opacity-20 text-yellow-400">
                            ⚠ Pending Review
                          </Badge>
                          <span className="text-xs text-gray-400">Due: 3 days</span>
                        </div>
                      </div>
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