import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { ForumSearch } from "@/components/forum/ForumSearch";
import { NewThreadDialog } from "@/components/forum/NewThreadDialog";
import { ForumTabContent } from "@/components/forum/ForumTabContent";
import { ForumThread } from "@/components/forum/ForumPostCard";
const Forum = () => {
  const [threads, setThreads] = useState<ForumThread[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const {
    toast
  } = useToast();
  const isMobile = useIsMobile();
  const {
    user,
    isAuthenticated
  } = useAuth();
  useEffect(() => {
    fetchThreads(activeTab);
  }, [activeTab]);
  const fetchThreads = async (category: string = "all") => {
    try {
      console.log("Fetching threads for category:", category);
      let query = supabase.from('forum_threads').select('*').order('created_at', {
        ascending: false
      });
      if (category !== "all") {
        query = query.eq('category', category);
      }
      const {
        data: threadsData,
        error: threadsError
      } = await query;
      if (threadsError) {
        console.error("Error fetching threads:", threadsError);
        throw threadsError;
      }
      console.log("Fetched threads:", threadsData);
      if (threadsData && threadsData.length > 0) {
        // Get unique user IDs from threads
        const userIds = [...new Set(threadsData.map(thread => thread.user_id))];
        console.log("User IDs to fetch:", userIds);

        // Fetch profiles for these users
        const {
          data: profilesData,
          error: profilesError
        } = await supabase.from('profiles').select('id, username').in('id', userIds);
        if (profilesError) {
          console.error('Error fetching profiles:', profilesError);
        }
        console.log("Fetched profiles:", profilesData);

        // Create a map of user IDs to usernames
        const profilesMap: Record<string, string> = {};
        if (profilesData) {
          profilesData.forEach(profile => {
            profilesMap[profile.id] = profile.username;
          });
        }
        const formattedThreads = threadsData.map((thread: any) => ({
          id: thread.id,
          title: thread.title,
          content: thread.content,
          category: thread.category,
          created_at: thread.created_at,
          user_id: thread.user_id,
          username: profilesMap[thread.user_id] || "Ανώνυμος",
          comment_count: 0,
          like_count: 0
        }));
        console.log("Formatted threads:", formattedThreads);
        setThreads(formattedThreads);
      } else {
        setThreads([]);
      }
    } catch (error: any) {
      console.error("Error in fetchThreads:", error);
      toast({
        title: "Σφάλμα",
        description: "Δεν ήταν δυνατή η φόρτωση των συζητήσεων",
        variant: "destructive"
      });
      setThreads([]);
    }
  };
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      fetchThreads(activeTab);
      return;
    }
    const filtered = threads.filter(thread => thread.title.toLowerCase().includes(searchTerm.toLowerCase()) || thread.content.toLowerCase().includes(searchTerm.toLowerCase()));
    if (filtered.length === 0) {
      toast({
        title: "Δεν βρέθηκαν αποτελέσματα",
        description: "Δοκιμάστε διαφορετικούς όρους αναζήτησης"
      });
    } else {
      setThreads(filtered);
    }
  };
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setSearchTerm("");
  };
  const handleNewPost = async (newThread: {
    title: string;
    content: string;
    category: string;
  }) => {
    if (!isAuthenticated || !user) {
      toast({
        title: "Απαιτείται σύνδεση",
        description: "Πρέπει να συνδεθείτε για να δημιουργήσετε νέα συζήτηση",
        variant: "destructive"
      });
      return;
    }
    if (newThread.title.trim() === "" || newThread.content.trim() === "") {
      toast({
        title: "Συμπληρώστε όλα τα πεδία",
        description: "Τίτλος και περιεχόμενο είναι υποχρεωτικά",
        variant: "destructive"
      });
      return;
    }
    setIsLoading(true);
    try {
      console.log("Creating new thread:", newThread, "User ID:", user.id);
      const {
        data,
        error
      } = await supabase.from('forum_threads').insert([{
        title: newThread.title,
        content: newThread.content,
        category: newThread.category,
        user_id: user.id
      }]).select();
      if (error) {
        console.error("Error creating thread:", error);
        throw error;
      }
      console.log("Thread created successfully:", data);
      toast({
        title: "Επιτυχία",
        description: "Η συζήτηση δημιουργήθηκε επιτυχώς"
      });

      // Refresh the thread list
      fetchThreads(activeTab);
    } catch (error: any) {
      console.error("Error in handleNewPost:", error);
      toast({
        title: "Σφάλμα",
        description: error.message || "Σφάλμα κατά τη δημιουργία της συζήτησης",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  const handleLike = (threadId: string) => {
    if (!isAuthenticated) {
      toast({
        title: "Απαιτείται σύνδεση",
        description: "Πρέπει να συνδεθείτε για να προσθέσετε στα αγαπημένα",
        variant: "destructive"
      });
      return;
    }
    toast({
      title: "Επιτυχία",
      description: "Προσθέσατε τη δημοσίευση στα αγαπημένα σας"
    });
  };
  const handleShare = (threadId: string) => {
    // Create a URL to share
    const shareUrl = `${window.location.origin}/forum/${threadId}`;

    // Try to use the Web Share API if available
    if (navigator.share) {
      navigator.share({
        title: 'Συζήτηση από την Κοινότητα Αδέσποτων',
        url: shareUrl
      }).catch(err => {
        console.error('Error sharing', err);
      });
    } else {
      // Fallback to copying the URL to clipboard
      navigator.clipboard.writeText(shareUrl).then(() => {
        toast({
          title: "Κοινοποίηση",
          description: "Ο σύνδεσμος αντιγράφηκε στο πρόχειρο"
        });
      }, () => {
        toast({
          title: "Σφάλμα",
          description: "Δεν ήταν δυνατή η αντιγραφή του συνδέσμου",
          variant: "destructive"
        });
      });
    }
  };
  return <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Χώρος συζητήσεων</h1>
        <p className="text-gray-600">
          Συζητήστε, μοιραστείτε εμπειρίες και ζητήστε βοήθεια για αδέσποτα ζώα
        </p>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 space-y-4 md:space-y-0">
        <ForumSearch searchTerm={searchTerm} setSearchTerm={setSearchTerm} handleSearch={handleSearch} />

        <NewThreadDialog isAuthenticated={isAuthenticated} onCreateThread={handleNewPost} isLoading={isLoading} />
      </div>

      <Tabs defaultValue="all" onValueChange={handleTabChange}>
        <TabsList className="mb-6">
          <TabsTrigger value="all">Όλες</TabsTrigger>
          <TabsTrigger value="general">Γενικά</TabsTrigger>
          <TabsTrigger value="help">Βοήθεια</TabsTrigger>
          <TabsTrigger value="suggestions">Προτάσεις</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-0">
          <ForumTabContent threads={threads} onLike={handleLike} onShare={handleShare} />
        </TabsContent>

        <TabsContent value="general" className="mt-0">
          <ForumTabContent threads={threads} category="general" onLike={handleLike} onShare={handleShare} />
        </TabsContent>

        <TabsContent value="help" className="mt-0">
          <ForumTabContent threads={threads} category="help" onLike={handleLike} onShare={handleShare} />
        </TabsContent>

        <TabsContent value="suggestions" className="mt-0">
          <ForumTabContent threads={threads} category="suggestions" onLike={handleLike} onShare={handleShare} />
        </TabsContent>
      </Tabs>
    </div>;
};
export default Forum;