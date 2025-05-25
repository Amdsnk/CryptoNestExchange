import { useState } from "react";
import { useWeb3 } from "@/lib/web3";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ArrowDown, ArrowUp, RefreshCw } from "lucide-react";
import DepositModal from "@/components/DepositModal";
import WithdrawModal from "@/components/WithdrawModal";
import TransactionHistory from "@/components/TransactionHistory";
import { Skeleton } from "@/components/ui/skeleton";

// Token definitions with their respective icons
const tokens = [
  {
    symbol: "BTC",
    name: "Bitcoin",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-amber-500 h-8 w-8"
      >
        <path d="M11.767 19.089c4.924.868 6.14-6.025 1.216-6.894m-1.216 6.894L5.86 18.047m5.908 1.042-.347 1.97m1.563-8.864c4.924.869 6.14-6.025 1.215-6.893m-1.215 6.893-3.94-.694m5.155-6.2L8.29 4.26m5.908 1.042.348-1.97M7.48 20.364l3.126-17.727" />
      </svg>
    ),
    balance: "0.8942",
    value: "$37,895.67",
    address: "bc1q87e6tq6uuwm7hm7tuj9wy4jkzdkxm4a3cfxjnh",
  },
  {
    symbol: "ETH",
    name: "Ethereum",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-indigo-500 h-8 w-8"
      >
        <path d="m12 2 7 11-7 4-7-4z" />
        <path d="m5 13 7 4 7-4" />
        <path d="M12 22V2" />
      </svg>
    ),
    balance: "4.5832",
    value: "$12,997.71",
    address: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
  },
  {
    symbol: "USDT",
    name: "Tether",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-success h-8 w-8"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v12" />
        <path d="M16 10H8" />
      </svg>
    ),
    balance: "12,450.00",
    value: "$12,450.00",
    address: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
  },
];

export default function Wallets() {
  // Override isConnected for demo purposes
  const { toast } = useToast();
  const [isConnected, setIsConnected] = useState(true); // Force connected state to show data
  const [depositModalOpen, setDepositModalOpen] = useState(false);
  const [withdrawModalOpen, setWithdrawModalOpen] = useState(false);
  const [selectedToken, setSelectedToken] = useState("BTC");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefreshBalances = async () => {
    if (!isConnected) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to refresh balances",
        variant: "destructive",
      });
      return;
    }

    setIsRefreshing(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsRefreshing(false);
      toast({
        title: "Balances refreshed",
        description: "Your wallet balances have been updated",
      });
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-foreground">My Wallets</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefreshBalances}
          disabled={isRefreshing || !isConnected}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Wallet List */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Your Assets</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="crypto">
                <TabsList className="mb-4">
                  <TabsTrigger value="crypto">Crypto</TabsTrigger>
                  <TabsTrigger value="fiat">Fiat</TabsTrigger>
                </TabsList>
                
                <TabsContent value="crypto">
                  <div className="space-y-4">
                    {tokens.map((token) => (
                      <div
                        key={token.symbol}
                        className="flex items-center justify-between p-4 hover:bg-muted rounded-lg transition-colors"
                        onClick={() => setSelectedToken(token.symbol)}
                      >
                        <div className="flex items-center">
                          {token.icon}
                          <div className="ml-4">
                            <p className="font-medium text-foreground">{token.name}</p>
                            <p className="text-sm text-muted-foreground">{token.symbol}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-foreground">{token.balance} {token.symbol}</p>
                          <p className="text-sm text-muted-foreground">{token.value}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="fiat">
                  <div className="text-center py-12 text-muted-foreground">
                    No fiat balances available
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <Button
                className="flex flex-col items-center justify-center h-24"
                variant="outline"
                onClick={() => setDepositModalOpen(true)}
              >
                <ArrowDown className="h-6 w-6 mb-2" />
                <span>Deposit</span>
              </Button>
              <Button
                className="flex flex-col items-center justify-center h-24"
                variant="outline"
                onClick={() => setWithdrawModalOpen(true)}
              >
                <ArrowUp className="h-6 w-6 mb-2" />
                <span>Withdraw</span>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle>{selectedToken} Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isConnected ? (
                <>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Address</p>
                    <p className="text-sm font-mono bg-muted p-2 rounded overflow-x-auto">
                      {tokens.find(t => t.symbol === selectedToken)?.address || "Connect wallet"}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Network</p>
                      <p className="text-sm font-medium">
                        {selectedToken === "BTC" ? "Bitcoin" : "Ethereum"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Status</p>
                      <div className="flex items-center">
                        <div className="w-2 h-2 rounded-full bg-success mr-2"></div>
                        <p className="text-sm font-medium">Active</p>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="py-4">
                  <Skeleton className="h-10 w-full mb-4" />
                  <div className="grid grid-cols-2 gap-4">
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Transaction History */}
      <TransactionHistory />

      {/* Modals */}
      <DepositModal
        open={depositModalOpen}
        onOpenChange={setDepositModalOpen}
      />
      <WithdrawModal
        open={withdrawModalOpen}
        onOpenChange={setWithdrawModalOpen}
      />
    </div>
  );
}
