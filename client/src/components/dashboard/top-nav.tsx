import { Bell, ChevronDown, Shield, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import type { User } from "@shared/schema";

export function TopNav() {
  const { user, isAuthenticated } = useAuth();
  const authUser = user as User | undefined;

  const getUserInitials = () => {
    if (authUser?.firstName && authUser?.lastName) {
      return `${authUser.firstName[0]}${authUser.lastName[0]}`;
    }
    return authUser?.email?.[0]?.toUpperCase() || 'U';
  };

  const getUserDisplayName = () => {
    if (authUser?.firstName && authUser?.lastName) {
      return `${authUser.firstName} ${authUser.lastName}`;
    }
    return authUser?.email || 'User';
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 wazuh-surface border-b border-gray-700 px-6 py-4" data-testid="top-nav">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Shield className="text-wazuh-primary text-2xl" />
            <h1 className="text-xl font-medium" data-testid="platform-title">Wazuh Security Platform</h1>
          </div>
          <div className="hidden md:flex items-center space-x-2 text-sm text-gray-400">
            <span>Manager:</span>
            <span className="text-green-400" data-testid="manager-name">wazuh-manager-01</span>
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" data-testid="manager-status"></span>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <button className="text-gray-400 hover:text-white cursor-pointer" data-testid="button-notifications">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-xs rounded-full w-4 h-4 flex items-center justify-center">
                3
              </span>
            </button>
          </div>
          
          {isAuthenticated ? (
            <div className="flex items-center space-x-2">
              <Avatar className="w-8 h-8">
                <AvatarImage src={authUser?.profileImageUrl || undefined} />
                <AvatarFallback className="wazuh-surface-variant text-sm">
                  {getUserInitials()}
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:flex flex-col">
                <span className="text-sm" data-testid="user-name">
                  {getUserDisplayName()}
                </span>
                <span className="text-xs text-gray-400">{authUser?.email}</span>
              </div>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => window.location.href = '/api/logout'}
                className="text-gray-400 hover:text-white"
                data-testid="button-logout"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <Button 
              variant="outline" 
              onClick={() => window.location.href = '/api/login'}
              data-testid="button-login"
            >
              Login
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}
