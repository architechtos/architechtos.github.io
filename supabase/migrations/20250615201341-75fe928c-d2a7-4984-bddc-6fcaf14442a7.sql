
-- Optimize RLS policies on stray_products by preventing re-evaluation of auth.uid().
-- This migration updates the admin policies for INSERT, UPDATE, and DELETE
-- to use (SELECT auth.uid()) instead of auth.uid() directly, which improves
-- query performance by ensuring the function is called only once per query.

-- Drop existing policies to recreate them with the optimization.
DROP POLICY IF EXISTS "Admins can insert products" ON public.stray_products;
DROP POLICY IF EXISTS "Admins can update products" ON public.stray_products;
DROP POLICY IF EXISTS "Admins can delete products" ON public.stray_products;

-- Recreate admin policy for INSERT with an optimized auth call.
CREATE POLICY "Admins can insert products" ON public.stray_products
FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = (SELECT auth.uid())
    AND username IN ('admin', 'maria')
  )
);

-- Recreate admin policy for UPDATE with an optimized auth call.
CREATE POLICY "Admins can update products" ON public.stray_products
FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = (SELECT auth.uid())
    AND username IN ('admin', 'maria')
  )
) WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = (SELECT auth.uid())
    AND username IN ('admin', 'maria')
  )
);

-- Recreate admin policy for DELETE with an optimized auth call.
CREATE POLICY "Admins can delete products" ON public.stray_products
FOR DELETE USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = (SELECT auth.uid())
    AND username IN ('admin', 'maria')
  )
);
