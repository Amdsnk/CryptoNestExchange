import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface UserDetails {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  walletAddress: string;
  createdAt: string;
  lastLoginAt?: string;
}

interface UserTransaction {
  id: number;
  type: string;
  amount: string;
  currency: string;
  status: string;
  timestamp: string;
  txHash?: string;
}

interface UserBalance {
  id: number;
  currency: string;
  amount: string;
  locked: string;
}

export default function VercelUserDetails() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [location] = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<UserDetails | null>(null);
  const [transactions, setTransactions] = useState<UserTransaction[]>([]);
  const [balances, setBalances] = useState<UserBalance[]>([]);

  // Extract user ID from URL
  const userId = location.split('/')[3];

  useEffect(() => {
    // Check if admin is logged in
    const adminUser = localStorage.getItem('adminUser');
    if (!adminUser) {
      navigate("/admin/login-v2");
      return;
    }

    if (userId) {
      loadUserDetails(userId);
    }
  }, [userId, navigate]);

  const loadUserDetails = async (id: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/admin/users/${id}`);
      
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        setTransactions(data.transactions || []);
        setBalances(data.balances || []);
      } else {
        // Fallback mock data based on user ID
        const mockUser: UserDetails = {
          id: id,
          email: `${id}@example.com`,
          firstName: id === "user-1" ? "John" : id === "user-2" ? "Jane" : id === "user-3" ? "Robert" : id === "user-4" ? "Sarah" : "Michael",
          lastName: id === "user-1" ? "Doe" : id === "user-2" ? "Smith" : id === "user-3" ? "Johnson" : id === "user-4" ? "Williams" : "Brown",
          walletAddress: `0x${id.replace('user-', '891')}2AE4d47288283f823E11D8c87C81a3829B303`,
          createdAt: "2024-12-01T00:00:00Z",
          lastLoginAt: "2024-12-20T10:30:00Z"
        };

        const mockTransactions: UserTransaction[] = [
          {
            id: 101,
            type: "deposit",
            currency: "BTC",
            amount: "0.75000000",
            status: "completed",
            timestamp: "2024-12-15T10:30:00Z",
            txHash: "0x3a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b"
          },
          {
            id: 102,
            type: "withdrawal",
            currency: "ETH",
            amount: "1.25000000",
            status: "completed",
            timestamp: "2024-12-10T14:20:00Z",
            txHash: "0x4b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c"
          },
          {
            id: 103,
            type: "exchange",
            currency: "USDT",
            amount: "2500.00",
            status: "pending",
            timestamp: "2024-12-20T16:45:00Z"
          }
        ];

        const mockBalances: UserBalance[] = [
          {
            id: 1,
            currency: "BTC",
            amount: "0.75000000",
            locked: "0.00000000"
          },
          {
            id: 2,
            currency: "ETH",
            amount: "2.50000000",
            locked: "0.00000000"
          },
          {
            id: 3,
            currency: "USDT",
            amount: "1500.00000000",
            locked: "0.00000000"
          }
        ];

        setUser(mockUser);
        setTransactions(mockTransactions);
        setBalances(mockBalances);
      }
    } catch (error) {
      console.error('Error loading user details:', error);
      toast({
        title: "Error",
        description: "Failed to load user details",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToDashboard = () => {
    navigate("/admin/dashboard-v2");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="text-white">Loading user details...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="text-white">User not found</div>
      </div>
    );
  }

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
              onClick={handleBackToDashboard}
              variant="outline" 
              size="sm" 
              className="border-gray-700"
            >
              Back to Dashboard
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <div className="space-y-6">
          {/* User Info */}
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">User Information</CardTitle>
              <CardDescription className="text-gray-400">
                Detailed information for {user.firstName} {user.lastName}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-300">Full Name</label>
                  <p className="text-white">{user.firstName} {user.lastName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-300">Email</label>
                  <p className="text-white">{user.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-300">User ID</label>
                  <p className="text-white font-mono text-sm">{user.id}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-300">Member Since</label>
                  <p className="text-white">{new Date(user.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-gray-300">Wallet Address</label>
                  <p className="text-white font-mono text-sm break-all">{user.walletAddress}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Balances */}
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Account Balances</CardTitle>
              <CardDescription className="text-gray-400">Current cryptocurrency holdings</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-700">
                    <TableHead className="text-gray-300">Currency</TableHead>
                    <TableHead className="text-gray-300">Available</TableHead>
                    <TableHead className="text-gray-300">Locked</TableHead>
                    <TableHead className="text-gray-300">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {balances.map((balance) => (
                    <TableRow key={balance.id} className="border-gray-700">
                      <TableCell className="text-white font-medium">{balance.currency}</TableCell>
                      <TableCell className="text-white">{balance.amount}</TableCell>
                      <TableCell className="text-gray-300">{balance.locked}</TableCell>
                      <TableCell className="text-white font-medium">
                        {(parseFloat(balance.amount) + parseFloat(balance.locked)).toFixed(8)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Transaction History */}
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Transaction History</CardTitle>
              <CardDescription className="text-gray-400">Recent account activity</CardDescription>
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
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}