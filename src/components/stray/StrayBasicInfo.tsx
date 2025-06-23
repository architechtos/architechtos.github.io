
import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface StrayBasicInfoProps {
  form: UseFormReturn<any>;
}

const StrayBasicInfo = ({ form }: StrayBasicInfoProps) => {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 2000 + 1 }, (_, i) => currentYear - i);

  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Όνομα αδέσποτου *</FormLabel>
            <FormControl>
              <Input placeholder="π.χ. το ονομα με το οποίο ειναι γνωστό στους περισσότερους" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="age"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ηλικία (σε χρόνια)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="π.χ. 3"
                  {...field}
                  onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="gender"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Φύλο</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Επιλέξτε φύλο" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="male">Αρσενικό</SelectItem>
                  <SelectItem value="female">Θηλυκό</SelectItem>
                  <SelectItem value="unknown">Άγνωστο</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="birthYear"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Έτος γέννησης</FormLabel>
            <Select onValueChange={(value) => field.onChange(parseInt(value))} value={field.value?.toString()}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Επιλέξτε έτος" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {years.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default StrayBasicInfo;
