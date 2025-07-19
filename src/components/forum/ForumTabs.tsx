
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ForumTabContent } from "./ForumTabContent";
import { ForumThread } from "./ForumPostCard";
import CatsRegistry from "./CatsRegistry";
import DogsRegistry from "./DogsRegistry";

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
        <TabsTrigger value="cats">Μητρώο Γάτας</TabsTrigger>
        <TabsTrigger value="dogs">Μητρώο Σκύλου</TabsTrigger>
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

      <TabsContent value="cats" className="mt-0">
        <CatsRegistry />
      </TabsContent>

      <TabsContent value="dogs" className="mt-0">
        <DogsRegistry />
      </TabsContent>
    </Tabs>
  );
};

export default ForumTabs;
