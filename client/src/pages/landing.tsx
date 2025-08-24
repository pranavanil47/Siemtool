import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Users, Database, BarChart3, Eye, ShieldCheck } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-wazuh-dark text-white font-roboto">
      {/* Hero Section */}
      <div className="wazuh-surface border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-wazuh-primary bg-opacity-20 p-4 rounded-2xl">
                <Shield className="w-16 h-16 text-wazuh-primary" />
              </div>
            </div>
            <h1 className="text-5xl font-bold mb-6" data-testid="landing-title">
              Wazuh Security Platform
            </h1>
            <p className="text-xl text-gray-400 mb-8 max-w-3xl mx-auto" data-testid="landing-subtitle">
              Comprehensive security monitoring, threat detection, and compliance management 
              in a unified open-source platform.
            </p>
            <Button 
              className="wazuh-primary hover:bg-blue-600 text-lg px-8 py-3"
              onClick={() => window.location.href = '/api/login'}
              data-testid="button-login"
            >
              Access Dashboard
            </Button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Security Management Features</h2>
          <p className="text-gray-400 text-lg">
            Protect your infrastructure with advanced security monitoring and analysis
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="wazuh-surface border-gray-700" data-testid="feature-threat-detection">
            <CardHeader>
              <div className="bg-red-500 bg-opacity-20 p-3 rounded-lg w-fit">
                <Eye className="w-8 h-8 text-red-400" />
              </div>
              <CardTitle>Threat Detection</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400">
                Real-time threat detection with advanced behavioral analytics, 
                intrusion detection, and malware identification across your infrastructure.
              </p>
            </CardContent>
          </Card>

          <Card className="wazuh-surface border-gray-700" data-testid="feature-compliance">
            <CardHeader>
              <div className="bg-green-500 bg-opacity-20 p-3 rounded-lg w-fit">
                <ShieldCheck className="w-8 h-8 text-green-400" />
              </div>
              <CardTitle>Compliance Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400">
                Automated compliance monitoring for PCI DSS, GDPR, HIPAA, 
                and NIST frameworks with detailed reporting and remediation guidance.
              </p>
            </CardContent>
          </Card>

          <Card className="wazuh-surface border-gray-700" data-testid="feature-analytics">
            <CardHeader>
              <div className="bg-blue-500 bg-opacity-20 p-3 rounded-lg w-fit">
                <BarChart3 className="w-8 h-8 text-blue-400" />
              </div>
              <CardTitle>Security Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400">
                Comprehensive security metrics, performance insights, and 
                threat intelligence with interactive dashboards and reporting.
              </p>
            </CardContent>
          </Card>

          <Card className="wazuh-surface border-gray-700" data-testid="feature-agents">
            <CardHeader>
              <div className="bg-purple-500 bg-opacity-20 p-3 rounded-lg w-fit">
                <Users className="w-8 h-8 text-purple-400" />
              </div>
              <CardTitle>Agent Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400">
                Centralized management of security agents across endpoints, 
                servers, and cloud infrastructure with automated deployment.
              </p>
            </CardContent>
          </Card>

          <Card className="wazuh-surface border-gray-700" data-testid="feature-integration">
            <CardHeader>
              <div className="bg-yellow-500 bg-opacity-20 p-3 rounded-lg w-fit">
                <Database className="w-8 h-8 text-yellow-400" />
              </div>
              <CardTitle>Integration Hub</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400">
                Seamless integration with existing security tools, SIEM platforms, 
                and cloud services for unified security operations.
              </p>
            </CardContent>
          </Card>

          <Card className="wazuh-surface border-gray-700" data-testid="feature-api">
            <CardHeader>
              <div className="bg-orange-500 bg-opacity-20 p-3 rounded-lg w-fit">
                <Shield className="w-8 h-8 text-orange-400" />
              </div>
              <CardTitle>API & Automation</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400">
                Comprehensive REST API for automation, custom integrations, 
                and programmatic security management with extensive documentation.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <div className="wazuh-surface border-t border-gray-700 mt-16">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="text-center text-gray-400">
            <p>Wazuh Security Platform - Open Source Security Monitoring</p>
          </div>
        </div>
      </div>
    </div>
  );
}