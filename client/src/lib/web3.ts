import { useState, useEffect } from "react";
import Web3 from "web3";
import { ethers, formatEther, formatUnits, parseEther, parseUnits } from "ethers";
import { useToast } from "@/hooks/use-toast";

// ABI for ERC20 tokens
const erc20Abi = [
  {
    constant: true,
    inputs: [{ name: "_owner", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "balance", type: "uint256" }],
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { name: "_to", type: "address" },
      { name: "_value", type: "uint256" },
    ],
    name: "transfer",
    outputs: [{ name: "success", type: "bool" }],
    type: "function",
  },
];

// Token contract addresses - would be configured based on environment in production
const TOKEN_ADDRESSES = {
  USDT: {
    ETH: "0xdAC17F958D2ee523a2206206994597C13D831ec7", // Ethereum Mainnet
    BSC: "0x55d398326f99059fF775485246999027B3197955", // BSC Mainnet
  },
  ETH: {
    ETH: "native",
  },
  BNB: {
    BSC: "native",
  },
};

export interface Web3State {
  isConnected: boolean;
  account: string | null;
  chainId: string | null;
  web3: Web3 | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  getBalance: (tokenSymbol: string, network: string) => Promise<string>;
  sendToken: (
    tokenSymbol: string,
    network: string,
    toAddress: string,
    amount: string
  ) => Promise<string>;
}

export function useWeb3(): Web3State {
  const [web3, setWeb3] = useState<Web3 | null>(null);
  const [account, setAccount] = useState<string | null>(null);
  const [chainId, setChainId] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const { toast } = useToast();

  // Initialize Web3 and check if already connected
  useEffect(() => {
    const checkConnection = async () => {
      if (typeof window.ethereum !== 'undefined') {
        try {
          const web3Instance = new Web3(window.ethereum);
          const accounts = await web3Instance.eth.getAccounts();
          
          if (accounts.length > 0) {
            setWeb3(web3Instance);
            setAccount(accounts[0]);
            const chainId = await web3Instance.eth.getChainId();
            setChainId(`0x${chainId.toString(16)}`);
            setIsConnected(true);
          }
        } catch (error) {
          console.error("Failed to check wallet connection:", error);
        }
      }
    };

    checkConnection();
  }, []);

  // Set up event listeners for account and chain changes
  useEffect(() => {
    if (typeof window.ethereum !== 'undefined') {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          setIsConnected(false);
          setAccount(null);
        } else {
          setAccount(accounts[0]);
          setIsConnected(true);
        }
      };

      const handleChainChanged = (chainId: string) => {
        setChainId(chainId);
        window.location.reload();
      };

      const handleDisconnect = () => {
        setIsConnected(false);
        setAccount(null);
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);
      window.ethereum.on('disconnect', handleDisconnect);

      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
        window.ethereum.removeListener('disconnect', handleDisconnect);
      };
    }
  }, []);

  // Connect to MetaMask wallet
  const connectWallet = async () => {
    if (typeof window.ethereum === 'undefined') {
      toast({
        title: "MetaMask not installed",
        description: "Please install MetaMask browser extension to connect your wallet",
        variant: "destructive",
      });
      return;
    }

    try {
      const web3Instance = new Web3(window.ethereum);
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      });
      
      setWeb3(web3Instance);
      setAccount(accounts[0]);
      
      const chainId = await web3Instance.eth.getChainId();
      setChainId(`0x${chainId.toString(16)}`);
      setIsConnected(true);
      
      toast({
        title: "Wallet connected",
        description: `Connected to ${shortenAddress(accounts[0])}`,
      });
    } catch (error: any) {
      toast({
        title: "Connection failed",
        description: error.message || "Failed to connect to wallet",
        variant: "destructive",
      });
    }
  };

  // Disconnect wallet
  const disconnectWallet = () => {
    setWeb3(null);
    setAccount(null);
    setChainId(null);
    setIsConnected(false);
    
    toast({
      title: "Wallet disconnected",
      description: "Your wallet has been disconnected",
    });
  };

  // Get token balance
  const getBalance = async (tokenSymbol: string, network: string): Promise<string> => {
    if (!web3 || !account) {
      throw new Error("Wallet not connected");
    }

    try {
      const tokenAddress = TOKEN_ADDRESSES[tokenSymbol]?.[network];
      
      if (!tokenAddress) {
        throw new Error(`Unsupported token: ${tokenSymbol} on ${network}`);
      }

      // Handle native tokens (ETH, BNB)
      if (tokenAddress === "native") {
        const balance = await web3.eth.getBalance(account);
        return formatEther(balance);
      }

      // Handle ERC20 tokens
      const contract = new web3.eth.Contract(erc20Abi as any, tokenAddress);
      const balance = await contract.methods.balanceOf(account).call();
      
      // Most tokens use 18 decimals, but some like USDT on Ethereum use 6
      const decimals = tokenSymbol === "USDT" && network === "ETH" ? 6 : 18;
      return formatUnits(balance, decimals);
    } catch (error: any) {
      console.error("Failed to get balance:", error);
      throw new Error(error.message || "Failed to get token balance");
    }
  };

  // Send tokens
  const sendToken = async (
    tokenSymbol: string,
    network: string,
    toAddress: string,
    amount: string
  ): Promise<string> => {
    if (!web3 || !account) {
      throw new Error("Wallet not connected");
    }

    try {
      const tokenAddress = TOKEN_ADDRESSES[tokenSymbol]?.[network];
      
      if (!tokenAddress) {
        throw new Error(`Unsupported token: ${tokenSymbol} on ${network}`);
      }

      // Handle native tokens (ETH, BNB)
      if (tokenAddress === "native") {
        const amountWei = parseEther(amount).toString();
        const tx = await web3.eth.sendTransaction({
          from: account,
          to: toAddress,
          value: amountWei,
        });
        return tx.transactionHash;
      }

      // Handle ERC20 tokens
      const contract = new web3.eth.Contract(erc20Abi as any, tokenAddress);
      
      // Determine token decimals
      const decimals = tokenSymbol === "USDT" && network === "ETH" ? 6 : 18;
      const amountInSmallestUnit = parseUnits(amount, decimals).toString();
      
      const tx = await contract.methods
        .transfer(toAddress, amountInSmallestUnit)
        .send({ from: account });
        
      return tx.transactionHash;
    } catch (error: any) {
      console.error("Transaction failed:", error);
      throw new Error(error.message || "Failed to send tokens");
    }
  };

  return {
    isConnected,
    account,
    chainId,
    web3,
    connectWallet,
    disconnectWallet,
    getBalance,
    sendToken,
  };
}

// Helper function to shorten address
export function shortenAddress(address: string | null): string {
  if (!address) return "";
  return address.slice(0, 6) + "..." + address.slice(-4);
}
