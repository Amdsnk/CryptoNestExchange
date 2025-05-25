import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
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

export default function QuickExchange() {
  const { toast } = useToast();
  const { isConnected } = useWeb3();
  
  const [fromCurrency, setFromCurrency] = useState("BTC");
  const [toCurrency, setToCurrency] = useState("USDT");
  const [fromAmount, setFromAmount] = useState("");
  const [toAmount, setToAmount] = useState("");
  
  // Mock exchange rates
  const exchangeRates = {
    "BTC": {
      "USDT": 42384.25,
      "ETH": 14.95,
    },
    "ETH": {
      "USDT": 2835.75,
      "BTC": 0.067,
    },
    "USDT": {
      "BTC": 0.000023,
      "ETH": 0.00035,
    },
  };

  // Calculate to amount when from amount changes
  const handleFromAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFromAmount(value);
    
    if (value && !isNaN(parseFloat(value))) {
      const rate = exchangeRates[fromCurrency][toCurrency];
      setToAmount((parseFloat(value) * rate).toFixed(6));
    } else {
      setToAmount("");
    }
  };

  // Calculate from amount when to amount changes
  const handleToAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setToAmount(value);
    
    if (value && !isNaN(parseFloat(value))) {
      const rate = exchangeRates[fromCurrency][toCurrency];
      setFromAmount((parseFloat(value) / rate).toFixed(6));
    } else {
      setFromAmount("");
    }
  };

  // Handle from currency change
  const handleFromCurrencyChange = (value: string) => {
    if (value === toCurrency) {
      setToCurrency(fromCurrency);
    }
    setFromCurrency(value);
    
    if (fromAmount && !isNaN(parseFloat(fromAmount))) {
      const rate = exchangeRates[value][toCurrency === value ? fromCurrency : toCurrency];
      setToAmount((parseFloat(fromAmount) * rate).toFixed(6));
    }
  };

  // Handle to currency change
  const handleToCurrencyChange = (value: string) => {
    if (value === fromCurrency) {
      setFromCurrency(toCurrency);
    }
    setToCurrency(value);
    
    if (fromAmount && !isNaN(parseFloat(fromAmount))) {
      const rate = exchangeRates[fromCurrency === value ? toCurrency : fromCurrency][value];
      setToAmount((parseFloat(fromAmount) * rate).toFixed(6));
    }
  };

  // Handle exchange button click
  const handleExchange = () => {
    if (!isConnected) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to proceed with the exchange",
        variant: "destructive",
      });
      return;
    }
    
    if (!fromAmount || !toAmount) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount to exchange",
        variant: "destructive",
      });
      return;
    }
    
    // Simulate successful exchange
    toast({
      title: "Exchange successful",
      description: `Exchanged ${fromAmount} ${fromCurrency} for ${toAmount} ${toCurrency}`,
      variant: "default",
    });
    
    // Reset form
    setFromAmount("");
    setToAmount("");
  };

  return (
    <Card>
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold text-foreground mb-4">Quick Exchange</h3>
        
        {/* Trading Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* From Currency */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-muted-foreground">From</label>
            <div className="flex bg-muted/30 border rounded-lg overflow-hidden">
              <Input
                type="number"
                placeholder="0.00"
                value={fromAmount}
                onChange={handleFromAmountChange}
                className="border-0 flex-1 bg-transparent"
              />
              <Select value={fromCurrency} onValueChange={handleFromCurrencyChange}>
                <SelectTrigger className="w-auto border-l bg-muted min-w-[120px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BTC">BTC</SelectItem>
                  <SelectItem value="ETH">ETH</SelectItem>
                  <SelectItem value="USDT">USDT</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* To Currency */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-muted-foreground">To</label>
            <div className="flex bg-muted/30 border rounded-lg overflow-hidden">
              <Input
                type="number"
                placeholder="0.00"
                value={toAmount}
                onChange={handleToAmountChange}
                className="border-0 flex-1 bg-transparent"
              />
              <Select value={toCurrency} onValueChange={handleToCurrencyChange}>
                <SelectTrigger className="w-auto border-l bg-muted min-w-[120px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BTC">BTC</SelectItem>
                  <SelectItem value="ETH">ETH</SelectItem>
                  <SelectItem value="USDT">USDT</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        
        {/* Exchange Rate */}
        <div className="mt-3 text-center">
          <p className="text-sm text-muted-foreground">
            1 {fromCurrency} ≈ {exchangeRates[fromCurrency][toCurrency].toFixed(
              toCurrency === "USDT" ? 2 : 6
            )} {toCurrency}
          </p>
        </div>
        
        {/* Exchange Button */}
        <div className="mt-4">
          <Button 
            className="w-full" 
            onClick={handleExchange}
            disabled={!fromAmount || !toAmount}
          >
            Exchange Now
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
