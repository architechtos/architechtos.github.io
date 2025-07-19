
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Pencil, Eye } from "lucide-react";
import EditStrayDialog from "@/components/stray/EditStrayDialog";
import StrayTimelineDialog from "@/components/stray/StrayTimelineDialog";

interface Stray {
  id: string;
  name: string;
  age: number | null;
  birth_year: number | null;
  gender: string | null;
  fur_colors: string | null;
  location_description: string | null;
  story: string | null;
  is_neutered: boolean;
  neutering_vet: string | null;
  neutering_date: string | null;
  possible_relatives: string | null;
  expenses_paid_by: string | null;
  available_for_adoption: boolean | null;
  created_at: string;
}

interface UserStraysProps {
  userId: string;
}

const UserStrays = ({ userId }: UserStraysProps) => {
  const [strays, setStrays] = useState<Stray[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingStray, setEditingStray] = useState<Stray | null>(null);
  const [viewingStrayId, setViewingStrayId] = useState<string | null>(null);

  useEffect(() => {
    const fetchStrays = async () => {
      try {
        const { data, error } = await supabase
          .from('strays')
          .select('*')
          .eq('registered_by', userId)
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        setStrays(data || []);
      } catch (err) {
        console.error('Error fetching strays:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStrays();
  }, [userId]);

  const handleStrayUpdated = (updatedStray: Stray) => {
    setStrays(prev => prev.map(stray => 
      stray.id === updatedStray.id ? updatedStray : stray
    ));
    setEditingStray(null);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('el-GR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(date);
  };

  const calculateAge = (stray: Stray) => {
    if (stray.age !== null) {
      if (stray.age < 12) {
        return `${stray.age} μήνας/μήνες`;
      } else {
        const years = Math.floor(stray.age / 12);
        const months = stray.age % 12;
        if (months === 0) {
          return `${years} έτος/έτη`;
        } else {
          return `${years} έτος/έτη και ${months} μήνας/μήνες`;
        }
      }
    }
    
    if (stray.birth_year) {
      const currentYear = new Date().getFullYear();
      const ageInYears = currentYear - stray.birth_year;
      return `${ageInYears} έτος/έτη`;
    }
    
    return "Άγνωστη";
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-24 bg-gray-200 animate-pulse rounded-lg"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {strays.length > 0 ? (
        strays.map((stray) => (
          <Card key={stray.id}>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{stray.name}</CardTitle>
                  <p className="text-sm text-gray-500">
                    Καταχωρήθηκε στις {formatDate(stray.created_at)}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setViewingStrayId(stray.id)}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Ιστορικό
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingStray(stray)}
                  >
                    <Pencil className="h-4 w-4 mr-1" />
                    Επεξεργασία
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Ηλικία:</span> {calculateAge(stray)}
                </div>
                <div>
                  <span className="font-medium">Χρώματα:</span> {stray.fur_colors || "Δεν αναφέρθηκαν"}
                </div>
                <div className="col-span-2">
                  <Badge variant={stray.is_neutered ? "default" : "secondary"}>
                    {stray.is_neutered ? "Στειρωμένος/η" : "Δεν είναι στειρωμένος/η"}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      ) : (
        <p className="text-center text-gray-500 py-8">
          Δεν έχετε καταχωρήσει κανέναν αδέσποτο ακόμη.
        </p>
      )}

      {editingStray && (
        <EditStrayDialog
          stray={editingStray}
          open={!!editingStray}
          onOpenChange={(open) => !open && setEditingStray(null)}
          onStrayUpdated={handleStrayUpdated}
        />
      )}

      {viewingStrayId && (
        <StrayTimelineDialog
          strayId={viewingStrayId}
          isOpen={!!viewingStrayId}
          onClose={() => setViewingStrayId(null)}
        />
      )}
    </div>
  );
};

export default UserStrays;
