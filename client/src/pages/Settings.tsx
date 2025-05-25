import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { useWeb3 } from "@/lib/web3";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { 
  KeyRound, 
  Bell, 
  Wallet, 
  Shield, 
  EyeOff,
  LockIcon 
} from "lucide-react";
import { shortenAddress } from "@/lib/web3";

export default function Settings() {
  const { user } = useAuth();
  const { isConnected, account } = useWeb3();
  const { toast } = useToast();
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Profile form schema
  const profileFormSchema = z.object({
    firstName: z.string().min(2, {
      message: "First name must be at least 2 characters.",
    }),
    lastName: z.string().optional(),
    email: z.string().email({
      message: "Please enter a valid email address.",
    }),
  });

  // Password form schema
  const passwordFormSchema = z.object({
    currentPassword: z.string().min(1, {
      message: "Current password is required.",
    }),
    newPassword: z.string().min(8, {
      message: "Password must be at least 8 characters.",
    }).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
      message: "Password must contain uppercase, lowercase letters and numbers.",
    }),
    confirmPassword: z.string().min(1, {
      message: "Please confirm your password.",
    }),
  }).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match.",
    path: ["confirmPassword"],
  });

  // Profile form
  const profileForm = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
    },
  });

  // Password form
  const passwordForm = useForm<z.infer<typeof passwordFormSchema>>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  // Handle profile form submission
  const onProfileSubmit = async (values: z.infer<typeof profileFormSchema>) => {
    setIsSaving(true);
    
    try {
      // In a real app, this would call an API to update the user profile
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulating API call
      
      toast({
        title: "Profile updated",
        description: "Your profile information has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Failed to update profile",
        description: "There was an error updating your profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Handle password form submission
  const onPasswordSubmit = async (values: z.infer<typeof passwordFormSchema>) => {
    setIsChangingPassword(true);
    
    try {
      // In a real app, this would call an API to change the password
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulating API call
      
      toast({
        title: "Password changed",
        description: "Your password has been changed successfully.",
      });
      
      passwordForm.reset({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      toast({
        title: "Failed to change password",
        description: "There was an error changing your password. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsChangingPassword(false);
    }
  };

  // Handle enabling/disabling 2FA
  const handleToggle2FA = async (enabled: boolean) => {
    try {
      // In a real app, this would call an API to enable/disable 2FA
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulating API call
      
      toast({
        title: enabled ? "2FA Enabled" : "2FA Disabled",
        description: enabled 
          ? "Two-factor authentication has been enabled for your account." 
          : "Two-factor authentication has been disabled for your account.",
      });
    } catch (error) {
      toast({
        title: "Failed to update 2FA",
        description: "There was an error updating your 2FA settings. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Settings</h2>
        <p className="text-muted-foreground">
          Manage your account settings and preferences.
        </p>
      </div>
      
      <Tabs defaultValue="account" className="space-y-4">
        <TabsList>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="wallets">Wallets</TabsTrigger>
        </TabsList>
        
        {/* Account Tab */}
        <TabsContent value="account" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Profile</CardTitle>
              <CardDescription>
                Update your personal information and how we can reach you.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...profileForm}>
                <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={profileForm.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={profileForm.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={profileForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="john@example.com" type="email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="flex justify-end">
                    <Button type="submit" disabled={isSaving}>
                      {isSaving ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>
                Update your password to maintain security of your account.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...passwordForm}>
                <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
                  <FormField
                    control={passwordForm.control}
                    name="currentPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Current Password</FormLabel>
                        <FormControl>
                          <Input placeholder="Current password" type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={passwordForm.control}
                    name="newPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>New Password</FormLabel>
                        <FormControl>
                          <Input placeholder="New password" type="password" {...field} />
                        </FormControl>
                        <FormDescription>
                          Password must be at least 8 characters and include uppercase, lowercase letters and numbers.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={passwordForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm New Password</FormLabel>
                        <FormControl>
                          <Input placeholder="Confirm new password" type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="flex justify-end">
                    <Button type="submit" disabled={isChangingPassword}>
                      {isChangingPassword ? "Changing..." : "Change Password"}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Security Tab */}
        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Two-Factor Authentication</CardTitle>
              <CardDescription>
                Add an extra layer of security to your account with two-factor authentication.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-2 rounded-full bg-muted">
                    <Shield className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Two-Factor Authentication</p>
                    <p className="text-sm text-muted-foreground">Protect your account with 2FA</p>
                  </div>
                </div>
                <Switch onCheckedChange={handleToggle2FA} />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-2 rounded-full bg-muted">
                    <KeyRound className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">API Keys</p>
                    <p className="text-sm text-muted-foreground">Manage your API keys</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Manage
                </Button>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-2 rounded-full bg-muted">
                    <LockIcon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Login History</p>
                    <p className="text-sm text-muted-foreground">View your recent login activity</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  View
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Privacy and Data</CardTitle>
              <CardDescription>
                Manage your privacy settings and data.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-2 rounded-full bg-muted">
                    <EyeOff className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Privacy Mode</p>
                    <p className="text-sm text-muted-foreground">Hide your balances from view</p>
                  </div>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Configure how and when you want to be notified.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-2 rounded-full bg-muted">
                    <Bell className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Email Notifications</p>
                    <p className="text-sm text-muted-foreground">Receive important updates via email</p>
                  </div>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-2 rounded-full bg-muted">
                    <Bell className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Deposit Alerts</p>
                    <p className="text-sm text-muted-foreground">Notify when funds are deposited</p>
                  </div>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-2 rounded-full bg-muted">
                    <Bell className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Withdrawal Alerts</p>
                    <p className="text-sm text-muted-foreground">Notify when funds are withdrawn</p>
                  </div>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-2 rounded-full bg-muted">
                    <Bell className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Price Alerts</p>
                    <p className="text-sm text-muted-foreground">Notify on significant price changes</p>
                  </div>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Wallets Tab */}
        <TabsContent value="wallets" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Connected Wallets</CardTitle>
              <CardDescription>
                Manage your connected cryptocurrency wallets.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isConnected ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="p-2 rounded-full bg-muted">
                      <Wallet className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">MetaMask</p>
                      <p className="text-sm font-mono text-muted-foreground">{shortenAddress(account)}</p>
                    </div>
                  </div>
                  <Button variant="destructive" size="sm">
                    Disconnect
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-6 bg-muted/30 rounded-lg">
                  <Wallet className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="font-medium text-lg mb-2">No Wallets Connected</p>
                  <p className="text-sm text-muted-foreground text-center mb-4">
                    Connect your cryptocurrency wallet to deposit, withdraw and trade.
                  </p>
                  <Button>
                    Connect Wallet
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Whitelisted Withdrawal Addresses</CardTitle>
              <CardDescription>
                Manage addresses that are approved for withdrawals.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Bitcoin</p>
                    <p className="text-sm font-mono text-muted-foreground">bc1q87e6tq6uuwm7hm7tuj9wy4jkzdkxm4a3cfxjnh</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Remove
                  </Button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Ethereum</p>
                    <p className="text-sm font-mono text-muted-foreground">0x742d35Cc6634C0532925a3b844Bc454e4438f44e</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Remove
                  </Button>
                </div>
                
                <div className="flex justify-end">
                  <Button variant="outline">
                    Add New Address
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
