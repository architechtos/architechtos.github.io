
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Pencil, Save, X } from "lucide-react";

interface BioEditorProps {
  bio: string | null;
  onBioUpdate: (newBio: string) => void;
}

const BioEditor = ({ bio, onBioUpdate }: BioEditorProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editBio, setEditBio] = useState(bio || "");
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleSave = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ bio: editBio })
        .eq('id', user.id);

      if (error) throw error;

      onBioUpdate(editBio);
      setIsEditing(false);
      toast({
        title: "Επιτυχία",
        description: "Το βιογραφικό σας ενημερώθηκε",
      });
    } catch (error) {
      console.error('Error updating bio:', error);
      toast({
        title: "Σφάλμα",
        description: "Δεν ήταν δυνατή η ενημέρωση του βιογραφικού",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setEditBio(bio || "");
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="space-y-3">
        <Textarea
          value={editBio}
          onChange={(e) => setEditBio(e.target.value)}
          placeholder="Πείτε μας λίγα λόγια για εσάς..."
          className="min-h-[100px]"
          maxLength={500}
        />
        <div className="flex gap-2">
          <Button
            onClick={handleSave}
            disabled={isLoading}
            size="sm"
            className="flex items-center gap-1"
          >
            <Save className="h-4 w-4" />
            Αποθήκευση
          </Button>
          <Button
            onClick={handleCancel}
            disabled={isLoading}
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
          >
            <X className="h-4 w-4" />
            Ακύρωση
          </Button>
        </div>
        <p className="text-xs text-gray-500">
          {editBio.length}/500 χαρακτήρες
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          {bio ? (
            <p className="text-gray-700 whitespace-pre-wrap">{bio}</p>
          ) : (
            <p className="text-gray-500 italic">
              Δεν έχετε προσθέσει βιογραφικό ακόμη. Κάντε κλικ για να προσθέσετε.
            </p>
          )}
        </div>
        <Button
          onClick={() => setIsEditing(true)}
          variant="ghost"
          size="sm"
          className="flex items-center gap-1"
        >
          <Pencil className="h-4 w-4" />
          Επεξεργασία
        </Button>
      </div>
    </div>
  );
};

export default BioEditor;
