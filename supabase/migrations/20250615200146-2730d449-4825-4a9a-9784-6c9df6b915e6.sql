
-- Fix multiple permissive policies on stray_products table for SELECT action.
-- This migration corrects previous attempts by correctly splitting the admin
-- policy into separate INSERT, UPDATE, and DELETE policies.

-- Drop the overly broad admin policy which was causing the issue.
DROP POLICY IF EXISTS "Admins can manage products" ON public.stray_products;
-- Also drop any policies from previous attempts to ensure a clean state.
DROP POLICY IF EXISTS "Admins can insert products" ON public.stray_products;
DROP POLICY IF EXISTS "Admins can update products" ON public.stray_products;
DROP POLICY IF EXISTS "Admins can delete products" ON public.stray_products;

-- Recreate admin policy for INSERT.
CREATE POLICY "Admins can insert products" ON public.stray_products
FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid()
    AND username IN ('admin', 'maria')
  )
);

-- Recreate admin policy for UPDATE.
CREATE POLICY "Admins can update products" ON public.stray_products
FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid()
    AND username IN ('admin', 'maria')
  )
) WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid()
    AND username IN ('admin', 'maria')
  )
);

-- Recreate admin policy for DELETE.
CREATE POLICY "Admins can delete products" ON public.stray_products
FOR DELETE USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid()
    AND username IN ('admin', 'maria')
  )
);

-- With this change, "Anyone can view active products" is now correctly the only policy for SELECTs.
