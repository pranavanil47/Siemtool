import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CreditCard, UserCheck, Hospital, Bookmark } from "lucide-react";
import type { ComplianceFrameworkScore } from "@shared/schema";

export function ComplianceOverview() {
  const { data: complianceData, isLoading } = useQuery<ComplianceFrameworkScore[]>({
    queryKey: ["/api/compliance/overview"],
    refetchInterval: 30000,
  });

  const getFrameworkIcon = (framework: string) => {
    switch (framework) {
      case 'PCI_DSS':
        return CreditCard;
      case 'GDPR':
        return UserCheck;
      case 'HIPAA':
        return Hospital;
      case 'NIST_800_53':
        return Bookmark;
      default:
        return CreditCard;
    }
  };

  const getFrameworkName = (framework: string) => {
    switch (framework) {
      case 'PCI_DSS':
        return 'PCI DSS';
      case 'GDPR':
        return 'GDPR';
      case 'HIPAA':
        return 'HIPAA';
      case 'NIST_800_53':
        return 'NIST 800-53';
      default:
        return framework;
    }
  };

  const getScoreColor = (percentage: number) => {
    if (percentage >= 95) return 'text-green-400';
    if (percentage >= 85) return 'text-yellow-500';
    return 'text-red-400';
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 95) return 'bg-green-400';
    if (percentage >= 85) return 'bg-yellow-500';
    return 'bg-red-400';
  };

  if (isLoading) {
    return (
      <Card className="wazuh-surface border-gray-700">
        <CardHeader>
          <CardTitle>Compliance Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center justify-between p-4 wazuh-surface-variant rounded animate-pulse">
                <div className="h-4 bg-gray-700 rounded w-24"></div>
                <div className="h-4 bg-gray-700 rounded w-16"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="wazuh-surface border-gray-700" data-testid="compliance-overview">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle data-testid="compliance-overview-title">Compliance Overview</CardTitle>
          <Button 
            variant="link" 
            className="text-wazuh-primary hover:underline text-sm p-0"
            data-testid="button-view-reports"
          >
            View Reports
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          {complianceData?.map((framework) => {
            const IconComponent = getFrameworkIcon(framework.framework);
            return (
              <div 
                key={framework.framework} 
                className="flex items-center justify-between p-4 wazuh-surface-variant rounded"
                data-testid={`compliance-framework-${framework.framework}`}
              >
                <div className="flex items-center space-x-3">
                  <IconComponent className="text-wazuh-primary w-5 h-5" />
                  <span className="text-sm font-medium" data-testid={`framework-name-${framework.framework}`}>
                    {getFrameworkName(framework.framework)}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span 
                    className={`text-sm ${getScoreColor(framework.percentage)}`}
                    data-testid={`framework-score-${framework.framework}`}
                  >
                    {framework.percentage}%
                  </span>
                  <div className="w-16">
                    <Progress 
                      value={framework.percentage} 
                      className="h-2"
                      data-testid={`framework-progress-${framework.framework}`}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
