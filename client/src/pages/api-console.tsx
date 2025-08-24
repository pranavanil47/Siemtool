import { useState } from "react";
import { TopNav } from "@/components/dashboard/top-nav";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Code, Play, Copy, Download, BookOpen, Server, Database } from "lucide-react";

export default function ApiConsole() {
  const [selectedEndpoint, setSelectedEndpoint] = useState("");
  const [requestMethod, setRequestMethod] = useState("GET");
  const [requestBody, setRequestBody] = useState("");
  const [responseData, setResponseData] = useState("");
  const [responseStatus, setResponseStatus] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // API endpoints categorized
  const apiEndpoints = [
    {
      category: "Agents",
      endpoints: [
        { method: "GET", path: "/agents", description: "List all agents" },
        { method: "GET", path: "/agents/{agent_id}", description: "Get agent details" },
        { method: "POST", path: "/agents", description: "Add new agent" },
        { method: "DELETE", path: "/agents/{agent_id}", description: "Remove agent" },
        { method: "GET", path: "/agents/stats", description: "Get agent statistics" }
      ]
    },
    {
      category: "Security Events",
      endpoints: [
        { method: "GET", path: "/events", description: "Get security events" },
        { method: "GET", path: "/events/{event_id}", description: "Get specific event" },
        { method: "GET", path: "/events/stats", description: "Get event statistics" }
      ]
    },
    {
      category: "Rules",
      endpoints: [
        { method: "GET", path: "/rules", description: "List all rules" },
        { method: "GET", path: "/rules/{rule_id}", description: "Get rule details" },
        { method: "POST", path: "/rules", description: "Create custom rule" },
        { method: "PUT", path: "/rules/{rule_id}", description: "Update rule" },
        { method: "DELETE", path: "/rules/{rule_id}", description: "Delete rule" }
      ]
    },
    {
      category: "Configuration",
      endpoints: [
        { method: "GET", path: "/manager/config", description: "Get manager configuration" },
        { method: "PUT", path: "/manager/config", description: "Update manager configuration" },
        { method: "GET", path: "/cluster/config", description: "Get cluster configuration" }
      ]
    }
  ];

  const exampleRequests = {
    "GET /agents": {
      description: "Retrieve a list of all registered agents",
      body: "",
      response: `{
  "data": {
    "affected_items": [
      {
        "id": "001",
        "name": "web-server-01",
        "ip": "192.168.1.100",
        "status": "active",
        "node_name": "worker-1",
        "dateAdd": "2024-01-15T10:30:00Z",
        "version": "4.8.0",
        "os": {
          "arch": "x86_64",
          "major": "20",
          "minor": "04",
          "name": "Ubuntu",
          "platform": "ubuntu"
        }
      }
    ],
    "total_affected_items": 1
  }
}`
    },
    "POST /agents": {
      description: "Register a new agent",
      body: `{
  "name": "new-server",
  "ip": "192.168.1.150"
}`,
      response: `{
  "data": {
    "id": "002",
    "key": "MDEyIDEyNy4wLjAuMSA4YjUzNmE0ZDQ..."
  }
}`
    },
    "GET /events": {
      description: "Retrieve security events with optional filters",
      body: "",
      response: `{
  "data": {
    "affected_items": [
      {
        "timestamp": "2024-01-20T15:45:30Z",
        "rule": {
          "id": 5501,
          "description": "Login session opened",
          "level": 3
        },
        "agent": {
          "id": "001",
          "name": "web-server-01"
        },
        "location": "/var/log/auth.log"
      }
    ],
    "total_affected_items": 1
  }
}`
    }
  };

  const handleExecuteRequest = async () => {
    if (!selectedEndpoint) return;
    
    setIsLoading(true);
    
    try {
      // Mock API call simulation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const example = exampleRequests[`${requestMethod} ${selectedEndpoint}` as keyof typeof exampleRequests];
      if (example) {
        setResponseData(example.response);
        setResponseStatus(200);
      } else {
        setResponseData(JSON.stringify({ error: "Endpoint not found" }, null, 2));
        setResponseStatus(404);
      }
    } catch (error) {
      setResponseData(JSON.stringify({ error: "Request failed" }, null, 2));
      setResponseStatus(500);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyResponse = () => {
    navigator.clipboard.writeText(responseData);
  };

  const getStatusColor = (status: number | null) => {
    if (!status) return "bg-gray-500 bg-opacity-20 text-gray-400";
    if (status >= 200 && status < 300) return "bg-green-400 bg-opacity-20 text-green-400";
    if (status >= 400) return "bg-red-400 bg-opacity-20 text-red-400";
    return "bg-yellow-400 bg-opacity-20 text-yellow-400";
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
                <h2 className="text-2xl font-medium flex items-center" data-testid="api-console-title">
                  <Code className="w-8 h-8 text-wazuh-primary mr-3" />
                  API Console
                </h2>
                <p className="text-gray-400 mt-1" data-testid="api-console-subtitle">
                  Interact with the Wazuh REST API
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <Button 
                  variant="outline" 
                  className="border-gray-600 hover:bg-gray-700"
                  data-testid="button-api-docs"
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  API Documentation
                </Button>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* API Endpoints Sidebar */}
              <Card className="wazuh-surface border-gray-700" data-testid="api-endpoints">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Server className="w-5 h-5 mr-2" />
                    API Endpoints
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0 max-h-96 overflow-y-auto">
                  {apiEndpoints.map((category) => (
                    <div key={category.category} className="p-4 border-b border-gray-700 last:border-b-0">
                      <h4 className="font-medium text-sm mb-3 text-gray-300">{category.category}</h4>
                      <div className="space-y-2">
                        {category.endpoints.map((endpoint) => (
                          <button
                            key={`${endpoint.method} ${endpoint.path}`}
                            onClick={() => {
                              setSelectedEndpoint(endpoint.path);
                              setRequestMethod(endpoint.method);
                              const example = exampleRequests[`${endpoint.method} ${endpoint.path}` as keyof typeof exampleRequests];
                              setRequestBody(example?.body || "");
                            }}
                            className={`w-full text-left p-2 rounded hover:bg-wazuh-surface-variant transition-colors ${
                              selectedEndpoint === endpoint.path ? 'bg-wazuh-primary bg-opacity-20' : ''
                            }`}
                            data-testid={`endpoint-${endpoint.method.toLowerCase()}-${endpoint.path.replace(/[^a-zA-Z0-9]/g, '-')}`}
                          >
                            <div className="flex items-center space-x-2">
                              <Badge 
                                className={`text-xs ${
                                  endpoint.method === 'GET' ? 'bg-blue-500 bg-opacity-20 text-blue-400' :
                                  endpoint.method === 'POST' ? 'bg-green-500 bg-opacity-20 text-green-400' :
                                  endpoint.method === 'PUT' ? 'bg-yellow-500 bg-opacity-20 text-yellow-400' :
                                  'bg-red-500 bg-opacity-20 text-red-400'
                                }`}
                              >
                                {endpoint.method}
                              </Badge>
                              <span className="text-xs font-mono">{endpoint.path}</span>
                            </div>
                            <p className="text-xs text-gray-400 mt-1">{endpoint.description}</p>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Request Configuration */}
              <Card className="wazuh-surface border-gray-700" data-testid="request-config">
                <CardHeader>
                  <CardTitle>Request Configuration</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">HTTP Method</label>
                    <Select value={requestMethod} onValueChange={setRequestMethod}>
                      <SelectTrigger className="wazuh-surface-variant border-gray-600" data-testid="select-method">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="GET">GET</SelectItem>
                        <SelectItem value="POST">POST</SelectItem>
                        <SelectItem value="PUT">PUT</SelectItem>
                        <SelectItem value="DELETE">DELETE</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Endpoint URL</label>
                    <Input
                      type="text"
                      value={selectedEndpoint}
                      onChange={(e) => setSelectedEndpoint(e.target.value)}
                      placeholder="/agents"
                      className="wazuh-surface-variant border-gray-600 font-mono"
                      data-testid="input-endpoint"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Request Headers</label>
                    <Textarea
                      placeholder={`Content-Type: application/json
Authorization: Bearer YOUR_TOKEN`}
                      className="wazuh-surface-variant border-gray-600 font-mono text-xs"
                      rows={3}
                      data-testid="textarea-headers"
                    />
                  </div>

                  {(requestMethod === 'POST' || requestMethod === 'PUT') && (
                    <div>
                      <label className="text-sm font-medium mb-2 block">Request Body</label>
                      <Textarea
                        value={requestBody}
                        onChange={(e) => setRequestBody(e.target.value)}
                        placeholder='{"name": "example", "value": "data"}'
                        className="wazuh-surface-variant border-gray-600 font-mono text-xs"
                        rows={6}
                        data-testid="textarea-request-body"
                      />
                    </div>
                  )}

                  <Button 
                    onClick={handleExecuteRequest}
                    disabled={!selectedEndpoint || isLoading}
                    className="w-full wazuh-primary hover:bg-blue-600"
                    data-testid="button-execute-request"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    {isLoading ? 'Executing...' : 'Execute Request'}
                  </Button>
                </CardContent>
              </Card>

              {/* Response */}
              <Card className="wazuh-surface border-gray-700" data-testid="response-panel">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Response</CardTitle>
                    <div className="flex items-center space-x-2">
                      {responseStatus && (
                        <Badge className={`text-xs ${getStatusColor(responseStatus)}`}>
                          {responseStatus}
                        </Badge>
                      )}
                      {responseData && (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={handleCopyResponse}
                          className="text-gray-400 hover:text-white"
                          data-testid="button-copy-response"
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {responseData ? (
                    <div className="bg-black bg-opacity-50 p-4 rounded border">
                      <pre className="text-xs font-mono whitespace-pre-wrap overflow-x-auto" data-testid="response-data">
                        {responseData}
                      </pre>
                    </div>
                  ) : (
                    <div className="text-center text-gray-400 py-8">
                      <Database className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>Execute a request to see the response</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* API Reference */}
            <Card className="wazuh-surface border-gray-700 mt-6" data-testid="api-reference">
              <CardHeader>
                <CardTitle>API Reference</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="wazuh-surface-variant rounded p-4">
                    <h4 className="font-medium mb-2">Authentication</h4>
                    <p className="text-sm text-gray-400 mb-2">
                      Use JWT tokens for API authentication. Include in the Authorization header.
                    </p>
                    <code className="text-xs bg-black bg-opacity-50 p-2 rounded block">
                      Authorization: Bearer &lt;token&gt;
                    </code>
                  </div>
                  <div className="wazuh-surface-variant rounded p-4">
                    <h4 className="font-medium mb-2">Rate Limiting</h4>
                    <p className="text-sm text-gray-400 mb-2">
                      API requests are limited to 300 requests per minute per IP address.
                    </p>
                    <code className="text-xs bg-black bg-opacity-50 p-2 rounded block">
                      X-RateLimit-Remaining: 299
                    </code>
                  </div>
                  <div className="wazuh-surface-variant rounded p-4">
                    <h4 className="font-medium mb-2">Response Format</h4>
                    <p className="text-sm text-gray-400 mb-2">
                      All responses follow a consistent JSON structure with data and metadata.
                    </p>
                    <code className="text-xs bg-black bg-opacity-50 p-2 rounded block">
                      Content-Type: application/json
                    </code>
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