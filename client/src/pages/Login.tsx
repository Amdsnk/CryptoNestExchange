import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const loginSchema = z.object({
  username: z.string().min(3, {
    message: "Username must be at least 3 characters.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
});

export default function Login() {
  const [, setLocation] = useLocation();
  const { user, login } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isDemoLoading, setIsDemoLoading] = useState(false);

  // Redirect if user is already logged in
  useEffect(() => {
    if (user) {
      setLocation("/dashboard");
    }
  }, [user, setLocation]);

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    setIsLoading(true);
    
    try {
      await login(values.username, values.password);
      toast({
        title: "Login successful",
        description: "Welcome to CryptoNest!",
      });
      setLocation("/dashboard");
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message || "Invalid username or password",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }
  
  async function handleDemoLogin() {
    setIsDemoLoading(true);
    
    try {
      // Create a demo user directly on the client side
      const demoUser = {
        id: "demo-user-123",
        email: "demo@example.com",
        firstName: "Demo",
        lastName: "User",
        profileImageUrl: null,
        walletAddress: null,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      // Use the existing auth login function instead of direct API call
      await login("demouser", "demo123");
      
      toast({
        title: "Demo Login Successful",
        description: "Welcome to the CryptoNest demo account!",
      });
      setLocation("/dashboard");
    } catch (error: any) {
      // Fallback approach if regular login fails
      try {
        // Try our special demo-login endpoint as fallback
        console.log("Trying fallback demo login method...");
        const response = await fetch('/api/auth/demo-login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include'
        });
        
        if (!response.ok) {
          throw new Error("Fallback demo login failed");
        }
        
        await fetch('/api/auth/me', { credentials: 'include' });
        
        toast({
          title: "Demo Login Successful",
          description: "Welcome to the CryptoNest demo account!",
        });
        setLocation("/dashboard");
      } catch (fallbackError) {
        console.error("Demo login error:", error, fallbackError);
        toast({
          title: "Demo Login Failed",
          description: "Could not log in to demo account. Please try again later.",
          variant: "destructive",
        });
      }
    } finally {
      setIsDemoLoading(false);
    }
  }



  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12 bg-gray-900">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full filter blur-3xl"></div>
        <div className="absolute top-40 right-10 w-80 h-80 bg-purple-500/10 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-violet-500/10 rounded-full filter blur-3xl"></div>
      </div>
      
      <Link href="/" className="absolute top-8 left-8 text-white hover:text-gray-300 transition duration-200">
        <div className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          <span className="ml-2">Back to Home</span>
        </div>
      </Link>
      
      <div className="fixed bottom-4 right-4">
        <Link href="/admin" className="text-xs text-gray-500 hover:text-blue-400">
          Admin Access
        </Link>
      </div>
      
      <Card className="w-full max-w-md border-gray-800 bg-gray-800/50 backdrop-blur-lg relative z-10 shadow-xl">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="text-3xl font-bold flex items-center">
              <div className="bg-gradient-to-r from-blue-400 to-violet-500 p-2 rounded-lg mr-3 shadow-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-8 w-8 text-white"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" />
                  <path d="M12 18V6" />
                </svg>
              </div>
              <span className="bg-gradient-to-r from-blue-400 to-violet-500 bg-clip-text text-transparent">CryptoNest</span>
            </div>
          </div>
          <CardTitle className="text-2xl text-white">Welcome back</CardTitle>
          <CardDescription className="text-gray-400">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-200">Username</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="username" 
                        {...field} 
                        className="bg-gray-700 border-gray-600 text-white" 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-200">Password</FormLabel>
                    <FormControl>
                      <Input 
                        type="password" 
                        placeholder="••••••••" 
                        {...field} 
                        className="bg-gray-700 border-gray-600 text-white" 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button 
                className="w-full bg-gradient-to-r from-blue-500 to-violet-600 hover:from-blue-600 hover:to-violet-700 transition-all duration-200" 
                type="submit" 
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          </Form>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-700"></span>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-gray-800 px-2 text-gray-400">or continue with</span>
            </div>
          </div>
          
          <Button 
            variant="outline" 
            className="w-full border-gray-700 hover:bg-gray-700 text-gray-200"
            onClick={() => {
              // Skip the demo login API and directly go to dashboard with a simulated login
              const demoUser = {
                id: "demo-user-123",
                email: "demo@example.com",
                firstName: "Demo",
                lastName: "User",
                profileImageUrl: null,
                walletAddress: null
              };
              
              // Store demo user in localStorage for persistence
              localStorage.setItem('demoUser', JSON.stringify(demoUser));
              
              toast({
                title: "Demo Mode Activated",
                description: "Welcome to the CryptoNest demo experience!"
              });
              
              // Navigate to dashboard
              setLocation("/dashboard");
            }}
            disabled={isDemoLoading}
          >
            {isDemoLoading ? "Loading Demo..." : "Try Demo Account"}
          </Button>
        </CardContent>
        <CardFooter className="flex flex-col border-t border-gray-700 pt-6">
          <div className="text-center text-sm mt-2">
            <span className="text-gray-400">Don't have an account? </span>
            <Link href="/register" className="text-blue-400 hover:underline">
              Sign up
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
