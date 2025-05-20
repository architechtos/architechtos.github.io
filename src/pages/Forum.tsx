
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { MessageSquare, Heart, Share, Search, Plus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";

// Types
interface ForumPost {
  id: string;
  title: string;
  content: string;
  author: string;
  date: string;
  commentCount: number;
  likeCount: number;
  category: 'general' | 'help' | 'suggestions';
}

// Mock data
const mockPosts: ForumPost[] = [
  {
    id: '1',
    title: 'Οδηγίες για φροντίδα αδέσποτων γατιών',
    content: 'Καλησπέρα σε όλους! Πρόσφατα βρήκα μια αδέσποτη γάτα στη γειτονιά μου και θα ήθελα να μοιραστώ κάποιες συμβουλές για το πώς μπορούμε να φροντίσουμε αδέσποτες γάτες.',
    author: 'cat_lover',
    date: '2025-05-15',
    commentCount: 12,
    likeCount: 24,
    category: 'general'
  },
  {
    id: '2',
    title: 'Χρειάζομαι βοήθεια με τραυματισμένο σκύλο',
    content: 'Βρήκα έναν τραυματισμένο σκύλο στην περιοχή του Χαλανδρίου. Φαίνεται να έχει τραυματιστεί στο πόδι του. Υπάρχει κάποιος κτηνίατρος που μπορεί να βοηθήσει ή κάποιος φιλοζωικός σύλλογος στην περιοχή;',
    author: 'dog_friend',
    date: '2025-05-14',
    commentCount: 8,
    likeCount: 15,
    category: 'help'
  },
  {
    id: '3',
    title: 'Πρόταση για εκδήλωση υιοθεσίας',
    content: 'Σκεφτόμουν ότι θα ήταν καλή ιδέα να οργανώσουμε μια εκδήλωση υιοθεσίας αδέσποτων στην πλατεία Συντάγματος. Θα μπορούσαμε να συνεργαστούμε με τοπικούς φιλοζωικούς συλλόγους.',
    author: 'animal_helper',
    date: '2025-05-12',
    commentCount: 20,
    likeCount: 42,
    category: 'suggestions'
  },
  {
    id: '4',
    title: 'Συμβουλές για υιοθεσία ενήλικου σκύλου',
    content: 'Σκέφτομαι να υιοθετήσω έναν ενήλικο σκύλο από καταφύγιο. Έχει κανείς εμπειρία με αυτό; Υπάρχουν κάποιες συμβουλές που θα μπορούσατε να μοιραστείτε;',
    author: 'new_adopter',
    date: '2025-05-10',
    commentCount: 15,
    likeCount: 18,
    category: 'general'
  },
  {
    id: '5',
    title: 'Βρήκα αδέσποτα κουτάβια στην Πάτρα',
    content: 'Βρήκα 5 αδέσποτα κουτάβια κοντά στο πανεπιστήμιο της Πάτρας. Είναι περίπου 2 μηνών. Υπάρχει κάποιος στην περιοχή που θα μπορούσε να βοηθήσει με την φροντίδα τους μέχρι να βρεθούν σπίτια;',
    author: 'student_helper',
    date: '2025-05-08',
    commentCount: 10,
    likeCount: 12,
    category: 'help'
  }
];

const Forum = () => {
  const [posts, setPosts] = useState<ForumPost[]>(mockPosts);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('el-GR', options);
  };

  const filterPosts = (category: string) => {
    if (category === 'all') return mockPosts;
    return mockPosts.filter(post => post.category === category);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const filtered = mockPosts.filter(post => 
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      post.content.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setPosts(filtered);
    
    if (filtered.length === 0) {
      toast({
        title: "Δεν βρέθηκαν αποτελέσματα",
        description: "Δοκιμάστε διαφορετικούς όρους αναζήτησης",
      });
    }
  };

  const handleTabChange = (value: string) => {
    setSearchTerm("");
    setPosts(filterPosts(value));
  };

  const handleLike = (postId: string) => {
    toast({
      title: "Επιτυχία",
      description: "Προσθέσατε τη δημοσίευση στα αγαπημένα σας",
    });
  };

  const handleShare = (postId: string) => {
    toast({
      title: "Κοινοποίηση",
      description: "Ο σύνδεσμος αντιγράφηκε στο πρόχειρο",
    });
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Φόρουμ συζητήσεων</h1>
        <p className="text-gray-600">
          Συζητήστε, μοιραστείτε εμπειρίες και ζητήστε βοήθεια για αδέσποτα ζώα
        </p>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 space-y-4 md:space-y-0">
        <form onSubmit={handleSearch} className="flex w-full md:w-1/3 space-x-2">
          <Input
            placeholder="Αναζήτηση..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button type="submit" variant="outline" size="icon">
            <Search className="h-4 w-4" />
          </Button>
        </form>

        <Button className="bg-strays-orange hover:bg-strays-dark-orange">
          <Plus className="mr-2 h-4 w-4" /> Νέα Συζήτηση
        </Button>
      </div>

      <Tabs defaultValue="all" onValueChange={handleTabChange}>
        <TabsList className="mb-6">
          <TabsTrigger value="all">Όλες</TabsTrigger>
          <TabsTrigger value="general">Γενικά</TabsTrigger>
          <TabsTrigger value="help">Βοήθεια</TabsTrigger>
          <TabsTrigger value="suggestions">Προτάσεις</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-0">
          <div className="space-y-4">
            {posts.map((post) => (
              <ForumPostCard key={post.id} post={post} onLike={handleLike} onShare={handleShare} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="general" className="mt-0">
          <div className="space-y-4">
            {posts.filter(post => post.category === 'general').map((post) => (
              <ForumPostCard key={post.id} post={post} onLike={handleLike} onShare={handleShare} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="help" className="mt-0">
          <div className="space-y-4">
            {posts.filter(post => post.category === 'help').map((post) => (
              <ForumPostCard key={post.id} post={post} onLike={handleLike} onShare={handleShare} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="suggestions" className="mt-0">
          <div className="space-y-4">
            {posts.filter(post => post.category === 'suggestions').map((post) => (
              <ForumPostCard key={post.id} post={post} onLike={handleLike} onShare={handleShare} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

interface ForumPostCardProps {
  post: ForumPost;
  onLike: (postId: string) => void;
  onShare: (postId: string) => void;
}

const ForumPostCard: React.FC<ForumPostCardProps> = ({ post, onLike, onShare }) => {
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('el-GR', options);
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'general':
        return { label: 'Γενικά', color: 'bg-blue-100 text-blue-800' };
      case 'help':
        return { label: 'Βοήθεια', color: 'bg-red-100 text-red-800' };
      case 'suggestions':
        return { label: 'Προτάσεις', color: 'bg-green-100 text-green-800' };
      default:
        return { label: category, color: 'bg-gray-100 text-gray-800' };
    }
  };

  const category = getCategoryLabel(post.category);

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl">{post.title}</CardTitle>
            <CardDescription>
              <span>από {post.author} • {formatDate(post.date)}</span>
            </CardDescription>
          </div>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${category.color}`}>
            {category.label}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-700">
          {post.content.length > 200 
            ? `${post.content.substring(0, 200)}...` 
            : post.content}
        </p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="flex space-x-4">
          <Button variant="ghost" size="sm" className="flex items-center text-gray-600">
            <MessageSquare className="mr-1 h-4 w-4" /> {post.commentCount}
          </Button>
          <Button variant="ghost" size="sm" className="flex items-center text-gray-600" onClick={() => onLike(post.id)}>
            <Heart className="mr-1 h-4 w-4" /> {post.likeCount}
          </Button>
          <Button variant="ghost" size="sm" className="flex items-center text-gray-600" onClick={() => onShare(post.id)}>
            <Share className="mr-1 h-4 w-4" /> Κοινοποίηση
          </Button>
        </div>
        <Button variant="outline" size="sm">
          Ανάγνωση
        </Button>
      </CardFooter>
    </Card>
  );
};

export default Forum;
