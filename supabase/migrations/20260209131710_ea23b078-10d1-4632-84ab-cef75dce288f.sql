
-- Create storage bucket for project screenshots
INSERT INTO storage.buckets (id, name, public) VALUES ('project-screenshots', 'project-screenshots', true);

-- Allow public read access
CREATE POLICY "Project screenshots are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'project-screenshots');

-- Allow service role to upload (edge function uses service role)
CREATE POLICY "Service role can upload project screenshots"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'project-screenshots');

CREATE POLICY "Service role can update project screenshots"
ON storage.objects FOR UPDATE
USING (bucket_id = 'project-screenshots');

CREATE POLICY "Service role can delete project screenshots"
ON storage.objects FOR DELETE
USING (bucket_id = 'project-screenshots');
