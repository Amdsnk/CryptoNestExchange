import { useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { adminApi } from "@/lib/adminApi";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

// Schema for admin login
const adminLoginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().optional(),
});

type AdminLoginValues = z.infer<typeof adminLoginSchema>;

export default function AdminLogin() {
  const [isLoading, setIsLoading] = useState(false);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  // Form setup with default values
  const form = useForm<AdminLoginValues>({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: {
      username: "",
      password: "",
      rememberMe: false,
    },
  });

  async function onSubmit(values: AdminLoginValues) {
    setIsLoading(true);
    
    try {
      console.log("Attempting admin login with:", values.username);
      
      // Direct fetch approach for better error handling
      const response = await fetch('/api/auth/admin-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          username: values.username,
          password: values.password
        })
      });
      
      console.log("Login response status:", response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log("Login successful");
        
        toast({
          title: "Admin login successful",
          description: "Welcome to the admin dashboard",
        });
        
        // Redirect to admin dashboard
        setLocation("/admin/dashboard");
      } else {
        // Handle error responses
        try {
          const errorData = await response.json();
          console.error("Login error data:", errorData);
          
          if (response.status === 401) {
            toast({
              title: "Login failed",
              description: "Invalid username or password.",
              variant: "destructive",
            });
          } else if (response.status === 429) {
            toast({
              title: "Too many attempts",
              description: "Please wait before trying again.",
              variant: "destructive",
            });
          } else {
            toast({
              title: "Login error",
              description: errorData.error?.message || "An unexpected error occurred",
              variant: "destructive",
            });
          }
        } catch (parseError) {
          console.error("Error parsing response:", parseError);
          toast({
            title: "Login failed",
            description: "Could not process the server response",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      console.error("Admin login error:", error);
      
      toast({
        title: "Login failed",
        description: "Could not connect to the server",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-slate-900 to-slate-800 p-4">
      <div className="mx-auto max-w-md w-full">
        <Card className="border-slate-700 bg-slate-900/60 backdrop-blur-sm">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold tracking-tight text-white">
              Admin Panel
            </CardTitle>
            <CardDescription className="text-slate-400">
              Administrator Login
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Admin Username</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className="bg-slate-800 border-slate-700 text-white"
                          placeholder="admin"
                          autoComplete="username"
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
                      <FormLabel className="text-white">Admin Password</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="password"
                          className="bg-slate-800 border-slate-700 text-white"
                          placeholder="••••••••"
                          autoComplete="current-password"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="rememberMe"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="data-[state=checked]:bg-blue-600 border-slate-600"
                        />
                      </FormControl>
                      <FormLabel className="text-sm font-medium text-slate-300">
                        Remember me
                      </FormLabel>
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  disabled={isLoading}
                >
                  {isLoading ? "Logging in..." : "Log In to Admin"}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex justify-center border-t border-slate-700 pt-4">
            <p className="text-sm text-slate-400">
              Secure Admin Access Only
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}