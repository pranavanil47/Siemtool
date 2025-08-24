import { TopNav } from "@/components/dashboard/top-nav";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, Hospital, CheckCircle, XCircle, AlertTriangle, Eye, Shield } from "lucide-react";

export default function Hipaa() {
  // HIPAA Safeguards and compliance status
  const hipaaSafeguards = [
    {
      category: "Administrative Safeguards",
      requirements: [
        { id: "164.308(a)(1)", title: "Assigned Security Responsibility", status: "pass", compliance: 100 },
        { id: "164.308(a)(2)", title: "Workforce Training", status: "pass", compliance: 95 },
        { id: "164.308(a)(3)", title: "Information Access Management", status: "pass", compliance: 92 },
        { id: "164.308(a)(4)", title: "Information System Activity Review", status: "pass", compliance: 88 },
        { id: "164.308(a)(5)", title: "Security Awareness and Training", status: "fail", compliance: 70 },
        { id: "164.308(a)(6)", title: "Security Incident Procedures", status: "pass", compliance: 85 },
        { id: "164.308(a)(7)", title: "Contingency Plan", status: "pass", compliance: 90 },
        { id: "164.308(a)(8)", title: "Evaluation", status: "pass", compliance: 87 }
      ]
    },
    {
      category: "Physical Safeguards", 
      requirements: [
        { id: "164.310(a)(1)", title: "Facility Access Controls", status: "pass", compliance: 95 },
        { id: "164.310(a)(2)", title: "Workstation Use", status: "pass", compliance: 90 },
        { id: "164.310(b)", title: "Workstation Security", status: "pass", compliance: 88 },
        { id: "164.310(c)", title: "Device and Media Controls", status: "fail", compliance: 75 }
      ]
    },
    {
      category: "Technical Safeguards",
      requirements: [
        { id: "164.312(a)(1)", title: "Access Control", status: "pass", compliance: 93 },
        { id: "164.312(b)", title: "Audit Controls", status: "pass", compliance: 96 },
        { id: "164.312(c)(1)", title: "Integrity", status: "pass", compliance: 89 },
        { id: "164.312(d)", title: "Person or Entity Authentication", status: "pass", compliance: 94 },
        { id: "164.312(e)(1)", title: "Transmission Security", status: "pass", compliance: 91 }
      ]
    }
  ];

  const phiHandling = [
    {
      id: "1",
      dataType: "Patient Medical Records",
      location: "Primary Database", 
      encryption: "AES-256",
      accessControls: "Role-based access control",
      backupStatus: "Encrypted daily backups",
      status: "compliant"
    },
    {
      id: "2",
      dataType: "Patient Contact Information",
      location: "CRM System",
      encryption: "AES-256", 
      accessControls: "Multi-factor authentication",
      backupStatus: "Encrypted daily backups",
      status: "compliant"
    },
    {
      id: "3",
      dataType: "Diagnostic Images",
      location: "Image Archive",
      encryption: "AES-256",
      accessControls: "Limited access by role",
      backupStatus: "Requires review",
      status: "review_required"
    },
    {
      id: "4",
      dataType: "Treatment History",
      location: "Analytics Database",
      encryption: "AES-256",
      accessControls: "Audit logging enabled",
      backupStatus: "Encrypted daily backups", 
      status: "compliant"
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass':
      case 'compliant':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'fail':
        return <XCircle className="w-5 h-5 text-red-400" />;
      case 'review_required':
        return <AlertTriangle className="w-5 h-5 text-yellow-400" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pass':
      case 'compliant':
        return 'bg-green-400 bg-opacity-20 text-green-400';
      case 'fail':
        return 'bg-red-400 bg-opacity-20 text-red-400';
      case 'review_required':
        return 'bg-yellow-400 bg-opacity-20 text-yellow-400';
      default:
        return 'bg-gray-400 bg-opacity-20 text-gray-400';
    }
  };

  const allRequirements = hipaaSafeguards.flatMap(category => category.requirements);
  const passedRequirements = allRequirements.filter(r => r.status === 'pass').length;
  const failedRequirements = allRequirements.filter(r => r.status === 'fail').length;
  const totalCompliance = Math.round(allRequirements.reduce((sum, r) => sum + r.compliance, 0) / allRequirements.length);

  return (
    <div className="min-h-screen bg-wazuh-dark text-white font-roboto">
      <TopNav />
      
      <div className="flex h-screen pt-16">
        <Sidebar />
        
        <main className="flex-1 overflow-auto">
          <div className="wazuh-surface border-b border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-medium flex items-center" data-testid="hipaa-title">
                  <Hospital className="w-8 h-8 text-wazuh-primary mr-3" />
                  HIPAA Compliance
                </h2>
                <p className="text-gray-400 mt-1" data-testid="hipaa-subtitle">
                  Health Insurance Portability and Accountability Act
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <Button className="wazuh-primary hover:bg-blue-600" data-testid="button-export-hipaa-report">
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
                      <p className="text-3xl font-semibold mt-2">{totalCompliance}%</p>
                      <div className="mt-2">
                        <Progress value={totalCompliance} className="h-2" />
                      </div>
                    </div>
                    <div className="bg-green-400 bg-opacity-20 p-3 rounded-lg">
                      <Hospital className="text-green-400 w-6 h-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="wazuh-surface border-gray-700" data-testid="summary-passed">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Compliant Safeguards</p>
                      <p className="text-3xl font-semibold mt-2 text-green-400">{passedRequirements}</p>
                      <p className="text-gray-400 text-xs mt-1">Out of {allRequirements.length}</p>
                    </div>
                    <CheckCircle className="text-green-400 w-8 h-8" />
                  </div>
                </CardContent>
              </Card>

              <Card className="wazuh-surface border-gray-700" data-testid="summary-failed">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Non-Compliant</p>
                      <p className="text-3xl font-semibold mt-2 text-red-400">{failedRequirements}</p>
                      <p className="text-gray-400 text-xs mt-1">Require attention</p>
                    </div>
                    <XCircle className="text-red-400 w-8 h-8" />
                  </div>
                </CardContent>
              </Card>

              <Card className="wazuh-surface border-gray-700" data-testid="summary-phi-types">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">PHI Data Types</p>
                      <p className="text-3xl font-semibold mt-2">{phiHandling.length}</p>
                      <p className="text-gray-400 text-xs mt-1">Protected</p>
                    </div>
                    <Shield className="text-blue-400 w-8 h-8" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="safeguards" className="space-y-6">
              <TabsList className="wazuh-surface-variant">
                <TabsTrigger value="safeguards" data-testid="tab-safeguards">Safeguards</TabsTrigger>
                <TabsTrigger value="phi" data-testid="tab-phi">PHI Handling</TabsTrigger>
              </TabsList>

              <TabsContent value="safeguards" className="space-y-6">
                {/* HIPAA Safeguards */}
                {hipaaSafeguards.map((category) => (
                  <Card key={category.category} className="wazuh-surface border-gray-700" data-testid={`safeguard-category-${category.category.replace(' ', '-').toLowerCase()}`}>
                    <CardHeader>
                      <CardTitle>{category.category}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead className="wazuh-surface-variant">
                            <tr>
                              <th className="text-left p-4 font-medium text-sm">Requirement</th>
                              <th className="text-left p-4 font-medium text-sm">Title</th>
                              <th className="text-left p-4 font-medium text-sm">Status</th>
                              <th className="text-left p-4 font-medium text-sm">Compliance</th>
                              <th className="text-left p-4 font-medium text-sm">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {category.requirements.map((requirement) => (
                              <tr 
                                key={requirement.id} 
                                className="border-b border-gray-700 hover:bg-wazuh-surface-variant transition-colors"
                                data-testid={`requirement-row-${requirement.id}`}
                              >
                                <td className="p-4">
                                  <div className="flex items-center space-x-2">
                                    {getStatusIcon(requirement.status)}
                                    <span className="font-mono text-sm" data-testid={`requirement-id-${requirement.id}`}>
                                      {requirement.id}
                                    </span>
                                  </div>
                                </td>
                                <td className="p-4">
                                  <div className="text-sm font-medium" data-testid={`requirement-title-${requirement.id}`}>
                                    {requirement.title}
                                  </div>
                                </td>
                                <td className="p-4">
                                  <Badge className={`text-xs ${getStatusColor(requirement.status)}`}>
                                    {requirement.status === 'pass' ? 'COMPLIANT' : 'NON-COMPLIANT'}
                                  </Badge>
                                </td>
                                <td className="p-4">
                                  <div className="flex items-center space-x-2">
                                    <span className="text-sm" data-testid={`requirement-compliance-${requirement.id}`}>
                                      {requirement.compliance}%
                                    </span>
                                    <div className="w-16">
                                      <Progress value={requirement.compliance} className="h-2" />
                                    </div>
                                  </div>
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
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="phi" className="space-y-6">
                {/* PHI Handling */}
                <Card className="wazuh-surface border-gray-700" data-testid="phi-table">
                  <CardHeader>
                    <CardTitle>Protected Health Information (PHI) Handling</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="wazuh-surface-variant">
                          <tr>
                            <th className="text-left p-4 font-medium text-sm">Data Type</th>
                            <th className="text-left p-4 font-medium text-sm">Location</th>
                            <th className="text-left p-4 font-medium text-sm">Encryption</th>
                            <th className="text-left p-4 font-medium text-sm">Access Controls</th>
                            <th className="text-left p-4 font-medium text-sm">Backup Status</th>
                            <th className="text-left p-4 font-medium text-sm">Status</th>
                            <th className="text-left p-4 font-medium text-sm">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {phiHandling.map((phi) => (
                            <tr 
                              key={phi.id} 
                              className="border-b border-gray-700 hover:bg-wazuh-surface-variant transition-colors"
                              data-testid={`phi-row-${phi.id}`}
                            >
                              <td className="p-4">
                                <div className="text-sm font-medium" data-testid={`phi-data-type-${phi.id}`}>
                                  {phi.dataType}
                                </div>
                              </td>
                              <td className="p-4 text-sm" data-testid={`phi-location-${phi.id}`}>
                                {phi.location}
                              </td>
                              <td className="p-4 text-sm" data-testid={`phi-encryption-${phi.id}`}>
                                {phi.encryption}
                              </td>
                              <td className="p-4 text-sm text-gray-300" data-testid={`phi-access-controls-${phi.id}`}>
                                {phi.accessControls}
                              </td>
                              <td className="p-4 text-sm text-gray-400" data-testid={`phi-backup-status-${phi.id}`}>
                                {phi.backupStatus}
                              </td>
                              <td className="p-4">
                                <Badge className={`text-xs ${getStatusColor(phi.status)}`}>
                                  {phi.status.replace('_', ' ').toUpperCase()}
                                </Badge>
                              </td>
                              <td className="p-4">
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  className="text-wazuh-primary hover:bg-wazuh-primary hover:text-white"
                                  data-testid={`button-view-phi-${phi.id}`}
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