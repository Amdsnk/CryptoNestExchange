import { Link, useLocation } from "wouter";
import { useAuth } from "@/lib/auth";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  LayoutDashboard, 
  ArrowLeftRight, 
  Wallet, 
  History, 
  Settings, 
  X 
} from "lucide-react";

interface SidebarProps {
  onClose?: () => void;
}

export default function Sidebar({ onClose }: SidebarProps) {
  const [location] = useLocation();
  const { user, logout } = useAuth();

  const getInitials = (name: string) => {
    const names = name.split(' ');
    return names.map(n => n[0]).join('').toUpperCase();
  };

  const firstName = user?.firstName || '';
  const lastName = user?.lastName || '';
  const fullName = `${firstName} ${lastName}`.trim();
  const initials = fullName ? getInitials(fullName) : 'U';

  return (
    <div className="flex h-full flex-col bg-sidebar">
      {/* Logo */}
      <div className="p-4 flex items-center justify-between border-b border-sidebar-border">
        <div className="text-2xl font-bold text-sidebar-foreground flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-6 w-6 mr-2 text-primary"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" />
            <path d="M12 18V6" />
          </svg>
          <span>CryptoNest</span>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="md:hidden text-sidebar-foreground focus:outline-none"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        <ul>
          <li>
            <Link 
              href="/dashboard"
              className={`sidebar-item flex items-center px-4 py-3 text-sidebar-foreground ${
                location === "/dashboard" 
                  ? "bg-primary bg-opacity-10 border-l-2 border-primary" 
                  : ""
              }`}
            >
              <LayoutDashboard className="mr-3 h-5 w-5" />
              <span>Dashboard</span>
            </Link>
          </li>
          <li>
            <Link 
              href="/exchange"
              className={`sidebar-item flex items-center px-4 py-3 text-sidebar-foreground ${
                location === "/exchange"
                  ? "bg-primary bg-opacity-10 border-l-2 border-primary" 
                  : ""
              }`}
            >
              <ArrowLeftRight className="mr-3 h-5 w-5" />
              <span>Exchange</span>
            </Link>
          </li>
          <li>
            <Link 
              href="/wallets"
              className={`sidebar-item flex items-center px-4 py-3 text-sidebar-foreground ${
                location === "/wallets" 
                  ? "bg-primary bg-opacity-10 border-l-2 border-primary" 
                  : ""
              }`}
            >
              <Wallet className="mr-3 h-5 w-5" />
              <span>Wallets</span>
            </Link>
          </li>
          <li>
            <Link 
              href="/history"
              className={`sidebar-item flex items-center px-4 py-3 text-sidebar-foreground ${
                location === "/history"
                  ? "bg-primary bg-opacity-10 border-l-2 border-primary" 
                  : ""
              }`}
            >
              <History className="mr-3 h-5 w-5" />
              <span>History</span>
            </Link>
          </li>
          <li>
            <Link 
              href="/settings"
              className={`sidebar-item flex items-center px-4 py-3 text-sidebar-foreground ${
                location === "/settings"
                  ? "bg-primary bg-opacity-10 border-l-2 border-primary" 
                  : ""
              }`}
            >
              <Settings className="mr-3 h-5 w-5" />
              <span>Settings</span>
            </Link>
          </li>
        </ul>
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center">
          <Avatar>
            <AvatarFallback className="bg-primary text-white">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="ml-3">
            <p className="text-sm font-medium text-sidebar-foreground">
              {fullName || "Guest User"}
            </p>
            <p className="text-xs text-sidebar-foreground/70">
              {user?.email || "guest@example.com"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
