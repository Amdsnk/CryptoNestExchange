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
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface User {
  id: string;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  profileImageUrl: string | null;
  walletAddress: string | null;
  isAdmin: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Balance {
  id: number;
  userId: string;
  currency: string;
  amount: string;
  address: string | null;
}

interface Transaction {
  id: number;
  userId: string;
  type: string;
  amount: string;
  currency: string;
  status: string;
  timestamp: string;
}

interface UserDetailsData {
  user: User;
  balances: Balance[];
  transactions: Transaction[];
}

export default function AdminUserDetail() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [location] = useLocation();
  const userId = location.split("/").pop();
  const [userData, setUserData] = useState<UserDetailsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [editedUser, setEditedUser] = useState<Partial<User>>({});
  const [currentTab, setCurrentTab] = useState("profile");

  useEffect(() => {
    // Check if admin is logged in
    const checkAdminAndLoadData = async () => {
      try {
        const authResponse = await fetch("/api/auth/admin/me", {
          credentials: "include",
        });

        if (!authResponse.ok) {
          throw new Error("Not authenticated as admin");
        }

        // Load user data
        await loadUserData();
      } catch (error) {
        toast({
          title: "Authentication Error",
          description: "You must be logged in as an admin to view this page",
          variant: "destructive",
        });
        navigate("/admin");
      }
    };

    checkAdminAndLoadData();
  }, [navigate, toast, userId]);

  const loadUserData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }

      const data = await response.json();
      setUserData(data);
      setEditedUser({
        firstName: data.user.firstName,
        lastName: data.user.lastName,
        email: data.user.email,
        isAdmin: data.user.isAdmin,
      });
    } catch (error) {
      console.error("Error loading user data:", error);
      toast({
        title: "Data Loading Error",
        description: "Failed to load user details. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setEditedUser((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSaveUser = async () => {
    if (!userData) return;

    setIsSaving(true);
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editedUser),
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to update user");
      }

      const updatedUser = await response.json();
      setUserData((prev) => prev ? { ...prev, user: updatedUser } : null);

      toast({
        title: "User Updated",
        description: "User details have been successfully updated.",
      });
    } catch (error) {
      console.error("Error updating user:", error);
      toast({
        title: "Update Error",
        description: "Failed to update user details. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const formatCurrency = (amount: string) => {
    return parseFloat(amount).toFixed(6);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="animate-pulse text-xl">Loading user data...</div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center">
        <div className="text-xl mb-4">User not found</div>
        <Button onClick={() => navigate("/admin/dashboard")}>
          Back to Dashboard
        </Button>
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
              className="h-10 w-10 text-blue-400"
            >
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold">
              {userData.user.firstName} {userData.user.lastName}
            </h1>
            <p className="text-gray-400">User ID: {userData.user.id}</p>
          </div>
          <div className="ml-auto">
            {userData.user.isAdmin ? (
              <Badge className="bg-red-900/30 text-red-200 border-red-800/50 text-sm px-3 py-1">
                Administrator
              </Badge>
            ) : (
              <Badge className="bg-blue-900/30 text-blue-200 border-blue-800/50 text-sm px-3 py-1">
                Standard User
              </Badge>
            )}
          </div>
        </div>

        <Tabs value={currentTab} onValueChange={setCurrentTab} className="mt-4">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="balances">Balances</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
          </TabsList>
          <TabsContent value="profile">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle>User Profile</CardTitle>
                <CardDescription>View and manage user details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={editedUser.firstName || ""}
                      onChange={(e) => handleInputChange("firstName", e.target.value)}
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={editedUser.lastName || ""}
                      onChange={(e) => handleInputChange("lastName", e.target.value)}
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      value={editedUser.email || ""}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="walletAddress">Wallet Address</Label>
                    <Input
                      id="walletAddress"
                      value={userData.user.walletAddress || "No wallet connected"}
                      disabled
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-2 mt-4">
                  <Checkbox
                    id="isAdmin"
                    checked={!!editedUser.isAdmin}
                    onCheckedChange={(checked) => handleInputChange("isAdmin", !!checked)}
                  />
                  <Label htmlFor="isAdmin" className="text-gray-300">
                    Administrator Status
                  </Label>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <p className="text-sm text-gray-400">Created At</p>
                    <p className="text-white">
                      {new Date(userData.user.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Last Updated</p>
                    <p className="text-white">
                      {new Date(userData.user.updatedAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  className="bg-gradient-to-r from-blue-500 to-violet-600 hover:from-blue-600 hover:to-violet-700"
                  onClick={handleSaveUser}
                  disabled={isSaving}
                >
                  {isSaving ? "Saving Changes..." : "Save Changes"}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="balances">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle>User Balances</CardTitle>
                <CardDescription>View crypto balances for this user</CardDescription>
              </CardHeader>
              <CardContent>
                {userData.balances.length === 0 ? (
                  <div className="text-center py-6 text-gray-400">
                    No crypto balances found for this user
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow className="border-gray-700">
                        <TableHead>Currency</TableHead>
                        <TableHead>Balance</TableHead>
                        <TableHead>Wallet Address</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {userData.balances.map((balance) => (
                        <TableRow key={balance.id} className="border-gray-700">
                          <TableCell>
                            <div className="flex items-center">
                              <Badge
                                className={`mr-2 ${
                                  balance.currency === "BTC"
                                    ? "bg-orange-800/30 text-orange-200"
                                    : balance.currency === "ETH"
                                    ? "bg-purple-800/30 text-purple-200"
                                    : "bg-blue-800/30 text-blue-200"
                                }`}
                              >
                                {balance.currency}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="font-medium text-white">
                              {formatCurrency(balance.amount)}
                            </span>
                          </TableCell>
                          <TableCell>
                            <span className="font-mono text-xs text-gray-300 truncate max-w-xs block">
                              {balance.address || "Not set"}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="transactions">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle>User Transactions</CardTitle>
                <CardDescription>View transaction history for this user</CardDescription>
              </CardHeader>
              <CardContent>
                {userData.transactions.length === 0 ? (
                  <div className="text-center py-6 text-gray-400">
                    No transactions found for this user
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow className="border-gray-700">
                        <TableHead>ID</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {userData.transactions.map((tx) => (
                        <TableRow key={tx.id} className="border-gray-700">
                          <TableCell className="font-mono text-xs">
                            {tx.id}
                          </TableCell>
                          <TableCell>
                            {tx.type === "deposit" ? (
                              <Badge className="bg-green-900/30 text-green-200 border-green-800/50">
                                Deposit
                              </Badge>
                            ) : (
                              <Badge className="bg-orange-900/30 text-orange-200 border-orange-800/50">
                                Withdraw
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            {formatCurrency(tx.amount)} {tx.currency}
                          </TableCell>
                          <TableCell>
                            {tx.status === "completed" ? (
                              <Badge className="bg-green-900/30 text-green-200 border-green-800/50">
                                Completed
                              </Badge>
                            ) : tx.status === "pending" ? (
                              <Badge className="bg-amber-900/30 text-amber-200 border-amber-800/50">
                                Pending
                              </Badge>
                            ) : (
                              <Badge className="bg-red-900/30 text-red-200 border-red-800/50">
                                Failed
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            {new Date(tx.timestamp).toLocaleString()}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}