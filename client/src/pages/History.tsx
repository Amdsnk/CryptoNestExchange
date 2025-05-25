import { useState, useEffect } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowDown, ArrowUp, ArrowLeftRight } from "lucide-react";
import { format } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { Transaction } from "@shared/schema";

export default function History() {
  const [transactionType, setTransactionType] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  
  // Fetch transactions from the API
  const { data: transactions, isLoading } = useQuery<Transaction[]>({
    queryKey: ["/api/transactions"],
    queryFn: async () => {
      // Simulate delay for loading state
      await new Promise(resolve => setTimeout(resolve, 1500));
      return [];
    },
  });
  
  // Sample transactions for UI demonstration
  const sampleTransactions = [
    {
      id: 1,
      type: "deposit",
      currency: "BTC",
      amount: "0.0045",
      status: "completed",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      to: "",
      from: "bc1q87e6tq6uuwm7hm7tuj9wy4jkzdkxm4a3cfxjnh",
      network: "Bitcoin",
      txHash: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
      usdValue: "186.54"
    },
    {
      id: 2,
      type: "withdrawal",
      currency: "ETH",
      amount: "1.25",
      status: "completed",
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      to: "0xd8da6bf26964af9d7eed9e03e53415d37aa96045",
      from: "",
      network: "ERC20",
      txHash: "0x5a77d93e2c1abc084eaaa5b245efd4cde8b2d93faa0e391b76fc07a8a92ff533",
      usdValue: "2,374.50"
    },
    {
      id: 3,
      type: "exchange",
      currency: "BTC",
      amount: "0.035",
      status: "completed",
      timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      to: "",
      from: "",
      network: "",
      txHash: "",
      usdValue: "1,480.21"
    },
    {
      id: 4,
      type: "deposit",
      currency: "USDT",
      amount: "5,000",
      status: "completed",
      timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      to: "",
      from: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
      network: "BEP20",
      txHash: "0x3a54f5c9b29e0a431c1c6860e4ea9859c3476c7c",
      usdValue: "5,000.00"
    },
    {
      id: 5,
      type: "withdrawal",
      currency: "BNB",
      amount: "2.5",
      status: "pending",
      timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
      to: "0x3a54f5c9b29e0a431c1c6860e4ea9859c3476c7c",
      from: "",
      network: "BEP20",
      txHash: "Processing...",
      usdValue: "950.25"
    },
    {
      id: 6,
      type: "exchange",
      currency: "ETH",
      amount: "2.75",
      status: "completed",
      timestamp: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      to: "",
      from: "",
      network: "",
      txHash: "",
      usdValue: "6,230.85"
    },
    {
      id: 7,
      type: "withdrawal",
      currency: "USDT",
      amount: "2,500",
      status: "failed",
      timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
      to: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
      from: "",
      network: "TRC20",
      txHash: "Failed - Insufficient funds",
      usdValue: "2,500.00"
    }
  ];
  
  // Filter transactions based on type and date
  const filteredTransactions = () => {
    let result = sampleTransactions;
    
    // Filter by transaction type
    if (transactionType !== "all") {
      result = result.filter(tx => tx.type === transactionType);
    }
    
    // Filter by date
    const now = new Date();
    if (dateFilter === "today") {
      const startOfDay = new Date(now.setHours(0, 0, 0, 0));
      result = result.filter(tx => new Date(tx.timestamp) >= startOfDay);
    } else if (dateFilter === "week") {
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - 7);
      result = result.filter(tx => new Date(tx.timestamp) >= startOfWeek);
    } else if (dateFilter === "month") {
      const startOfMonth = new Date(now);
      startOfMonth.setDate(now.getDate() - 30);
      result = result.filter(tx => new Date(tx.timestamp) >= startOfMonth);
    }
    
    return result;
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "MMM dd, yyyy HH:mm");
  };

  // Get status badge variant
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge variant="success">Completed</Badge>;
      case "pending":
        return <Badge variant="outline">Pending</Badge>;
      case "failed":
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Get transaction icon
  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "deposit":
        return (
          <div className="w-8 h-8 rounded-full bg-success/20 flex items-center justify-center">
            <ArrowDown className="h-4 w-4 text-success" />
          </div>
        );
      case "withdrawal":
        return (
          <div className="w-8 h-8 rounded-full bg-warning/20 flex items-center justify-center">
            <ArrowUp className="h-4 w-4 text-warning" />
          </div>
        );
      case "exchange":
        return (
          <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center">
            <ArrowLeftRight className="h-4 w-4 text-indigo-500" />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-foreground">Transaction History</h2>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <CardTitle>Your Transactions</CardTitle>
            <div className="flex flex-wrap gap-2">
              <Select value={transactionType} onValueChange={setTransactionType}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Transaction Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="deposit">Deposits</SelectItem>
                  <SelectItem value="withdrawal">Withdrawals</SelectItem>
                  <SelectItem value="exchange">Exchanges</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Date Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">Last 7 Days</SelectItem>
                  <SelectItem value="month">Last 30 Days</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList className="mb-4">
              <TabsTrigger value="all">All Transactions</TabsTrigger>
              <TabsTrigger value="deposits">Deposits</TabsTrigger>
              <TabsTrigger value="withdrawals">Withdrawals</TabsTrigger>
              <TabsTrigger value="exchanges">Exchanges</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all">
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[80px]">Type</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Asset</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Network</TableHead>
                      <TableHead className="hidden md:table-cell">Transaction ID</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      // Loading skeleton
                      Array(5).fill(0).map((_, i) => (
                        <TableRow key={i}>
                          <TableCell><Skeleton className="h-8 w-8 rounded-full" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                          <TableCell className="hidden md:table-cell"><Skeleton className="h-4 w-32" /></TableCell>
                          <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                        </TableRow>
                      ))
                    ) : filteredTransactions().length > 0 ? (
                      filteredTransactions().map((tx) => (
                        <TableRow key={tx.id}>
                          <TableCell>{getTransactionIcon(tx.type)}</TableCell>
                          <TableCell>{formatDate(tx.timestamp)}</TableCell>
                          <TableCell>{tx.currency}</TableCell>
                          <TableCell className="font-medium">
                            {tx.type === "deposit" ? "+" : tx.type === "withdrawal" ? "-" : ""}
                            {tx.amount} {tx.currency}
                            <div className="text-xs text-muted-foreground">${tx.usdValue}</div>
                          </TableCell>
                          <TableCell>{tx.network || "-"}</TableCell>
                          <TableCell className="hidden md:table-cell font-mono text-xs">
                            {tx.txHash ? (
                              <span className="truncate block max-w-[200px]" title={tx.txHash}>
                                {tx.txHash}
                              </span>
                            ) : (
                              "-"
                            )}
                          </TableCell>
                          <TableCell>{getStatusBadge(tx.status)}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center">
                          No transactions found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            {/* Tab content for specific transaction types - using the same structure as the "all" tab */}
            <TabsContent value="deposits">
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[80px]">Type</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Asset</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Network</TableHead>
                      <TableHead className="hidden md:table-cell">Transaction ID</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      Array(3).fill(0).map((_, i) => (
                        <TableRow key={i}>
                          <TableCell><Skeleton className="h-8 w-8 rounded-full" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                          <TableCell className="hidden md:table-cell"><Skeleton className="h-4 w-32" /></TableCell>
                          <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                        </TableRow>
                      ))
                    ) : sampleTransactions.filter(tx => tx.type === "deposit").length > 0 ? (
                      sampleTransactions
                        .filter(tx => tx.type === "deposit")
                        .map((tx) => (
                          <TableRow key={tx.id}>
                            <TableCell>{getTransactionIcon(tx.type)}</TableCell>
                            <TableCell>{formatDate(tx.timestamp)}</TableCell>
                            <TableCell>{tx.currency}</TableCell>
                            <TableCell className="font-medium">
                              +{tx.amount} {tx.currency}
                              <div className="text-xs text-muted-foreground">${tx.usdValue}</div>
                            </TableCell>
                            <TableCell>{tx.network || "-"}</TableCell>
                            <TableCell className="hidden md:table-cell font-mono text-xs">
                              {tx.txHash ? (
                                <span className="truncate block max-w-[200px]" title={tx.txHash}>
                                  {tx.txHash}
                                </span>
                              ) : (
                                "-"
                              )}
                            </TableCell>
                            <TableCell>{getStatusBadge(tx.status)}</TableCell>
                          </TableRow>
                        ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center">
                          No deposit transactions found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="withdrawals">
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[80px]">Type</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Asset</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Network</TableHead>
                      <TableHead className="hidden md:table-cell">Transaction ID</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      Array(3).fill(0).map((_, i) => (
                        <TableRow key={i}>
                          <TableCell><Skeleton className="h-8 w-8 rounded-full" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                          <TableCell className="hidden md:table-cell"><Skeleton className="h-4 w-32" /></TableCell>
                          <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                        </TableRow>
                      ))
                    ) : sampleTransactions.filter(tx => tx.type === "withdrawal").length > 0 ? (
                      sampleTransactions
                        .filter(tx => tx.type === "withdrawal")
                        .map((tx) => (
                          <TableRow key={tx.id}>
                            <TableCell>{getTransactionIcon(tx.type)}</TableCell>
                            <TableCell>{formatDate(tx.timestamp)}</TableCell>
                            <TableCell>{tx.currency}</TableCell>
                            <TableCell className="font-medium">
                              -{tx.amount} {tx.currency}
                              <div className="text-xs text-muted-foreground">${tx.usdValue}</div>
                            </TableCell>
                            <TableCell>{tx.network || "-"}</TableCell>
                            <TableCell className="hidden md:table-cell font-mono text-xs">
                              {tx.txHash ? (
                                <span className="truncate block max-w-[200px]" title={tx.txHash}>
                                  {tx.txHash}
                                </span>
                              ) : (
                                "-"
                              )}
                            </TableCell>
                            <TableCell>{getStatusBadge(tx.status)}</TableCell>
                          </TableRow>
                        ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center">
                          No withdrawal transactions found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="exchanges">
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[80px]">Type</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Asset</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Network</TableHead>
                      <TableHead className="hidden md:table-cell">Transaction ID</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      Array(3).fill(0).map((_, i) => (
                        <TableRow key={i}>
                          <TableCell><Skeleton className="h-8 w-8 rounded-full" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                          <TableCell className="hidden md:table-cell"><Skeleton className="h-4 w-32" /></TableCell>
                          <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                        </TableRow>
                      ))
                    ) : sampleTransactions.filter(tx => tx.type === "exchange").length > 0 ? (
                      sampleTransactions
                        .filter(tx => tx.type === "exchange")
                        .map((tx) => (
                          <TableRow key={tx.id}>
                            <TableCell>{getTransactionIcon(tx.type)}</TableCell>
                            <TableCell>{formatDate(tx.timestamp)}</TableCell>
                            <TableCell>{tx.currency}</TableCell>
                            <TableCell className="font-medium">
                              {tx.amount} {tx.currency}
                              <div className="text-xs text-muted-foreground">${tx.usdValue}</div>
                            </TableCell>
                            <TableCell>{tx.network || "-"}</TableCell>
                            <TableCell className="hidden md:table-cell font-mono text-xs">
                              {tx.txHash ? (
                                <span className="truncate block max-w-[200px]" title={tx.txHash}>
                                  {tx.txHash}
                                </span>
                              ) : (
                                "-"
                              )}
                            </TableCell>
                            <TableCell>{getStatusBadge(tx.status)}</TableCell>
                          </TableRow>
                        ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center">
                          No exchange transactions found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
