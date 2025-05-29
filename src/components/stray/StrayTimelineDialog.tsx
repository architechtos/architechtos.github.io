
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { User, Calendar } from "lucide-react";

interface StrayAction {
  id: string;
  action_type: string;
  action_description: string;
  action_date: string;
  created_at: string;
  user_id: string;
}

interface Stray {
  id: string;
  name: string;
  age: number | null;
  fur_colors: string | null;
  is_neutered: boolean;
  neutering_vet: string | null;
  neutering_date: string | null;
  possible_relatives: string | null;
  expenses_paid_by: string | null;
  created_at: string;
}

interface StrayTimelineDialogProps {
  stray: Stray;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const StrayTimelineDialog = ({ 
  stray, 
  open, 
  onOpenChange 
}: StrayTimelineDialogProps) => {
  const [actions, setActions] = useState<StrayAction[]>([]);
  const [userProfiles, setUserProfiles] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (open && stray.id) {
      fetchActions();
    }
  }, [open, stray.id]);

  const fetchActions = async () => {
    try {
      // First fetch the actions
      const { data: actionsData, error: actionsError } = await supabase
        .from('stray_actions')
        .select('*')
        .eq('stray_id', stray.id)
        .order('action_date', { ascending: false });
      
      if (actionsError) throw actionsError;
      
      if (actionsData && actionsData.length > 0) {
        // Get unique user IDs
        const userIds = [...new Set(actionsData.map(action => action.user_id))];
        
        // Fetch profiles for these users
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('id, username')
          .in('id', userIds);
        
        if (profilesError) {
          console.error('Error fetching profiles:', profilesError);
        }
        
        // Create a map of user IDs to usernames
        const profilesMap: Record<string, string> = {};
        if (profilesData) {
          profilesData.forEach(profile => {
            profilesMap[profile.id] = profile.username;
          });
        }
        
        setActions(actionsData);
        setUserProfiles(profilesMap);
      } else {
        setActions([]);
        setUserProfiles({});
      }
    } catch (err) {
      console.error('Error fetching stray actions:', err);
      setActions([]);
      setUserProfiles({});
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('el-GR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(date);
  };

  const getActionTypeColor = (actionType: string) => {
    switch (actionType) {
      case 'registered':
        return 'bg-green-100 text-green-800';
      case 'updated':
        return 'bg-blue-100 text-blue-800';
      case 'neutered':
        return 'bg-purple-100 text-purple-800';
      case 'fed':
        return 'bg-orange-100 text-orange-800';
      case 'treated':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getActionTypeLabel = (actionType: string) => {
    switch (actionType) {
      case 'registered':
        return 'Καταχώρηση';
      case 'updated':
        return 'Ενημέρωση';
      case 'neutered':
        return 'Στείρωση';
      case 'fed':
        return 'Φαγητό';
      case 'treated':
        return 'Θεραπεία';
      default:
        return actionType;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Ιστορικό Ενεργειών: {stray.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-20 bg-gray-200 animate-pulse rounded-lg"></div>
              ))}
            </div>
          ) : actions.length > 0 ? (
            actions.map((action) => (
              <Card key={action.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <Badge className={getActionTypeColor(action.action_type)}>
                      {getActionTypeLabel(action.action_type)}
                    </Badge>
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="w-4 h-4 mr-1" />
                      {formatDate(action.action_date)}
                    </div>
                  </div>
                  
                  <p className="text-sm mb-2">{action.action_description}</p>
                  
                  <div className="flex items-center text-xs text-gray-400">
                    <User className="w-3 h-3 mr-1" />
                    {userProfiles[action.user_id] || 'Άγνωστος χρήστης'}
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <p className="text-center text-gray-500 py-8">
              Δεν υπάρχουν καταγεγραμμένες ενέργειες για αυτόν τον αδέσποτο.
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StrayTimelineDialog;
