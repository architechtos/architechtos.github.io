
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import ImageUpload from "./ImageUpload";
import TagsInput from "./TagsInput";

const registrationSchema = z.object({
  name: z.string().min(1, "Το όνομα είναι υποχρεωτικό"),
  birthYear: z.number().min(2000).max(new Date().getFullYear()).optional(),
  gender: z.string().optional(),
  characteristics: z.array(z.string()).default([]),
  age: z.number().min(0, "Η ηλικία πρέπει να είναι θετικός αριθμός").optional(),
  furColors: z.array(z.string()).default([]),
  locationDescription: z.string().optional(),
  story: z.string().optional(),
  isNeutered: z.boolean().default(false),
  neuteringVet: z.string().optional(),
  neuteringDate: z.string().optional(),
  possibleRelatives: z.array(z.string()).default([]),
  expensesPaidBy: z.string().optional(),
});

type RegistrationFormData = z.infer<typeof registrationSchema>;

interface StrayRegistrationFormProps {
  isSubmitting: boolean;
  setIsSubmitting: (value: boolean) => void;
  onSuccess: () => void;
}

const CHARACTERISTICS_OPTIONS = [
  "Φιλικός/η",
  "Φοβισμένος/η", 
  "Χαδιάρης/α",
  "Τα πάει καλά με σκύλους",
  "Ανθρωποκεντρικός/η"
];

const StrayRegistrationForm = ({ 
  isSubmitting, 
  setIsSubmitting, 
  onSuccess 
}: StrayRegistrationFormProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  
  const form = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      name: "",
      birthYear: undefined,
      gender: "",
      characteristics: [],
      age: undefined,
      furColors: [],
      locationDescription: "",
      story: "",
      isNeutered: false,
      neuteringVet: "",
      neuteringDate: "",
      possibleRelatives: [],
      expensesPaidBy: "",
    },
  });

  const onSubmit = async (data: RegistrationFormData) => {
    if (!user) return;

    setIsSubmitting(true);
    try {
      let imageUrl = null;

      // Upload image if selected
      if (selectedImage) {
        const fileName = `${Date.now()}_${selectedImage.name}`;
        const { error: uploadError, data: uploadData } = await supabase.storage
          .from('strays')
          .upload(`${user.id}/${fileName}`, selectedImage);

        if (uploadError) throw uploadError;

        if (uploadData) {
          const { data: urlData } = supabase.storage
            .from('strays')
            .getPublicUrl(uploadData.path);
          imageUrl = urlData.publicUrl;
        }
      }

      const strayData = {
        name: data.name,
        birth_year: data.birthYear || null,
        gender: data.gender || null,
        characteristics: data.characteristics.length > 0 ? data.characteristics : null,
        age: data.age || null,
        fur_colors: null, // We'll use coat_colors_tags instead
        coat_colors_tags: data.furColors.length > 0 ? data.furColors : null,
        location_description: data.locationDescription || null,
        story: data.story || null,
        image_url: imageUrl,
        is_neutered: data.isNeutered,
        neutering_vet: data.isNeutered ? data.neuteringVet || null : null,
        neutering_date: data.isNeutered && data.neuteringDate ? data.neuteringDate : null,
        possible_relatives: null, // We'll use relative_animals_tags instead
        relative_animals_tags: data.possibleRelatives.length > 0 ? data.possibleRelatives : null,
        expenses_paid_by: data.expensesPaidBy || null,
        registered_by: user.id,
      };

      const { error } = await supabase
        .from("strays")
        .insert([strayData]);

      if (error) throw error;

      toast({
        title: "Επιτυχής καταχώρηση!",
        description: "Ο αδέσποτος καταχωρήθηκε επιτυχώς στη βάση δεδομένων.",
      });

      // Award 1 point for stray registration
      await supabase.rpc('add_user_points', {
        user_id: user.id,
        activity_type: 'stray_registration',
        points_to_add: 1
      });

      onSuccess();
    } catch (error) {
      console.error("Error registering stray:", error);
      toast({
        title: "Σφάλμα",
        description: "Υπήρξε πρόβλημα κατά την καταχώρηση. Παρακαλώ δοκιμάστε ξανά.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 2000 + 1 }, (_, i) => currentYear - i);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Όνομα αδέσποτου *</FormLabel>
              <FormControl>
                <Input placeholder="π.χ. Μπόμπι" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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

        <FormField
          control={form.control}
          name="characteristics"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Χαρακτηριστικά</FormLabel>
              <div className="grid grid-cols-1 gap-3">
                {CHARACTERISTICS_OPTIONS.map((characteristic) => (
                  <div key={characteristic} className="flex items-center space-x-2">
                    <Checkbox
                      id={characteristic}
                      checked={field.value.includes(characteristic)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          field.onChange([...field.value, characteristic]);
                        } else {
                          field.onChange(field.value.filter(item => item !== characteristic));
                        }
                      }}
                    />
                    <Label htmlFor={characteristic}>{characteristic}</Label>
                  </div>
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="furColors"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <TagsInput
                  label="Χρώματα τριχώματος"
                  tags={field.value}
                  onTagsChange={field.onChange}
                  placeholder="π.χ. καφέ, άσπρο, μαύρο"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="locationDescription"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Τοποθεσία αδέσποτου</FormLabel>
              <FormControl>
                <Input placeholder="π.χ. Πάρκο Εθνικής Αντίστασης, Καλαμαριά" {...field} />
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
                  placeholder="Διηγηθείτε την ιστορία του αδέσποτου..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <ImageUpload 
          onImageSelect={setSelectedImage}
        />

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
          name="possibleRelatives"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <TagsInput
                  label="Πιθανά συγγενικά ζώα"
                  tags={field.value}
                  onTagsChange={field.onChange}
                  placeholder="π.χ. Μητέρα, Αδέλφια"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="isNeutered"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Είναι στειρωμένος/η;</FormLabel>
              </div>
            </FormItem>
          )}
        />

        {form.watch("isNeutered") && (
          <>
            <FormField
              control={form.control}
              name="neuteringVet"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Κτηνίατρος που έκανε τη στείρωση</FormLabel>
                  <FormControl>
                    <Input placeholder="Όνομα κτηνιάτρου" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="neuteringDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ημερομηνία στείρωσης</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}

        <FormField
          control={form.control}
          name="expensesPaidBy"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ποιος πλήρωσε τα έξοδα</FormLabel>
              <FormControl>
                <Input placeholder="π.χ. Τοπική ομάδα εθελοντών" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button 
          type="submit" 
          className="w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Καταχώρηση..." : "Καταχώρηση Αδέσποτου"}
        </Button>
      </form>
    </Form>
  );
};

export default StrayRegistrationForm;
