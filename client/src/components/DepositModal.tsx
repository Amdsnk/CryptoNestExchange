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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Copy, AlertTriangle, QrCode } from "lucide-react";

interface DepositModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function DepositModal({ open, onOpenChange }: DepositModalProps) {
  const { isConnected, account } = useWeb3();
  const { toast } = useToast();
  const [currency, setCurrency] = useState("btc");
  const [network, setNetwork] = useState("erc20");
  const [showQR, setShowQR] = useState(false);

  // Mock deposit address based on selected currency and network
  const getDepositAddress = () => {
    if (!isConnected || !account) return "Connect wallet first";
    
    // In a real app, this would be generated or fetched from the backend
    return account;
  };

  const handleCopyAddress = () => {
    const address = getDepositAddress();
    navigator.clipboard.writeText(address).then(() => {
      toast({
        title: "Address copied",
        description: "Deposit address copied to clipboard",
      });
    });
  };

  const handleShowQRCode = () => {
    setShowQR(!showQR);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Deposit Crypto</DialogTitle>
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
              <SelectItem value="btc">Bitcoin (BTC)</SelectItem>
              <SelectItem value="eth">Ethereum (ETH)</SelectItem>
              <SelectItem value="usdt">Tether (USDT)</SelectItem>
              <SelectItem value="bnb">Binance Coin (BNB)</SelectItem>
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

        {/* Deposit Address */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-muted-foreground mb-2">
            Deposit Address
          </label>
          <div className="bg-muted border rounded-lg p-3">
            <p className="text-foreground break-all font-mono text-sm mb-2">
              {getDepositAddress()}
            </p>
            <div className="flex justify-between">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopyAddress}
                className="text-xs text-primary hover:text-primary/80 flex items-center"
              >
                <Copy className="h-3 w-3 mr-1" />
                Copy Address
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleShowQRCode}
                className="text-xs text-primary hover:text-primary/80 flex items-center"
              >
                <QrCode className="h-3 w-3 mr-1" />
                {showQR ? "Hide QR" : "Show QR"}
              </Button>
            </div>
          </div>
        </div>

        {/* QR Code Display (conditionally shown) */}
        {showQR && (
          <div className="mb-6 flex justify-center">
            <div className="bg-white p-4 rounded-lg">
              {/* In a real app, this would be a QR code component */}
              <div className="w-48 h-48 bg-gray-800 flex items-center justify-center text-white">
                QR Code Placeholder
              </div>
            </div>
          </div>
        )}

        {/* Warning Message */}
        <Alert variant="warning" className="mb-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Please make sure you're sending assets on the correct network. Sending on the wrong
            network may result in permanent loss.
          </AlertDescription>
        </Alert>

        {/* Close Button */}
        <DialogClose asChild>
          <Button variant="outline" className="w-full">
            Close
          </Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
