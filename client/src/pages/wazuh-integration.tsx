import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { TopNav } from "@/components/dashboard/top-nav";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  Database, 
  Server, 
  Shield, 
  BarChart3, 
  ShieldCheck, 
  Target, 
  Settings, 
  Code, 
  CheckCircle,
  AlertTriangle,
  Clock,
  Zap,
  Cloud,
  Workflow
} from "lucide-react";

export default function WazuhIntegration() {
  const { user } = useAuth();

  // Integration status data
  const integrationComponents = [
    {
      id: "agents",
      name: "Agent Management",
      description: "Centralized management of security agents across all endpoints",
      status: "active",
      health: 95,
      lastUpdate: "2 minutes ago",
      icon: Server,
      color: "text-green-400",
      bgColor: "bg-green-400 bg-opacity-20"
    },
    {
      id: "alerts",
      name: "Security Alerts",
      description: "Real-time threat detection and alert management system",
      status: "active", 
      health: 98,
      lastUpdate: "30 seconds ago",
      icon: Shield,
      color: "text-green-400",
      bgColor: "bg-green-400 bg-opacity-20"
    },
    {
      id: "vulnerabilities",
      name: "Vulnerability Scanner",
      description: "Automated vulnerability assessment and management",
      status: "active",
      health: 92,
      lastUpdate: "5 minutes ago", 
      icon: Target,
      color: "text-green-400",
      bgColor: "bg-green-400 bg-opacity-20"
    },
    {
      id: "compliance",
      name: "Compliance Monitor",
      description: "Multi-framework compliance tracking and reporting",
      status: "warning",
      health: 75,
      lastUpdate: "15 minutes ago",
      icon: ShieldCheck,
      color: "text-yellow-400",
      bgColor: "bg-yellow-400 bg-opacity-20"
    },
    {
      id: "analytics",
      name: "Security Analytics",
      description: "Advanced threat intelligence and performance metrics",
      status: "active",
      health: 89,
      lastUpdate: "1 minute ago",
      icon: BarChart3,
      color: "text-green-400",
      bgColor: "bg-green-400 bg-opacity-20"
    },
    {
      id: "api",
      name: "API Gateway",
      description: "Secure API access for integrations and automation",
      status: "maintenance",
      health: 60,
      lastUpdate: "1 hour ago",
      icon: Code,
      color: "text-blue-400",
      bgColor: "bg-blue-400 bg-opacity-20"
    }
  ];

  const externalIntegrations = [
    {
      id: "elastic",
      name: "Elastic Stack",
      description: "SIEM integration with Elasticsearch and Kibana",
      status: "configured",
      icon: Database,
      provider: "Elastic"
    },
    {
      id: "splunk",
      name: "Splunk Enterprise",
      description: "Log analysis and security intelligence platform",
      status: "available",
      icon: BarChart3,
      provider: "Splunk"
    },
    {
      id: "aws",
      name: "AWS Security Hub",
      description: "Cloud security posture management for AWS",
      status: "configured",
      icon: Cloud,
      provider: "Amazon Web Services"
    },
    {
      id: "azure",
      name: "Microsoft Sentinel", 
      description: "Cloud-native SIEM and SOAR platform",
      status: "available",
      icon: Shield,
      provider: "Microsoft"
    },
    {
      id: "gcp",
      name: "Google Security Command Center",
      description: "Centralized security management for Google Cloud",
      status: "available",
      icon: Cloud,
      provider: "Google Cloud"
    },
    {
      id: "servicenow",
      name: "ServiceNow ITSM",
      description: "Incident management and workflow automation",
      status: "configured",
      icon: Workflow,
      provider: "ServiceNow"
    }
  ];

  const systemStatus = {
    overallHealth: 88,
    activeComponents: integrationComponents.filter(c => c.status === 'active').length,
    totalComponents: integrationComponents.length,
    configuredIntegrations: externalIntegrations.filter(i => i.status === 'configured').length,
    totalIntegrations: externalIntegrations.length
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
      case 'maintenance':
        return <Clock className="w-4 h-4 text-blue-400" />;
      case 'configured':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'available':
        return <Settings className="w-4 h-4 text-gray-400" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-red-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
      case 'configured':
        return 'bg-green-400 bg-opacity-20 text-green-400';
      case 'warning':
        return 'bg-yellow-400 bg-opacity-20 text-yellow-400';
      case 'maintenance':
        return 'bg-blue-400 bg-opacity-20 text-blue-400';
      case 'available':
        return 'bg-gray-500 bg-opacity-20 text-gray-400';
      default:
        return 'bg-red-400 bg-opacity-20 text-red-400';
    }
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
                <h2 className="text-2xl font-medium flex items-center" data-testid="integration-title">
                  <Zap className="w-8 h-8 text-wazuh-primary mr-3" />
                  Wazuh Integration Hub
                </h2>
                <p className="text-gray-400 mt-1" data-testid="integration-subtitle">
                  Unified security operations with comprehensive component integration
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <Button 
                  variant="outline" 
                  className="border-gray-600 hover:bg-gray-700"
                  data-testid="button-refresh-status"
                >
                  Refresh Status
                </Button>
                <Button 
                  className="wazuh-primary hover:bg-blue-600"
                  data-testid="button-configure-integration"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Configure
                </Button>
              </div>
            </div>
          </div>

          <div className="p-6">
            {/* System Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <Card className="wazuh-surface border-gray-700" data-testid="overview-health">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">System Health</p>
                      <p className="text-3xl font-semibold mt-2">{systemStatus.overallHealth}%</p>
                    </div>
                    <div className="bg-green-400 bg-opacity-20 p-2 rounded-lg">
                      <CheckCircle className="text-green-400 w-6 h-6" />
                    </div>
                  </div>
                  <Progress value={systemStatus.overallHealth} className="mt-3" />
                </CardContent>
              </Card>

              <Card className="wazuh-surface border-gray-700" data-testid="overview-components">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Active Components</p>
                      <p className="text-3xl font-semibold mt-2">
                        {systemStatus.activeComponents}/{systemStatus.totalComponents}
                      </p>
                    </div>
                    <div className="bg-blue-500 bg-opacity-20 p-2 rounded-lg">
                      <Server className="text-blue-500 w-6 h-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="wazuh-surface border-gray-700" data-testid="overview-integrations">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Configured Integrations</p>
                      <p className="text-3xl font-semibold mt-2">
                        {systemStatus.configuredIntegrations}/{systemStatus.totalIntegrations}
                      </p>
                    </div>
                    <div className="bg-purple-500 bg-opacity-20 p-2 rounded-lg">
                      <Workflow className="text-purple-500 w-6 h-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="wazuh-surface border-gray-700" data-testid="overview-uptime">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Uptime</p>
                      <p className="text-3xl font-semibold mt-2">99.8%</p>
                      <p className="text-green-400 text-xs mt-1">15 days, 4 hours</p>
                    </div>
                    <div className="bg-green-400 bg-opacity-20 p-2 rounded-lg">
                      <Clock className="text-green-400 w-6 h-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="components" className="space-y-6">
              <TabsList className="wazuh-surface-variant">
                <TabsTrigger value="components" data-testid="tab-components">Wazuh Components</TabsTrigger>
                <TabsTrigger value="integrations" data-testid="tab-integrations">External Integrations</TabsTrigger>
                <TabsTrigger value="workflows" data-testid="tab-workflows">Automated Workflows</TabsTrigger>
              </TabsList>

              <TabsContent value="components" className="space-y-6">
                {/* Wazuh Components */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {integrationComponents.map((component) => {
                    const IconComponent = component.icon;
                    return (
                      <Card key={component.id} className="wazuh-surface border-gray-700" data-testid={`component-${component.id}`}>
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className={`p-2 rounded-lg ${component.bgColor}`}>
                                <IconComponent className={`w-6 h-6 ${component.color}`} />
                              </div>
                              <div>
                                <CardTitle className="text-lg">{component.name}</CardTitle>
                                <p className="text-sm text-gray-400">{component.description}</p>
                              </div>
                            </div>
                            {getStatusIcon(component.status)}
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-400">Health Status:</span>
                              <div className="flex items-center space-x-2">
                                <Progress value={component.health} className="w-16" />
                                <span className="text-sm font-medium">{component.health}%</span>
                              </div>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-400">Status:</span>
                              <Badge className={`text-xs ${getStatusColor(component.status)}`}>
                                {component.status}
                              </Badge>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-400">Last Update:</span>
                              <span className="text-sm">{component.lastUpdate}</span>
                            </div>
                            <div className="pt-2 border-t border-gray-700">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="w-full border-gray-600 hover:bg-gray-700"
                                data-testid={`button-configure-${component.id}`}
                              >
                                <Settings className="w-4 h-4 mr-2" />
                                Configure
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </TabsContent>

              <TabsContent value="integrations" className="space-y-6">
                {/* External Integrations */}
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {externalIntegrations.map((integration) => {
                    const IconComponent = integration.icon;
                    return (
                      <Card key={integration.id} className="wazuh-surface border-gray-700" data-testid={`integration-${integration.id}`}>
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="bg-gray-500 bg-opacity-20 p-2 rounded-lg">
                                <IconComponent className="w-6 h-6 text-gray-400" />
                              </div>
                              <div>
                                <CardTitle className="text-lg">{integration.name}</CardTitle>
                                <p className="text-xs text-gray-400">{integration.provider}</p>
                              </div>
                            </div>
                            {getStatusIcon(integration.status)}
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <p className="text-sm text-gray-400">{integration.description}</p>
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-400">Status:</span>
                              <Badge className={`text-xs ${getStatusColor(integration.status)}`}>
                                {integration.status}
                              </Badge>
                            </div>
                            <div className="pt-2 border-t border-gray-700">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className={`w-full border-gray-600 ${
                                  integration.status === 'configured' 
                                    ? 'hover:bg-gray-700' 
                                    : 'hover:bg-wazuh-primary hover:text-white'
                                }`}
                                data-testid={`button-setup-${integration.id}`}
                              >
                                {integration.status === 'configured' ? (
                                  <>
                                    <Settings className="w-4 h-4 mr-2" />
                                    Manage
                                  </>
                                ) : (
                                  <>
                                    <Zap className="w-4 h-4 mr-2" />
                                    Setup Integration
                                  </>
                                )}
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </TabsContent>

              <TabsContent value="workflows" className="space-y-6">
                {/* Automated Workflows */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="wazuh-surface border-gray-700" data-testid="workflow-incident-response">
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Workflow className="w-6 h-6 text-purple-400 mr-2" />
                        Incident Response Automation
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-400 mb-4">
                        Automated response workflows for security incidents including containment, 
                        investigation, and remediation steps.
                      </p>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Active Workflows:</span>
                          <span>12</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Success Rate:</span>
                          <span className="text-green-400">94%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Avg Response Time:</span>
                          <span>2.3 minutes</span>
                        </div>
                      </div>
                      <Button className="w-full mt-4 wazuh-primary hover:bg-blue-600" data-testid="button-manage-workflows">
                        Manage Workflows
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="wazuh-surface border-gray-700" data-testid="workflow-compliance-automation">
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <ShieldCheck className="w-6 h-6 text-green-400 mr-2" />
                        Compliance Automation
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-400 mb-4">
                        Automated compliance monitoring and reporting for regulatory frameworks 
                        with real-time violation detection.
                      </p>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Monitored Frameworks:</span>
                          <span>4</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Compliance Score:</span>
                          <span className="text-green-400">88%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Last Assessment:</span>
                          <span>1 hour ago</span>
                        </div>
                      </div>
                      <Button className="w-full mt-4 wazuh-primary hover:bg-blue-600" data-testid="button-view-compliance">
                        View Reports
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="wazuh-surface border-gray-700" data-testid="workflow-threat-intelligence">
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Target className="w-6 h-6 text-red-400 mr-2" />
                        Threat Intelligence Feeds
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-400 mb-4">
                        Automated threat intelligence collection and analysis from multiple sources 
                        with IOC enrichment and correlation.
                      </p>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Active Feeds:</span>
                          <span>8</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">IOCs Processed:</span>
                          <span>15,234</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Last Update:</span>
                          <span>5 minutes ago</span>
                        </div>
                      </div>
                      <Button className="w-full mt-4 wazuh-primary hover:bg-blue-600" data-testid="button-manage-feeds">
                        Manage Feeds
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="wazuh-surface border-gray-700" data-testid="workflow-vulnerability-management">
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Shield className="w-6 h-6 text-yellow-400 mr-2" />
                        Vulnerability Management
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-400 mb-4">
                        Automated vulnerability scanning, assessment, and prioritization 
                        with patch management integration.
                      </p>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Assets Scanned:</span>
                          <span>847</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Critical Vulns:</span>
                          <span className="text-red-400">23</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Patched This Week:</span>
                          <span className="text-green-400">156</span>
                        </div>
                      </div>
                      <Button className="w-full mt-4 wazuh-primary hover:bg-blue-600" data-testid="button-view-vulnerabilities">
                        View Dashboard
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
}