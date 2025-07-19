
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export const useUserRole = () => {
  const { user } = useAuth();

  const { data: userRole, isLoading } = useQuery({
    queryKey: ['user-role', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data, error } = await supabase
        .rpc('get_user_role', { check_user_id: user.id });
      
      if (error) {
        console.error('Error fetching user role:', error);
        return 'user'; // Default to user role
      }
      
      return data || 'user';
    },
    enabled: !!user?.id,
  });

  const { data: isAdmin } = useQuery({
    queryKey: ['is-admin', user?.id],
    queryFn: async () => {
      if (!user?.id) return false;
      
      const { data, error } = await supabase
        .rpc('is_admin', { check_user_id: user.id });
      
      if (error) {
        console.error('Error checking admin status:', error);
        return false;
      }
      
      return data || false;
    },
    enabled: !!user?.id,
  });

  return {
    userRole,
    isAdmin: isAdmin || false,
    isLoading
  };
};
