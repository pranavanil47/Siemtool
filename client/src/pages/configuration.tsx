import { useState } from "react";
import { TopNav } from "@/components/dashboard/top-nav";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Save, Settings, Database, Bell, Shield, RefreshCw } from "lucide-react";

export default function Configuration() {
  const [hasChanges, setHasChanges] = useState(false);

  // Configuration state
  const [config, setConfig] = useState({
    general: {
      managerHost: "wazuh-manager-01",
      managerPort: "1514",
      logLevel: "info",
      maxAgents: "1000",
      alertsPerSecond: "50"
    },
    alerts: {
      emailNotifications: true,
      syslogOutput: false,
      jsonOutput: true,
      minimumSeverity: "medium",
      emailRecipients: "admin@example.com, security@example.com"
    },
    security: {
      authRequired: true,
      maxLoginAttempts: "5",
      sessionTimeout: "30",
      sslEnabled: true,
      apiRateLimit: "100"
    },
    database: {
      host: "localhost",
      port: "5432",
      database: "wazuh",
      username: "wazuh_user",
      maxConnections: "20",
      backupEnabled: true,
      backupInterval: "daily"
    }
  });

  const configSections = [
    {
      id: "general",
      title: "General Settings",
      icon: Settings,
      description: "Core Wazuh manager configuration settings"
    },
    {
      id: "alerts",
      title: "Alert Configuration", 
      icon: Bell,
      description: "Alert generation and notification settings"
    },
    {
      id: "security",
      title: "Security Settings",
      icon: Shield,
      description: "Authentication and access control configuration"
    },
    {
      id: "database",
      title: "Database Configuration",
      icon: Database,
      description: "Database connection and management settings"
    }
  ];

  const handleInputChange = (section: string, field: string, value: string | boolean) => {
    setConfig(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [field]: value
      }
    }));
    setHasChanges(true);
  };

  const handleSave = () => {
    // Mock save functionality
    console.log("Saving configuration:", config);
    setHasChanges(false);
  };

  const handleReset = () => {
    // Mock reset functionality
    setHasChanges(false);
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
                <h2 className="text-2xl font-medium" data-testid="configuration-title">Configuration</h2>
                <p className="text-gray-400 mt-1" data-testid="configuration-subtitle">
                  Manage Wazuh system settings and preferences
                </p>
              </div>
              <div className="flex items-center space-x-4">
                {hasChanges && (
                  <Badge variant="outline" className="text-yellow-400 border-yellow-400">
                    Unsaved changes
                  </Badge>
                )}
                <Button 
                  variant="outline" 
                  className="border-gray-600 hover:bg-gray-700"
                  onClick={handleReset}
                  data-testid="button-reset-config"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Reset
                </Button>
                <Button 
                  className="wazuh-primary hover:bg-blue-600"
                  onClick={handleSave}
                  disabled={!hasChanges}
                  data-testid="button-save-config"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </div>
          </div>

          <div className="p-6">
            {/* Configuration Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              {configSections.map((section) => (
                <Card key={section.id} className="wazuh-surface border-gray-700" data-testid={`config-section-${section.id}`}>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-3">
                      <div className="bg-wazuh-primary bg-opacity-20 p-2 rounded-lg">
                        <section.icon className="text-wazuh-primary w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-medium text-sm">{section.title}</h3>
                        <p className="text-xs text-gray-400 mt-1">{section.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Tabs defaultValue="general" className="space-y-6">
              <TabsList className="wazuh-surface-variant">
                <TabsTrigger value="general" data-testid="tab-general">General</TabsTrigger>
                <TabsTrigger value="alerts" data-testid="tab-alerts">Alerts</TabsTrigger>
                <TabsTrigger value="security" data-testid="tab-security">Security</TabsTrigger>
                <TabsTrigger value="database" data-testid="tab-database">Database</TabsTrigger>
              </TabsList>

              <TabsContent value="general" className="space-y-6">
                <Card className="wazuh-surface border-gray-700" data-testid="general-config">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Settings className="w-5 h-5 mr-2" />
                      General Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Manager Host</label>
                        <Input
                          type="text"
                          value={config.general.managerHost}
                          onChange={(e) => handleInputChange('general', 'managerHost', e.target.value)}
                          className="wazuh-surface-variant border-gray-600"
                          data-testid="input-manager-host"
                        />
                        <p className="text-xs text-gray-400 mt-1">Hostname or IP address of the Wazuh manager</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Manager Port</label>
                        <Input
                          type="text"
                          value={config.general.managerPort}
                          onChange={(e) => handleInputChange('general', 'managerPort', e.target.value)}
                          className="wazuh-surface-variant border-gray-600"
                          data-testid="input-manager-port"
                        />
                        <p className="text-xs text-gray-400 mt-1">Port for agent communication (default: 1514)</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Log Level</label>
                        <select 
                          value={config.general.logLevel}
                          onChange={(e) => handleInputChange('general', 'logLevel', e.target.value)}
                          className="w-full p-2 bg-wazuh-surface-variant border border-gray-600 rounded text-white"
                          data-testid="select-log-level"
                        >
                          <option value="debug">Debug</option>
                          <option value="info">Info</option>
                          <option value="warning">Warning</option>
                          <option value="error">Error</option>
                        </select>
                        <p className="text-xs text-gray-400 mt-1">Minimum log level for system messages</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Max Agents</label>
                        <Input
                          type="text"
                          value={config.general.maxAgents}
                          onChange={(e) => handleInputChange('general', 'maxAgents', e.target.value)}
                          className="wazuh-surface-variant border-gray-600"
                          data-testid="input-max-agents"
                        />
                        <p className="text-xs text-gray-400 mt-1">Maximum number of agents allowed</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="alerts" className="space-y-6">
                <Card className="wazuh-surface border-gray-700" data-testid="alerts-config">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Bell className="w-5 h-5 mr-2" />
                      Alert Configuration
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <label className="text-sm font-medium">Email Notifications</label>
                          <p className="text-xs text-gray-400">Send alerts via email</p>
                        </div>
                        <Switch
                          checked={config.alerts.emailNotifications}
                          onCheckedChange={(checked) => handleInputChange('alerts', 'emailNotifications', checked)}
                          data-testid="switch-email-notifications"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <label className="text-sm font-medium">Syslog Output</label>
                          <p className="text-xs text-gray-400">Forward alerts to syslog</p>
                        </div>
                        <Switch
                          checked={config.alerts.syslogOutput}
                          onCheckedChange={(checked) => handleInputChange('alerts', 'syslogOutput', checked)}
                          data-testid="switch-syslog-output"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <label className="text-sm font-medium">JSON Output</label>
                          <p className="text-xs text-gray-400">Output alerts in JSON format</p>
                        </div>
                        <Switch
                          checked={config.alerts.jsonOutput}
                          onCheckedChange={(checked) => handleInputChange('alerts', 'jsonOutput', checked)}
                          data-testid="switch-json-output"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Minimum Severity</label>
                        <select 
                          value={config.alerts.minimumSeverity}
                          onChange={(e) => handleInputChange('alerts', 'minimumSeverity', e.target.value)}
                          className="w-full p-2 bg-wazuh-surface-variant border border-gray-600 rounded text-white"
                          data-testid="select-minimum-severity"
                        >
                          <option value="low">Low</option>
                          <option value="medium">Medium</option>
                          <option value="high">High</option>
                          <option value="critical">Critical</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Email Recipients</label>
                        <Textarea
                          value={config.alerts.emailRecipients}
                          onChange={(e) => handleInputChange('alerts', 'emailRecipients', e.target.value)}
                          className="wazuh-surface-variant border-gray-600"
                          rows={3}
                          data-testid="textarea-email-recipients"
                        />
                        <p className="text-xs text-gray-400 mt-1">Comma-separated list of email addresses</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="security" className="space-y-6">
                <Card className="wazuh-surface border-gray-700" data-testid="security-config">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Shield className="w-5 h-5 mr-2" />
                      Security Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <label className="text-sm font-medium">Authentication Required</label>
                          <p className="text-xs text-gray-400">Require authentication for API access</p>
                        </div>
                        <Switch
                          checked={config.security.authRequired}
                          onCheckedChange={(checked) => handleInputChange('security', 'authRequired', checked)}
                          data-testid="switch-auth-required"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <label className="text-sm font-medium">SSL Enabled</label>
                          <p className="text-xs text-gray-400">Enable SSL/TLS encryption</p>
                        </div>
                        <Switch
                          checked={config.security.sslEnabled}
                          onCheckedChange={(checked) => handleInputChange('security', 'sslEnabled', checked)}
                          data-testid="switch-ssl-enabled"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Max Login Attempts</label>
                        <Input
                          type="text"
                          value={config.security.maxLoginAttempts}
                          onChange={(e) => handleInputChange('security', 'maxLoginAttempts', e.target.value)}
                          className="wazuh-surface-variant border-gray-600"
                          data-testid="input-max-login-attempts"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Session Timeout (minutes)</label>
                        <Input
                          type="text"
                          value={config.security.sessionTimeout}
                          onChange={(e) => handleInputChange('security', 'sessionTimeout', e.target.value)}
                          className="wazuh-surface-variant border-gray-600"
                          data-testid="input-session-timeout"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">API Rate Limit (req/min)</label>
                        <Input
                          type="text"
                          value={config.security.apiRateLimit}
                          onChange={(e) => handleInputChange('security', 'apiRateLimit', e.target.value)}
                          className="wazuh-surface-variant border-gray-600"
                          data-testid="input-api-rate-limit"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="database" className="space-y-6">
                <Card className="wazuh-surface border-gray-700" data-testid="database-config">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Database className="w-5 h-5 mr-2" />
                      Database Configuration
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Database Host</label>
                        <Input
                          type="text"
                          value={config.database.host}
                          onChange={(e) => handleInputChange('database', 'host', e.target.value)}
                          className="wazuh-surface-variant border-gray-600"
                          data-testid="input-db-host"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Database Port</label>
                        <Input
                          type="text"
                          value={config.database.port}
                          onChange={(e) => handleInputChange('database', 'port', e.target.value)}
                          className="wazuh-surface-variant border-gray-600"
                          data-testid="input-db-port"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Database Name</label>
                        <Input
                          type="text"
                          value={config.database.database}
                          onChange={(e) => handleInputChange('database', 'database', e.target.value)}
                          className="wazuh-surface-variant border-gray-600"
                          data-testid="input-db-name"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Username</label>
                        <Input
                          type="text"
                          value={config.database.username}
                          onChange={(e) => handleInputChange('database', 'username', e.target.value)}
                          className="wazuh-surface-variant border-gray-600"
                          data-testid="input-db-username"
                        />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <label className="text-sm font-medium">Automatic Backups</label>
                          <p className="text-xs text-gray-400">Enable automated database backups</p>
                        </div>
                        <Switch
                          checked={config.database.backupEnabled}
                          onCheckedChange={(checked) => handleInputChange('database', 'backupEnabled', checked)}
                          data-testid="switch-backup-enabled"
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="text-sm font-medium mb-2 block">Max Connections</label>
                          <Input
                            type="text"
                            value={config.database.maxConnections}
                            onChange={(e) => handleInputChange('database', 'maxConnections', e.target.value)}
                            className="wazuh-surface-variant border-gray-600"
                            data-testid="input-max-connections"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium mb-2 block">Backup Interval</label>
                          <select 
                            value={config.database.backupInterval}
                            onChange={(e) => handleInputChange('database', 'backupInterval', e.target.value)}
                            className="w-full p-2 bg-wazuh-surface-variant border border-gray-600 rounded text-white"
                            data-testid="select-backup-interval"
                          >
                            <option value="hourly">Hourly</option>
                            <option value="daily">Daily</option>
                            <option value="weekly">Weekly</option>
                            <option value="monthly">Monthly</option>
                          </select>
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