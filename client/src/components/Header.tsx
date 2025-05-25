import { Button } from "@/components/ui/button";
import { useWeb3 } from "@/lib/web3";
import { useAuth } from "@/lib/auth";
import { Menu, Bell, LogOut, User } from "lucide-react";
import { shortenAddress } from "@/lib/web3";

interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const { connectWallet, disconnectWallet, isConnected, account } = useWeb3();
  const { user, logout } = useAuth();
  
  const pageTitles: { [key: string]: string } = {
    "/": "Dashboard",
    "/exchange": "Exchange",
    "/wallets": "Wallets",
    "/history": "Transaction History",
    "/settings": "Settings",
  };

  // Get current page from path
  const currentPath = window.location.pathname;
  const pageTitle = pageTitles[currentPath] || "Dashboard";

  return (
    <header className="bg-card border-b border-border py-3 px-4 flex items-center justify-between">
      {/* Mobile Menu Toggle */}
      <button
        onClick={onMenuClick}
        className="md:hidden text-foreground focus:outline-none"
      >
        <Menu className="h-6 w-6" />
      </button>

      {/* Page Title */}
      <h1 className="text-lg font-semibold text-foreground md:ml-0">{pageTitle}</h1>

      {/* User and Wallet Actions */}
      <div className="flex items-center space-x-4">
        {/* Notifications */}
        <button className="text-muted-foreground relative p-1 focus:outline-none">
          <Bell className="h-5 w-5" />
          <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-primary"></span>
        </button>

        {/* User Authentication */}
        {!user ? (
          <Button
            size="sm"
            className="hidden md:flex items-center"
            onClick={() => window.location.href = "/login"}
          >
            <User className="h-4 w-4 mr-2" />
            Sign In
          </Button>
        ) : (
          <div className="hidden md:flex items-center text-sm bg-muted text-foreground rounded-lg px-3 py-2">
            <User className="h-4 w-4 mr-2 text-primary" />
            <span className="mr-2 font-medium">
              {user.firstName || 'User'}
            </span>
            <button
              onClick={() => logout()}
              className="text-xs text-muted-foreground hover:text-foreground"
              title="Sign out"
            >
              <LogOut className="h-3 w-3" />
            </button>
          </div>
        )}

        {/* Wallet Connection Button */}
        {!isConnected && user ? (
          <Button
            size="sm"
            variant="outline"
            className="hidden md:flex items-center ml-2"
            onClick={connectWallet}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4 mr-2"
            >
              <path d="M18 8.4c.06.89.09 1.77.09 2.64a19.61 19.61 0 0 1-.37 4.28" />
              <path d="M21 8a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2z" />
              <path d="M6 8V6a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2" />
              <path d="M10 15h.01" />
            </svg>
            Wallet
          </Button>
        ) : (
          <div className="hidden md:flex items-center text-sm bg-muted text-foreground rounded-lg px-3 py-2 ml-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4 mr-2 text-primary"
            >
              <path d="M18 8.4c.06.89.09 1.77.09 2.64a19.61 19.61 0 0 1-.37 4.28" />
              <path d="M21 8a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2z" />
              <path d="M6 8V6a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2" />
              <path d="M10 15h.01" />
            </svg>
            <span className="mr-2 font-medium">{shortenAddress(account)}</span>
            <button
              onClick={disconnectWallet}
              className="text-xs text-muted-foreground hover:text-foreground"
              title="Disconnect wallet"
            >
              <LogOut className="h-3 w-3" />
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
