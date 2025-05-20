
import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { useAuth } from "@/contexts/AuthContext";
import { useIsMobile } from "@/hooks/use-mobile";

const loginSchema = z.object({
  email: z.string().email({
    message: "Παρακαλώ εισάγετε ένα έγκυρο email",
  }),
  password: z.string().min(6, {
    message: "Ο κωδικός πρέπει να είναι τουλάχιστον 6 χαρακτήρες",
  }),
});

const Login = () => {
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  
  const from = location.state?.from?.pathname || "/";

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof loginSchema>) => {
    setIsLoading(true);
    const success = await login(values.email, values.password);
    setIsLoading(false);
    
    if (success) {
      navigate(from, { replace: true });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[70vh]">
      <div className={`${isMobile ? 'w-full' : 'w-[400px]'} space-y-6`}>
        <div className="text-center">
          <h1 className="text-2xl font-bold">Σύνδεση</h1>
          <p className="text-sm text-gray-600 mt-2">
            Συνδεθείτε για να συνεχίσετε στην κοινότητα αδέσποτων
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="your.email@example.com" 
                      {...field} 
                      type="email"
                      autoComplete="email"
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
                  <FormLabel>Κωδικός</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="••••••••" 
                      type="password" 
                      {...field}
                      autoComplete="current-password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button 
              type="submit" 
              className="w-full bg-strays-orange hover:bg-strays-dark-orange"
              disabled={isLoading}
            >
              {isLoading ? "Σύνδεση..." : "Σύνδεση"}
            </Button>
          </form>
        </Form>

        <div className="text-center text-sm">
          <p>
            Δεν έχετε λογαριασμό;{" "}
            <Link
              to="/register"
              className="font-medium text-strays-orange hover:underline"
            >
              Εγγραφή
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
