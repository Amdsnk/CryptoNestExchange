import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useWeb3 } from "@/lib/web3";
import MarketStats from "@/components/MarketStats";
import MarketChart from "@/components/MarketChart";

export default function Exchange() {
  const { toast } = useToast();
  const { isConnected } = useWeb3();
  
  const [orderType, setOrderType] = useState("market");
  const [pair, setPair] = useState("BTC/USDT");
  const [buyAmount, setBuyAmount] = useState("");
  const [buyPrice, setBuyPrice] = useState("");
  const [sellAmount, setSellAmount] = useState("");
  const [sellPrice, setSellPrice] = useState("");
  
  // Current pair price (mock)
  const currentPrice = 42384.25;

  // Set market price for buy/sell
  const handleSetMarketPrice = (side: 'buy' | 'sell') => {
    if (side === 'buy') {
      setBuyPrice(currentPrice.toString());
    } else {
      setSellPrice(currentPrice.toString());
    }
  };

  // Calculate total cost
  const calculateTotal = (amount: string, price: string) => {
    if (!amount || !price) return "0.00";
    return (parseFloat(amount) * parseFloat(price)).toFixed(2);
  };

  // Handle buy order
  const handleBuyOrder = () => {
    if (!isConnected) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to place orders",
        variant: "destructive",
      });
      return;
    }

    if (!buyAmount || parseFloat(buyAmount) <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount to buy",
        variant: "destructive",
      });
      return;
    }

    // For market orders, use current price
    const price = orderType === "market" ? currentPrice : parseFloat(buyPrice);
    
    if (orderType === "limit" && (!buyPrice || parseFloat(buyPrice) <= 0)) {
      toast({
        title: "Invalid price",
        description: "Please enter a valid price for your limit order",
        variant: "destructive",
      });
      return;
    }

    // Simulate order
    toast({
      title: "Buy order placed",
      description: `${orderType.charAt(0).toUpperCase() + orderType.slice(1)} order to buy ${buyAmount} ${pair.split('/')[0]} at ${price.toFixed(2)} ${pair.split('/')[1]}`,
    });

    // Reset form
    setBuyAmount("");
    if (orderType === "limit") {
      setBuyPrice("");
    }
  };

  // Handle sell order
  const handleSellOrder = () => {
    if (!isConnected) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to place orders",
        variant: "destructive",
      });
      return;
    }

    if (!sellAmount || parseFloat(sellAmount) <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount to sell",
        variant: "destructive",
      });
      return;
    }

    // For market orders, use current price
    const price = orderType === "market" ? currentPrice : parseFloat(sellPrice);
    
    if (orderType === "limit" && (!sellPrice || parseFloat(sellPrice) <= 0)) {
      toast({
        title: "Invalid price",
        description: "Please enter a valid price for your limit order",
        variant: "destructive",
      });
      return;
    }

    // Simulate order
    toast({
      title: "Sell order placed",
      description: `${orderType.charAt(0).toUpperCase() + orderType.slice(1)} order to sell ${sellAmount} ${pair.split('/')[0]} at ${price.toFixed(2)} ${pair.split('/')[1]}`,
    });

    // Reset form
    setSellAmount("");
    if (orderType === "limit") {
      setSellPrice("");
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-foreground mb-1">Exchange</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Market Chart - Takes up 2/3 on large screens */}
        <div className="lg:col-span-2">
          <MarketChart />
        </div>
        
        {/* Market Stats - Takes up 1/3 on large screens */}
        <div>
          <MarketStats />
        </div>
      </div>
      
      {/* Trading Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trading Form - Takes up 2/3 on large screens */}
        <Card className="lg:col-span-2">
          <CardContent className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-foreground">Place Order</h3>
              
              <div className="flex space-x-2">
                <Select value={pair} onValueChange={setPair}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BTC/USDT">BTC/USDT</SelectItem>
                    <SelectItem value="ETH/USDT">ETH/USDT</SelectItem>
                    <SelectItem value="BNB/USDT">BNB/USDT</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <Tabs defaultValue="buy" className="w-full">
              <div className="flex justify-between items-center mb-4">
                <TabsList>
                  <TabsTrigger value="buy">Buy</TabsTrigger>
                  <TabsTrigger value="sell">Sell</TabsTrigger>
                </TabsList>
                
                <div className="flex space-x-2">
                  <Button
                    variant={orderType === "market" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setOrderType("market")}
                  >
                    Market
                  </Button>
                  <Button
                    variant={orderType === "limit" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setOrderType("limit")}
                  >
                    Limit
                  </Button>
                </div>
              </div>
              
              <TabsContent value="buy">
                <div className="space-y-4">
                  {/* Price Input (only for limit orders) */}
                  {orderType === "limit" && (
                    <div>
                      <label className="block text-sm font-medium text-muted-foreground mb-2">
                        Price ({pair.split('/')[1]})
                      </label>
                      <div className="flex gap-2">
                        <Input
                          type="number"
                          placeholder="0.00"
                          value={buyPrice}
                          onChange={(e) => setBuyPrice(e.target.value)}
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleSetMarketPrice('buy')}
                          className="whitespace-nowrap"
                        >
                          Market
                        </Button>
                      </div>
                    </div>
                  )}
                  
                  {/* Amount Input */}
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">
                      Amount ({pair.split('/')[0]})
                    </label>
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={buyAmount}
                      onChange={(e) => setBuyAmount(e.target.value)}
                    />
                  </div>
                  
                  {/* Total */}
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">
                      Total ({pair.split('/')[1]})
                    </label>
                    <Input
                      type="text"
                      placeholder="0.00"
                      value={calculateTotal(
                        buyAmount,
                        orderType === "market" ? currentPrice.toString() : buyPrice
                      )}
                      disabled
                    />
                  </div>
                  
                  {/* Buy Button */}
                  <Button 
                    className="w-full bg-success hover:bg-success/90" 
                    onClick={handleBuyOrder}
                  >
                    Buy {pair.split('/')[0]}
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="sell">
                <div className="space-y-4">
                  {/* Price Input (only for limit orders) */}
                  {orderType === "limit" && (
                    <div>
                      <label className="block text-sm font-medium text-muted-foreground mb-2">
                        Price ({pair.split('/')[1]})
                      </label>
                      <div className="flex gap-2">
                        <Input
                          type="number"
                          placeholder="0.00"
                          value={sellPrice}
                          onChange={(e) => setSellPrice(e.target.value)}
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleSetMarketPrice('sell')}
                          className="whitespace-nowrap"
                        >
                          Market
                        </Button>
                      </div>
                    </div>
                  )}
                  
                  {/* Amount Input */}
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">
                      Amount ({pair.split('/')[0]})
                    </label>
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={sellAmount}
                      onChange={(e) => setSellAmount(e.target.value)}
                    />
                  </div>
                  
                  {/* Total */}
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">
                      Total ({pair.split('/')[1]})
                    </label>
                    <Input
                      type="text"
                      placeholder="0.00"
                      value={calculateTotal(
                        sellAmount,
                        orderType === "market" ? currentPrice.toString() : sellPrice
                      )}
                      disabled
                    />
                  </div>
                  
                  {/* Sell Button */}
                  <Button 
                    className="w-full bg-destructive hover:bg-destructive/90" 
                    onClick={handleSellOrder}
                  >
                    Sell {pair.split('/')[0]}
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        
        {/* Order Book / Open Orders - Takes up 1/3 on large screens */}
        <Card>
          <CardContent className="p-4">
            <Tabs defaultValue="orderbook">
              <TabsList className="w-full">
                <TabsTrigger value="orderbook" className="flex-1">Order Book</TabsTrigger>
                <TabsTrigger value="orders" className="flex-1">My Orders</TabsTrigger>
              </TabsList>
              
              <TabsContent value="orderbook" className="mt-4">
                <div className="space-y-2">
                  <div className="grid grid-cols-3 text-xs text-muted-foreground">
                    <div>Price</div>
                    <div className="text-center">Amount</div>
                    <div className="text-right">Total</div>
                  </div>
                  
                  {/* Sell orders (red) */}
                  <div className="space-y-1">
                    {[42400, 42350, 42300, 42250, 42200].map((price, i) => (
                      <div key={`sell-${i}`} className="grid grid-cols-3 text-xs">
                        <div className="text-destructive">{price.toFixed(2)}</div>
                        <div className="text-center">{(Math.random() * 0.5).toFixed(4)}</div>
                        <div className="text-right">{(price * Math.random() * 0.5).toFixed(2)}</div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Current price */}
                  <div className="py-1 text-center text-sm font-medium">
                    <span className="text-primary">{currentPrice.toFixed(2)}</span>
                  </div>
                  
                  {/* Buy orders (green) */}
                  <div className="space-y-1">
                    {[42150, 42100, 42050, 42000, 41950].map((price, i) => (
                      <div key={`buy-${i}`} className="grid grid-cols-3 text-xs">
                        <div className="text-success">{price.toFixed(2)}</div>
                        <div className="text-center">{(Math.random() * 0.5).toFixed(4)}</div>
                        <div className="text-right">{(price * Math.random() * 0.5).toFixed(2)}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="orders" className="mt-4">
                <div className="text-center py-6 text-muted-foreground">
                  {isConnected ? (
                    "You have no open orders"
                  ) : (
                    "Connect wallet to view your orders"
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
