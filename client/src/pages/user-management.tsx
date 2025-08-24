import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { TopNav } from "@/components/dashboard/top-nav";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Users, Plus, Edit, Trash2, Shield, Key, Settings } from "lucide-react";

export default function UserManagement() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  // Mock user data
  const users = [
    {
      id: "1",
      email: "admin@company.com",
      firstName: "John",
      lastName: "Doe",
      role: "Administrator",
      status: "active",
      lastLogin: new Date("2024-01-20T10:30:00Z"),
      profileImageUrl: null,
      permissions: ["read", "write", "admin"],
      createdAt: new Date("2024-01-01T00:00:00Z")
    },
    {
      id: "2", 
      email: "security@company.com",
      firstName: "Jane",
      lastName: "Smith",
      role: "Security Analyst",
      status: "active",
      lastLogin: new Date("2024-01-20T09:15:00Z"),
      profileImageUrl: null,
      permissions: ["read", "write"],
      createdAt: new Date("2024-01-05T00:00:00Z")
    },
    {
      id: "3",
      email: "readonly@company.com", 
      firstName: "Bob",
      lastName: "Johnson",
      role: "Viewer",
      status: "inactive",
      lastLogin: new Date("2024-01-18T14:22:00Z"),
      profileImageUrl: null,
      permissions: ["read"],
      createdAt: new Date("2024-01-10T00:00:00Z")
    }
  ];

  const roles = [
    {
      name: "Administrator",
      description: "Full system access with user management capabilities",
      permissions: ["read", "write", "admin", "user_management"],
      color: "bg-red-500 bg-opacity-20 text-red-400"
    },
    {
      name: "Security Analyst", 
      description: "Can view and manage security events, alerts, and configurations",
      permissions: ["read", "write"],
      color: "bg-blue-500 bg-opacity-20 text-blue-400"
    },
    {
      name: "Viewer",
      description: "Read-only access to dashboards and reports",
      permissions: ["read"],
      color: "bg-gray-500 bg-opacity-20 text-gray-400"
    }
  ];

  const getRoleColor = (role: string) => {
    const roleData = roles.find(r => r.name === role);
    return roleData?.color || "bg-gray-500 bg-opacity-20 text-gray-400";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-400 bg-opacity-20 text-green-400';
      case 'inactive':
        return 'bg-gray-500 bg-opacity-20 text-gray-400';
      case 'suspended':
        return 'bg-red-500 bg-opacity-20 text-red-400';
      default:
        return 'bg-gray-500 bg-opacity-20 text-gray-400';
    }
  };

  const formatLastLogin = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    return `${diffDays} days ago`;
  };

  const filteredUsers = users.filter(user => {
    if (roleFilter !== "all" && user.role !== roleFilter) return false;
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      return user.email.toLowerCase().includes(search) ||
             user.firstName.toLowerCase().includes(search) ||
             user.lastName.toLowerCase().includes(search);
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-wazuh-dark text-white font-roboto">
      <TopNav />
      
      <div className="flex h-screen pt-16">
        <Sidebar />
        
        <main className="flex-1 overflow-auto">
          <div className="wazuh-surface border-b border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-medium flex items-center" data-testid="user-management-title">
                  <Users className="w-8 h-8 text-wazuh-primary mr-3" />
                  User Management
                </h2>
                <p className="text-gray-400 mt-1" data-testid="user-management-subtitle">
                  Manage user accounts, roles, and permissions
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <Button 
                  variant="outline" 
                  className="border-gray-600 hover:bg-gray-700"
                  data-testid="button-export-users"
                >
                  Export Users
                </Button>
                <Button 
                  className="wazuh-primary hover:bg-blue-600"
                  data-testid="button-add-user"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add User
                </Button>
              </div>
            </div>
          </div>

          <div className="p-6">
            {/* User Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <Card className="wazuh-surface border-gray-700" data-testid="summary-total-users">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Total Users</p>
                      <p className="text-3xl font-semibold mt-2">{users.length}</p>
                    </div>
                    <Users className="text-wazuh-primary w-8 h-8" />
                  </div>
                </CardContent>
              </Card>

              <Card className="wazuh-surface border-gray-700" data-testid="summary-active-users">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Active Users</p>
                      <p className="text-3xl font-semibold mt-2 text-green-400">
                        {users.filter(u => u.status === 'active').length}
                      </p>
                    </div>
                    <div className="bg-green-400 bg-opacity-20 p-2 rounded-lg">
                      <Shield className="text-green-400 w-6 h-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="wazuh-surface border-gray-700" data-testid="summary-admins">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Administrators</p>
                      <p className="text-3xl font-semibold mt-2 text-red-400">
                        {users.filter(u => u.role === 'Administrator').length}
                      </p>
                    </div>
                    <div className="bg-red-500 bg-opacity-20 p-2 rounded-lg">
                      <Key className="text-red-400 w-6 h-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="wazuh-surface border-gray-700" data-testid="summary-roles">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Available Roles</p>
                      <p className="text-3xl font-semibold mt-2">{roles.length}</p>
                    </div>
                    <div className="bg-purple-500 bg-opacity-20 p-2 rounded-lg">
                      <Settings className="text-purple-400 w-6 h-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="users" className="space-y-6">
              <TabsList className="wazuh-surface-variant">
                <TabsTrigger value="users" data-testid="tab-users">Users</TabsTrigger>
                <TabsTrigger value="roles" data-testid="tab-roles">Roles & Permissions</TabsTrigger>
              </TabsList>

              <TabsContent value="users" className="space-y-6">
                {/* Filters */}
                <Card className="wazuh-surface border-gray-700">
                  <CardHeader>
                    <CardTitle>Search & Filter</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap items-center gap-4">
                      <div className="flex items-center space-x-2">
                        <Search className="w-4 h-4 text-gray-400" />
                        <Input
                          type="text"
                          placeholder="Search users..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="wazuh-surface-variant border-gray-600 w-64"
                          data-testid="input-search-users"
                        />
                      </div>
                      
                      <Select value={roleFilter} onValueChange={setRoleFilter}>
                        <SelectTrigger className="w-48 wazuh-surface-variant border-gray-600" data-testid="select-role-filter">
                          <SelectValue placeholder="Filter by role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Roles</SelectItem>
                          {roles.map(role => (
                            <SelectItem key={role.name} value={role.name}>{role.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                {/* Users Table */}
                <Card className="wazuh-surface border-gray-700" data-testid="users-table">
                  <CardHeader>
                    <CardTitle>Users ({filteredUsers.length})</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="wazuh-surface-variant">
                          <tr>
                            <th className="text-left p-4 font-medium text-sm">User</th>
                            <th className="text-left p-4 font-medium text-sm">Role</th>
                            <th className="text-left p-4 font-medium text-sm">Status</th>
                            <th className="text-left p-4 font-medium text-sm">Last Login</th>
                            <th className="text-left p-4 font-medium text-sm">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredUsers.map((user) => (
                            <tr 
                              key={user.id} 
                              className="border-b border-gray-700 hover:bg-wazuh-surface-variant transition-colors"
                              data-testid={`user-row-${user.id}`}
                            >
                              <td className="p-4">
                                <div className="flex items-center space-x-3">
                                  <Avatar className="w-10 h-10">
                                    <AvatarImage src={user.profileImageUrl || undefined} />
                                    <AvatarFallback className="wazuh-surface-variant">
                                      {user.firstName[0]}{user.lastName[0]}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <div className="font-medium" data-testid={`user-name-${user.id}`}>
                                      {user.firstName} {user.lastName}
                                    </div>
                                    <div className="text-xs text-gray-400" data-testid={`user-email-${user.id}`}>
                                      {user.email}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="p-4">
                                <Badge className={`text-xs ${getRoleColor(user.role)}`} data-testid={`user-role-${user.id}`}>
                                  {user.role}
                                </Badge>
                              </td>
                              <td className="p-4">
                                <Badge className={`text-xs ${getStatusColor(user.status)}`} data-testid={`user-status-${user.id}`}>
                                  {user.status}
                                </Badge>
                              </td>
                              <td className="p-4 text-sm text-gray-400" data-testid={`user-last-login-${user.id}`}>
                                {formatLastLogin(user.lastLogin)}
                              </td>
                              <td className="p-4">
                                <div className="flex items-center space-x-2">
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    className="text-wazuh-primary hover:bg-wazuh-primary hover:text-white"
                                    data-testid={`button-edit-${user.id}`}
                                  >
                                    <Edit className="w-4 h-4" />
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    className="text-red-400 hover:bg-red-500 hover:text-white"
                                    data-testid={`button-delete-${user.id}`}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="roles" className="space-y-6">
                {/* Roles Management */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {roles.map((role) => (
                    <Card key={role.name} className="wazuh-surface border-gray-700" data-testid={`role-card-${role.name.toLowerCase().replace(' ', '-')}`}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="flex items-center">
                            <Badge className={`${role.color} mr-2`}>
                              {role.name}
                            </Badge>
                          </CardTitle>
                          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-400 mb-4">{role.description}</p>
                        <div>
                          <h4 className="text-sm font-medium mb-2">Permissions:</h4>
                          <div className="flex flex-wrap gap-2">
                            {role.permissions.map((permission) => (
                              <Badge 
                                key={permission} 
                                variant="outline" 
                                className="text-xs"
                                data-testid={`permission-${permission}`}
                              >
                                {permission.replace('_', ' ')}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-gray-700">
                          <p className="text-xs text-gray-400">
                            Users with this role: {users.filter(u => u.role === role.name).length}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
}