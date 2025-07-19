
import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface StrayLocationInfoProps {
  form: UseFormReturn<any>;
}

const StrayLocationInfo = ({ form }: StrayLocationInfoProps) => {
  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="locationDescription"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Τοποθεσία αδέσποτου</FormLabel>
            <FormControl>
              <Input placeholder="πληκτρολογήστε μόνο την διεύθυνση" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="story"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Σύντομη ιστορία</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Διηγηθείτε όσα γνωρίζετε από την ιστορία του αδέσποτου..."
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default StrayLocationInfo;
