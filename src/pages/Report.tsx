import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useRanking } from "@/hooks/use-ranking";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import UserRank from "@/components/user/UserRank";

// Import our new components
import ReportTypeForm from "@/components/report/ReportTypeForm";
import LocationForm from "@/components/report/LocationForm";
import PhotoUploadForm from "@/components/report/PhotoUploadForm";
import SuccessScreen from "@/components/report/SuccessScreen";

const Report = () => {
  const [step, setStep] = useState(1);
  const [animalType, setAnimalType] = useState("");
  const [condition, setCondition] = useState("");
  const [description, setDescription] = useState("");
  const [locationDescription, setLocationDescription] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [gpsPermission, setGpsPermission] = useState<boolean | null>(null);
  const [location, setLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [reportId, setReportId] = useState<string>("");
  const { toast } = useToast();
  const { awardReportPoints } = useRanking();
  const { user } = useAuth();

  const nextStep = () => {
    if (step === 1 && !animalType) {
      toast({
        title: "Συμπληρώστε όλα τα πεδία",
        description: "Παρακαλώ επιλέξτε το είδος του ζώου",
        variant: "destructive"
      });
      return;
    }
    if (step === 2 && !location && !locationDescription) {
      toast({
        title: "Απαιτείται τοποθεσία",
        description: "Παρακαλώ επιτρέψτε την πρόσβαση στην τοποθεσία σας ή περιγράψτε την τοποθεσία",
        variant: "destructive"
      });
      return;
    }
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const handleSubmit = async () => {
    if (!user) {
      toast({
        title: "Σφάλμα",
        description: "Πρέπει να συνδεθείτε για να υποβάλετε αναφορά",
        variant: "destructive"
      });
      return;
    }
    setIsSubmitting(true);
    try {
      // Generate a unique ID for the report
      const generatedReportId = crypto.randomUUID();
      setReportId(generatedReportId);

      // Upload images to storage if needed
      const imageUrls = [];
      for (const image of images) {
        const fileName = `${Date.now()}_${image.name}`;
        const { error: uploadError, data } = await supabase.storage
          .from('reports')
          .upload(`${user.id}/${generatedReportId}/${fileName}`, image);
        
        if (uploadError) throw uploadError;
        
        if (data) {
          const { data: urlData } = supabase.storage
            .from('reports')
            .getPublicUrl(data.path);
          imageUrls.push(urlData.publicUrl);
        }
      }

      // Award points for submitting a report
      const result = await awardReportPoints(generatedReportId);
      if (result.success) {
        // Show success message with points
        toast({
          title: "Επιτυχής υποβολή",
          description: "Η αναφορά σας υποβλήθηκε επιτυχώς!"
        });

        // If user ranked up, show a special message
        if (result.newRank) {
          setTimeout(() => {
            toast({
              title: "Συγχαρητήρια! 🎉",
              description: `Αναβαθμιστήκατε σε ${result.newRank!.name}!`
            });
          }, 1000);
        }
        setStep(4);
      }
    } catch (error) {
      console.error("Error submitting report:", error);
      toast({
        title: "Σφάλμα",
        description: "Υπήρξε ένα πρόβλημα με την υποβολή της αναφοράς.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    // Reset form state
    setStep(1);
    setAnimalType("");
    setCondition("");
    setDescription("");
    setLocationDescription("");
    setImages([]);
    setGpsPermission(null);
    setLocation(null);
    setReportId("");
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return <ReportTypeForm 
          animalType={animalType} 
          setAnimalType={setAnimalType} 
          condition={condition} 
          setCondition={setCondition} 
          description={description} 
          setDescription={(e) => setDescription(e.target.value)} 
        />;
      case 2:
        return <LocationForm 
          gpsPermission={gpsPermission} 
          setGpsPermission={setGpsPermission} 
          location={location} 
          setLocation={setLocation} 
          locationDescription={locationDescription} 
          setLocationDescription={(e) => setLocationDescription(e.target.value)} 
        />;
      case 3:
        return <PhotoUploadForm images={images} setImages={setImages} />;
      case 4:
        return <SuccessScreen resetForm={resetForm} />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Αναφορά αδέσποτου σε ανάγκη</h1>
        <p className="text-gray-600">Συμπληρώστε όσο το δυνατόν περισσότερα στοιχεία στη φόρμα για να αναφέρετε ένα αδέσποτο ζώο που χρειάζεται βοήθεια</p>
      </div>

      {user && (
        <div className="mb-6 flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Πόντοι για κάθε αναφορά: <span className="font-bold text-strays-orange">+5</span>
          </div>
          <UserRank />
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>
            {step === 4 ? "Ολοκλήρωση" : `Βήμα ${step}/3: ${step === 1 ? "Πληροφορίες Ζώου" : step === 2 ? "Τοποθεσία" : "Φωτογραφίες"}`}
          </CardTitle>
          {step < 4 && (
            <CardDescription>
              {step === 1 ? "Παρακαλώ συμπληρώστε τις πληροφορίες σχετικά με το αδέσποτο ζώο" : 
               step === 2 ? "Υποδείξτε την τοποθεσία όπου εντοπίσατε το ζώο" : 
               "Προσθέστε φωτογραφίες αν είναι διαθέσιμες"}
            </CardDescription>
          )}
        </CardHeader>

        <CardContent>
          {renderStepContent()}
        </CardContent>

        {step < 4 && (
          <CardFooter className="flex justify-between">
            {step > 1 ? (
              <Button variant="outline" onClick={prevStep}>
                Προηγούμενο
              </Button>
            ) : (
              <div></div>
            )}
            {step < 3 ? (
              <Button className="bg-strays-orange hover:bg-strays-dark-orange" onClick={nextStep}>
                Επόμενο
              </Button>
            ) : (
              <Button 
                className="bg-strays-orange hover:bg-strays-dark-orange" 
                onClick={handleSubmit} 
                disabled={isSubmitting}
              >
                {isSubmitting ? "Υποβολή..." : "Υποβολή"}
              </Button>
            )}
          </CardFooter>
        )}
      </Card>
    </div>
  );
};

export default Report;
