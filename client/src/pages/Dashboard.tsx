import { useState } from "react";
import { useAuth } from "@/lib/auth";
import BalanceCards from "@/components/BalanceCards";
import MarketChart from "@/components/MarketChart";
import QuickExchange from "@/components/QuickExchange";
import TransactionHistory from "@/components/TransactionHistory";
import MarketStats from "@/components/MarketStats";
import DepositModal from "@/components/DepositModal";
import WithdrawModal from "@/components/WithdrawModal";
import { Card } from "@/components/ui/card";
import { ArrowDown, ArrowUp } from "lucide-react";

export default function Dashboard() {
  const { user } = useAuth();
  const [depositModalOpen, setDepositModalOpen] = useState(false);
  const [withdrawModalOpen, setWithdrawModalOpen] = useState(false);

  return (
    <div>
      {/* Welcome Section */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground mb-1">
          Welcome back, {user?.firstName || "User"}
        </h2>
        <p className="text-muted-foreground">
          Here's what's happening with your account today.
        </p>
      </div>

      {/* Balance Cards */}
      <BalanceCards />

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Market Chart & Trading - Takes up 2/3 on large screens */}
        <div className="lg:col-span-2 space-y-6">
          <MarketChart />
          <QuickExchange />
        </div>

        {/* Right Sidebar - Takes up 1/3 on large screens */}
        <div className="space-y-6">
          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-4">
            {/* Deposit Button */}
            <Card
              className="flex flex-col items-center justify-center p-4 hover:bg-muted cursor-pointer transition-colors"
              onClick={() => setDepositModalOpen(true)}
            >
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mb-2">
                <ArrowDown className="h-5 w-5 text-primary" />
              </div>
              <span className="text-foreground font-medium">Deposit</span>
            </Card>

            {/* Withdraw Button */}
            <Card
              className="flex flex-col items-center justify-center p-4 hover:bg-muted cursor-pointer transition-colors"
              onClick={() => setWithdrawModalOpen(true)}
            >
              <div className="w-10 h-10 rounded-full bg-warning/20 flex items-center justify-center mb-2">
                <ArrowUp className="h-5 w-5 text-warning" />
              </div>
              <span className="text-foreground font-medium">Withdraw</span>
            </Card>
          </div>

          <TransactionHistory />
          <MarketStats />
        </div>
      </div>

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
