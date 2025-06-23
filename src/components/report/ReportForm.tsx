
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ReportTypeForm from "./ReportTypeForm";
import LocationForm from "./LocationForm";
import PhotoUploadForm from "./PhotoUploadForm";
import ReporterInfo from "./ReporterInfo";
import SuccessScreen from "./SuccessScreen";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const ReportForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [animalType, setAnimalType] = useState("");
  const [condition, setCondition] = useState("");
  const [gpsPermission, setGpsPermission] = useState<boolean | null>(null);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationDescription, setLocationDescription] = useState<string[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const [description, setDescription] = useState("");
  const [reporterName, setReporterName] = useState("");
  const [reporterContact, setReporterContact] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();

  const totalSteps = 4;

  const isStepValid = (step: number) => {
    switch (step) {
      case 1:
        return animalType && condition && description.trim().length > 0;
      case 2:
        return location && locationDescription.length > 0;
      case 3:
        return images.length >= 1;
      case 4:
        return reporterName.trim().length > 0 && reporterContact.trim().length > 0;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (currentStep < totalSteps && isStepValid(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const resetForm = () => {
    setCurrentStep(1);
    setAnimalType("");
    setCondition("");
    setGpsPermission(null);
    setLocation(null);
    setLocationDescription([]);
    setImages([]);
    setDescription("");
    setReporterName("");
    setReporterContact("");
  };

  const handleSubmit = async () => {
    if (!isStepValid(4)) return;

    setIsSubmitting(true);
    try {
      // Upload images first if any
      let imageUrls: string[] = [];
      
      if (images.length > 0) {
        console.log("Starting image upload process...");
        const uploadPromises = images.map(async (image, index) => {
          const fileName = `report_${Date.now()}_${index}.${image.name.split('.').pop()}`;
          console.log("Uploading image to 'reports' bucket:", fileName);
          
          const { data, error } = await supabase.storage
            .from('reports')
            .upload(fileName, image);
          
          if (error) {
            console.error("Upload error:", error);
            throw new Error(`Σφάλμα μεταφόρτωσης εικόνας: ${error.message}`);
          }
          
          const { data: { publicUrl } } = supabase.storage
            .from('reports')
            .getPublicUrl(fileName);
          
          console.log("Image uploaded successfully:", publicUrl);
          return publicUrl;
        });
        
        imageUrls = await Promise.all(uploadPromises);
        console.log("All images uploaded:", imageUrls);
      }

      // Submit report to database
      const reportData = {
        animal_type: animalType,
        condition,
        description,
        location_lat: location?.lat,
        location_lng: location?.lng,
        location_description: locationDescription.join(', '),
        image_urls: imageUrls,
        user_id: user?.id || null
      };

      console.log("Submitting report data:", reportData);

      const { data: insertedReport, error } = await supabase
        .from('reports')
        .insert([reportData])
        .select()
        .single();

      if (error) {
        console.error("Database insertion error:", error);
        throw error;
      }

      // Award 5 points for report if user is authenticated
      if (user?.id) {
        await supabase.rpc('add_user_points', {
          user_id: user.id,
          activity_type: 'report',
          points_to_add: 5,
          reference_id: insertedReport.id
        });
      }

      setCurrentStep(5);
      toast({
        title: "Επιτυχία!",
        description: "Η αναφορά σας καταχωρήθηκε επιτυχώς και κερδίσατε 5 πόντους!"
      });
    } catch (error: any) {
      console.error('Error submitting report:', error);
      toast({
        title: "Σφάλμα",
        description: error.message || "Σφάλμα κατά την καταχώρηση της αναφοράς",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (currentStep === 5) {
    return <SuccessScreen resetForm={resetForm} />;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>
            Αναφορά αδέσποτου
          </CardTitle>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-strays-orange h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
          <p className="text-sm text-gray-600">
            Βήμα {currentStep} από {totalSteps}
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          {currentStep === 1 && (
            <ReportTypeForm
              animalType={animalType}
              setAnimalType={setAnimalType}
              condition={condition}
              setCondition={setCondition}
              description={description}
              setDescription={setDescription}
            />
          )}

          {currentStep === 2 && (
            <LocationForm
              gpsPermission={gpsPermission}
              setGpsPermission={setGpsPermission}
              location={location}
              setLocation={setLocation}
              locationDescription={locationDescription}
              setLocationDescription={setLocationDescription}
            />
          )}

          {currentStep === 3 && (
            <PhotoUploadForm
              images={images}
              setImages={setImages}
            />
          )}

          {currentStep === 4 && (
            <ReporterInfo
              reporterName={reporterName}
              setReporterName={setReporterName}
              reporterContact={reporterContact}
              setReporterContact={setReporterContact}
            />
          )}

          <div className="flex justify-between pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 1}
            >
              Προηγούμενο
            </Button>

            {currentStep === totalSteps ? (
              <Button
                onClick={handleSubmit}
                disabled={!isStepValid(currentStep) || isSubmitting}
                className="bg-strays-orange hover:bg-strays-orange/90"
              >
                {isSubmitting ? "Αποστολή..." : "Καταχώρηση Αναφοράς"}
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                disabled={!isStepValid(currentStep)}
                className="bg-strays-orange hover:bg-strays-orange/90"
              >
                Επόμενο
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportForm;
