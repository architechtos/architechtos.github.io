
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ViewModeProvider } from "@/contexts/ViewModeContext";
import Layout from "@/components/layout/Layout";
import Index from "@/pages/Index";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Profile from "@/pages/Profile";
import Report from "@/pages/Report";
import StrayRegistration from "@/pages/StrayRegistration";
import StrayActivities from "@/pages/StrayActivities";
import StrayAdoptions from "@/pages/StrayAdoptions";
import Forum from "@/pages/Forum";
import ForumThread from "@/pages/ForumThread";
import Chat from "@/pages/Chat";
import CommunityInfo from "@/pages/CommunityInfo";
import NotFound from "@/pages/NotFound";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import NewsArticle from "@/pages/NewsArticle";
import AllNews from "@/pages/AllNews";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <ViewModeProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<Index />} />
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />
                <Route path="profile" element={<Profile />} />
                <Route path="report" element={<Report />} />
                <Route path="stray-registration" element={<StrayRegistration />} />
                <Route path="stray-activities" element={<StrayActivities />} />
                <Route path="stray-adoptions" element={<StrayAdoptions />} />
                <Route path="forum" element={<Forum />} />
                <Route path="forum/thread/:threadId" element={<ForumThread />} />
                <Route path="chat" element={<Chat />} />
                <Route path="community-info" element={<CommunityInfo />} />
                <Route path="news" element={<AllNews />} />
                <Route path="news/:articleId" element={<NewsArticle />} />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </ViewModeProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
