
-- Fix the get_user_role function with proper search_path
CREATE OR REPLACE FUNCTION public.get_user_role(check_user_id UUID)
RETURNS TEXT
LANGUAGE SQL
SECURITY DEFINER
STABLE
SET search_path = 'public'
AS $$
  SELECT role FROM public.user_roles 
  WHERE user_id = check_user_id 
  ORDER BY CASE role 
    WHEN 'admin' THEN 1 
    WHEN 'moderator' THEN 2 
    WHEN 'user' THEN 3 
  END 
  LIMIT 1;
$$;

-- Fix the is_admin function with proper search_path
CREATE OR REPLACE FUNCTION public.is_admin(check_user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
STABLE
SET search_path = 'public'
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = check_user_id AND role = 'admin'
  );
$$;
