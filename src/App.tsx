
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, HashRouter } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ViewModeProvider } from "./contexts/ViewModeContext";

// Pages
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Forum from "./pages/Forum";
import Chat from "./pages/Chat";
import Report from "./pages/Report";
import ProfilePage from "./pages/Profile";
import CommunityInfo from "./pages/CommunityInfo";
import StrayRegistration from "./pages/StrayRegistration";

// Components
import Layout from "./components/layout/Layout";
import ProtectedRoute from "./components/auth/ProtectedRoute";

const queryClient = new QueryClient();

// Determine if we're running in GitHub Pages
const isGitHubPages = window.location.hostname.includes('github.io');

// Use HashRouter for GitHub Pages, otherwise use BrowserRouter
const Router = isGitHubPages ? HashRouter : BrowserRouter;

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <ViewModeProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Router>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<Index />} />
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />
                <Route path="profile" element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                } />
                <Route path="forum" element={<Forum />} />
                <Route path="chat" element={
                  <ProtectedRoute>
                    <Chat />
                  </ProtectedRoute>
                } />
                <Route path="report" element={
                  <ProtectedRoute>
                    <Report />
                  </ProtectedRoute>
                } />
                <Route path="stray-registration" element={
                  <ProtectedRoute>
                    <StrayRegistration />
                  </ProtectedRoute>
                } />
                <Route path="community" element={<CommunityInfo />} />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </Router>
        </TooltipProvider>
      </ViewModeProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
