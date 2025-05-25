import { useState, useEffect } from "react";
import { useWeb3 } from "@/lib/web3";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

export default function BalanceCards() {
  const { isConnected, getBalance } = useWeb3();
  const { toast } = useToast();
  const [balances, setBalances] = useState({
    total: { value: "$45,821.65", change: "+2.3%" },
    btc: { value: "0.4357", change: "+1.8%" },
    eth: { value: "6.2143", change: "+3.2%" },
    usdt: { value: "15,250.00", change: "0.0%" },
  });
  const [loading, setLoading] = useState(false);

  // Fetch balances when wallet is connected
  useEffect(() => {
    if (isConnected) {
      setLoading(true);
      fetchBalances()
        .catch((error) => {
          toast({
            title: "Failed to fetch balances",
            description: error.message,
            variant: "destructive",
          });
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [isConnected]);

  async function fetchBalances() {
    try {
      // In a real app, you would fetch balances for each token from the blockchain
      // Here we're using mock data for demonstration
      
      if (isConnected) {
        // Use random balances for demonstration
        // In a real app, you would use the getBalance function to get actual balances
        const btcBalance = (Math.random() * 2).toFixed(4);
        const ethBalance = (Math.random() * 10).toFixed(4);
        const usdtBalance = (Math.random() * 20000).toFixed(2);
        
        // Calculate total in USD (mock conversion rates)
        const btcInUsd = parseFloat(btcBalance) * 42000;
        const ethInUsd = parseFloat(ethBalance) * 2800;
        const usdtInUsd = parseFloat(usdtBalance);
        const totalInUsd = btcInUsd + ethInUsd + usdtInUsd;
        
        setBalances({
          total: { 
            value: `$${totalInUsd.toFixed(2)}`, 
            change: getRandomChange() 
          },
          btc: { 
            value: btcBalance, 
            change: getRandomChange() 
          },
          eth: { 
            value: ethBalance, 
            change: getRandomChange() 
          },
          usdt: { 
            value: usdtBalance, 
            change: "0.0%" 
          },
        });
      }
    } catch (error) {
      console.error("Error fetching balances:", error);
      throw error;
    }
  }

  function getRandomChange() {
    const isPositive = Math.random() > 0.5;
    const value = (Math.random() * 5).toFixed(1);
    return isPositive ? `+${value}%` : `-${value}%`;
  }

  function getChangeColor(change: string) {
    if (change.startsWith("+")) return "text-success";
    if (change.startsWith("-")) return "text-destructive";
    return "text-muted-foreground";
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Total Balance */}
      <Card className="balance-card">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-muted-foreground text-sm">Total Balance</span>
            <div className="bg-primary/20 rounded-full p-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4 text-primary"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" />
                <path d="M12 18V6" />
              </svg>
            </div>
          </div>
          <div className="flex items-baseline">
            {loading ? (
              <Skeleton className="h-6 w-24" />
            ) : (
              <>
                <h3 className="text-xl font-bold text-foreground">{balances.total.value}</h3>
                <span className={`ml-2 text-xs font-medium ${getChangeColor(balances.total.change)}`}>
                  {balances.total.change}
                </span>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* BTC Balance */}
      <Card className="balance-card">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-muted-foreground text-sm">BTC Balance</span>
            <div className="bg-warning/20 rounded-full p-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4 text-warning"
              >
                <path d="M11.767 19.089c4.924.868 6.14-6.025 1.216-6.894m-1.216 6.894L5.86 18.047m5.908 1.042-.347 1.97m1.563-8.864c4.924.869 6.14-6.025 1.215-6.893m-1.215 6.893-3.94-.694m5.155-6.2L8.29 4.26m5.908 1.042.348-1.97M7.48 20.364l3.126-17.727" />
              </svg>
            </div>
          </div>
          <div className="flex items-baseline">
            {loading ? (
              <Skeleton className="h-6 w-24" />
            ) : (
              <>
                <h3 className="text-xl font-bold text-foreground">{balances.btc.value} BTC</h3>
                <span className={`ml-2 text-xs font-medium ${getChangeColor(balances.btc.change)}`}>
                  {balances.btc.change}
                </span>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* ETH Balance */}
      <Card className="balance-card">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-muted-foreground text-sm">ETH Balance</span>
            <div className="bg-indigo-500/20 rounded-full p-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4 text-indigo-500"
              >
                <path d="m12 2 7 11-7 4-7-4z" />
                <path d="m5 13 7 4 7-4" />
                <path d="M12 22V2" />
              </svg>
            </div>
          </div>
          <div className="flex items-baseline">
            {loading ? (
              <Skeleton className="h-6 w-24" />
            ) : (
              <>
                <h3 className="text-xl font-bold text-foreground">{balances.eth.value} ETH</h3>
                <span className={`ml-2 text-xs font-medium ${getChangeColor(balances.eth.change)}`}>
                  {balances.eth.change}
                </span>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* USDT Balance */}
      <Card className="balance-card">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-muted-foreground text-sm">USDT Balance</span>
            <div className="bg-success/20 rounded-full p-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4 text-success"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v12" />
                <path d="M16 10H8" />
              </svg>
            </div>
          </div>
          <div className="flex items-baseline">
            {loading ? (
              <Skeleton className="h-6 w-24" />
            ) : (
              <>
                <h3 className="text-xl font-bold text-foreground">{balances.usdt.value} USDT</h3>
                <span className={`ml-2 text-xs font-medium ${getChangeColor(balances.usdt.change)}`}>
                  {balances.usdt.change}
                </span>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
