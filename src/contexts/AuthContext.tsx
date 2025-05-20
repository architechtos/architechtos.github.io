
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";

// Types
interface User {
  id: string;
  username: string;
  email: string;
  phoneVerified: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (username: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  verifyPhone: (phone: string, code: string) => Promise<boolean>;
}

// Create Auth Context
const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => false,
  register: async () => false,
  logout: () => {},
  verifyPhone: async () => false,
});

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

// Mock user database for demo purposes
const mockUsers = [
  {
    id: '1',
    username: 'demo',
    email: 'demo@example.com',
    password: 'password',
    phoneVerified: true,
  }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  // Check if user is already logged in
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        localStorage.removeItem('user');
      }
    }
    setIsLoading(false);
  }, []);

  // Login function
  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const foundUser = mockUsers.find(u => 
          u.email === email && u.password === password
        );
        
        if (foundUser) {
          const { password, ...userWithoutPassword } = foundUser;
          setUser(userWithoutPassword);
          localStorage.setItem('user', JSON.stringify(userWithoutPassword));
          toast({
            title: "Επιτυχής σύνδεση",
            description: "Καλωσήρθατε πίσω!",
          });
          resolve(true);
        } else {
          toast({
            title: "Αποτυχία σύνδεσης",
            description: "Λάθος email ή κωδικός",
            variant: "destructive",
          });
          resolve(false);
        }
        setIsLoading(false);
      }, 1000);
    });
  };

  // Register function
  const register = async (username: string, email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const userExists = mockUsers.some(u => u.email === email);
        
        if (userExists) {
          toast({
            title: "Αποτυχία εγγραφής",
            description: "Το email χρησιμοποιείται ήδη",
            variant: "destructive",
          });
          resolve(false);
        } else {
          const newUser = {
            id: String(mockUsers.length + 1),
            username,
            email,
            password,
            phoneVerified: false,
          };
          
          // In a real app, we'd add the user to the database here
          mockUsers.push(newUser);
          
          // Log in the user after registration
          const { password: _, ...userWithoutPassword } = newUser;
          setUser(userWithoutPassword);
          localStorage.setItem('user', JSON.stringify(userWithoutPassword));
          
          toast({
            title: "Επιτυχής εγγραφή",
            description: "Ο λογαριασμός σας δημιουργήθηκε με επιτυχία",
          });
          resolve(true);
        }
        setIsLoading(false);
      }, 1000);
    });
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    toast({
      title: "Αποσύνδεση",
      description: "Αποσυνδεθήκατε με επιτυχία",
    });
  };

  // Verify phone function
  const verifyPhone = async (phone: string, code: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        // For demo purposes, any code is valid
        if (user && code.length === 6) {
          const updatedUser = { ...user, phoneVerified: true };
          setUser(updatedUser);
          localStorage.setItem('user', JSON.stringify(updatedUser));
          
          toast({
            title: "Επιβεβαίωση τηλεφώνου",
            description: "Το τηλέφωνό σας επιβεβαιώθηκε με επιτυχία",
          });
          resolve(true);
        } else {
          toast({
            title: "Αποτυχία επιβεβαίωσης",
            description: "Μη έγκυρος κωδικός",
            variant: "destructive",
          });
          resolve(false);
        }
        setIsLoading(false);
      }, 1000);
    });
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      register,
      logout,
      verifyPhone,
    }}>
      {children}
    </AuthContext.Provider>
  );
};
