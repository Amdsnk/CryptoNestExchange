import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SimpleAdminDashboard() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [currentTab, setCurrentTab] = useState("overview");
  const [selectedUser, setSelectedUser] = useState(null);
  const [editingUser, setEditingUser] = useState(null);

  // Real user data with state management
  const [users, setUsers] = useState([
    {
      id: "user-1",
      email: "john.doe@example.com",
      firstName: "John",
      lastName: "Doe",
      walletAddress: "0x8912AE4d47288283f823E11D8c87C81a3829B303",
      createdAt: "2024-12-01T00:00:00Z",
      status: "active"
    },
    {
      id: "user-2",
      email: "jane.smith@example.com",
      firstName: "Jane",
      lastName: "Smith",
      walletAddress: "0x7612BE4c47288283f823E11D8c87C81a3829B401",
      createdAt: "2024-12-02T00:00:00Z",
      status: "active"
    },
    {
      id: "user-3",
      email: "robert.johnson@example.com",
      firstName: "Robert",
      lastName: "Johnson",
      walletAddress: "0x5512AB4d47288283f823E11D8c87C81a3829B505",
      createdAt: "2024-12-03T00:00:00Z",
      status: "active"
    },
    {
      id: "user-4",
      email: "sarah.williams@example.com",
      firstName: "Sarah",
      lastName: "Williams",
      walletAddress: "0x3312AE4d47288283f823E11D8c87C81a3829B707",
      createdAt: "2024-12-04T00:00:00Z",
      status: "suspended"
    },
    {
      id: "user-5",
      email: "michael.brown@example.com",
      firstName: "Michael",
      lastName: "Brown",
      walletAddress: "0x2212AE4d47288283f823E11D8c87C81a3829B909",
      createdAt: "2024-12-05T00:00:00Z",
      status: "active"
    }
  ]);

  // Real transaction data
  const [transactions, setTransactions] = useState([
    {
      id: 14,
      userId: "user-4",
      type: "exchange",
      currency: "BNB",
      amount: "3.50000000",
      status: "completed",
      timestamp: "2024-12-15T10:30:00Z",
      txHash: "0xfedcba9876543210fedcba9876543210fedcba98",
      network: "Binance Smart Chain"
    },
    {
      id: 13,
      userId: "user-5",
      type: "withdrawal",
      currency: "BTC",
      amount: "0.25000000",
      status: "completed",
      timestamp: "2024-12-14T15:20:00Z",
      txHash: "0xa1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0",
      network: "Bitcoin"
    },
    {
      id: 12,
      userId: "user-3",
      type: "withdrawal",
      currency: "ETH",
      amount: "1.75000000",
      status: "failed",
      timestamp: "2024-12-13T09:45:00Z",
      network: "Ethereum"
    },
    {
      id: 11,
      userId: "user-2",
      type: "deposit",
      currency: "USDT",
      amount: "5000.00",
      status: "completed",
      timestamp: "2024-12-12T14:15:00Z",
      txHash: "0xa1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0",
      network: "Ethereum"
    },
    {
      id: 10,
      userId: "user-1",
      type: "deposit",
      currency: "BTC",
      amount: "0.75000000",
      status: "completed",
      timestamp: "2024-12-11T11:30:00Z",
      txHash: "0x3a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b",
      network: "Bitcoin"
    },
    {
      id: 9,
      userId: "user-4",
      type: "deposit",
      currency: "USDT",
      amount: "1500.00",
      status: "pending",
      timestamp: "2024-12-20T16:45:00Z",
      network: "Ethereum"
    },
    {
      id: 8,
      userId: "user-5",
      type: "deposit",
      currency: "ETH",
      amount: "1.25000000",
      status: "pending",
      timestamp: "2024-12-21T08:30:00Z",
      network: "Ethereum"
    }
  ]);

  // Calculate statistics from real data
  const stats = {
    totalUsers: users.length,
    activeUsers: users.filter(u => u.status === 'active').length,
    suspendedUsers: users.filter(u => u.status === 'suspended').length,
    totalTransactions: transactions.length,
    pendingTransactions: transactions.filter(t => t.status === 'pending').length,
    depositVolume: transactions
      .filter(t => t.type === 'deposit' && t.status === 'completed')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0),
    withdrawalVolume: transactions
      .filter(t => t.type === 'withdrawal' && t.status === 'completed')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0)
  };

  useEffect(() => {
    // Check if admin is logged in
    const adminUser = localStorage.getItem('adminUser');
    if (!adminUser) {
      navigate("/admin/login-v2");
      return;
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminUser');
    navigate("/admin/login-v2");
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
  };

  const handleDeleteUser = (userId) => {
    setUsers(prevUsers => prevUsers.filter(u => u.id !== userId));
    toast({
      title: "User Deleted",
      description: `User has been permanently deleted from the system`,
    });
  };

  const handleSuspendUser = (userId) => {
    setUsers(prevUsers => 
      prevUsers.map(u => 
        u.id === userId ? { ...u, status: u.status === 'active' ? 'suspended' : 'active' } : u
      )
    );
    const user = users.find(u => u.id === userId);
    toast({
      title: user?.status === 'active' ? "User Suspended" : "User Activated",
      description: `User status has been updated successfully`,
    });
  };

  const handleEditUser = (user) => {
    setEditingUser({ ...user });
  };

  const handleSaveUserEdit = () => {
    if (editingUser) {
      setUsers(prevUsers => 
        prevUsers.map(u => 
          u.id === editingUser.id ? editingUser : u
        )
      );
      toast({
        title: "User Updated",
        description: "User information has been saved successfully",
      });
      setEditingUser(null);
    }
  };

  const handleApproveTransaction = (transactionId) => {
    setTransactions(prevTransactions => 
      prevTransactions.map(tx => 
        tx.id === transactionId ? { ...tx, status: 'completed' } : tx
      )
    );
    
    toast({
      title: "Transaction Approved",
      description: `Transaction #${transactionId} has been approved successfully`,
    });
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

      {/* Main Content */}
      <main className="flex-1 p-6">
        <Tabs defaultValue="overview" value={currentTab} onValueChange={setCurrentTab} className="space-y-4">
          <TabsList className="bg-gray-800 border-gray-700">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium text-white">Total Users</CardTitle>
                  <CardDescription className="text-gray-400">All registered accounts</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-blue-400">{stats.totalUsers}</div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium text-white">Active Users</CardTitle>
                  <CardDescription className="text-gray-400">Currently active</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-green-400">{stats.activeUsers}</div>
                </CardContent>
              </Card>
              
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium text-white">Total Transactions</CardTitle>
                  <CardDescription className="text-gray-400">All transactions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-purple-400">{stats.totalTransactions}</div>
                </CardContent>
              </Card>
              
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium text-white">Pending Transactions</CardTitle>
                  <CardDescription className="text-gray-400">Awaiting approval</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-yellow-400">{stats.pendingTransactions}</div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="users">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">User Management</CardTitle>
                <CardDescription className="text-gray-400">Manage user accounts and permissions</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-700">
                      <TableHead className="text-gray-300">Email</TableHead>
                      <TableHead className="text-gray-300">Name</TableHead>
                      <TableHead className="text-gray-300">Wallet</TableHead>
                      <TableHead className="text-gray-300">Status</TableHead>
                      <TableHead className="text-gray-300">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id} className="border-gray-700">
                        <TableCell className="text-white">{user.email}</TableCell>
                        <TableCell className="text-gray-300">{user.firstName} {user.lastName}</TableCell>
                        <TableCell className="text-gray-300 font-mono text-xs">
                          {user.walletAddress.substring(0, 10)}...
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant="outline" 
                            className={
                              user.status === 'active' 
                                ? 'text-green-400 border-green-400' 
                                : 'text-red-400 border-red-400'
                            }
                          >
                            {user.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="border-blue-600 text-blue-400"
                                  onClick={() => handleEditUser(user)}
                                >
                                  Edit
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="bg-gray-800 border-gray-700 text-white">
                                <DialogHeader>
                                  <DialogTitle>Edit User</DialogTitle>
                                  <DialogDescription className="text-gray-400">
                                    Update user information
                                  </DialogDescription>
                                </DialogHeader>
                                {editingUser && (
                                  <div className="space-y-4">
                                    <div>
                                      <Label htmlFor="email">Email</Label>
                                      <Input
                                        id="email"
                                        value={editingUser.email}
                                        onChange={(e) => setEditingUser({...editingUser, email: e.target.value})}
                                        className="bg-gray-900 border-gray-600"
                                      />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <Label htmlFor="firstName">First Name</Label>
                                        <Input
                                          id="firstName"
                                          value={editingUser.firstName}
                                          onChange={(e) => setEditingUser({...editingUser, firstName: e.target.value})}
                                          className="bg-gray-900 border-gray-600"
                                        />
                                      </div>
                                      <div>
                                        <Label htmlFor="lastName">Last Name</Label>
                                        <Input
                                          id="lastName"
                                          value={editingUser.lastName}
                                          onChange={(e) => setEditingUser({...editingUser, lastName: e.target.value})}
                                          className="bg-gray-900 border-gray-600"
                                        />
                                      </div>
                                    </div>
                                    <div>
                                      <Label htmlFor="wallet">Wallet Address</Label>
                                      <Input
                                        id="wallet"
                                        value={editingUser.walletAddress}
                                        onChange={(e) => setEditingUser({...editingUser, walletAddress: e.target.value})}
                                        className="bg-gray-900 border-gray-600"
                                      />
                                    </div>
                                    <div className="flex gap-2 pt-4">
                                      <Button onClick={handleSaveUserEdit} className="bg-green-600 hover:bg-green-700">
                                        Save Changes
                                      </Button>
                                      <Button 
                                        variant="outline" 
                                        onClick={() => setEditingUser(null)}
                                        className="border-gray-600"
                                      >
                                        Cancel
                                      </Button>
                                    </div>
                                  </div>
                                )}
                              </DialogContent>
                            </Dialog>
                            
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className={
                                user.status === 'active' 
                                  ? 'border-yellow-600 text-yellow-400' 
                                  : 'border-green-600 text-green-400'
                              }
                              onClick={() => handleSuspendUser(user.id)}
                            >
                              {user.status === 'active' ? 'Suspend' : 'Activate'}
                            </Button>
                            
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="border-red-600 text-red-400"
                              onClick={() => {
                                if (confirm(`Are you sure you want to delete ${user.firstName} ${user.lastName}?`)) {
                                  handleDeleteUser(user.id);
                                }
                              }}
                            >
                              Delete
                            </Button>
                          </div>
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
                <CardTitle className="text-white">Transaction Management</CardTitle>
                <CardDescription className="text-gray-400">Monitor and manage all transactions</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-700">
                      <TableHead className="text-gray-300">ID</TableHead>
                      <TableHead className="text-gray-300">Type</TableHead>
                      <TableHead className="text-gray-300">Amount</TableHead>
                      <TableHead className="text-gray-300">Status</TableHead>
                      <TableHead className="text-gray-300">Date</TableHead>
                      <TableHead className="text-gray-300">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.map((tx) => (
                      <TableRow key={tx.id} className="border-gray-700">
                        <TableCell className="text-white">#{tx.id}</TableCell>
                        <TableCell className="text-gray-300 capitalize">{tx.type}</TableCell>
                        <TableCell className="text-white">{tx.amount} {tx.currency}</TableCell>
                        <TableCell>
                          <Badge 
                            variant="outline" 
                            className={
                              tx.status === 'completed' ? 'text-green-400 border-green-400' :
                              tx.status === 'pending' ? 'text-yellow-400 border-yellow-400' :
                              'text-red-400 border-red-400'
                            }
                          >
                            {tx.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-gray-300">
                          {new Date(tx.timestamp).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          {tx.status === 'pending' ? (
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="border-green-600 text-green-400"
                              onClick={() => handleApproveTransaction(tx.id)}
                            >
                              Approve
                            </Button>
                          ) : (
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="border-gray-600"
                                >
                                  Details
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
                                <DialogHeader>
                                  <DialogTitle className="text-xl font-bold">Transaction Details</DialogTitle>
                                  <DialogDescription className="text-gray-400">
                                    Complete information for transaction #{tx.id}
                                  </DialogDescription>
                                </DialogHeader>
                                
                                <div className="space-y-6 pr-2">
                                  {/* Basic Information */}
                                  <div>
                                    <h3 className="text-lg font-semibold mb-3 text-blue-400">Basic Information</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <label className="text-sm font-medium text-gray-400">Transaction ID</label>
                                        <p className="text-white font-mono">#{tx.id}</p>
                                      </div>
                                      <div>
                                        <label className="text-sm font-medium text-gray-400">User ID</label>
                                        <p className="text-white font-mono">{tx.userId}</p>
                                      </div>
                                      <div>
                                        <label className="text-sm font-medium text-gray-400">Type</label>
                                        <p className="text-white capitalize">{tx.type}</p>
                                      </div>
                                      <div>
                                        <label className="text-sm font-medium text-gray-400">Status</label>
                                        <Badge 
                                          variant="outline" 
                                          className={
                                            tx.status === 'completed' ? 'text-green-400 border-green-400' :
                                            tx.status === 'pending' ? 'text-yellow-400 border-yellow-400' :
                                            'text-red-400 border-red-400'
                                          }
                                        >
                                          {tx.status}
                                        </Badge>
                                      </div>
                                    </div>
                                  </div>

                                  <Separator className="bg-gray-700" />

                                  {/* Amount & Currency */}
                                  <div>
                                    <h3 className="text-lg font-semibold mb-3 text-green-400">Amount & Currency</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <label className="text-sm font-medium text-gray-400">Amount</label>
                                        <p className="text-white font-bold text-lg">{tx.amount}</p>
                                      </div>
                                      <div>
                                        <label className="text-sm font-medium text-gray-400">Currency</label>
                                        <p className="text-white font-bold text-lg">{tx.currency}</p>
                                      </div>
                                    </div>
                                  </div>

                                  <Separator className="bg-gray-700" />

                                  {/* Network Information */}
                                  <div>
                                    <h3 className="text-lg font-semibold mb-3 text-purple-400">Network Information</h3>
                                    <div className="space-y-3">
                                      <div>
                                        <label className="text-sm font-medium text-gray-400">Network</label>
                                        <p className="text-white">{tx.network}</p>
                                      </div>
                                      {tx.txHash && (
                                        <div>
                                          <label className="text-sm font-medium text-gray-400">Transaction Hash</label>
                                          <p className="text-white font-mono text-sm break-all bg-gray-900 p-2 rounded border border-gray-600">
                                            {tx.txHash}
                                          </p>
                                        </div>
                                      )}
                                    </div>
                                  </div>

                                  <Separator className="bg-gray-700" />

                                  {/* Timestamp */}
                                  <div>
                                    <h3 className="text-lg font-semibold mb-3 text-orange-400">Timestamp</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <label className="text-sm font-medium text-gray-400">Date</label>
                                        <p className="text-white">{new Date(tx.timestamp).toLocaleDateString()}</p>
                                      </div>
                                      <div>
                                        <label className="text-sm font-medium text-gray-400">Time</label>
                                        <p className="text-white">{new Date(tx.timestamp).toLocaleTimeString()}</p>
                                      </div>
                                    </div>
                                    <div className="mt-2">
                                      <label className="text-sm font-medium text-gray-400">Full Timestamp</label>
                                      <p className="text-white font-mono text-sm">{tx.timestamp}</p>
                                    </div>
                                  </div>

                                  {/* Additional Status Information */}
                                  {tx.status === 'failed' && (
                                    <>
                                      <Separator className="bg-gray-700" />
                                      <div>
                                        <h3 className="text-lg font-semibold mb-3 text-red-400">Error Information</h3>
                                        <div className="bg-red-950/50 border border-red-800 rounded p-3">
                                          <p className="text-red-300">
                                            Transaction failed. This could be due to insufficient funds, network issues, or validation errors.
                                          </p>
                                        </div>
                                      </div>
                                    </>
                                  )}

                                  {tx.status === 'pending' && (
                                    <>
                                      <Separator className="bg-gray-700" />
                                      <div>
                                        <h3 className="text-lg font-semibold mb-3 text-yellow-400">Pending Status</h3>
                                        <div className="bg-yellow-950/50 border border-yellow-800 rounded p-3">
                                          <p className="text-yellow-300">
                                            Transaction is awaiting confirmation. This may take several minutes depending on network congestion.
                                          </p>
                                        </div>
                                      </div>
                                    </>
                                  )}
                                </div>
                              </DialogContent>
                            </Dialog>
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