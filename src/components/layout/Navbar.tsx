
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { useViewMode } from "@/contexts/ViewModeContext";
import { Menu, X, User, MessageCircle, PenSquare, MapPin, Heart, Smartphone, Tablet, Home, Calendar } from "lucide-react";

const Navbar = () => {
  const {
    isAuthenticated,
    user,
    logout
  } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();
  const {
    isMobileView,
    toggleMobileView
  } = useViewMode();
  const location = useLocation();
  
  const navigation = [{
    name: "Αρχική",
    href: "/",
    icon: Home
  }, ...(isAuthenticated ? [{
    name: "Μητρώο αδέσποτων",
    href: "/stray-registration",
    icon: Heart
  }, {
    name: "Αδέσποτο σε ανάγκη",
    href: "/report",
    icon: MapPin
  }, {
    name: "Δραστηριότητες αδέσποτων",
    href: "/stray-activities",
    icon: Calendar
  }, {    
    name: "Χώρος συζητήσεων",
    href: "/forum",
    icon: MessageCircle
  }] : [])];
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  return <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo and Title */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center" onClick={closeMobileMenu}>
              <div> 
              <img id="image" src="https://i.ibb.co/zTV6h7k7/3053a010.png" width="50" />
              </div> 
              <span className="ml-2 font-medium text-orange-500 text-2xl">Adespolis </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          {!isMobile && <div className="flex items-center space-x-4">
              <nav className="flex space-x-4">
                {navigation.map(item => <Link key={item.name} to={item.href} className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${isActive(item.href) ? "text-strays-orange bg-orange-50" : "text-gray-600 hover:text-strays-orange hover:bg-gray-50"}`} title={item.name}>
                    <item.icon className="h-5 w-5" />
                  </Link>)}
              </nav>
              
              <div className="ml-4 flex items-center space-x-2">
             
                {/* View Mode Toggle */}
                <Button variant="outline" size="sm" onClick={toggleMobileView} className="flex items-center" title={isMobileView ? "Αλλαγή σε Desktop προβολή" : "Αλλαγή σε Mobile προβολή"}>
                  {isMobileView ? <Tablet className="h-4 w-4" /> : <Smartphone className="h-4 w-4" />}
                </Button>

                {isAuthenticated ? <div className="flex items-center space-x-2">
                    <Link to="/profile">
                      <Button variant="outline" size="sm" className="flex items-center">
                        <User className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button variant="ghost" size="sm" onClick={logout}>
                      Αποσύνδεση
                    </Button>
                  </div> : <div className="flex space-x-2">
                    <Link to="/login">
                      <Button variant="outline" size="sm">
                        Σύνδεση
                      </Button>
                    </Link>
                  </div>}
              </div>
            </div>}

          {/* Mobile menu button */}
          {isMobile && <div className="flex items-center space-x-2">
              {/* New User Participation Badge for Mobile */}
              {isAuthenticated && (
                <Badge variant="secondary" className="bg-orange-100 text-orange-800 text-xs">
                  Συμμετοχή! 🎉
                </Badge>
              )}
              
              {/* View Mode Toggle for Mobile */}
              <Button variant="outline" size="sm" onClick={toggleMobileView} className="flex items-center" title={isMobileView ? "Αλλαγή σε Desktop προβολή" : "Αλλαγή σε Mobile προβολή"}>
                {isMobileView ? <Tablet className="h-4 w-4" /> : <Smartphone className="h-4 w-4" />}
              </Button>
              
              <button className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-strays-orange focus:outline-none" onClick={toggleMobileMenu}>
                {mobileMenuOpen ? <X className="block h-6 w-6" aria-hidden="true" /> : <Menu className="block h-6 w-6" aria-hidden="true" />}
              </button>
            </div>}
        </div>
      </div>

      {/* Mobile menu */}
      {isMobile && mobileMenuOpen && <div className="fixed inset-0 z-40 bg-white">
          <div className="pt-5 pb-6 px-4 space-y-4">
            <div className="flex items-center justify-between">
              <Link to="/" className="flex items-center" onClick={closeMobileMenu}>
                <div className="h-10 w-10 rounded-full bg-strays-orange flex items-center justify-center">
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </div>
                <span className="ml-2 text-lg font-medium text-gray-900">
                  Βοήθεια Αδέσποτων
                </span>
              </Link>
              <button className="rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none" onClick={toggleMobileMenu}>
                <X className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            <div className="mt-6">
              <nav className="grid gap-y-8">
                {navigation.map(item => <Link key={item.name} to={item.href} className="flex items-center -m-3 p-3 rounded-md hover:bg-gray-50" onClick={closeMobileMenu}>
                    <item.icon className="mr-3 h-6 w-6" />
                    <span className={`ml-3 text-base font-medium ${isActive(item.href) ? "text-strays-orange" : "text-gray-900"}`}>
                      {item.name}
                    </span>
                  </Link>)}
              </nav>
            </div>

            {/* Auth section for mobile */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              {isAuthenticated ? <div className="space-y-4">
                  <Link to="/profile" onClick={closeMobileMenu} className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-strays-orange hover:bg-strays-dark-orange">
                    <User className="mr-2 h-5 w-5" />
                    Προφίλ
                  </Link>
                  <Button variant="outline" onClick={() => {
              logout();
              closeMobileMenu();
            }} className="w-full">
                    Αποσύνδεση
                  </Button>
                </div> : <div className="space-y-4">
                  <Link to="/login" onClick={closeMobileMenu} className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-strays-orange bg-white border-strays-orange hover:bg-gray-50">
                    Σύνδεση
                  </Link>
                </div>}
            </div>
          </div>
        </div>}
    </header>;
};

export default Navbar;
