
-- Create a covering index for the foreign key on the `thread_id` column
-- in the `forum_comments` table to improve query performance.
CREATE INDEX forum_comments_thread_id_idx ON public.forum_comments (thread_id);
