import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { 
  ArrowDown, 
  ArrowUp, 
  ArrowLeftRight 
} from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { Transaction } from "@shared/schema";

export default function TransactionHistory() {
  const [isLoading, setIsLoading] = useState(true);
  const [transactions, setTransactions] = useState<any[]>([]);

  // Use mock data for demo
  useEffect(() => {
    const timer = setTimeout(() => {
      setTransactions(sampleTransactions);
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  // Sample transactions for UI demo
  const sampleTransactions = [
    {
      id: 1,
      type: "deposit",
      currency: "BTC",
      amount: "0.0045",
      status: "completed",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      usdAmount: "186.54",
    },
    {
      id: 2,
      type: "withdrawal",
      currency: "ETH",
      amount: "1.25",
      status: "completed",
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      usdAmount: "2,374.50",
    },
    {
      id: 3,
      type: "exchange",
      currency: "BTC",
      amount: "0.035",
      status: "completed",
      timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      usdAmount: "1,480.21",
    },
    {
      id: 4,
      type: "deposit",
      currency: "USDT",
      amount: "5,000",
      status: "completed",
      timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      usdAmount: "5,000.00",
    },
  ];

  // Format transaction date
  const formatTransactionDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === now.toDateString()) {
      return formatDistanceToNow(date, { addSuffix: true });
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return format(date, "MMM d, yyyy");
    }
  };

  // Get icon for transaction type
  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "deposit":
        return (
          <div className="w-10 h-10 rounded-full bg-success/20 flex items-center justify-center mr-3">
            <ArrowDown className="h-5 w-5 text-success" />
          </div>
        );
      case "withdrawal":
        return (
          <div className="w-10 h-10 rounded-full bg-warning/20 flex items-center justify-center mr-3">
            <ArrowUp className="h-5 w-5 text-warning" />
          </div>
        );
      case "exchange":
        return (
          <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center mr-3">
            <ArrowLeftRight className="h-5 w-5 text-indigo-500" />
          </div>
        );
      default:
        return null;
    }
  };

  // Get transaction description
  const getTransactionDescription = (tx: any) => {
    switch (tx.type) {
      case "deposit":
        return `Deposit ${tx.currency}`;
      case "withdrawal":
        return `Withdraw ${tx.currency}`;
      case "exchange":
        return `Exchange ${tx.fromCurrency || tx.currency} to ${tx.toCurrency || "USDT"}`;
      default:
        return "Transaction";
    }
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Recent Transactions</h3>
          <a href="/history" className="text-sm text-primary hover:text-primary/80">
            View All
          </a>
        </div>
        
        <div className="space-y-3">
          {isLoading ? (
            // Loading skeletons
            Array(4)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="flex items-center p-2">
                  <Skeleton className="w-10 h-10 rounded-full mr-3" />
                  <div className="flex-1">
                    <Skeleton className="h-5 w-24 mb-1" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                  <div className="text-right">
                    <Skeleton className="h-5 w-20 mb-1" />
                    <Skeleton className="h-4 w-12 ml-auto" />
                  </div>
                </div>
              ))
          ) : (
            // Display transactions data
            transactions.map((tx: any) => (
              <div key={tx.id} className="flex items-center p-2 hover:bg-muted/50 rounded-lg transition-colors">
                {getTransactionIcon(tx.type)}
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">
                    {getTransactionDescription(tx)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatTransactionDate(tx.timestamp)}
                  </p>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-medium ${
                    tx.type === "deposit" 
                      ? "text-success" 
                      : tx.type === "withdrawal" 
                        ? "text-destructive" 
                        : "text-foreground"
                  }`}>
                    {tx.type === "deposit" ? "+" : tx.type === "withdrawal" ? "-" : ""}
                    {tx.amount} {tx.currency}
                  </p>
                  <p className="text-xs text-muted-foreground">${tx.usdAmount}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
