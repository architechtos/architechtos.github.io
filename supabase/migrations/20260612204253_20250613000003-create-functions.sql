-- Create helper functions

-- Function to check if a user is an admin
CREATE OR REPLACE FUNCTION is_admin(check_user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = check_user_id AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user role
CREATE OR REPLACE FUNCTION get_user_role(check_user_id UUID)
RETURNS TEXT AS $$
DECLARE
  user_role TEXT;
BEGIN
  SELECT role INTO user_role 
  FROM public.user_roles 
  WHERE user_id = check_user_id;
  
  RETURN COALESCE(user_role, 'user');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to add user points
CREATE OR REPLACE FUNCTION add_user_points(
  user_id UUID,
  activity_type TEXT,
  points_to_add INTEGER,
  reference_id UUID DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
  -- Insert the point activity
  INSERT INTO public.point_activities (user_id, activity_type, points, reference_id)
  VALUES (user_id, activity_type, points_to_add, reference_id);
  
  -- Update user_ranks
  INSERT INTO public.user_ranks (id, points, reports_count, current_rank_id)
  VALUES (user_id, points_to_add, 0, 1)
  ON CONFLICT (id) DO UPDATE
  SET points = user_ranks.points + points_to_add;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;