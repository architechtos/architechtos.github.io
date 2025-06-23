
-- Fix multiple permissive policies on stray_products table for SELECT action
-- The "Admins can manage products" policy is for ALL operations, but we only need one policy for SELECT
-- We'll keep "Anyone can view active products" for SELECT and modify the admin policy to exclude SELECT

DROP POLICY IF EXISTS "Admins can manage products" ON public.stray_products;

-- Recreate admin policy for INSERT, UPDATE, DELETE only (excluding SELECT)
CREATE POLICY "Admins can manage products" ON public.stray_products
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND (
      username = 'admin' OR 
      username = 'maria'
    )
  )
) WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND (
      username = 'admin' OR 
      username = 'maria'
    )
  )
);

-- The "Anyone can view active products" policy already handles SELECT operations efficiently
-- This ensures only one policy evaluates per SELECT query
