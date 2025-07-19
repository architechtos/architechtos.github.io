
-- Create a covering index for the foreign key on the `registered_by` column
-- in the `strays` table to improve query performance.
CREATE INDEX strays_registered_by_idx ON public.strays (registered_by);
