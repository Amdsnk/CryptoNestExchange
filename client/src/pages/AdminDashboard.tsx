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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

interface AdminUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string | null;
  isAdmin: boolean;
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
}

export default function AdminDashboard() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentTab, setCurrentTab] = useState("overview");
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [adminStats, setAdminStats] = useState({
    totalUsers: 0,
    totalTransactions: 0,
    depositVolume: 0,
    withdrawalVolume: 0,
    pendingTransactions: 0
  });

  useEffect(() => {
    // Check if admin is logged in
    const checkAdmin = async () => {
      try {
        // Use our robust API client for authentication check
        await adminApi.getCurrentAdmin();
        
        // Load admin data
        loadDashboardData();
      } catch (error) {
        // Error message is automatically shown by the adminApi
        navigate("/admin");
      }
    };

    checkAdmin();
  }, [navigate]);

  // This will be implemented below

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      // Load all data in parallel for better performance
      const [statsData, usersData, transactionsResponse] = await Promise.all([
        adminApi.getStats(),
        adminApi.getUsers(),
        adminApi.getTransactions()
      ]);
      
      // Update state with the loaded data
      setAdminStats(statsData);
      setUsers(usersData);
      
      // Handle the new paginated transaction response format
      if (transactionsResponse && transactionsResponse.data) {
        setTransactions(transactionsResponse.data);
      } else if (Array.isArray(transactionsResponse)) {
        // Handle case where API might return array directly for backwards compatibility
        setTransactions(transactionsResponse);
      }
      
    } catch (error) {
      console.error('Error loading admin data:', error);
      // Error toast is automatically shown by adminApi
      
      // Fallback to empty arrays if API fails
      setUsers([]);
      setTransactions([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle transaction approval
  const handleApproveTransaction = async (transactionId: number) => {
    try {
      // First set the transaction to "approving" state in the UI
      setTransactions(prevTransactions => 
        prevTransactions.map(tx => 
          tx.id === transactionId ? { ...tx, isApproving: true } : tx
        )
      );
      
      // Use the robust API client for better error handling
      const result = await adminApi.approveTransaction(transactionId);
      
      // Update the transaction in the state
      setTransactions(prevTransactions => 
        prevTransactions.map(tx => 
          tx.id === transactionId ? { ...tx, status: "completed", isApproving: false } : tx
        )
      );
      
      // Also update statistics to reflect the newly approved transaction
      try {
        const statsData = await adminApi.getStats();
        setAdminStats(statsData);
      } catch (statsError) {
        // Silent fail for stats refresh - not critical
        console.warn("Failed to refresh stats after transaction approval", statsError);
      }
      
      toast({
        title: "Transaction Approved",
        description: `Transaction #${transactionId} has been approved successfully`,
      });
    } catch (error) {
      console.error("Error approving transaction:", error);
      
      // Remove the loading state in case of error
      setTransactions(prevTransactions => 
        prevTransactions.map(tx => 
          tx.id === transactionId ? { ...tx, isApproving: false } : tx
        )
      );
      
      // Error toast is shown automatically by the adminApi
    }
  };

  const handleLogout = async () => {
    try {
      // Add logout functionality to our admin API client
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      
      toast({
        title: "Logged Out",
        description: "You have been logged out of the admin panel",
      });
      
      // Redirect to login page
      navigate("/admin");
    } catch (error) {
      console.error("Error during logout:", error);
      toast({
        title: "Logout Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive",
      });
    }
  };

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
            <Button 
              onClick={() => navigate("/admin/settings")} 
              variant="outline" 
              size="sm" 
              className="border-gray-700 mr-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4 mr-1"
              >
                <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              Settings
            </Button>
            <Badge variant="outline" className="bg-blue-950/50 text-blue-300 border-blue-800">
              Admin
            </Badge>
            <Button onClick={handleLogout} variant="outline" size="sm" className="border-gray-700">
              Logout
            </Button>
          </div>
        </div>
      </header>
      <main className="container mx-auto p-4 md:p-6">
        <Tabs value={currentTab} onValueChange={setCurrentTab} className="mt-4">
          <TabsList className="grid w-full grid-cols-3 mb-8">
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
                <CardDescription>View and manage registered users</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-700">
                      <TableHead>ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id} className="border-gray-700">
                        <TableCell className="font-mono text-xs">{user.id}</TableCell>
                        <TableCell>{user.firstName} {user.lastName}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          {user.isAdmin ? (
                            <Badge className="bg-red-900/30 text-red-200 border-red-800/50">Admin</Badge>
                          ) : (
                            <Badge className="bg-blue-900/30 text-blue-200 border-blue-800/50">User</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="h-8 border-gray-700"
                            onClick={() => navigate(`/admin/users/${user.id}`)}
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
                <CardTitle>Transaction History</CardTitle>
                <CardDescription>View and manage all platform transactions</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-700">
                      <TableHead>ID</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.map((tx) => (
                      <TableRow key={tx.id} className="border-gray-700">
                        <TableCell className="font-mono text-xs">{tx.id}</TableCell>
                        <TableCell className="font-mono text-xs">{tx.userId}</TableCell>
                        <TableCell>
                          {tx.type === "deposit" ? (
                            <Badge className="bg-green-900/30 text-green-200 border-green-800/50">Deposit</Badge>
                          ) : (
                            <Badge className="bg-orange-900/30 text-orange-200 border-orange-800/50">Withdraw</Badge>
                          )}
                        </TableCell>
                        <TableCell>{tx.amount} {tx.currency}</TableCell>
                        <TableCell>
                          {tx.status === "completed" ? (
                            <Badge className="bg-green-900/30 text-green-200 border-green-800/50">Completed</Badge>
                          ) : (
                            <Badge className="bg-amber-900/30 text-amber-200 border-amber-800/50">Pending</Badge>
                          )}
                        </TableCell>
                        <TableCell>{new Date(tx.timestamp).toLocaleString()}</TableCell>
                        <TableCell>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className={tx.status === "pending" 
                              ? "h-8 border-amber-700 text-amber-400 hover:text-amber-300 hover:bg-amber-900/20"
                              : "h-8 border-gray-700"
                            }
                            onClick={() => {
                              setSelectedTransaction(tx);
                              setDetailsOpen(true);
                            }}
                          >
                            {tx.status === "pending" ? "Review" : "Details"}
                          </Button>
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
      {/* Transaction Details Dialog */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="bg-gray-900 border border-gray-800 text-white max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              Transaction Details
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              View complete information about this transaction
            </DialogDescription>
          </DialogHeader>
          
          {selectedTransaction && (
            <div className="mt-4 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <h3 className="text-xs font-medium text-gray-500">Transaction ID</h3>
                  <p className="mt-1 font-mono text-sm">{selectedTransaction.id}</p>
                </div>
                <div>
                  <h3 className="text-xs font-medium text-gray-500">Date</h3>
                  <p className="mt-1 text-sm">{new Date(selectedTransaction.timestamp).toLocaleString()}</p>
                </div>
                <div>
                  <h3 className="text-xs font-medium text-gray-500">Type</h3>
                  <div className="mt-1">
                    {selectedTransaction.type === "deposit" ? (
                      <Badge className="bg-green-900/30 text-green-200 border-green-800/50">Deposit</Badge>
                    ) : (
                      <Badge className="bg-orange-900/30 text-orange-200 border-orange-800/50">Withdraw</Badge>
                    )}
                  </div>
                </div>
                <div>
                  <h3 className="text-xs font-medium text-gray-500">Status</h3>
                  <div className="mt-1">
                    {selectedTransaction.status === "completed" ? (
                      <Badge className="bg-green-900/30 text-green-200 border-green-800/50">Completed</Badge>
                    ) : (
                      <Badge className="bg-amber-900/30 text-amber-200 border-amber-800/50">Pending</Badge>
                    )}
                  </div>
                </div>
                <div>
                  <h3 className="text-xs font-medium text-gray-500">Amount</h3>
                  <p className="mt-1 text-sm font-medium">
                    {selectedTransaction.amount} {selectedTransaction.currency}
                  </p>
                </div>
                <div>
                  <h3 className="text-xs font-medium text-gray-500">User ID</h3>
                  <p className="mt-1 font-mono text-xs truncate">{selectedTransaction.userId}</p>
                </div>
              </div>
              
              <Separator className="bg-gray-800" />
              
              <div>
                <h3 className="text-sm font-medium mb-2">Blockchain Details</h3>
                <div className="grid grid-cols-2 gap-3">
                  {selectedTransaction.network && (
                    <div>
                      <h3 className="text-xs font-medium text-gray-500">Network</h3>
                      <p className="mt-1 text-sm">{selectedTransaction.network}</p>
                    </div>
                  )}
                  
                  {selectedTransaction.address && (
                    <div>
                      <h3 className="text-xs font-medium text-gray-500">Wallet Address</h3>
                      <p className="mt-1 font-mono text-xs truncate">{selectedTransaction.address}</p>
                    </div>
                  )}
                  
                  {selectedTransaction.txHash && (
                    <div className="col-span-2">
                      <h3 className="text-xs font-medium text-gray-500">Transaction Hash</h3>
                      <p className="mt-1 font-mono text-xs truncate">{selectedTransaction.txHash}</p>
                    </div>
                  )}
                </div>
              </div>
              
              <Separator className="bg-gray-800" />
              
              <div>
                <h3 className="text-sm font-medium mb-2">What Happens During Approval?</h3>
                <div className="space-y-2 text-sm text-gray-300">
                  {selectedTransaction.type === "deposit" ? (
                    <>
                      <p>When you approve a deposit:</p>
                      <ol className="list-decimal list-inside space-y-1 text-sm pl-2">
                        <li>The transaction status is changed from <span className="text-amber-300">pending</span> to <span className="text-green-300">completed</span></li>
                        <li>The user's balance for {selectedTransaction.currency} is increased by {selectedTransaction.amount}</li>
                        <li>If the user doesn't have a {selectedTransaction.currency} balance yet, a new balance record is created</li>
                        <li>The user can now use these funds for trading or withdrawals</li>
                      </ol>
                    </>
                  ) : (
                    <>
                      <p>When you approve a withdrawal:</p>
                      <ol className="list-decimal list-inside space-y-1 text-sm pl-2">
                        <li>The transaction status is changed from <span className="text-amber-300">pending</span> to <span className="text-green-300">completed</span></li>
                        <li>The withdrawal is marked as processed in the blockchain</li>
                        <li>No further action is required as the user's balance was already decreased when they initiated the withdrawal</li>
                      </ol>
                    </>
                  )}
                </div>
              </div>
              
              {selectedTransaction.status === "pending" && (
                <div className="pt-2 flex gap-2">
                  <Button
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                    onClick={() => {
                      handleApproveTransaction(selectedTransaction.id);
                      setDetailsOpen(false);
                    }}
                  >
                    Approve Transaction
                  </Button>
                  <Button
                    className="w-full bg-gray-600 hover:bg-gray-700 text-white"
                    onClick={() => {
                      setDetailsOpen(false);
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}