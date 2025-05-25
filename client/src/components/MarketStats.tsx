import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface CryptoPrice {
  symbol: string;
  price: string;
  change: string;
  icon: React.ReactNode;
}

export default function MarketStats() {
  const [loading, setLoading] = useState(true);
  const [prices, setPrices] = useState<CryptoPrice[]>([]);

  useEffect(() => {
    // Simulate API call to get market prices
    const fetchPrices = async () => {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setPrices([
        {
          symbol: "BTC",
          price: "$42,384.25",
          change: "+1.95%",
          icon: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-amber-500 mr-2 h-5 w-5"
            >
              <path d="M11.767 19.089c4.924.868 6.14-6.025 1.216-6.894m-1.216 6.894L5.86 18.047m5.908 1.042-.347 1.97m1.563-8.864c4.924.869 6.14-6.025 1.215-6.893m-1.215 6.893-3.94-.694m5.155-6.2L8.29 4.26m5.908 1.042.348-1.97M7.48 20.364l3.126-17.727" />
            </svg>
          ),
        },
        {
          symbol: "ETH",
          price: "$2,874.50",
          change: "+3.8%",
          icon: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-indigo-500 mr-2 h-5 w-5"
            >
              <path d="m12 2 7 11-7 4-7-4z" />
              <path d="m5 13 7 4 7-4" />
              <path d="M12 22V2" />
            </svg>
          ),
        },
        {
          symbol: "BNB",
          price: "$380.25",
          change: "-0.52%",
          icon: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-yellow-500 mr-2 h-5 w-5"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M8 12h8" />
              <path d="M12 8v8" />
            </svg>
          ),
        },
      ]);
      
      setLoading(false);
    };
    
    fetchPrices();
  }, []);

  return (
    <Card>
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold text-foreground mb-4">Market Stats</h3>
        
        <div className="space-y-3">
          {loading ? (
            // Loading skeletons
            Array(3)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="flex items-center justify-between p-2">
                  <div className="flex items-center">
                    <Skeleton className="h-6 w-6 mr-2 rounded-full" />
                    <Skeleton className="h-5 w-12" />
                  </div>
                  <div className="text-right">
                    <Skeleton className="h-5 w-24 mb-1" />
                    <Skeleton className="h-4 w-10 ml-auto" />
                  </div>
                </div>
              ))
          ) : (
            // Price data
            prices.map((crypto, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 hover:bg-muted/50 rounded-lg transition-colors"
              >
                <div className="flex items-center">
                  {crypto.icon}
                  <span className="text-foreground">{crypto.symbol}</span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-foreground">{crypto.price}</p>
                  <p className={`text-xs ${
                    crypto.change.startsWith("+") 
                      ? "text-success" 
                      : "text-destructive"
                  }`}>
                    {crypto.change}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
