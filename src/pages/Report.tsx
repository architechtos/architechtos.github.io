
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { MapPin, Camera, Upload, CheckCircle2 } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const Report = () => {
  const [step, setStep] = useState(1);
  const [animalType, setAnimalType] = useState("");
  const [condition, setCondition] = useState("");
  const [description, setDescription] = useState("");
  const [locationDescription, setLocationDescription] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [gpsPermission, setGpsPermission] = useState<boolean | null>(null);
  const [location, setLocation] = useState<{lat: number, lng: number} | null>(null);
  const { toast } = useToast();
  const isMobile = useIsMobile();

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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      if (images.length + selectedFiles.length > 3) {
        toast({
          title: "Σφάλμα",
          description: "Μπορείτε να ανεβάσετε μέχρι 3 εικόνες",
          variant: "destructive",
        });
        return;
      }
      setImages([...images, ...selectedFiles]);
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const nextStep = () => {
    if (step === 1 && !animalType) {
      toast({
        title: "Συμπληρώστε όλα τα πεδία",
        description: "Παρακαλώ επιλέξτε το είδος του ζώου",
        variant: "destructive",
      });
      return;
    }
    
    if (step === 2 && !location) {
      toast({
        title: "Απαιτείται τοποθεσία",
        description: "Παρακαλώ επιτρέψτε την πρόσβαση στην τοποθεσία σας ή περιγράψτε την τοποθεσία",
        variant: "destructive",
      });
      return;
    }

    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Επιτυχής υποβολή",
        description: "Η αναφορά σας υποβλήθηκε επιτυχώς!",
      });
      setStep(4);
    }, 2000);
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="animalType">Είδος Ζώου</Label>
              <Select value={animalType} onValueChange={setAnimalType}>
                <SelectTrigger>
                  <SelectValue placeholder="Επιλέξτε είδος ζώου" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dog">Σκύλος</SelectItem>
                  <SelectItem value="cat">Γάτα</SelectItem>
                  <SelectItem value="other">Άλλο</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="condition">Κατάσταση Ζώου</Label>
              <Select value={condition} onValueChange={setCondition}>
                <SelectTrigger>
                  <SelectValue placeholder="Επιλέξτε κατάσταση" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="healthy">Υγιές</SelectItem>
                  <SelectItem value="injured">Τραυματισμένο</SelectItem>
                  <SelectItem value="sick">Άρρωστο</SelectItem>
                  <SelectItem value="unknown">Δεν γνωρίζω</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Περιγραφή</Label>
              <Textarea
                id="description"
                placeholder="Περιγράψτε το ζώο και την κατάστασή του..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
              />
            </div>
          </div>
        );

      case 2:
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
                onChange={(e) => setLocationDescription(e.target.value)}
                rows={3}
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label>Φωτογραφίες (προαιρετικά, έως 3)</Label>
              <div className="flex flex-col space-y-4">
                <div className="flex items-center space-x-2">
                  <Label
                    htmlFor="image-upload"
                    className="cursor-pointer flex items-center justify-center p-8 border-2 border-dashed border-gray-300 rounded-md hover:border-strays-orange transition-colors"
                  >
                    <div className="text-center">
                      <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                      <span className="text-sm text-gray-600">
                        Επιλέξτε φωτογραφίες
                      </span>
                    </div>
                  </Label>
                  <Input
                    id="image-upload"
                    type="file"
                    className="hidden"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                  />
                </div>
                
                {images.length > 0 && (
                  <div className="grid grid-cols-3 gap-4">
                    {images.map((image, index) => (
                      <div key={index} className="relative">
                        <img
                          src={URL.createObjectURL(image)}
                          alt={`Uploaded ${index + 1}`}
                          className="h-24 w-24 object-cover rounded-md border border-gray-200"
                        />
                        <button
                          type="button"
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                          onClick={() => removeImage(index)}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-3 w-3"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="text-center py-8">
            <div className="bg-green-50 border border-green-200 rounded-full mx-auto h-16 w-16 flex items-center justify-center mb-4">
              <CheckCircle2 className="h-8 w-8 text-green-500" />
            </div>
            <h3 className="text-lg font-medium mb-2">Ευχαριστούμε!</h3>
            <p className="text-gray-600 mb-6">
              Η αναφορά σας καταχωρήθηκε με επιτυχία και θα ελεγχθεί από την ομάδα μας το συντομότερο δυνατό.
            </p>
            <Button 
              onClick={() => {
                // Reset form
                setStep(1);
                setAnimalType("");
                setCondition("");
                setDescription("");
                setLocationDescription("");
                setImages([]);
                setGpsPermission(null);
                setLocation(null);
              }}
              className="bg-strays-orange hover:bg-strays-dark-orange"
            >
              Νέα Αναφορά
            </Button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Αναφορά Αδέσποτου</h1>
        <p className="text-gray-600">
          Συμπληρώστε τη φόρμα για να αναφέρετε ένα αδέσποτο ζώο που χρειάζεται βοήθεια
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            {step === 4
              ? "Ολοκλήρωση"
              : `Βήμα ${step}/3: ${
                  step === 1
                    ? "Πληροφορίες Ζώου"
                    : step === 2
                    ? "Τοποθεσία"
                    : "Φωτογραφίες"
                }`}
          </CardTitle>
          {step < 4 && (
            <CardDescription>
              {step === 1
                ? "Παρακαλώ συμπληρώστε τις πληροφορίες σχετικά με το αδέσποτο ζώο"
                : step === 2
                ? "Υποδείξτε την τοποθεσία όπου εντοπίσατε το ζώο"
                : "Προσθέστε φωτογραφίες αν είναι διαθέσιμες"}
            </CardDescription>
          )}
        </CardHeader>

        <CardContent>{renderStepContent()}</CardContent>

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
