import { TopNav } from "@/components/dashboard/top-nav";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, UserCheck, CheckCircle, XCircle, AlertTriangle, Eye, Shield } from "lucide-react";

export default function Gdpr() {
  // GDPR Articles and compliance status
  const gdprArticles = [
    { 
      id: "6", 
      title: "Lawfulness of processing",
      status: "pass",
      details: "Legal basis documented for all data processing activities",
      compliance: 95
    },
    { 
      id: "7", 
      title: "Conditions for consent",
      status: "pass",
      details: "Consent mechanisms properly implemented and documented",
      compliance: 92
    },
    { 
      id: "12", 
      title: "Transparent information and communication",
      status: "pass",
      details: "Privacy notices clear and accessible to data subjects",
      compliance: 88
    },
    { 
      id: "15", 
      title: "Right of access by the data subject",
      status: "pass",
      details: "Subject access request procedures implemented",
      compliance: 90
    },
    { 
      id: "17", 
      title: "Right to erasure ('right to be forgotten')",
      status: "fail",
      details: "Data deletion processes need automation improvements",
      compliance: 65
    },
    { 
      id: "25", 
      title: "Data protection by design and by default",
      status: "pass",
      details: "Privacy considerations integrated into system design",
      compliance: 85
    },
    { 
      id: "32", 
      title: "Security of processing",
      status: "pass",
      details: "Technical and organizational security measures in place",
      compliance: 94
    },
    { 
      id: "33", 
      title: "Notification of a personal data breach to the supervisory authority",
      status: "pass",
      details: "Breach notification procedures established and tested",
      compliance: 89
    },
    { 
      id: "34", 
      title: "Communication of a personal data breach to the data subject",
      status: "fail",
      details: "Data subject notification process requires enhancement",
      compliance: 70
    },
    { 
      id: "35", 
      title: "Data protection impact assessment",
      status: "pass",
      details: "DPIA process documented and regularly conducted",
      compliance: 91
    }
  ];

  const dataProcessingActivities = [
    {
      id: "1",
      purpose: "Customer Account Management",
      legalBasis: "Contract",
      dataTypes: "Name, Email, Phone, Address",
      retention: "7 years after account closure",
      dataSubjects: "Customers",
      status: "compliant"
    },
    {
      id: "2", 
      purpose: "Marketing Communications",
      legalBasis: "Consent",
      dataTypes: "Email, Name, Preferences",
      retention: "Until consent withdrawn",
      dataSubjects: "Subscribers",
      status: "compliant"
    },
    {
      id: "3",
      purpose: "Security Monitoring",
      legalBasis: "Legitimate Interest",
      dataTypes: "IP Address, Access Logs",
      retention: "12 months",
      dataSubjects: "All Users",
      status: "review_required"
    },
    {
      id: "4",
      purpose: "Employee Records",
      legalBasis: "Legal Obligation",
      dataTypes: "Personal Details, Employment History",
      retention: "6 years after employment",
      dataSubjects: "Employees",
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

  const passedArticles = gdprArticles.filter(a => a.status === 'pass').length;
  const failedArticles = gdprArticles.filter(a => a.status === 'fail').length;
  const totalCompliance = Math.round(gdprArticles.reduce((sum, a) => sum + a.compliance, 0) / gdprArticles.length);

  return (
    <div className="min-h-screen bg-wazuh-dark text-white font-roboto">
      <TopNav />
      
      <div className="flex h-screen pt-16">
        <Sidebar />
        
        <main className="flex-1 overflow-auto">
          <div className="wazuh-surface border-b border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-medium flex items-center" data-testid="gdpr-title">
                  <UserCheck className="w-8 h-8 text-wazuh-primary mr-3" />
                  GDPR Compliance
                </h2>
                <p className="text-gray-400 mt-1" data-testid="gdpr-subtitle">
                  General Data Protection Regulation
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <Button className="wazuh-primary hover:bg-blue-600" data-testid="button-export-gdpr-report">
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
                      <UserCheck className="text-green-400 w-6 h-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="wazuh-surface border-gray-700" data-testid="summary-articles-passed">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Articles Compliant</p>
                      <p className="text-3xl font-semibold mt-2 text-green-400">{passedArticles}</p>
                      <p className="text-gray-400 text-xs mt-1">Out of {gdprArticles.length}</p>
                    </div>
                    <CheckCircle className="text-green-400 w-8 h-8" />
                  </div>
                </CardContent>
              </Card>

              <Card className="wazuh-surface border-gray-700" data-testid="summary-articles-failed">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Non-Compliant</p>
                      <p className="text-3xl font-semibold mt-2 text-red-400">{failedArticles}</p>
                      <p className="text-gray-400 text-xs mt-1">Require attention</p>
                    </div>
                    <XCircle className="text-red-400 w-8 h-8" />
                  </div>
                </CardContent>
              </Card>

              <Card className="wazuh-surface border-gray-700" data-testid="summary-data-processing">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Processing Activities</p>
                      <p className="text-3xl font-semibold mt-2">{dataProcessingActivities.length}</p>
                      <p className="text-gray-400 text-xs mt-1">Documented</p>
                    </div>
                    <Shield className="text-blue-400 w-8 h-8" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="articles" className="space-y-6">
              <TabsList className="wazuh-surface-variant">
                <TabsTrigger value="articles" data-testid="tab-articles">Articles Compliance</TabsTrigger>
                <TabsTrigger value="processing" data-testid="tab-processing">Data Processing</TabsTrigger>
              </TabsList>

              <TabsContent value="articles" className="space-y-6">
                {/* GDPR Articles Table */}
                <Card className="wazuh-surface border-gray-700" data-testid="articles-table">
                  <CardHeader>
                    <CardTitle>GDPR Articles Assessment</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="wazuh-surface-variant">
                          <tr>
                            <th className="text-left p-4 font-medium text-sm">Article</th>
                            <th className="text-left p-4 font-medium text-sm">Title</th>
                            <th className="text-left p-4 font-medium text-sm">Status</th>
                            <th className="text-left p-4 font-medium text-sm">Compliance</th>
                            <th className="text-left p-4 font-medium text-sm">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {gdprArticles.map((article) => (
                            <tr 
                              key={article.id} 
                              className="border-b border-gray-700 hover:bg-wazuh-surface-variant transition-colors"
                              data-testid={`article-row-${article.id}`}
                            >
                              <td className="p-4">
                                <div className="flex items-center space-x-2">
                                  {getStatusIcon(article.status)}
                                  <span className="font-medium" data-testid={`article-id-${article.id}`}>
                                    Article {article.id}
                                  </span>
                                </div>
                              </td>
                              <td className="p-4">
                                <div className="max-w-md">
                                  <div className="text-sm font-medium" data-testid={`article-title-${article.id}`}>
                                    {article.title}
                                  </div>
                                  <div className="text-xs text-gray-400 mt-1" data-testid={`article-details-${article.id}`}>
                                    {article.details}
                                  </div>
                                </div>
                              </td>
                              <td className="p-4">
                                <Badge className={`text-xs ${getStatusColor(article.status)}`}>
                                  {article.status === 'pass' ? 'COMPLIANT' : 'NON-COMPLIANT'}
                                </Badge>
                              </td>
                              <td className="p-4">
                                <div className="flex items-center space-x-2">
                                  <span className="text-sm" data-testid={`article-compliance-${article.id}`}>
                                    {article.compliance}%
                                  </span>
                                  <div className="w-16">
                                    <Progress value={article.compliance} className="h-2" />
                                  </div>
                                </div>
                              </td>
                              <td className="p-4">
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  className="text-wazuh-primary hover:bg-wazuh-primary hover:text-white"
                                  data-testid={`button-view-${article.id}`}
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

              <TabsContent value="processing" className="space-y-6">
                {/* Data Processing Activities */}
                <Card className="wazuh-surface border-gray-700" data-testid="processing-table">
                  <CardHeader>
                    <CardTitle>Data Processing Activities</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="wazuh-surface-variant">
                          <tr>
                            <th className="text-left p-4 font-medium text-sm">Purpose</th>
                            <th className="text-left p-4 font-medium text-sm">Legal Basis</th>
                            <th className="text-left p-4 font-medium text-sm">Data Types</th>
                            <th className="text-left p-4 font-medium text-sm">Retention</th>
                            <th className="text-left p-4 font-medium text-sm">Status</th>
                            <th className="text-left p-4 font-medium text-sm">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {dataProcessingActivities.map((activity) => (
                            <tr 
                              key={activity.id} 
                              className="border-b border-gray-700 hover:bg-wazuh-surface-variant transition-colors"
                              data-testid={`processing-row-${activity.id}`}
                            >
                              <td className="p-4">
                                <div className="text-sm font-medium" data-testid={`processing-purpose-${activity.id}`}>
                                  {activity.purpose}
                                </div>
                                <div className="text-xs text-gray-400" data-testid={`processing-subjects-${activity.id}`}>
                                  {activity.dataSubjects}
                                </div>
                              </td>
                              <td className="p-4 text-sm" data-testid={`processing-legal-basis-${activity.id}`}>
                                {activity.legalBasis}
                              </td>
                              <td className="p-4 text-sm text-gray-300" data-testid={`processing-data-types-${activity.id}`}>
                                {activity.dataTypes}
                              </td>
                              <td className="p-4 text-sm text-gray-400" data-testid={`processing-retention-${activity.id}`}>
                                {activity.retention}
                              </td>
                              <td className="p-4">
                                <Badge className={`text-xs ${getStatusColor(activity.status)}`}>
                                  {activity.status.replace('_', ' ').toUpperCase()}
                                </Badge>
                              </td>
                              <td className="p-4">
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  className="text-wazuh-primary hover:bg-wazuh-primary hover:text-white"
                                  data-testid={`button-view-processing-${activity.id}`}
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