
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIsMobile } from "@/hooks/use-mobile";

const registerSchema = z.object({
  username: z.string().min(3, {
    message: "Το όνομα χρήστη πρέπει να έχει τουλάχιστον 3 χαρακτήρες",
  }),
  email: z.string().email({
    message: "Παρακαλώ εισάγετε ένα έγκυρο email",
  }),
  password: z.string().min(6, {
    message: "Ο κωδικός πρέπει να είναι τουλάχιστον 6 χαρακτήρες",
  }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Οι κωδικοί δεν ταιριάζουν",
  path: ["confirmPassword"],
});

const phoneVerificationSchema = z.object({
  phone: z.string().min(10, {
    message: "Παρακαλώ εισάγετε έναν έγκυρο αριθμό τηλεφώνου",
  }),
  code: z.string().length(6, {
    message: "Ο κωδικός επιβεβαίωσης πρέπει να είναι 6 ψηφία",
  }),
});

const Register = () => {
  const { register, verifyPhone } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isCodeSent, setIsCodeSent] = useState(false);
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const registerForm = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const verificationForm = useForm<z.infer<typeof phoneVerificationSchema>>({
    resolver: zodResolver(phoneVerificationSchema),
    defaultValues: {
      phone: "",
      code: "",
    },
  });

  const onRegisterSubmit = async (values: z.infer<typeof registerSchema>) => {
    setIsLoading(true);
    const success = await register(values.username, values.email, values.password);
    setIsLoading(false);
    
    if (success) {
      setIsRegistered(true);
    }
  };

  const sendVerificationCode = () => {
    const phone = verificationForm.getValues("phone");
    setPhoneNumber(phone);
    // In a real app, this would trigger sending a verification code
    setIsCodeSent(true);
  };

  const onVerificationSubmit = async (values: z.infer<typeof phoneVerificationSchema>) => {
    setIsLoading(true);
    const success = await verifyPhone(values.phone, values.code);
    setIsLoading(false);
    
    if (success) {
      navigate("/", { replace: true });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[70vh]">
      <div className={`${isMobile ? 'w-full' : 'w-[450px]'} space-y-6`}>
        <div className="text-center">
          <h1 className="text-2xl font-bold">
            {isRegistered ? "Επιβεβαίωση τηλεφώνου" : "Δημιουργία λογαριασμού"}
          </h1>
          <p className="text-sm text-gray-600 mt-2">
            {isRegistered 
              ? "Επιβεβαιώστε το τηλέφωνό σας για να συνεχίσετε" 
              : "Συμπληρώστε τα στοιχεία σας για να δημιουργήσετε λογαριασμό"}
          </p>
        </div>

        {isRegistered ? (
          <Form {...verificationForm}>
            <form onSubmit={verificationForm.handleSubmit(onVerificationSubmit)} className="space-y-4">
              <FormField
                control={verificationForm.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Αριθμός τηλεφώνου</FormLabel>
                    <FormControl>
                      <div className="flex space-x-2">
                        <Input 
                          placeholder="69xxxxxxxx" 
                          {...field} 
                          type="tel"
                          disabled={isCodeSent}
                          className="flex-grow"
                        />
                        {!isCodeSent && (
                          <Button 
                            type="button" 
                            variant="outline" 
                            onClick={sendVerificationCode}
                            disabled={!verificationForm.getValues("phone") || verificationForm.getValues("phone").length < 10}
                          >
                            Αποστολή κωδικού
                          </Button>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {isCodeSent && (
                <FormField
                  control={verificationForm.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Κωδικός επιβεβαίωσης</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="6-ψήφιος κωδικός" 
                          {...field}
                          maxLength={6}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {isCodeSent && (
                <Button 
                  type="submit" 
                  className="w-full bg-strays-orange hover:bg-strays-dark-orange"
                  disabled={isLoading}
                >
                  {isLoading ? "Επιβεβαίωση..." : "Επιβεβαίωση τηλεφώνου"}
                </Button>
              )}
              
              {isCodeSent && (
                <div className="text-center text-sm">
                  <Button 
                    type="button" 
                    variant="link" 
                    className="text-strays-orange"
                    onClick={() => setIsCodeSent(false)}
                  >
                    Αλλαγή αριθμού τηλεφώνου
                  </Button>
                </div>
              )}
            </form>
          </Form>
        ) : (
          <Tabs defaultValue="email" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="email">Email</TabsTrigger>
              <TabsTrigger value="google">Google</TabsTrigger>
            </TabsList>
            
            <TabsContent value="email" className="mt-0">
              <Form {...registerForm}>
                <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                  <FormField
                    control={registerForm.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Όνομα χρήστη</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Εισάγετε το όνομα χρήστη σας" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={registerForm.control}
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
                    control={registerForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Κωδικός</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="••••••••" 
                            type="password" 
                            {...field}
                            autoComplete="new-password"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={registerForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Επιβεβαίωση κωδικού</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="••••••••" 
                            type="password" 
                            {...field}
                            autoComplete="new-password"
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
                    {isLoading ? "Εγγραφή..." : "Εγγραφή"}
                  </Button>
                </form>
              </Form>
            </TabsContent>
            
            <TabsContent value="google" className="mt-0">
              <div className="flex flex-col items-center justify-center p-6">
                <Button 
                  className="w-full flex items-center justify-center bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                  onClick={() => {
                    // In a real app, this would trigger Google authentication
                    alert("Η σύνδεση με Google θα υλοποιηθεί σε μελλοντική έκδοση");
                  }}
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Συνέχεια με Google
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        )}

        <div className="text-center text-sm">
          {!isRegistered && (
            <p>
              Έχετε ήδη λογαριασμό;{" "}
              <Link
                to="/login"
                className="font-medium text-strays-orange hover:underline"
              >
                Σύνδεση
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Register;
