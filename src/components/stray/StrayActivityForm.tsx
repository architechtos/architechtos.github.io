
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import ActivityImageUpload from "@/components/stray/ActivityImageUpload";
import StraySearchSection from "@/components/stray/StraySearchSection";
import ActivityTypeSection from "@/components/stray/ActivityTypeSection";
import ActivityDescriptionSection from "@/components/stray/ActivityDescriptionSection";
import ActivityDateSection from "@/components/stray/ActivityDateSection";
import ActivityNotesSection from "@/components/stray/ActivityNotesSection";
import GPSLocationSection from "@/components/stray/GPSLocationSection";

interface StrayActivityFormProps {
  formData: {
    stray_id: string;
    activity_type: string;
    activity_description: string;
    notes: string;
    food_type: string;
    activity_date: string;
  };
  setFormData: (data: any) => void;
  straySearch: string;
  setStraySearch: (value: string) => void;
  selectedStray: any;
  setSelectedStray: (stray: any) => void;
  activityImages: File[];
  setActivityImages: (images: File[]) => void;
  coordinates: { lat: string; lng: string };
  setCoordinates: (coords: { lat: string; lng: string }) => void;
  searchResults: any[] | undefined;
  onSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
}

const StrayActivityForm = ({
  formData,
  setFormData,
  straySearch,
  setStraySearch,
  selectedStray,
  setSelectedStray,
  activityImages,
  setActivityImages,
  coordinates,
  setCoordinates,
  searchResults,
  onSubmit,
  isSubmitting
}: StrayActivityFormProps) => {
  const { toast } = useToast();

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log("Form submission started");
    console.log("Selected stray:", selectedStray);
    console.log("Form data:", formData);
    console.log("Coordinates:", coordinates);
    console.log("Activity images:", activityImages);
    console.log("Is submitting:", isSubmitting);
    
    // Validate required fields (images are now required again)
    if (!selectedStray) {
      console.log("Validation failed: No stray selected");
      toast({
        title: "Σφάλμα",
        description: "Παρακαλώ επιλέξτε ένα αδέσποτο",
        variant: "destructive",
      });
      return;
    }

    if (!formData.activity_type) {
      console.log("Validation failed: No activity type");
      toast({
        title: "Σφάλμα",
        description: "Παρακαλώ επιλέξτε τύπο δραστηριότητας",
        variant: "destructive",
      });
      return;
    }

    if (!formData.activity_description || formData.activity_description.trim() === '') {
      console.log("Validation failed: No activity description");
      toast({
        title: "Σφάλμα",
        description: "Παρακαλώ συμπληρώστε περιγραφή δραστηριότητας",
        variant: "destructive",
      });
      return;
    }

    if (!activityImages || activityImages.length === 0) {
      console.log("Validation failed: No activity images");
      toast({
        title: "Σφάλμα",
        description: "Παρακαλώ προσθέστε τουλάχιστον μία φωτογραφία δραστηριότητας",
        variant: "destructive",
      });
      return;
    }

    if (!coordinates.lat || !coordinates.lng) {
      console.log("Validation failed: No GPS coordinates");
      toast({
        title: "Σφάλμα",
        description: "Παρακαλώ συμπληρώστε τις συντεταγμένες GPS",
        variant: "destructive",
      });
      return;
    }

    if (!formData.activity_date) {
      console.log("Validation failed: No activity date");
      toast({
        title: "Σφάλμα",
        description: "Παρακαλώ συμπληρώστε την ημερομηνία",
        variant: "destructive",
      });
      return;
    }

    console.log("All validations passed, calling onSubmit");
    onSubmit(e);
  };

  // Check if form is valid for button enabling (images are now required)
  const isFormValid = selectedStray && 
                     formData.activity_type && 
                     formData.activity_description &&
                     formData.activity_description.trim() !== '' &&
                     activityImages &&
                     activityImages.length > 0 &&
                     coordinates.lat && 
                     coordinates.lng &&
                     formData.activity_date;

  console.log("Form validation state:", {
    selectedStray: !!selectedStray,
    activity_type: !!formData.activity_type,
    activity_description: !!formData.activity_description && formData.activity_description.trim() !== '',
    activityImages: !!(activityImages && activityImages.length > 0),
    coordinates: !!(coordinates.lat && coordinates.lng),
    activity_date: !!formData.activity_date,
    isFormValid: isFormValid,
    isSubmitting: isSubmitting
  });

  const handleButtonClick = (e: React.MouseEvent) => {
    e.preventDefault();
    console.log("Button clicked directly, isSubmitting:", isSubmitting, "isFormValid:", isFormValid);
    if (!isSubmitting && isFormValid) {
      console.log("Calling handleFormSubmit");
      const formEvent = new Event('submit', { bubbles: true, cancelable: true }) as any;
      handleFormSubmit(formEvent);
    }
  };

  return (
    <form onSubmit={handleFormSubmit} className="space-y-6">
      <StraySearchSection
        straySearch={straySearch}
        setStraySearch={setStraySearch}
        searchResults={searchResults}
        selectedStray={selectedStray}
        setSelectedStray={setSelectedStray}
      />

      <ActivityTypeSection
        activityType={formData.activity_type}
        onActivityTypeChange={(value) => setFormData(prev => ({ ...prev, activity_type: value }))}
      />

      <ActivityDescriptionSection
        activityType={formData.activity_type}
        activityDescription={formData.activity_description}
        onActivityDescriptionChange={(value) => setFormData(prev => ({ ...prev, activity_description: value }))}
      />

      <ActivityImageUpload 
        images={activityImages}
        setImages={setActivityImages}
      />

      <GPSLocationSection
        coordinates={coordinates}
        setCoordinates={setCoordinates}
      />

      <ActivityDateSection
        activityDate={formData.activity_date}
        onActivityDateChange={(value) => setFormData(prev => ({ ...prev, activity_date: value }))}
      />

      <ActivityNotesSection
        notes={formData.notes}
        onNotesChange={(value) => setFormData(prev => ({ ...prev, notes: value }))}
      />

      <Button
        type="button"
        className="w-full"
        disabled={isSubmitting || !isFormValid}
        onClick={handleButtonClick}
      >
        {isSubmitting ? "Καταγραφή..." : "Καταγραφή Δραστηριότητας"}
      </Button>
    </form>
  );
};

export default StrayActivityForm;
