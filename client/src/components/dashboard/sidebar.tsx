import { Link, useLocation } from "wouter";
import { 
  Gauge, 
  TrendingUp, 
  AlertTriangle, 
  Bug, 
  Shield, 
  Target, 
  CreditCard, 
  UserCheck, 
  Hospital, 
  Bookmark, 
  Server, 
  Settings, 
  Code, 
  FlaskConical,
  Users,
  Zap
} from "lucide-react";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const [location] = useLocation();
  
  const getRouteFromId = (id: string) => {
    if (id === "overview") return "/";
    return `/${id}`;
  };
  
  const getActiveId = () => {
    if (location === "/") return "overview";
    if (location.includes("-")) {
      return location.substring(1);
    }
    return location.substring(1);
  };

  const menuItems = [
    {
      section: "Dashboard",
      items: [
        { id: "overview", icon: Gauge, label: "Overview", active: true },
        { id: "analytics", icon: TrendingUp, label: "Analytics" },
      ]
    },
    {
      section: "Security",
      items: [
        { id: "alerts", icon: AlertTriangle, label: "Alerts", badge: "24" },
        { id: "vulnerabilities", icon: Bug, label: "Vulnerabilities" },
        { id: "file-integrity", icon: Shield, label: "File Integrity" },
        { id: "mitre-attack", icon: Target, label: "MITRE ATT&CK" },
      ]
    },
    {
      section: "Compliance",
      items: [
        { id: "pci-dss", icon: CreditCard, label: "PCI DSS" },
        { id: "gdpr", icon: UserCheck, label: "GDPR" },
        { id: "hipaa", icon: Hospital, label: "HIPAA" },
        { id: "nist", icon: Bookmark, label: "NIST 800-53" },
      ]
    },
    {
      section: "Management",
      items: [
        { id: "agents", icon: Server, label: "Agents", count: "847" },
        { id: "configuration", icon: Settings, label: "Configuration" },
        { id: "api-console", icon: Code, label: "API Console" },
        { id: "ruleset-test", icon: FlaskConical, label: "Ruleset Test" },
      ]
    },
    {
      section: "System",
      items: [
        { id: "user-management", icon: Users, label: "User Management" },
        { id: "wazuh-integration", icon: Zap, label: "Integration Hub" },
      ]
    }
  ];

  type MenuItem = {
    id: string;
    icon: any;
    label: string;
    active?: boolean;
    badge?: string;
    count?: string;
  };

  return (
    <aside className="w-64 wazuh-surface border-r border-gray-700 overflow-y-auto" data-testid="sidebar">
      <div className="p-4">
        <div className="space-y-2">
          {menuItems.map((section, sectionIndex) => (
            <div key={section.section} className={cn(
              "border-b border-gray-700 pb-2 mb-4",
              sectionIndex === menuItems.length - 1 && "border-b-0"
            )}>
              <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">
                {section.section}
              </h3>
              {section.items.map((item) => (
                <Link
                  key={item.id}
                  href={getRouteFromId(item.id)}
                  className={cn(
                    "w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-300 hover:bg-wazuh-surface-variant transition-colors",
                    getActiveId() === item.id && "wazuh-primary"
                  )}
                  data-testid={`sidebar-item-${item.id}`}
                >
                  <item.icon className="w-4 h-4" />
                  <span className="flex-1 text-left">{item.label}</span>
                  {(item as any).badge && (
                    <span className="bg-red-500 text-xs px-2 py-1 rounded-full">
                      {(item as any).badge}
                    </span>
                  )}
                  {(item as any).count && (
                    <span className="text-xs text-gray-500">
                      {(item as any).count}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
