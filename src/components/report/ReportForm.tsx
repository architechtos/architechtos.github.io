
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useRanking } from "@/hooks/use-ranking";
import ReporterInfo from "./ReporterInfo";
import ReportBasicInfo from "./ReportBasicInfo";
import LocationForm from "./LocationForm";
import PhotoUploadForm from "./PhotoUploadForm";
import SuccessScreen from "./SuccessScreen";
import { validateFiles, generateSecureFileName } from "@/utils/fileValidation";
import { sanitizeDescription, validateCoordinates } from "@/utils/inputValidation";
import { sanitizeError, logSecurityEvent } from "@/utils/errorHandling";

const ReportForm = () => {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const { awardPoints } = useRanking();

  const [animalType, setAnimalType] = useState("");
  const [condition, setCondition] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [gpsPermission, setGpsPermission] = useState<boolean | null>(null);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationDescription, setLocationDescription] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const resetForm = () => {
    setAnimalType("");
    setCondition("");
    setDescription("");
    setImages([]);
    setGpsPermission(null);
    setLocation(null);
    setLocationDescription([]);
    setSubmitted(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated || !user?.id) {
      logSecurityEvent('unauthorized_report_attempt', { userId: user?.id });
      toast({
        title: "Απαιτείται σύνδεση",
        description: "Πρέπει να συνδεθείτε για να υποβάλετε αναφορά",
        variant: "destructive",
      });
      return;
    }

    if (!animalType || !condition || !description) {
      toast({
        title: "Συμπληρώστε όλα τα απαιτούμενα πεδία",
        description: "Παρακαλώ συμπληρώστε όλα τα υποχρεωτικά πεδία",
        variant: "destructive",
      });
      return;
    }

    if (location && !validateCoordinates(location.lat, location.lng)) {
      logSecurityEvent('invalid_coordinates_attempt', { location, userId: user.id });
      toast({
        title: "Μη έγκυρες συντεταγμένες",
        description: "Οι συντεταγμένες τοποθεσίας δεν είναι έγκυρες",
        variant: "destructive",
      });
      return;
    }

    if (images.length > 0) {
      const validationErrors = validateFiles(images);
      if (validationErrors.length > 0) {
        toast({
          title: "Σφάλμα αρχείων",
          description: validationErrors[0].message,
          variant: "destructive",
        });
        return;
      }
    }

    setIsSubmitting(true);

    try {
      let imageUrls: string[] = [];

      if (images.length > 0) {
        for (let i = 0; i < images.length; i++) {
          const image = images[i];
          const secureFileName = generateSecureFileName(image.name, user.id);
          
          const { error: uploadError, data: uploadData } = await supabase.storage
            .from('reports')
            .upload(secureFileName, image, {
              cacheControl: '3600',
              upsert: false
            });

          if (uploadError) {
            console.error("Image upload error:", uploadError);
            logSecurityEvent('file_upload_error', { error: uploadError, userId: user.id });
            continue;
          }

          if (uploadData) {
            const { data: urlData } = supabase.storage
              .from('reports')
              .getPublicUrl(uploadData.path);
            imageUrls.push(urlData.publicUrl);
          }
        }
      }

      const reportData = {
        animal_type: animalType,
        condition,
        description: sanitizeDescription(description),
        location_lat: location?.lat || null,
        location_lng: location?.lng || null,
        location_description: locationDescription.length > 0 ? locationDescription.join(', ') : null,
        image_urls: imageUrls.length > 0 ? imageUrls : null,
        user_id: user.id
      };

      const { error } = await supabase
        .from('reports')
        .insert([reportData]);

      if (error) {
        console.error("Database error:", error);
        logSecurityEvent('report_submission_error', { error: error.message, userId: user.id });
        throw error;
      }

      toast({
        title: "Επιτυχής υποβολή!",
        description: "Η αναφορά σας υποβλήθηκε επιτυχώς",
      });

      try {
        await awardPoints('report', 1);
      } catch (pointsError) {
        console.error("Error awarding points:", pointsError);
      }

      setSubmitted(true);
    } catch (error) {
      console.error("Error submitting report:", error);
      const sanitizedError = sanitizeError(error);
      toast({
        title: "Σφάλμα",
        description: sanitizedError,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return <SuccessScreen resetForm={resetForm} />;
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Αναφορά Αδέσποτου Ζώου</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-8">
          <ReporterInfo />

          <ReportBasicInfo
            animalType={animalType}
            setAnimalType={setAnimalType}
            condition={condition}
            setCondition={setCondition}
            description={description}
            setDescription={setDescription}
          />

          <LocationForm
            gpsPermission={gpsPermission}
            setGpsPermission={setGpsPermission}
            location={location}
            setLocation={setLocation}
            locationDescription={locationDescription}
            setLocationDescription={setLocationDescription}
          />

          <PhotoUploadForm images={images} setImages={setImages} />

          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Υποβολή..." : "Υποβολή Αναφοράς"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ReportForm;
