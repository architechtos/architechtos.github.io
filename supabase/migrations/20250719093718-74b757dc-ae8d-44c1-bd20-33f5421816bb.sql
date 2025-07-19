-- Add available_for_adoption column to strays table
ALTER TABLE public.strays 
ADD COLUMN available_for_adoption boolean DEFAULT false;