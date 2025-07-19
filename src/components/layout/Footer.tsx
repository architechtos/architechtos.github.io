import { Link } from "react-router-dom";
const Footer = () => {
  return <footer className="bg-white border-t border-gray-200 py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-strays-orange flex items-center justify-center">
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </div>
              <span className="ml-2 text-lg font-medium text-gray-900">Αδεσπολις</span>
            </Link>
            <p className="mt-2 text-sm text-orange-500">Καταχωρημένη εκδοση:1.9. 
                                                        Ημερομηνία αναβάθμισης: 19/07/2025</p>
            <p className="mt-2 text-sm text-gray-500">Παρέχουμε μία πλατφόρμα με τα απαραίτητα
εργαλεία για την καταγραφή, την υποστήριξη 
και βοήθεια των αδέσποτων ζώων στην Ξανθη.</p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">
              Πλοήγηση
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link to="/" className="text-sm text-gray-500 hover:text-strays-orange">
                  Αρχική
                </Link>
              </li>
              <li>
                <Link to="/forum" className="text-sm text-gray-500 hover:text-strays-orange">
                  Φόρουμ
                </Link>
              </li>
              <li>
                <Link to="/chat" className="text-sm text-gray-500 hover:text-strays-orange">
                  Συνομιλία
                </Link>
              </li>
              <li>
                <Link to="/report" className="text-sm text-gray-500 hover:text-strays-orange">
                  Αναφορά Αδέσποτου
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">
              Επικοινωνία
            </h3>
            <ul className="mt-4 space-y-2">
              <li className="flex">
                <span className="text-sm text-gray-500">
                  Email: 
                </span>
              </li>
              <li className="flex">
                <span className="text-sm text-gray-500">
                  Τηλέφωνο: +30 25410 
                </span>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-200 pt-4">
          <p className="text-sm text-center text-gray-400">
            &copy; {new Date().getFullYear()} Architecht. Με επιφύλαξη παντός δικαιώματος.
          </p>
        </div>
      </div>
    </footer>;
};
export default Footer;
