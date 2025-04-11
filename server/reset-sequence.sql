-- Reset the user_id sequence
SELECT setval(pg_get_serial_sequence('public."User"', 'user_id'), COALESCE((SELECT MAX(user_id) FROM public."User"), 0) + 1, false); 