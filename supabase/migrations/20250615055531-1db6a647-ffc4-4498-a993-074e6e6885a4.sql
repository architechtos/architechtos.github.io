
-- Fix the remaining performance issue with profiles RLS policy
-- Drop the problematic policy that is still causing warnings
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;

-- The optimized policies from our previous migration should already be in place:
-- "Users can view all profiles", "Users can update their own profile", "Users can insert their own profile"
-- But let's ensure the view policy is properly set up

-- Verify the optimized policy exists, if not recreate it
DO $$
BEGIN
    -- Check if the optimized policy exists, if not create it
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'profiles' 
        AND policyname = 'Users can view all profiles'
    ) THEN
        CREATE POLICY "Users can view all profiles" ON public.profiles
        FOR SELECT USING (true);
    END IF;
END $$;
