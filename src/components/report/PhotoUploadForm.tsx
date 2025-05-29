
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PhotoUploadFormProps {
  images: File[];
  setImages: (images: File[]) => void;
}

const PhotoUploadForm = ({ images, setImages }: PhotoUploadFormProps) => {
  const { toast } = useToast();

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
};

export default PhotoUploadForm;
