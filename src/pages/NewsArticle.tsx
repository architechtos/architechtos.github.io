import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Calendar, Tag, Share } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import NewsComments from "@/components/news/NewsComments";

const NewsArticle = () => {
  const { articleId } = useParams();
  const { toast } = useToast();

  // Mock data - in a real app this would come from an API
  const newsItems = [
    {
    id: "1",
    title: "Πολίτες και Αδέσποτοι Φίλοι δίνουν 2.000 ευρώ σε όποιον/α δώσει πληροφορίες για το δράστη που δολοφόνησε με φόλες 4 αδέσποτα σκυλιά",
    content: "Αποτροπιασμό και θυμό προκαλεί η εγκληματική ενέργεια από άγνωστο δράστη προς το παρόν, που οδήγησε στο θάνατο ενός ιδιαίτερα αγαπητού αδέσποτου σκύλου, του Νταλάρα, που βρέθηκε νεκρός το πρωί της Δευτέρας, 5 Μαΐου 2025, στην οδό Μιαούλη 50, έχοντας, σύμφωνα με τις πρώτες ενδείξεις, πέσει θύμα δηλητηρίασης με φόλα. Ο Νταλάρας ήταν ιδιαίτερα αγαπητός στην τοπική κοινωνία της Ξάνθης και σύχναζε σε γειτονιές, όπως η Μιαούλη, η Χ. Κοψιδά, η Βελισσαρίου, το Πάρκο Μεγάλου Αλεξάνδρου και η Ευμόλπου. Οι φιλοζωικές οργανώσεις, αλλά και κάτοικοι της περιοχής απευθύνουν έκκληση προς όσους διατηρούν κάμερες ασφαλείας στις συγκεκριμένες περιοχές να τις ελέγξουν για καταγραφές, που ενδέχεται να βοηθήσουν στις έρευνες.",
    image: "https://xanthidaily.gr/wp-content/uploads/2025/05/495138145_1113252867509444_260609085874472809_n-767x520.jpg",
    date: "2025-05-02",
    source: "Δήμος Ξάνθης"
  },
  {
    id: "2",
    title: "Τα παιδιά του 6ου Νηπιαγωγείου ζήτησαν και πέτυχαν την τοποθέτηση ταΐστρας και ποτίστρας στο πάρκο του Μ. Αλεξάνδρου",
    content: "Μια συγκινητική και ουσιαστική πρωτοβουλία ανέλαβαν οι μικροί μαθητές του 6ου Νηπιαγωγείου Ξάνθης , στο πλαίσιο υλοποίησης φιλοζωικού προγράμματος που αποσκοπεί στην καλλιέργεια περιβαλλοντικής ευαισθησίας και αγάπης για τα ζώα. Με αφετηρία την επιθυμία να συμβάλουν στην προστασία και φροντίδα των αδέσποτων ζώων της περιοχής, τα παιδιά – με την καθοδήγηση των νηπιαγωγών τους – πρότειναν την τοποθέτηση ταΐστρας και ποτίστρας στο πάρκο του Μεγάλου Αλεξάνδρου, που βρίσκεται δίπλα από το σχολείο τους. Όπως ανέφερε η υπεύθυνη του προγράμματος, κα Σουλτάνα Φαϊτατζίδου , «ήταν μεγάλη μας επιθυμία να τοποθετηθεί μια ταΐστρα και μια ποτίστρα στο πάρκο , ως επιστέγασμα των φιλοζωικών δράσεων που πραγματοποιήσαμε φέτος με τα παιδιά».",
    image: "https://radio899.gr/sites/default/files/images/23_141.jpg",
    date: "2025-05-15",
    source: "6ου Νηπιαγωγείου Ξάνθης"
  },
  {
    id: "3",
    title: "Ο Φοίνικας βρήκε μια νέα «οικογένεια» στο 2ο Δημοτικό Σχολείο Ξάνθης",
    content: "Μια συγκινητική και αξιέπαινη πρωτοβουλία πήραν οι μαθητές και οι μαθήτριες του Γ2 τμήματος του 2ου Δημοτικού Σχολείου Ξάνθης, υιοθετώντας τον μικρό Φοίνικα, ένα από τα πολλά αδέσποτα σκυλάκια που φιλοξενούνται στην περιβαλλοντική φιλοζωική οργάνωση Ξάνθης «Αδέσποτοι Φίλοι». Η δράση αυτή εντάσσεται στο πλαίσιο του προγράμματος «πρώτα απόκτησε παιδεία και μετά κατοικίδιο», το οποίο υλοποιείται για τέταρτη χρονιά από το σχολείο, με στόχο να καλλιεργήσει στα παιδιά την ενσυναίσθηση, τη φροντίδα και τη φιλοζωική κουλτούρα.",
    image: "https://www.xanthinea.gr/wp-content/uploads/2025/05/skilos-2.png",
    date: "2025-05-05",
    source: "2ου Δημοτικού Σχολείου Ξάνθης"
  },
    {
      id: "4",
      title: "Άγνωστοι έκλεψαν και έκαψαν το φορτηγάκι του σωματείου «Αδεσποτούλια» Ξάνθης",
      content: "Άγνωστοι έκλεψαν και έκαψαν το φορτηγάκι του σωματείου «Αδεσποτούλια Ξάνθης», το βράδυ της περασμένης Πέμπτης, γεγονός που προκαλεί ερωτήματα και αγανάκτηση. Το φορτηγάκι ήταν παλιό, 21 ετών και είχε διανύσει 442.000 χλμ ωστόσο ήταν απαραίτητο για το σωματείο που φροντίζει τα αδέσποτα της Ξάνθης. Το σωματείο σε απόγνωση μετά την κλοπή ζητά βοήθεια για να μπορέσει να το αντικαταστήσει καθώς είναι απαραίτητο για τη σίτιση και περίθαλψη των εκατοντάδων αδέσποτων που φροντίζει.",
      date: "2025-03-31",
      image: "https://cdn.skai.gr/sites/default/files/styles/style_800x600/public/2025-03/xanthi.png.webp?itok=uSnRpKy1",
      source: "Αδεσποτούλια Ξάνθης"
    }
  ];

  const article = newsItems.find(item => item.id === articleId);

  if (!article) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Το άρθρο δεν βρέθηκε</h1>
          <Button asChild>
            <Link to="/">Επιστροφή στην αρχική</Link>
          </Button>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('el-GR', options);
  };

  const shareUrl = `${window.location.origin}/news/${article.id}`;

  const handleShare = async (platform: 'facebook' | 'twitter' | 'whatsapp' | 'copy') => {
    let url = '';
    
    switch (platform) {
      case 'facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
        window.open(url, '_blank');
        break;
      case 'twitter':
        url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${encodeURIComponent(shareUrl)}`;
        window.open(url, '_blank');
        break;
      case 'whatsapp':
        url = `https://wa.me/?text=${encodeURIComponent(article.title + ' ' + shareUrl)}`;
        window.open(url, '_blank');
        break;
      case 'copy':
        navigator.clipboard.writeText(shareUrl);
        toast({
          title: "Ο σύνδεσμος αντιγράφηκε",
          description: "Ο σύνδεσμος αντιγράφηκε στο πρόχειρο",
        });
        break;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Return Button */}
      <div className="mb-6">
        <Button variant="outline" asChild>
          <Link to="/" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Επιστροφή
          </Link>
        </Button>
      </div>

      {/* Article Content */}
      <article className="mb-8">
        {article.image && (
          <div className="w-full h-64 md:h-96 overflow-hidden rounded-lg mb-6">
            <img
              src={article.image}
              alt={article.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="mb-4">
          <h1 className="text-3xl md:text-4xl font-bold text-strays-dark-orange mb-4">
            {article.title}
          </h1>
          
          <div className="flex flex-wrap items-center justify-between gap-4 text-gray-600 mb-6">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(article.date)}</span>
              </div>
              {article.source && (
                <div className="flex items-center gap-1">
                  <Tag className="h-4 w-4" />
                  <span>{article.source}</span>
                </div>
              )}
            </div>
            
            {/* Share Button */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center">
                  <Share className="mr-2 h-4 w-4" /> 
                  Κοινοποίηση
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleShare('facebook')}>
                  Facebook
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleShare('twitter')}>
                  Twitter
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleShare('whatsapp')}>
                  WhatsApp
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleShare('copy')}>
                  Αντιγραφή συνδέσμου
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="prose prose-lg max-w-none">
          <p className="text-gray-700 leading-relaxed whitespace-pre-line">
            {article.content}
          </p>
        </div>
      </article>

      <Separator className="my-8" />

      {/* Comments Section */}
      <NewsComments articleId={article.id} />
    </div>
  );
};

export default NewsArticle;
