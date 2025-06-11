
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface PointActivity {
  id: string;
  activity_type: string;
  points: number;
  created_at: string;
}

interface ActivityHistoryProps {
  userId: string;
}

const ActivityHistory = ({ userId }: ActivityHistoryProps) => {
  const [activities, setActivities] = useState<PointActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const { data, error } = await supabase
          .from('point_activities')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .limit(5);
        
        if (error) throw error;
        setActivities(data || []);
      } catch (err) {
        console.error('Error fetching activities:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchActivities();
  }, [userId]);

  const formatActivityType = (type: string) => {
    switch (type) {
      case 'report':
        return 'Αναφορά αδέσποτου';
      case 'forum_post':
        return 'Δημοσίευση στο φόρουμ';
      case 'forum_comment':
        return 'Σχόλιο στο φόρουμ';
      default:
        return type;
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('el-GR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  if (isLoading) {
    return (
      <div className="space-y-2">
        {[1, 2, 3].map(i => (
          <div key={i} className="flex justify-between py-2 border-b border-gray-100">
            <div className="w-3/4 h-4 bg-gray-200 animate-pulse rounded"></div>
            <div className="w-1/6 h-4 bg-gray-200 animate-pulse rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  return activities.length > 0 ? (
    <div className="space-y-1">
      {activities.map((activity) => (
        <div key={activity.id} className="flex justify-between py-2 border-b border-gray-100">
          <div>
            <span className="text-sm text-gray-600">
              {formatActivityType(activity.activity_type)}
            </span>
            <div className="text-xs text-gray-400">
              {formatDate(activity.created_at)}
            </div>
          </div>
          <div className="text-strays-orange font-medium">
            +{activity.points}
          </div>
        </div>
      ))}
    </div>
  ) : (
    <p className="text-center text-gray-500 py-4">
      Δεν υπάρχει ιστορικό δραστηριότητας ακόμη.
    </p>
  );
};

export default ActivityHistory;
