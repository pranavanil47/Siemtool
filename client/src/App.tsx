import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import Landing from "@/pages/landing";
import Dashboard from "@/pages/dashboard";
import Analytics from "@/pages/analytics";
import Alerts from "@/pages/alerts";
import Vulnerabilities from "@/pages/vulnerabilities";
import FileIntegrity from "@/pages/file-integrity";
import MitreAttack from "@/pages/mitre-attack";
import PciDss from "@/pages/pci-dss";
import Gdpr from "@/pages/gdpr";
import Hipaa from "@/pages/hipaa";
import Nist from "@/pages/nist";
import Agents from "@/pages/agents";
import Configuration from "@/pages/configuration";
import ApiConsole from "@/pages/api-console";
import RulesetTest from "@/pages/ruleset-test";
import UserManagement from "@/pages/user-management";
import WazuhIntegration from "@/pages/wazuh-integration";
import NotFound from "@/pages/not-found";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <Switch>
      {isLoading || !isAuthenticated ? (
        <Route path="/" component={Landing} />
      ) : (
        <>
          <Route path="/" component={Dashboard} />
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/analytics" component={Analytics} />
          <Route path="/alerts" component={Alerts} />
          <Route path="/vulnerabilities" component={Vulnerabilities} />
          <Route path="/file-integrity" component={FileIntegrity} />
          <Route path="/mitre-attack" component={MitreAttack} />
          <Route path="/pci-dss" component={PciDss} />
          <Route path="/gdpr" component={Gdpr} />
          <Route path="/hipaa" component={Hipaa} />
          <Route path="/nist" component={Nist} />
          <Route path="/agents" component={Agents} />
          <Route path="/configuration" component={Configuration} />
          <Route path="/api-console" component={ApiConsole} />
          <Route path="/ruleset-test" component={RulesetTest} />
          <Route path="/user-management" component={UserManagement} />
          <Route path="/wazuh-integration" component={WazuhIntegration} />
        </>
      )}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
