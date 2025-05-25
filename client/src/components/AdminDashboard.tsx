import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { adminApi } from "@/lib/adminApi";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface AdminUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string | null;
  isAdmin: boolean;
  createdAt: string;
}

interface Transaction {
  id: number;
  userId: string;
  type: string;
  amount: string;
  currency: string;
  status: string;
  timestamp: string;
  txHash: string | null;
  to: string | null;
  from: string | null;
  address: string | null;
  network: string | null;
  isApproving?: boolean;
}

export default function AdminDashboard() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentTab, setCurrentTab] = useState("overview");
  const [adminStats, setAdminStats] = useState({
    totalUsers: 0,
    totalTransactions: 0,
    depositVolume: 0,
    withdrawalVolume: 0,
    pendingTransactions: 0
  });

  useEffect(() => {
    // Check if admin is logged in and load data
    const checkAdminAndLoadData = async () => {
      try {
        // Check admin authentication first
        const authResponse = await fetch('/api/auth/me', {
          credentials: 'include'
        });
        
        if (!authResponse.ok) {
          navigate("/admin");
          return;
        }
        
        const user = await authResponse.json();
        if (!user || !user.isAdmin) {
          navigate("/admin");
          return;
        }
        
        // Load admin data if authentication successful
        loadDashboardData();
      } catch (error) {
        console.error('Admin auth check failed:', error);
        navigate("/admin");
      }
    };

    checkAdminAndLoadData();
  }, [navigate]);

  const handleApproveTransaction = async (transactionId: number) => {
    try {
      // Show loading indicator for this transaction
      setTransactions(prevTransactions => 
        prevTransactions.map(tx => 
          tx.id === transactionId ? { ...tx, isApproving: true } : tx
        )
      );
      
      // Call the API endpoint to approve the transaction
      const response = await fetch(`/api/admin/transactions/${transactionId}/approve`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to approve transaction: ${response.status}`);
      }
      
      // Show success message
      toast({
        title: 'Transaction Approved',
        description: 'The transaction has been successfully approved.',
        variant: 'default',
      });
      
      // Refresh dashboard data to reflect changes
      loadDashboardData();
    } catch (error) {
      console.error('Error approving transaction:', error);
      toast({
        title: 'Error',
        description: 'Failed to approve transaction. Please try again.',
        variant: 'destructive',
      });
      
      // Reset loading state
      setTransactions(prevTransactions => 
        prevTransactions.map(tx => 
          tx.id === transactionId ? { ...tx, isApproving: false } : tx
        )
      );
    }
  };

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      // Use the new consolidated dashboard endpoint for better Vercel performance
      const response = await fetch('/api/admin/dashboard', {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to load dashboard data: ${response.status}`);
      }

      const data = await response.json();
      
      // Update state with the loaded data
      setAdminStats(data.stats);
      setUsers(data.users || []);
      setTransactions(data.transactions || []);
      
    } catch (error) {
      console.error('Error loading admin data:', error);
      toast({
        title: 'Error Loading Dashboard',
        description: 'Failed to load admin dashboard data. Please try again.',
        variant: 'destructive',
      });
      
      // Set empty arrays if API fails
      setUsers([]);
      setTransactions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    navigate("/admin");
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
  };

  const handleViewUserDetails = (userId: string) => {
    navigate(`/admin/users/${userId}`);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900/90 backdrop-blur">
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
              onClick={handleLogout}
              variant="outline" 
              size="sm" 
              className="border-gray-700"
            >
              Logout
            </Button>
          </div>
        </div>
      </header>
      
      <main className="flex-1 p-6">
        <Tabs defaultValue="overview" 
          value={currentTab} 
          onValueChange={setCurrentTab}
          className="space-y-4"
        >
          <TabsList className="bg-gray-800 border-gray-700">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium">Total Users</CardTitle>
                  <CardDescription>All registered user accounts</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-blue-400">{adminStats.totalUsers || users.length}</div>
                </CardContent>
              </Card>
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium">Transactions</CardTitle>
                  <CardDescription>All platform transactions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-green-400">{adminStats.totalTransactions || transactions.length}</div>
                </CardContent>
              </Card>
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium">Pending Approvals</CardTitle>
                  <CardDescription>Transactions requiring approval</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-amber-400">
                    {adminStats.pendingTransactions || transactions.filter(t => t.status === "pending").length}
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium">Deposit Volume</CardTitle>
                  <CardDescription>Total deposits processed</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-emerald-400">
                    {adminStats.depositVolume ? `$${adminStats.depositVolume.toFixed(2)}` : "$0.00"}
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium">Withdrawal Volume</CardTitle>
                  <CardDescription>Total withdrawals processed</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-violet-400">
                    {adminStats.withdrawalVolume ? `$${adminStats.withdrawalVolume.toFixed(2)}` : "$0.00"}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="users">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>
                  View and manage platform users
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-700">
                      <TableHead>ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Date Joined</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id} className="border-gray-700">
                        <TableCell className="font-mono text-xs">{user.id.substring(0, 8)}...</TableCell>
                        <TableCell>{user.firstName} {user.lastName}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</TableCell>
                        <TableCell>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="h-8 border-gray-700"
                            onClick={() => handleViewUserDetails(user.id)}
                          >
                            View Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="transactions">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle>Transaction Management</CardTitle>
                <CardDescription>
                  View and approve pending transactions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-700">
                      <TableHead>ID</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Currency</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.map((tx) => (
                      <TableRow key={tx.id} className="border-gray-700">
                        <TableCell>{tx.id}</TableCell>
                        <TableCell className="font-mono text-xs">{tx.userId.substring(0, 8)}...</TableCell>
                        <TableCell>
                          {tx.type === "deposit" && "Deposit"}
                          {tx.type === "withdraw" && "Withdrawal"}
                          {tx.type === "exchange" && "Exchange"}
                        </TableCell>
                        <TableCell>{tx.amount}</TableCell>
                        <TableCell>{tx.currency}</TableCell>
                        <TableCell>
                          {tx.status === "completed" ? (
                            <Badge className="bg-green-900/30 text-green-300 border-green-800/50">Completed</Badge>
                          ) : tx.status === "failed" ? (
                            <Badge className="bg-red-900/30 text-red-300 border-red-800/50">Failed</Badge>
                          ) : (
                            <Badge className="bg-amber-900/30 text-amber-200 border-amber-800/50">Pending</Badge>
                          )}
                        </TableCell>
                        <TableCell>{new Date(tx.timestamp).toLocaleString()}</TableCell>
                        <TableCell>
                          {tx.status === "pending" ? (
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="h-8 border-green-700 text-green-400 hover:text-green-300 hover:bg-green-900/20"
                              onClick={() => handleApproveTransaction(tx.id)}
                              disabled={tx.isApproving}
                            >
                              {tx.isApproving ? "Processing..." : "Approve"}
                            </Button>
                          ) : (
                            <Button size="sm" variant="outline" className="h-8 border-gray-700">
                              Details
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}