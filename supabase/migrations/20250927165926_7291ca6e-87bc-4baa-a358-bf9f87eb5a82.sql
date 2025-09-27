-- Fix the sequence for videos table to avoid duplicate key errors
SELECT setval('videos_id_seq', COALESCE((SELECT MAX(id) FROM videos), 1), true);