import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { User, LogOut, Menu, X, PawPrint, Camera, Home, MessageSquare, Activity } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
const Navbar = () => {
  const {
    user,
    isAuthenticated,
    logout
  } = useAuth();
  const location = useLocation();
  const isMobile = useIsMobile();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const handleLogout = async () => {
    await logout();
  };
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };
  const isActive = (path: string) => location.pathname === path;
  const NavLink = ({
    to,
    icon: Icon,
    onClick
  }: {
    to: string;
    icon: React.ComponentType<{
      className?: string;
    }>;
    onClick?: () => void;
  }) => <Link to={to} className={`flex items-center justify-center p-2 rounded-md transition-colors ${isActive(to) ? "bg-strays-orange text-white" : "text-gray-700 hover:text-strays-orange hover:bg-orange-50"}`} onClick={onClick}>
      <Icon className="h-5 w-5" />
    </Link>;
  const navigation = [{
    name: "Αρχική",
    path: "/",
    icon: Home
  }, {
    name: "Φόρουμ",
    path: "/forum",
    icon: MessageSquare
  }, {
    name: "Αναφορά",
    path: "/report",
    icon: Camera
  }, {
    name: "Καταχώρηση",
    path: "/stray-registration",
    icon: User
  }, {
    name: "Δραστηριότητες",
    path: "/stray-activities",
    icon: Activity
  }, {
    name: "Υιοθεσίες",
    path: "/stray-adoptions",
    icon: PawPrint
  }];
  if (isMobile) {
    return <>
        <nav className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center space-x-3">
                <Link to="/" className="flex-shrink-0">
                  <img src="/lovable-uploads/logo.png" alt="Αδέσπολις" className="h-40 w-40" />
                </Link>
                <Link to="/" className="text-xl font-bold text-strays-orange">
                  Αδέσπολις
                </Link>
              </div>

              <div className="flex items-center space-x-4">
                {isAuthenticated ? <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs">
                            {(user?.username || user?.email)?.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56 bg-white border border-gray-200 shadow-lg z-50" align="end">
                      <DropdownMenuItem asChild>
                        <Link to="/profile" className="flex items-center">
                          <User className="mr-2 h-4 w-4" />
                          <span>Προφίλ</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={handleLogout}>
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Αποσύνδεση</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu> : <button onClick={toggleMobileMenu} className="p-2 rounded-md text-gray-700 hover:text-strays-orange">
                    {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                  </button>}
              </div>
            </div>
          </div>
        </nav>

        {isMobileMenuOpen && <div className="fixed inset-0 z-50 bg-white">
            <div className="flex justify-between items-center p-4 border-b">
              <div className="flex items-center space-x-3">
                <Link to="/" onClick={closeMobileMenu}>
                  <img className="h-8 w-auto" src="/lovable-uploads/logo.png" alt="Αδέσπολις" />
                </Link>
                <Link to="/" onClick={closeMobileMenu} className="text-xl font-bold text-strays-orange">
                  Αδέσπολις
                </Link>
              </div>
              <button onClick={closeMobileMenu} className="p-2 rounded-md text-gray-700">
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="px-4 py-6 space-y-4">
              {navigation.map(item => <Link key={item.name} to={item.path} className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive(item.path) ? "bg-strays-orange text-white" : "text-gray-700 hover:text-strays-orange hover:bg-orange-50"}`} onClick={closeMobileMenu}>
                  <item.icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>)}

              <div className="pt-6 border-t border-gray-200">
                {!isAuthenticated && <div className="space-y-2">
                    <Link to="/login" onClick={closeMobileMenu} className="block w-full px-4 py-2 text-center text-sm font-medium text-white bg-strays-orange rounded-md hover:bg-strays-dark-orange transition-colors">
                      Σύνδεση
                    </Link>
                    <Link to="/register" onClick={closeMobileMenu} className="block w-full px-4 py-2 text-center text-sm font-medium text-strays-orange border border-strays-orange rounded-md hover:bg-orange-50 transition-colors">
                      Εγγραφή
                    </Link>
                  </div>}
              </div>
            </div>
          </div>}
      </>;
  }
  return <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-3">
            <Link to="/" className="flex-shrink-0">
              <img src="/lovable-uploads/logo.png" alt="Αδέσπολις" className="h-20 w-auto" />
            </Link>
            <Link to="/" className="text-xl font-bold text-strays-orange">
              Αδέσπολις
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {navigation.map(item => <NavLink key={item.name} to={item.path} icon={item.icon} />)}
          </div>

          <div className="flex items-center space-x-4">
            {isAuthenticated ? <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 px-3 rounded-full">
                    <span className="text-sm text-gray-700">
                      {user?.username || user?.email}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-white border border-gray-200 shadow-lg z-50" align="end">
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      <span>Προφίλ</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Αποσύνδεση</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu> : <div className="flex items-center space-x-2">
                <Button asChild variant="ghost">
                  <Link to="/login">Σύνδεση</Link>
                </Button>
                <Button asChild className="bg-strays-orange hover:bg-strays-dark-orange">
                  <Link to="/register">Εγγραφή</Link>
                </Button>
              </div>}
          </div>
        </div>
      </div>
    </nav>;
};
export default Navbar;