import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import NewsList from "@/components/news/NewsList";
import { useAuth } from "@/contexts/AuthContext";
import { useIsMobile } from "@/hooks/use-mobile";
const Index = () => {
  const {
    isAuthenticated
  } = useAuth();
  const isMobile = useIsMobile();
  useEffect(() => {
    // Set the document title
    document.title = "Αδέσπολις - Αρχική";
  }, []);
  return <div className="space-y-10">
      {/* Hero background with gradient overlay */}
      <section className="relative">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1415369629372-26f2fe60c467')",
          }}
          >
          </div>
          <div className={`relative ${isMobile ? 'py-16' : 'py-24'} px-6`}>
          <div className="mx-auto max-w-3xl text-center">
            <h1 className={`${isMobile ? 'text-3xl' : 'text-4xl md:text-5xl'} font-bold text-white mb-6`}>Βοήθησε τα αδέσποτα της πόλης σου!</h1>
            <p className="text-lg text-white mb-8">Ενημερώσου, συμμετείχε σε δράσεις και συζητήσεις για την ευζωία των αδέσποτων της περιοχής σου και βοηθήστε στην προστασία και φροντίδα τους. </p>
            <div className="flex flex-wrap gap-4 justify-center">
              {isAuthenticated ? <Link to="/report">
                  <Button size="lg" className="bg-white text-strays-orange hover:bg-gray-100">
                    Αναφέρετε ένα αδέσποτο
                  </Button>
                </Link> : <Link to="/register">
                  <Button size="lg" className="bg-white text-strays-orange hover:bg-gray-100">
                    Εγγραφείτε τώρα
                  </Button>
                </Link>}
              <Link to="/soon">
                <Button size="lg" variant="outline" className="border-white hover:bg-white/20 text-orange-500">
                  Περισσότερες πληροφορίες
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* News Section */}
      <section className={isMobile ? "mt-8 px-4" : "container mt-16"}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Τελευταία νέα</h2>
          <Button variant="link" className="text-strays-orange">
            Δείτε όλα τα νέα
          </Button>
        </div>
        <NewsList />
      </section>

      {/* Features */}
      <section className={`bg-gray-50 py-12 ${isMobile ? "px-4" : ""}`}>
        <div className="container mx-auto">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-12">
            Πώς μπορείτε να βοηθήσετε
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-all border border-gray-100">
              <div className="h-12 w-12 bg-strays-orange/10 rounded-lg flex items-center justify-center mb-4">
                <svg className="h-6 w-6 text-strays-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Αναφέρετε αδέσποτα</h3>
              <p className="text-gray-600">
                Βοηθήστε αναφέροντας τα αδέσποτα της γειτονιά σας ωστε να δημιουργηθεί τοπικά μια βάση δεδομένων ή εντοπίζοντας αδέσποτα ζώα που χρειάζονται βοήθεια στην περιοχή σας.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-all border border-gray-100">
              <div className="h-12 w-12 bg-strays-orange/10 rounded-lg flex items-center justify-center mb-4">
                <svg className="h-6 w-6 text-strays-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Συμμετέχετε στο φόρουμ</h3>
              <p className="text-gray-600">
                Μοιραστείτε ιδέες και συμβουλές με άλλα μέλη της κοινότητας για την προστασία των αδέσποτων.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-all border border-gray-100">
              <div className="h-12 w-12 bg-strays-orange/10 rounded-lg flex items-center justify-center mb-4">
                <svg className="h-6 w-6 text-strays-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Γίνετε εθελοντής</h3>
              <p className="text-gray-600">
                Προσφέρετε χρόνο και βοήθεια σε τοπικά καταφύγια και οργανώσεις προστασίας ζώων.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className={`${isMobile ? "px-4 mb-8" : "container mb-16"}`}>
        <div className="bg-strays-orange rounded-xl overflow-hidden">
          <div className="p-8 md:p-12 text-white text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Κάθε βοήθεια μετράει
            </h2>
            <p className="text-lg mb-6 max-w-2xl mx-auto">
              Γίνετε μέλος της κοινότητάς μας και βοηθήστε να κάνουμε τη διαφορά για τα αδέσποτα ζώα της Ελλάδας.
            </p>
            {!isAuthenticated && <Link to="/register">
                <Button size="lg" className="bg-white text-strays-orange hover:bg-gray-100">
                  Εγγραφείτε τώρα
                </Button>
              </Link>}
          </div>
        </div>
      </section>
    </div>;
};
export default Index;
