
-- Create a covering index for the foreign key on `current_rank_id`
CREATE INDEX user_ranks_current_rank_id_idx ON public.user_ranks (current_rank_id);
