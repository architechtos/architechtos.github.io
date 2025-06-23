
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ForumTabContent } from "./ForumTabContent";
import { ForumThread } from "./ForumPostCard";
import StraysRegistry from "./StraysRegistry";

interface ForumTabsProps {
  threads: ForumThread[];
  onLike: (threadId: string) => void;
  onShare: (threadId: string) => void;
  onTabChange: (value: string) => void;
}

const ForumTabs = ({ threads, onLike, onShare, onTabChange }: ForumTabsProps) => {
  return (
    <Tabs defaultValue="all" onValueChange={onTabChange}>
      <TabsList className="mb-6">
        <TabsTrigger value="all">Όλες</TabsTrigger>
        <TabsTrigger value="general">Γενικά</TabsTrigger>
        <TabsTrigger value="help">Βοήθεια</TabsTrigger>
        <TabsTrigger value="suggestions">Προτάσεις</TabsTrigger>
        <TabsTrigger value="strays">Μητρώο Αδέσποτων</TabsTrigger>
      </TabsList>

      <TabsContent value="all" className="mt-0">
        <ForumTabContent threads={threads} onLike={onLike} onShare={onShare} />
      </TabsContent>

      <TabsContent value="general" className="mt-0">
        <ForumTabContent threads={threads} category="general" onLike={onLike} onShare={onShare} />
      </TabsContent>

      <TabsContent value="help" className="mt-0">
        <ForumTabContent threads={threads} category="help" onLike={onLike} onShare={onShare} />
      </TabsContent>

      <TabsContent value="suggestions" className="mt-0">
        <ForumTabContent threads={threads} category="suggestions" onLike={onLike} onShare={onShare} />
      </TabsContent>

      <TabsContent value="strays" className="mt-0">
        <StraysRegistry />
      </TabsContent>
    </Tabs>
  );
};

export default ForumTabs;
