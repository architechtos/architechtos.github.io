
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const ReporterInfo = () => {
  const { user } = useAuth();

  const { data: profile } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data, error } = await supabase
        .from('profiles')
        .select('username, phone')
        .eq('id', user.id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Αναφορά από</Label>
        <Input 
          value={profile?.username || ""}
          readOnly 
          className="bg-gray-50 cursor-not-allowed"
          placeholder="Φόρτωση ονόματος χρήστη..."
        />
      </div>

      <div className="space-y-2">
        <Label>Τηλέφωνο επικοινωνίας</Label>
        <Input 
          value={profile?.phone || ""}
          readOnly 
          className="bg-gray-50 cursor-not-allowed"
          placeholder="Δεν έχει καταχωρηθεί τηλέφωνο"
        />
      </div>
    </div>
  );
};

export default ReporterInfo;
