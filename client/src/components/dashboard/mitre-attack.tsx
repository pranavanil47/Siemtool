import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { MitreAttackData } from "@shared/schema";

export function MitreAttack() {
  const { data: mitreData, isLoading } = useQuery<MitreAttackData[]>({
    queryKey: ["/api/mitre-attack"],
    refetchInterval: 30000,
  });

  const getSeverityBadge = (alertCount: number) => {
    if (alertCount >= 3) return { className: "severity-critical", label: `${alertCount} alerts` };
    if (alertCount >= 2) return { className: "severity-high", label: `${alertCount} alerts` };
    if (alertCount >= 1) return { className: "severity-medium", label: `${alertCount} alert` };
    return { className: "severity-low", label: "No alerts" };
  };

  if (isLoading) {
    return (
      <Card className="wazuh-surface border-gray-700">
        <CardHeader>
          <CardTitle>MITRE ATT&CK Framework</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="wazuh-surface-variant rounded p-4 animate-pulse">
                <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-700 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="wazuh-surface border-gray-700" data-testid="mitre-attack">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle data-testid="mitre-attack-title">MITRE ATT&CK Framework</CardTitle>
          <Button 
            variant="link" 
            className="text-wazuh-primary hover:underline text-sm p-0"
            data-testid="button-view-matrix"
          >
            View Full Matrix
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          {mitreData?.slice(0, 3).map((technique) => {
            const badge = getSeverityBadge(technique.alertCount || 0);
            return (
              <div 
                key={technique.id} 
                className="wazuh-surface-variant rounded p-4"
                data-testid={`mitre-technique-${technique.techniqueId}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium" data-testid={`technique-name-${technique.techniqueId}`}>
                    {technique.tactic}
                  </span>
                  <Badge className={`text-xs px-2 py-1 rounded ${badge.className}`}>
                    {badge.label}
                  </Badge>
                </div>
                <div className="text-xs text-gray-400" data-testid={`technique-id-${technique.techniqueId}`}>
                  {technique.techniqueId} - {technique.techniqueName}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
