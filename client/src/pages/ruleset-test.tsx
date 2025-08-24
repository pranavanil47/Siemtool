import { useState } from "react";
import { TopNav } from "@/components/dashboard/top-nav";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FlaskConical, Play, Copy, Upload, FileText, CheckCircle, XCircle, AlertTriangle } from "lucide-react";

export default function RulesetTest() {
  const [logInput, setLogInput] = useState("");
  const [selectedLogType, setSelectedLogType] = useState("syslog");
  const [testResults, setTestResults] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Example log formats
  const exampleLogs = {
    syslog: "Jan 20 10:30:15 server01 sshd[1234]: Failed password for invalid user admin from 192.168.1.100 port 22 ssh2",
    apache: '192.168.1.100 - - [20/Jan/2024:10:30:15 +0000] "GET /admin HTTP/1.1" 404 162 "-" "Mozilla/5.0"',
    windows: "Jan 20 10:30:15 WinEvtLog: Security: AUDIT_FAILURE(4625): Microsoft-Windows-Security-Auditing: SYSTEM: NT AUTHORITY: WIN-SERVER01: An account failed to log on.",
    firewall: "Jan 20 10:30:15 firewall01 kernel: DROP TCP 192.168.1.100:1234 -> 10.0.0.1:80",
    custom: "2024-01-20 10:30:15 [ERROR] Application authentication failed for user: admin from IP: 192.168.1.100"
  };

  // Mock test result
  const mockTestResult = {
    parsed: true,
    decoder: "sshd",
    rule_id: 5710,
    rule_description: "sshd: Attempt to login using a non-existent user",
    rule_level: 5,
    classification: "authentication_failed",
    mitre_attack: ["T1110.001"],
    fields: {
      timestamp: "Jan 20 10:30:15",
      hostname: "server01",
      program_name: "sshd",
      srcip: "192.168.1.100",
      srcport: "22",
      user: "admin",
      action: "failed_login"
    },
    alert: true,
    severity: "medium"
  };

  const handleTestLog = async () => {
    if (!logInput.trim()) return;
    
    setIsProcessing(true);
    
    try {
      // Mock processing delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock test result based on input
      if (logInput.includes("Failed password") || logInput.includes("authentication failed")) {
        setTestResults({
          ...mockTestResult,
          raw_log: logInput,
          processing_time: "12ms"
        });
      } else {
        setTestResults({
          parsed: false,
          decoder: "unknown",
          rule_id: null,
          rule_description: "No rule matched",
          rule_level: 0,
          classification: "unclassified",
          fields: {},
          alert: false,
          severity: "info",
          raw_log: logInput,
          processing_time: "8ms"
        });
      }
    } catch (error) {
      setTestResults({
        error: "Failed to process log entry",
        raw_log: logInput
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleLoadExample = (logType: string) => {
    setLogInput(exampleLogs[logType as keyof typeof exampleLogs]);
    setSelectedLogType(logType);
  };

  const handleCopyResult = () => {
    if (testResults) {
      navigator.clipboard.writeText(JSON.stringify(testResults, null, 2));
    }
  };

  const getResultIcon = () => {
    if (!testResults) return null;
    if (testResults.error) return <XCircle className="w-5 h-5 text-red-400" />;
    if (testResults.alert) return <AlertTriangle className="w-5 h-5 text-yellow-400" />;
    if (testResults.parsed) return <CheckCircle className="w-5 h-5 text-green-400" />;
    return <XCircle className="w-5 h-5 text-gray-400" />;
  };

  const getSeverityColor = (severity: string) => {
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
        return 'bg-gray-500 bg-opacity-20 text-gray-400';
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
                <h2 className="text-2xl font-medium flex items-center" data-testid="ruleset-test-title">
                  <FlaskConical className="w-8 h-8 text-wazuh-primary mr-3" />
                  Ruleset Test
                </h2>
                <p className="text-gray-400 mt-1" data-testid="ruleset-test-subtitle">
                  Test log entries against Wazuh rules and decoders
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <Button 
                  variant="outline" 
                  className="border-gray-600 hover:bg-gray-700"
                  data-testid="button-upload-log-file"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Log File
                </Button>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Input Section */}
              <div className="space-y-6">
                <Card className="wazuh-surface border-gray-700" data-testid="log-input">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <FileText className="w-5 h-5 mr-2" />
                      Log Entry Input
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Log Type</label>
                      <Select value={selectedLogType} onValueChange={setSelectedLogType}>
                        <SelectTrigger className="wazuh-surface-variant border-gray-600" data-testid="select-log-type">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="syslog">Syslog</SelectItem>
                          <SelectItem value="apache">Apache</SelectItem>
                          <SelectItem value="windows">Windows Event</SelectItem>
                          <SelectItem value="firewall">Firewall</SelectItem>
                          <SelectItem value="custom">Custom Application</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Raw Log Entry</label>
                      <Textarea
                        value={logInput}
                        onChange={(e) => setLogInput(e.target.value)}
                        placeholder="Paste your log entry here..."
                        className="wazuh-surface-variant border-gray-600 font-mono text-xs"
                        rows={6}
                        data-testid="textarea-log-input"
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <Button 
                        onClick={handleTestLog}
                        disabled={!logInput.trim() || isProcessing}
                        className="wazuh-primary hover:bg-blue-600"
                        data-testid="button-test-log"
                      >
                        <Play className="w-4 h-4 mr-2" />
                        {isProcessing ? 'Processing...' : 'Test Log'}
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => handleLoadExample(selectedLogType)}
                        className="border-gray-600 hover:bg-gray-700"
                        data-testid="button-load-example"
                      >
                        Load Example
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Example Logs */}
                <Card className="wazuh-surface border-gray-700" data-testid="example-logs">
                  <CardHeader>
                    <CardTitle>Example Log Formats</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {Object.entries(exampleLogs).map(([type, example]) => (
                        <div key={type} className="wazuh-surface-variant rounded p-3">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="text-sm font-medium capitalize">{type}</h4>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleLoadExample(type)}
                              className="text-wazuh-primary hover:bg-wazuh-primary hover:text-white text-xs"
                              data-testid={`button-load-${type}`}
                            >
                              Load
                            </Button>
                          </div>
                          <code className="text-xs bg-black bg-opacity-50 p-2 rounded block overflow-x-auto">
                            {example}
                          </code>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Results Section */}
              <div className="space-y-6">
                <Card className="wazuh-surface border-gray-700" data-testid="test-results">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center">
                        {getResultIcon()}
                        <span className="ml-2">Test Results</span>
                      </CardTitle>
                      {testResults && (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={handleCopyResult}
                          className="text-gray-400 hover:text-white"
                          data-testid="button-copy-results"
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    {testResults ? (
                      <div className="space-y-4">
                        {testResults.error ? (
                          <div className="text-red-400 text-sm">
                            <strong>Error:</strong> {testResults.error}
                          </div>
                        ) : (
                          <>
                            {/* Processing Summary */}
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <span className="text-sm text-gray-400">Parsed:</span>
                                <span className={`ml-2 text-sm ${testResults.parsed ? 'text-green-400' : 'text-red-400'}`}>
                                  {testResults.parsed ? 'Yes' : 'No'}
                                </span>
                              </div>
                              <div>
                                <span className="text-sm text-gray-400">Alert Generated:</span>
                                <span className={`ml-2 text-sm ${testResults.alert ? 'text-yellow-400' : 'text-gray-400'}`}>
                                  {testResults.alert ? 'Yes' : 'No'}
                                </span>
                              </div>
                            </div>

                            {/* Rule Information */}
                            {testResults.rule_id && (
                              <div className="wazuh-surface-variant rounded p-3">
                                <h4 className="font-medium mb-2">Matched Rule</h4>
                                <div className="space-y-2">
                                  <div className="flex items-center space-x-2">
                                    <Badge variant="outline" className="text-xs">
                                      Rule {testResults.rule_id}
                                    </Badge>
                                    <Badge className={`text-xs ${getSeverityColor(testResults.severity)}`}>
                                      Level {testResults.rule_level}
                                    </Badge>
                                  </div>
                                  <p className="text-sm" data-testid="rule-description">
                                    {testResults.rule_description}
                                  </p>
                                  {testResults.mitre_attack && testResults.mitre_attack.length > 0 && (
                                    <div className="flex items-center space-x-2">
                                      <span className="text-xs text-gray-400">MITRE ATT&CK:</span>
                                      {testResults.mitre_attack.map((technique: string) => (
                                        <Badge key={technique} variant="outline" className="text-xs">
                                          {technique}
                                        </Badge>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}

                            {/* Extracted Fields */}
                            {testResults.fields && Object.keys(testResults.fields).length > 0 && (
                              <div className="wazuh-surface-variant rounded p-3">
                                <h4 className="font-medium mb-2">Extracted Fields</h4>
                                <div className="space-y-1">
                                  {Object.entries(testResults.fields).map(([key, value]) => (
                                    <div key={key} className="flex items-center text-sm">
                                      <span className="text-gray-400 w-24">{key}:</span>
                                      <span className="font-mono text-xs" data-testid={`field-${key}`}>
                                        {String(value)}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Raw JSON Output */}
                            <div className="bg-black bg-opacity-50 p-3 rounded border">
                              <h4 className="font-medium mb-2 text-sm">Raw Output</h4>
                              <pre className="text-xs font-mono whitespace-pre-wrap overflow-x-auto" data-testid="raw-output">
                                {JSON.stringify(testResults, null, 2)}
                              </pre>
                            </div>
                          </>
                        )}
                      </div>
                    ) : (
                      <div className="text-center text-gray-400 py-8">
                        <FlaskConical className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>Test a log entry to see the results</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Rule Testing Guide */}
            <Card className="wazuh-surface border-gray-700 mt-6" data-testid="testing-guide">
              <CardHeader>
                <CardTitle>Rule Testing Guide</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="wazuh-surface-variant rounded p-4">
                    <h4 className="font-medium mb-2">1. Input Log Data</h4>
                    <p className="text-sm text-gray-400">
                      Paste raw log entries from your applications, systems, or security devices.
                    </p>
                  </div>
                  <div className="wazuh-surface-variant rounded p-4">
                    <h4 className="font-medium mb-2">2. Analyze Processing</h4>
                    <p className="text-sm text-gray-400">
                      Review how Wazuh parses the log and which rules are triggered.
                    </p>
                  </div>
                  <div className="wazuh-surface-variant rounded p-4">
                    <h4 className="font-medium mb-2">3. Validate Rules</h4>
                    <p className="text-sm text-gray-400">
                      Ensure your custom rules work as expected and generate appropriate alerts.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}