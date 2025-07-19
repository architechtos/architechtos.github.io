
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import InteractiveMapPreview from "./InteractiveMapPreview";
import LocationTagsInput from "./LocationTagsInput";

interface LocationFormProps {
  gpsPermission: boolean | null;
  setGpsPermission: (permission: boolean) => void;
  location: { lat: number; lng: number } | null;
  setLocation: (location: { lat: number; lng: number } | null) => void;
  locationDescription: string[];
  setLocationDescription: (tags: string[]) => void;
}

const LocationForm = ({
  gpsPermission,
  setGpsPermission,
  location,
  setLocation,
  locationDescription,
  setLocationDescription,
}: LocationFormProps) => {
  const [isLoadingGPS, setIsLoadingGPS] = useState(false);
  const { toast } = useToast();

  const handleGPSRequest = async () => {
    if (!navigator.geolocation) {
      toast({
        title: "Σφάλμα",
        description: "Η γεωτοποθεσία δεν υποστηρίζεται από τον περιηγητή σας",
        variant: "destructive",
      });
      return;
    }

    setIsLoadingGPS(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ lat: latitude, lng: longitude });
        setGpsPermission(true);

        // Simulate reverse geocoding (in a real app, you'd use a service like Google Maps API)
        try {
          // For demo purposes, we'll generate a mock address based on coordinates
          const mockAddress = `Lat: ${latitude.toFixed(4)}, Lng: ${longitude.toFixed(4)}`;
          
          // Add the address to location description if not already present
          if (!locationDescription.includes(mockAddress)) {
            setLocationDescription([...locationDescription, mockAddress]);
          }

          toast({
            title: "Τοποθεσία εντοπίστηκε",
            description: "Η τοποθεσία σας εντοπίστηκε και προστέθηκε στην περιγραφή",
          });
        } catch (error) {
          console.error("Error getting address:", error);
          toast({
            title: "Προειδοποίηση",
            description: "Η τοποθεσία εντοπίστηκε αλλά δεν ήταν δυνατή η λήψη διεύθυνσης",
            variant: "destructive",
          });
        }

        setIsLoadingGPS(false);
      },
      (error) => {
        console.error("GPS error:", error);
        setGpsPermission(false);
        setIsLoadingGPS(false);
        
        toast({
          title: "Σφάλμα GPS",
          description: "Δεν ήταν δυνατή η λήψη της τοποθεσίας σας. Παρακαλώ δοκιμάστε ξανά ή εισάγετε την τοποθεσία χειροκίνητα.",
          variant: "destructive",
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  };

  const handleLocationSelect = (selectedLocation: { lat: number; lng: number }) => {
    setLocation(selectedLocation);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>Λήψη τοποθεσίας GPS *</Label>
        <p className="text-sm text-gray-600">
          Απαιτείται η χρήση GPS ή η επιλογή τοποθεσίας στον χάρτη
        </p>
        <Button
          type="button"
          variant="outline"
          onClick={handleGPSRequest}
          disabled={isLoadingGPS}
          className={`w-full ${!location ? 'border-red-300 hover:border-red-400' : ''}`}
        >
          <MapPin className="mr-2 h-4 w-4" />
          {isLoadingGPS ? "Εντοπισμός τοποθεσίας..." : "Χρήση GPS για τοποθεσία"}
        </Button>
        {gpsPermission === false && (
          <p className="text-sm text-red-600">
            Η πρόσβαση στο GPS απορρίφθηκε. Παρακαλώ εισάγετε την τοποθεσία χειροκίνητα στον χάρτη.
          </p>
        )}
        {!location && (
          <p className="text-sm text-red-500 font-medium">
            * Απαιτείται η επιλογή τοποθεσίας
          </p>
        )}
      </div>

      <LocationTagsInput
        tags={locationDescription}
        onTagsChange={setLocationDescription}
        placeholder="π.χ. Πάρκο Αλεξάνδρου, Κέντρο πόλης, Παραλία"
      />

      <div className="space-y-2">
        <Label>Τοποθεσία στον χάρτη *</Label>
        <InteractiveMapPreview 
          location={location}
          onLocationSelect={handleLocationSelect}
        />
        {location ? (
          <p className="text-sm text-green-600">
            ✓ Συντεταγμένες: {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
          </p>
        ) : (
          <p className="text-sm text-red-500">
            * Κάντε κλικ στον χάρτη για να επιλέξετε τοποθεσία
          </p>
        )}
      </div>
    </div>
  );
};

export default LocationForm;
