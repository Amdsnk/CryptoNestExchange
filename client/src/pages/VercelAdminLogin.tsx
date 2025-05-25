import { useState } from "react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function VercelAdminLogin() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [credentials, setCredentials] = useState({
    username: "",
    password: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Direct authentication without server dependency
    if (credentials.username === "admin" && credentials.password === "admin123") {
      const adminUser = {
        id: "admin-user-1",
        email: "admin@cryptonest.com",
        firstName: "Admin",
        lastName: "User",
        isAdmin: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      // Store admin session in localStorage
      localStorage.setItem('adminUser', JSON.stringify(adminUser));
      
      toast({
        title: "Login Successful",
        description: "Welcome to the admin dashboard",
      });
      
      navigate("/admin/dashboard-v2");
    } else {
      toast({
        title: "Login Failed", 
        description: "Invalid admin credentials",
        variant: "destructive",
      });
    }
    
    setIsLoading(false);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-slate-900 to-slate-800 p-4">
      <div className="mx-auto max-w-md w-full">
        <Card className="border-slate-700 bg-slate-900/60 backdrop-blur-sm">
          <CardHeader className="space-y-1 text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="bg-gradient-to-r from-red-400 to-violet-500 p-2 rounded">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6 text-white"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <h1 className="text-xl font-bold text-white">CryptoNest Admin</h1>
            </div>
            <CardTitle className="text-2xl font-bold tracking-tight text-white">
              Admin Login
            </CardTitle>
            <CardDescription className="text-slate-400">
              Secure Administrator Access
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-white">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="admin"
                  value={credentials.username}
                  onChange={(e) => setCredentials(prev => ({ ...prev, username: e.target.value }))}
                  className="bg-slate-800 border-slate-700 text-white"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-white">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={credentials.password}
                  onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                  className="bg-slate-800 border-slate-700 text-white"
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={isLoading}
              >
                {isLoading ? "Logging in..." : "Login"}
              </Button>
            </form>
            <div className="mt-4 text-center">
              <p className="text-sm text-slate-400">
                Production Admin Panel v2.0
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}