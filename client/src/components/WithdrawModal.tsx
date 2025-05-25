import { useState } from "react";
import { useWeb3 } from "@/lib/web3";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

interface WithdrawModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function WithdrawModal({ open, onOpenChange }: WithdrawModalProps) {
  const { isConnected, sendToken } = useWeb3();
  const { toast } = useToast();
  
  const [currency, setCurrency] = useState("btc");
  const [network, setNetwork] = useState("erc20");
  const [address, setAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock balances for UI demo
  const balances = {
    btc: "0.8942",
    eth: "4.5832",
    usdt: "12,450.00",
  };

  const fees = {
    btc: "0.0005",
    eth: "0.005",
    usdt: "20",
  };

  const handleMaxAmount = () => {
    setAmount(balances[currency as keyof typeof balances]);
  };

  const handleWithdrawal = async () => {
    if (!isConnected) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to proceed with withdrawal",
        variant: "destructive",
      });
      return;
    }

    if (!address) {
      toast({
        title: "Address required",
        description: "Please enter a recipient address",
        variant: "destructive",
      });
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid withdrawal amount",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate withdrawal
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Withdrawal submitted",
        description: `Your withdrawal of ${amount} ${currency.toUpperCase()} is being processed`,
      });
      
      // Reset form and close modal
      setAmount("");
      setAddress("");
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: "Withdrawal failed",
        description: error.message || "Failed to process withdrawal",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Withdraw Crypto</DialogTitle>
        </DialogHeader>

        {/* Currency Selector */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-muted-foreground mb-2">
            Select Currency
          </label>
          <Select value={currency} onValueChange={setCurrency}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="btc">Bitcoin (BTC) - {balances.btc} BTC Available</SelectItem>
              <SelectItem value="eth">Ethereum (ETH) - {balances.eth} ETH Available</SelectItem>
              <SelectItem value="usdt">Tether (USDT) - {balances.usdt} USDT Available</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Network Selector */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-muted-foreground mb-2">
            Select Network
          </label>
          <Select value={network} onValueChange={setNetwork}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="erc20">Ethereum (ERC-20)</SelectItem>
              <SelectItem value="bep20">Binance Smart Chain (BEP-20)</SelectItem>
              <SelectItem value="trc20">Tron (TRC-20)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Withdrawal Address */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-muted-foreground mb-2">
            Withdrawal Address
          </label>
          <Input
            placeholder="Enter recipient address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>

        {/* Amount */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-muted-foreground mb-2">
            Amount
          </label>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <Button
              variant="outline"
              size="sm"
              onClick={handleMaxAmount}
              className="whitespace-nowrap"
            >
              MAX
            </Button>
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-xs text-muted-foreground">
              Available: {balances[currency as keyof typeof balances]} {currency.toUpperCase()}
            </span>
            <span className="text-xs text-muted-foreground">
              Fee: {fees[currency as keyof typeof fees]} {currency.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Warning Message */}
        <Alert variant="warning" className="mb-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Please double-check the withdrawal address. Transactions cannot be reversed once confirmed.
          </AlertDescription>
        </Alert>

        {/* Withdraw Button */}
        <Button
          className="w-full mb-2"
          onClick={handleWithdrawal}
          disabled={isSubmitting || !address || !amount}
        >
          {isSubmitting ? "Processing..." : "Withdraw Now"}
        </Button>

        {/* Cancel Button */}
        <DialogClose asChild>
          <Button variant="outline" className="w-full">
            Cancel
          </Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
