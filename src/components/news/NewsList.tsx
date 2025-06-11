
import { useState, useEffect } from 'react';
import NewsCard, { NewsItem } from './NewsCard';
import { useIsMobile } from '@/hooks/use-mobile';

const mockNews: NewsItem[] = [
  {
    id: '1',
    title: "Πολίτες και 'Αδέσποτοι Φίλοι' δίνουν 2.000 ευρώ σε όποιον/α δώσει πληροφορίες για το δράστη που δολοφόνησε με φόλες 4 αδέσποτα σκυλιά",
    content: "Αποτροπιασμό και θυμό προκαλεί η εγκληματική ενέργεια από άγνωστο δράστη προς το παρόν, που οδήγησε στο θάνατο ενός ιδιαίτερα αγαπητού αδέσποτου σκύλου, του Νταλάρα, που βρέθηκε νεκρός το πρωί της Δευτέρας, 5 Μαΐου 2025, στην οδό Μιαούλη 50, έχοντας, σύμφωνα με τις πρώτες ενδείξεις, πέσει θύμα δηλητηρίασης με φόλα. Ο Νταλάρας ήταν ιδιαίτερα αγαπητός στην τοπική κοινωνία της Ξάνθης και σύχναζε σε γειτονιές, όπως η Μιαούλη, η Χ. Κοψιδά, η Βελισσαρίου, το Πάρκο Μεγάλου Αλεξάνδρου και η Ευμόλπου. Οι φιλοζωικές οργανώσεις, αλλά και κάτοικοι της περιοχής απευθύνουν έκκληση προς όσους διατηρούν κάμερες ασφαλείας στις συγκεκριμένες περιοχές να τις ελέγξουν για καταγραφές, που ενδέχεται να βοηθήσουν στις έρευνες.",
    image: 'https://xanthidaily.gr/wp-content/uploads/2025/05/495138145_1113252867509444_260609085874472809_n-767x520.jpg',
    date: '2025-05-02',
    source: 'Δήμος Ξάνθης'
  },
  {
    id: '2',
    title: 'Τα παιδιά του 6ου Νηπιαγωγείου ζήτησαν και πέτυχαν την τοποθέτηση ταΐστρας και ποτίστρας στο πάρκο του Μ. Αλεξάνδρου',
    content: "Μια συγκινητική και ουσιαστική πρωτοβουλία ανέλαβαν οι μικροί μαθητές του 6ου Νηπιαγωγείου Ξάνθης , στο πλαίσιο υλοποίησης φιλοζωικού προγράμματος που αποσκοπεί στην καλλιέργεια περιβαλλοντικής ευαισθησίας και αγάπης για τα ζώα. Με αφετηρία την επιθυμία να συμβάλουν στην προστασία και φροντίδα των αδέσποτων ζώων της περιοχής, τα παιδιά – με την καθοδήγηση των νηπιαγωγών τους – πρότειναν την τοποθέτηση ταΐστρας και ποτίστρας στο πάρκο του Μεγάλου Αλεξάνδρου, που βρίσκεται δίπλα από το σχολείο τους. Όπως ανέφερε η υπεύθυνη του προγράμματος, κα Σουλτάνα Φαϊτατζίδου , «ήταν μεγάλη μας επιθυμία να τοποθετηθεί μια ταΐστρα και μια ποτίστρα στο πάρκο , ως επιστέγασμα των φιλοζωικών δράσεων που πραγματοποιήσαμε φέτος με τα παιδιά».",
    image: 'https://radio899.gr/sites/default/files/images/23_141.jpg',
    date: '2025-05-15',
    source: '6ου Νηπιαγωγείου Ξάνθης'
  },
  {
    id: '3',
    title: 'Ο Φοίνικας βρήκε μια νέα «οικογένεια» στο 2ο Δημοτικό Σχολείο Ξάνθης',
    content: "Μια συγκινητική και αξιέπαινη πρωτοβουλία πήραν οι μαθητές και οι μαθήτριες του Γ2 τμήματος του 2ου Δημοτικού Σχολείου Ξάνθης, υιοθετώντας τον μικρό Φοίνικα, ένα από τα πολλά αδέσποτα σκυλάκια που φιλοξενούνται στην περιβαλλοντική φιλοζωική οργάνωση Ξάνθης «Αδέσποτοι Φίλοι». Η δράση αυτή εντάσσεται στο πλαίσιο του προγράμματος «πρώτα απόκτησε παιδεία και μετά κατοικίδιο», το οποίο υλοποιείται για τέταρτη χρονιά από το σχολείο, με στόχο να καλλιεργήσει στα παιδιά την ενσυναίσθηση, τη φροντίδα και τη φιλοζωική κουλτούρα.",
    image: 'https://www.xanthinea.gr/wp-content/uploads/2025/05/skilos-2.png',
    date: '2025-05-05',
    source: '2ου Δημοτικού Σχολείου Ξάνθης'
  }
];

const NewsList = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const isMobile = useIsMobile();

  useEffect(() => {
    // Simulate API fetch
    const fetchNews = async () => {
      setIsLoading(true);
      // In a real app, this would be an API call
      setTimeout(() => {
        setNews(mockNews);
        setIsLoading(false);
      }, 1000);
    };

    fetchNews();
  }, []);

  if (isLoading) {
    return (
      <div className={isMobile ? "space-y-6" : "grid grid-cols-1 md:grid-cols-3 gap-6"}>
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-lg border bg-card text-card-foreground shadow-sm">
            <div className="w-full h-48 bg-gray-200 animate-pulse"></div>
            <div className="p-6 space-y-4">
              <div className="h-6 bg-gray-200 animate-pulse rounded"></div>
              <div className="h-4 bg-gray-200 animate-pulse rounded"></div>
              <div className="h-4 bg-gray-200 animate-pulse rounded w-3/4"></div>
              <div className="flex justify-between">
                <div className="h-4 bg-gray-200 animate-pulse rounded w-1/4"></div>
                <div className="h-8 bg-gray-200 animate-pulse rounded w-1/3"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={isMobile ? "space-y-6" : "grid grid-cols-1 md:grid-cols-3 gap-6"}>
      {news.map((item) => (
        <NewsCard key={item.id} item={item} />
      ))}
    </div>
  );
};

export default NewsList;
