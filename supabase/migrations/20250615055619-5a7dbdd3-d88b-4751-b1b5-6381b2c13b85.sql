
-- Fix the remaining performance issues with user_ranks RLS policies
-- Drop the problematic policies that are still causing warnings
DROP POLICY IF EXISTS "Anyone can view user ranks" ON public.user_ranks;
DROP POLICY IF EXISTS "users can view their own rank" ON public.user_ranks;

-- The optimized policies from our previous migration should already be in place:
-- "Users can view all user ranks" and "System can manage user ranks"
-- But let's ensure they're properly set up

-- Verify the optimized policies exist, if not recreate them
DO $$
BEGIN
    -- Check if the optimized policy exists, if not create it
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'user_ranks' 
        AND policyname = 'Users can view all user ranks'
    ) THEN
        CREATE POLICY "Users can view all user ranks" ON public.user_ranks
        FOR SELECT USING (true);
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'user_ranks' 
        AND policyname = 'System can manage user ranks'
    ) THEN
        CREATE POLICY "System can manage user ranks" ON public.user_ranks
        FOR ALL USING ((SELECT auth.uid()) IS NOT NULL);
    END IF;
END $$;
