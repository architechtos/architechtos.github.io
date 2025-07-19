import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import NewsCard from "@/components/news/NewsCard";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useState } from "react";

const AllNews = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Extended mock data with more articles
  const allNewsItems = [
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
    },
    {
      id: "5",
      title: "Εκπαίδευση εθελοντών για πρώτες βοήθειες",
      content: "Διοργανώθηκε σεμινάριο εκπαίδευσης εθελοντών για την παροχή πρώτων βοηθειών σε αδέσποτα ζώα...",
      date: "2024-01-05",
      image: "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?ixlib=rb-4.0.3",
      source: "Εκπαίδευση"
    },
    {
      id: "6",
      title: "Συλλογή τροφών για αδέσποτα",
      content: "Επιτυχημένη διοργάνωση συλλογής τροφών και ειδών φροντίδας για τα αδέσποτα ζώα της πόλης...",
      date: "2024-01-03",
      image: "https://images.unsplash.com/photo-1530281700549-e82e7bf110d6?ixlib=rb-4.0.3",
      source: "Συλλογές"
    }
  ];

  const totalPages = Math.ceil(allNewsItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = allNewsItems.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Return Button */}
      <div className="mb-8">
        <Button variant="outline" asChild>
          <Link to="/" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Επιστροφή
          </Link>
        </Button>
      </div>

      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold mb-4">Όλα τα Νέα</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Ενημερωθείτε για όλες τις δράσεις και εξελίξεις σχετικά με τα αδέσποτα ζώα
        </p>
      </div>

      {/* News Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
        {currentItems.map((item) => (
          <NewsCard key={item.id} item={item} showReadMore={true} />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                href="#" 
                onClick={(e) => {
                  e.preventDefault();
                  if (currentPage > 1) setCurrentPage(currentPage - 1);
                }}
                className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
            
            {[...Array(totalPages)].map((_, index) => (
              <PaginationItem key={index + 1}>
                <PaginationLink
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentPage(index + 1);
                  }}
                  isActive={currentPage === index + 1}
                >
                  {index + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            
            <PaginationItem>
              <PaginationNext 
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (currentPage < totalPages) setCurrentPage(currentPage + 1);
                }}
                className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};

export default AllNews;
