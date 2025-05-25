import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export default function AdminSettings() {
  const [location, navigate] = useLocation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [currentTab, setCurrentTab] = useState("general");

  // Platform settings
  const [settings, setSettings] = useState({
    platformName: "CryptoNest",
    maintenanceMode: false,
    allowRegistrations: true,
    allowDeposits: true,
    allowWithdrawals: true,
    minDepositAmount: "0.001",
    minWithdrawalAmount: "0.001",
    transactionFeePercentage: "1.5"
  });

  useEffect(() => {
    // Check if admin is logged in
    const checkAdminAuth = async () => {
      try {
        const response = await fetch("/api/auth/admin/me", {
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Not authenticated as admin");
        }

        // In a real application, we would load the settings from the backend
        setIsLoading(false);
      } catch (error) {
        toast({
          title: "Authentication Error",
          description: "You must be logged in as an admin to view this page",
          variant: "destructive",
        });
        navigate("/admin");
      }
    };

    checkAdminAuth();
  }, [navigate, toast]);

  const handleSettingChange = (key: string, value: string | boolean | number) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSaveSettings = async () => {
    setIsSaving(true);
    
    // Simulate saving settings
    setTimeout(() => {
      setIsSaving(false);
      toast({
        title: "Settings Saved",
        description: "The platform settings have been updated successfully.",
      });
    }, 1000);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="animate-pulse text-xl">Loading settings...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="border-b border-gray-800 bg-gray-900/90 backdrop-blur supports-backdrop-blur:bg-gray-900/60">
        <div className="flex h-16 items-center px-4 md:px-6">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-r from-red-400 to-violet-500 p-1.5 rounded mr-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6 text-white"
              >
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <h1 className="text-lg font-bold">CryptoNest Admin</h1>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Badge variant="outline" className="bg-blue-950/50 text-blue-300 border-blue-800">
              Admin
            </Badge>
            <Button 
              onClick={() => navigate("/admin/dashboard")}
              variant="outline" 
              size="sm" 
              className="border-gray-700"
            >
              Back to Dashboard
            </Button>
          </div>
        </div>
      </header>
      <main className="container mx-auto p-4 md:p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="bg-gray-800 p-3 rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-10 w-10 text-violet-400"
            >
              <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold">
              Platform Settings
            </h1>
            <p className="text-gray-400">Configure the cryptocurrency exchange platform</p>
          </div>
        </div>

        <Tabs value={currentTab} onValueChange={setCurrentTab} className="mt-4">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>
          <TabsContent value="general">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>Configure basic platform settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="platformName">Platform Name</Label>
                  <Input
                    id="platformName"
                    value={settings.platformName}
                    onChange={(e) => handleSettingChange("platformName", e.target.value)}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
                
                <Separator className="my-6 bg-gray-700" />
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="maintenanceMode" className="block">Maintenance Mode</Label>
                      <p className="text-sm text-gray-400 mt-1">
                        When enabled, the platform will be unavailable to users
                      </p>
                    </div>
                    <Switch
                      id="maintenanceMode"
                      checked={settings.maintenanceMode}
                      onCheckedChange={(checked) => handleSettingChange("maintenanceMode", checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="allowRegistrations" className="block">Allow Registrations</Label>
                      <p className="text-sm text-gray-400 mt-1">
                        Allow new users to register accounts
                      </p>
                    </div>
                    <Switch
                      id="allowRegistrations"
                      checked={settings.allowRegistrations}
                      onCheckedChange={(checked) => handleSettingChange("allowRegistrations", checked)}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  className="bg-gradient-to-r from-blue-500 to-violet-600 hover:from-blue-600 hover:to-violet-700"
                  onClick={handleSaveSettings}
                  disabled={isSaving}
                >
                  {isSaving ? "Saving Changes..." : "Save Changes"}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="transactions">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle>Transaction Settings</CardTitle>
                <CardDescription>Configure deposit and withdrawal settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="allowDeposits" className="block">Allow Deposits</Label>
                      <p className="text-sm text-gray-400 mt-1">
                        Enable cryptocurrency deposits
                      </p>
                    </div>
                    <Switch
                      id="allowDeposits"
                      checked={settings.allowDeposits}
                      onCheckedChange={(checked) => handleSettingChange("allowDeposits", checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="allowWithdrawals" className="block">Allow Withdrawals</Label>
                      <p className="text-sm text-gray-400 mt-1">
                        Enable cryptocurrency withdrawals
                      </p>
                    </div>
                    <Switch
                      id="allowWithdrawals"
                      checked={settings.allowWithdrawals}
                      onCheckedChange={(checked) => handleSettingChange("allowWithdrawals", checked)}
                    />
                  </div>
                </div>
                
                <Separator className="my-6 bg-gray-700" />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="minDepositAmount">Minimum Deposit Amount</Label>
                    <Input
                      id="minDepositAmount"
                      value={settings.minDepositAmount}
                      onChange={(e) => handleSettingChange("minDepositAmount", e.target.value)}
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="minWithdrawalAmount">Minimum Withdrawal Amount</Label>
                    <Input
                      id="minWithdrawalAmount"
                      value={settings.minWithdrawalAmount}
                      onChange={(e) => handleSettingChange("minWithdrawalAmount", e.target.value)}
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="transactionFeePercentage">Transaction Fee (%)</Label>
                    <Input
                      id="transactionFeePercentage"
                      value={settings.transactionFeePercentage}
                      onChange={(e) => handleSettingChange("transactionFeePercentage", e.target.value)}
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  className="bg-gradient-to-r from-blue-500 to-violet-600 hover:from-blue-600 hover:to-violet-700"
                  onClick={handleSaveSettings}
                  disabled={isSaving}
                >
                  {isSaving ? "Saving Changes..." : "Save Changes"}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="security">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>Configure platform security settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-yellow-900/20 border border-yellow-900/50 rounded-md p-4 mb-6">
                  <h3 className="text-yellow-300 font-medium mb-2">Security Notice</h3>
                  <p className="text-sm text-yellow-200/80">
                    These settings impact the security of your platform. Changes should be made with caution.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="requireEmailVerification" className="block">Require Email Verification</Label>
                      <p className="text-sm text-gray-400 mt-1">
                        Require users to verify their email before using the platform
                      </p>
                    </div>
                    <Switch
                      id="requireEmailVerification"
                      checked={true}
                      onCheckedChange={() => {}}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="enable2FA" className="block">Require 2FA for Withdrawals</Label>
                      <p className="text-sm text-gray-400 mt-1">
                        Require two-factor authentication for all withdrawals
                      </p>
                    </div>
                    <Switch
                      id="enable2FA"
                      checked={true}
                      onCheckedChange={() => {}}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="autoLockAccounts" className="block">Auto-Lock Suspicious Accounts</Label>
                      <p className="text-sm text-gray-400 mt-1">
                        Automatically lock accounts with suspicious activity
                      </p>
                    </div>
                    <Switch
                      id="autoLockAccounts"
                      checked={true}
                      onCheckedChange={() => {}}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  className="bg-gradient-to-r from-blue-500 to-violet-600 hover:from-blue-600 hover:to-violet-700"
                  onClick={handleSaveSettings}
                  disabled={isSaving}
                >
                  {isSaving ? "Saving Changes..." : "Save Changes"}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}