
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ReportTypeFormProps {
  animalType: string;
  setAnimalType: (value: string) => void;
  condition: string;
  setCondition: (value: string) => void;
  description: string;
  setDescription: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const ReportTypeForm = ({
  animalType,
  setAnimalType,
  condition,
  setCondition,
  description,
  setDescription,
}: ReportTypeFormProps) => {
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
          onChange={setDescription}
          rows={4}
        />
      </div>
    </div>
  );
};

export default ReportTypeForm;
