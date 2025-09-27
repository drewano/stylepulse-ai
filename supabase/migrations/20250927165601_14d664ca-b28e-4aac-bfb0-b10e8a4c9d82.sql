-- Insert the video record for Baby Lovable account
INSERT INTO public.videos (
  compte_id,
  script_id, 
  status,
  video_url,
  gcp_operation_name,
  created_at,
  updated_at
) VALUES (
  4, -- Baby Lovable compte_id
  15, -- script_id from the URL
  'completed',
  'https://avtqebzzgjlmvplulgnh.supabase.co/storage/v1/object/public/videos/script-15-1758991161028.mp4',
  'manual-insert-' || extract(epoch from now()),
  now(),
  now()
);