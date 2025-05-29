
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface LocationFormProps {
  gpsPermission: boolean | null;
  setGpsPermission: (permission: boolean) => void;
  location: { lat: number; lng: number } | null;
  setLocation: (location: { lat: number; lng: number } | null) => void;
  locationDescription: string;
  setLocationDescription: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const LocationForm = ({
  gpsPermission,
  setGpsPermission,
  location,
  setLocation,
  locationDescription,
  setLocationDescription,
}: LocationFormProps) => {
  const { toast } = useToast();

  const requestGpsPermission = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setLocation({ lat, lng });
          setGpsPermission(true);
          toast({
            title: "Επιτυχία",
            description: "Η τοποθεσία σας εντοπίστηκε επιτυχώς",
          });
        },
        () => {
          setGpsPermission(false);
          toast({
            title: "Σφάλμα",
            description: "Δεν ήταν δυνατός ο εντοπισμός της τοποθεσίας σας",
            variant: "destructive",
          });
        }
      );
    } else {
      toast({
        title: "Σφάλμα",
        description: "Ο browser σας δεν υποστηρίζει τον εντοπισμό τοποθεσίας",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>Τοποθεσία GPS</Label>
        <div className="flex items-center space-x-2 mb-2">
          <Button 
            onClick={requestGpsPermission} 
            className="space-x-2"
            variant="outline"
          >
            <MapPin className="h-4 w-4" />
            <span>Εντοπισμός τωρινής τοποθεσίας</span>
          </Button>
        </div>
        {gpsPermission === true && location && (
          <div className="bg-green-50 border border-green-200 p-3 rounded-md">
            <div className="flex items-center">
              <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
              <p className="text-sm">
                Η τοποθεσία εντοπίστηκε: {location.lat.toFixed(5)}, {location.lng.toFixed(5)}
              </p>
            </div>
          </div>
        )}
        {gpsPermission === false && (
          <div className="bg-red-50 border border-red-200 p-3 rounded-md">
            <p className="text-sm text-red-600">
              Δεν ήταν δυνατή η πρόσβαση στην τοποθεσία σας. Παρακαλώ περιγράψτε την τοποθεσία παρακάτω.
            </p>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="locationDescription">Περιγραφή Τοποθεσίας</Label>
        <Textarea
          id="locationDescription"
          placeholder="Περιγράψτε την τοποθεσία όπου βρίσκεται το αδέσποτο..."
          value={locationDescription}
          onChange={setLocationDescription}
          rows={3}
        />
      </div>
    </div>
  );
};

export default LocationForm;
