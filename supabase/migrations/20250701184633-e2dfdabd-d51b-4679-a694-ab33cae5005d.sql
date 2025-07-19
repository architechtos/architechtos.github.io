
-- Add animal_type column to strays table
ALTER TABLE public.strays 
ADD COLUMN animal_type TEXT NOT NULL DEFAULT 'cat';

-- Add a check constraint to ensure valid animal types
ALTER TABLE public.strays 
ADD CONSTRAINT strays_animal_type_check 
CHECK (animal_type IN ('cat', 'dog', 'other'));
