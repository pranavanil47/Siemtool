import { TopNav } from "@/components/dashboard/top-nav";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, Bookmark, CheckCircle, XCircle, AlertTriangle, Eye, Shield } from "lucide-react";

export default function Nist() {
  // NIST 800-53 Control Families
  const nistControlFamilies = [
    {
      id: "AC",
      name: "Access Control",
      controls: 25,
      implemented: 22,
      compliance: 88,
      status: "pass"
    },
    {
      id: "AU", 
      name: "Audit and Accountability",
      controls: 16,
      implemented: 15,
      compliance: 94,
      status: "pass"
    },
    {
      id: "CA",
      name: "Assessment, Authorization, and Monitoring",
      controls: 9,
      implemented: 7,
      compliance: 78,
      status: "fail"
    },
    {
      id: "CM",
      name: "Configuration Management",
      controls: 14,
      implemented: 12,
      compliance: 86,
      status: "pass"
    },
    {
      id: "CP",
      name: "Contingency Planning",
      controls: 13,
      implemented: 10,
      compliance: 77,
      status: "fail"
    },
    {
      id: "IA",
      name: "Identification and Authentication",
      controls: 12,
      implemented: 11,
      compliance: 92,
      status: "pass"
    },
    {
      id: "IR",
      name: "Incident Response",
      controls: 10,
      implemented: 9,
      compliance: 90,
      status: "pass"
    },
    {
      id: "RA",
      name: "Risk Assessment",
      controls: 10,
      implemented: 8,
      compliance: 80,
      status: "pass"
    },
    {
      id: "SA",
      name: "System and Services Acquisition",
      controls: 23,
      implemented: 18,
      compliance: 78,
      status: "fail"
    },
    {
      id: "SC",
      name: "System and Communications Protection",
      controls: 51,
      implemented: 45,
      compliance: 88,
      status: "pass"
    },
    {
      id: "SI",
      name: "System and Information Integrity",
      controls: 23,
      implemented: 20,
      compliance: 87,
      status: "pass"
    }
  ];

  const highPriorityControls = [
    {
      id: "AC-2",
      name: "Account Management",
      family: "Access Control",
      priority: "High",
      status: "pass",
      implementation: "Automated account provisioning and deprovisioning",
      compliance: 95
    },
    {
      id: "AU-6",
      name: "Audit Record Review, Analysis, and Reporting",
      family: "Audit and Accountability", 
      priority: "High",
      status: "pass",
      implementation: "SIEM-based automated audit review",
      compliance: 92
    },
    {
      id: "CA-7",
      name: "Continuous Monitoring",
      family: "Assessment, Authorization, and Monitoring",
      priority: "High",
      status: "fail",
      implementation: "Requires additional monitoring tools",
      compliance: 65
    },
    {
      id: "IA-2",
      name: "Identification and Authentication (Organizational Users)",
      family: "Identification and Authentication",
      priority: "High", 
      status: "pass",
      implementation: "Multi-factor authentication implemented",
      compliance: 98
    },
    {
      id: "IR-4",
      name: "Incident Handling",
      family: "Incident Response",
      priority: "High",
      status: "pass",
      implementation: "24/7 incident response team",
      compliance: 89
    },
    {
      id: "SC-7",
      name: "Boundary Protection",
      family: "System and Communications Protection",
      priority: "High",
      status: "pass",
      implementation: "Next-generation firewalls and DLP",
      compliance: 91
    },
    {
      id: "SI-4",
      name: "System Monitoring",
      family: "System and Information Integrity",
      priority: "High",
      status: "pass",
      implementation: "Real-time system monitoring",
      compliance: 94
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'fail':
        return <XCircle className="w-5 h-5 text-red-400" />;
      case 'partial':
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
      case 'partial':
        return 'bg-yellow-400 bg-opacity-20 text-yellow-400';
      default:
        return 'bg-gray-400 bg-opacity-20 text-gray-400';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'bg-red-500 bg-opacity-20 text-red-400';
      case 'Medium':
        return 'bg-yellow-500 bg-opacity-20 text-yellow-400';
      case 'Low':
        return 'bg-green-500 bg-opacity-20 text-green-400';
      default:
        return 'bg-gray-500 bg-opacity-20 text-gray-400';
    }
  };

  const totalControls = nistControlFamilies.reduce((sum, family) => sum + family.controls, 0);
  const totalImplemented = nistControlFamilies.reduce((sum, family) => sum + family.implemented, 0);
  const overallCompliance = Math.round(nistControlFamilies.reduce((sum, family) => sum + family.compliance, 0) / nistControlFamilies.length);
  const passedFamilies = nistControlFamilies.filter(f => f.status === 'pass').length;
  const failedFamilies = nistControlFamilies.filter(f => f.status === 'fail').length;

  return (
    <div className="min-h-screen bg-wazuh-dark text-white font-roboto">
      <TopNav />
      
      <div className="flex h-screen pt-16">
        <Sidebar />
        
        <main className="flex-1 overflow-auto">
          <div className="wazuh-surface border-b border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-medium flex items-center" data-testid="nist-title">
                  <Bookmark className="w-8 h-8 text-wazuh-primary mr-3" />
                  NIST 800-53 Compliance
                </h2>
                <p className="text-gray-400 mt-1" data-testid="nist-subtitle">
                  Security and Privacy Controls for Information Systems
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <Button className="wazuh-primary hover:bg-blue-600" data-testid="button-export-nist-report">
                  <Download className="w-4 h-4 mr-2" />
                  Export Report
                </Button>
              </div>
            </div>
          </div>

          <div className="p-6">
            {/* Compliance Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <Card className="wazuh-surface border-gray-700" data-testid="summary-compliance">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Overall Compliance</p>
                      <p className="text-3xl font-semibold mt-2">{overallCompliance}%</p>
                      <div className="mt-2">
                        <Progress value={overallCompliance} className="h-2" />
                      </div>
                    </div>
                    <div className="bg-green-400 bg-opacity-20 p-3 rounded-lg">
                      <Bookmark className="text-green-400 w-6 h-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="wazuh-surface border-gray-700" data-testid="summary-controls">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Controls Implemented</p>
                      <p className="text-3xl font-semibold mt-2">{totalImplemented}</p>
                      <p className="text-gray-400 text-xs mt-1">Out of {totalControls}</p>
                    </div>
                    <Shield className="text-blue-400 w-8 h-8" />
                  </div>
                </CardContent>
              </Card>

              <Card className="wazuh-surface border-gray-700" data-testid="summary-families-passed">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Compliant Families</p>
                      <p className="text-3xl font-semibold mt-2 text-green-400">{passedFamilies}</p>
                      <p className="text-gray-400 text-xs mt-1">Control families</p>
                    </div>
                    <CheckCircle className="text-green-400 w-8 h-8" />
                  </div>
                </CardContent>
              </Card>

              <Card className="wazuh-surface border-gray-700" data-testid="summary-families-failed">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Non-Compliant</p>
                      <p className="text-3xl font-semibold mt-2 text-red-400">{failedFamilies}</p>
                      <p className="text-gray-400 text-xs mt-1">Families need attention</p>
                    </div>
                    <XCircle className="text-red-400 w-8 h-8" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="families" className="space-y-6">
              <TabsList className="wazuh-surface-variant">
                <TabsTrigger value="families" data-testid="tab-families">Control Families</TabsTrigger>
                <TabsTrigger value="priority" data-testid="tab-priority">High Priority Controls</TabsTrigger>
              </TabsList>

              <TabsContent value="families" className="space-y-6">
                {/* Control Families Table */}
                <Card className="wazuh-surface border-gray-700" data-testid="families-table">
                  <CardHeader>
                    <CardTitle>NIST 800-53 Control Families</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="wazuh-surface-variant">
                          <tr>
                            <th className="text-left p-4 font-medium text-sm">Family</th>
                            <th className="text-left p-4 font-medium text-sm">Name</th>
                            <th className="text-left p-4 font-medium text-sm">Implementation</th>
                            <th className="text-left p-4 font-medium text-sm">Compliance</th>
                            <th className="text-left p-4 font-medium text-sm">Status</th>
                            <th className="text-left p-4 font-medium text-sm">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {nistControlFamilies.map((family) => (
                            <tr 
                              key={family.id} 
                              className="border-b border-gray-700 hover:bg-wazuh-surface-variant transition-colors"
                              data-testid={`family-row-${family.id}`}
                            >
                              <td className="p-4">
                                <div className="flex items-center space-x-2">
                                  {getStatusIcon(family.status)}
                                  <span className="font-mono font-medium" data-testid={`family-id-${family.id}`}>
                                    {family.id}
                                  </span>
                                </div>
                              </td>
                              <td className="p-4">
                                <div className="text-sm font-medium" data-testid={`family-name-${family.id}`}>
                                  {family.name}
                                </div>
                              </td>
                              <td className="p-4 text-sm" data-testid={`family-implementation-${family.id}`}>
                                {family.implemented}/{family.controls} controls
                              </td>
                              <td className="p-4">
                                <div className="flex items-center space-x-2">
                                  <span className="text-sm" data-testid={`family-compliance-${family.id}`}>
                                    {family.compliance}%
                                  </span>
                                  <div className="w-16">
                                    <Progress value={family.compliance} className="h-2" />
                                  </div>
                                </div>
                              </td>
                              <td className="p-4">
                                <Badge className={`text-xs ${getStatusColor(family.status)}`}>
                                  {family.status === 'pass' ? 'COMPLIANT' : 'NON-COMPLIANT'}
                                </Badge>
                              </td>
                              <td className="p-4">
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  className="text-wazuh-primary hover:bg-wazuh-primary hover:text-white"
                                  data-testid={`button-view-${family.id}`}
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

              <TabsContent value="priority" className="space-y-6">
                {/* High Priority Controls */}
                <Card className="wazuh-surface border-gray-700" data-testid="priority-controls-table">
                  <CardHeader>
                    <CardTitle>High Priority Security Controls</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="wazuh-surface-variant">
                          <tr>
                            <th className="text-left p-4 font-medium text-sm">Control</th>
                            <th className="text-left p-4 font-medium text-sm">Name</th>
                            <th className="text-left p-4 font-medium text-sm">Family</th>
                            <th className="text-left p-4 font-medium text-sm">Priority</th>
                            <th className="text-left p-4 font-medium text-sm">Implementation</th>
                            <th className="text-left p-4 font-medium text-sm">Compliance</th>
                            <th className="text-left p-4 font-medium text-sm">Status</th>
                            <th className="text-left p-4 font-medium text-sm">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {highPriorityControls.map((control) => (
                            <tr 
                              key={control.id} 
                              className="border-b border-gray-700 hover:bg-wazuh-surface-variant transition-colors"
                              data-testid={`control-row-${control.id}`}
                            >
                              <td className="p-4">
                                <div className="flex items-center space-x-2">
                                  {getStatusIcon(control.status)}
                                  <span className="font-mono font-medium" data-testid={`control-id-${control.id}`}>
                                    {control.id}
                                  </span>
                                </div>
                              </td>
                              <td className="p-4">
                                <div className="text-sm font-medium" data-testid={`control-name-${control.id}`}>
                                  {control.name}
                                </div>
                              </td>
                              <td className="p-4 text-sm text-gray-400" data-testid={`control-family-${control.id}`}>
                                {control.family}
                              </td>
                              <td className="p-4">
                                <Badge className={`text-xs ${getPriorityColor(control.priority)}`}>
                                  {control.priority}
                                </Badge>
                              </td>
                              <td className="p-4 text-sm max-w-xs" data-testid={`control-implementation-${control.id}`}>
                                {control.implementation}
                              </td>
                              <td className="p-4">
                                <div className="flex items-center space-x-2">
                                  <span className="text-sm" data-testid={`control-compliance-${control.id}`}>
                                    {control.compliance}%
                                  </span>
                                  <div className="w-16">
                                    <Progress value={control.compliance} className="h-2" />
                                  </div>
                                </div>
                              </td>
                              <td className="p-4">
                                <Badge className={`text-xs ${getStatusColor(control.status)}`}>
                                  {control.status === 'pass' ? 'COMPLIANT' : 'NON-COMPLIANT'}
                                </Badge>
                              </td>
                              <td className="p-4">
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  className="text-wazuh-primary hover:bg-wazuh-primary hover:text-white"
                                  data-testid={`button-view-control-${control.id}`}
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
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
}