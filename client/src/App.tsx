import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Layout from "@/components/Layout";
import Dashboard from "@/pages/Dashboard";
import Exchange from "@/pages/Exchange";
import Wallets from "@/pages/Wallets";
import History from "@/pages/History";
import Settings from "@/pages/Settings";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Home from "@/pages/Home";
import Admin from "@/pages/Admin";
import AdminDashboard from "@/pages/AdminDashboard";
import VercelAdminLogin from "@/pages/VercelAdminLogin";
import SimpleAdminDashboard from "@/pages/SimpleAdminDashboard";
import VercelUserDetails from "@/pages/VercelUserDetails";
import AdminUserDetail from "@/pages/AdminUserDetail";
import AdminSettings from "@/pages/AdminSettings";
import { AuthProvider } from "@/lib/auth";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/admin" component={Admin} />
      <Route path="/admin/dashboard" component={AdminDashboard} />
      <Route path="/admin/users/:id" component={AdminUserDetail} />
      <Route path="/admin/settings" component={AdminSettings} />
      <Route path="/admin/login-v2" component={VercelAdminLogin} />
      <Route path="/admin/dashboard-v2" component={SimpleAdminDashboard} />
      <Route path="/admin/users/:id/details" component={VercelUserDetails} />
      <Route path="/dashboard">
        <Layout>
          <Dashboard />
        </Layout>
      </Route>
      <Route path="/exchange">
        <Layout>
          <Exchange />
        </Layout>
      </Route>
      <Route path="/wallets">
        <Layout>
          <Wallets />
        </Layout>
      </Route>
      <Route path="/history">
        <Layout>
          <History />
        </Layout>
      </Route>
      <Route path="/settings">
        <Layout>
          <Settings />
        </Layout>
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
