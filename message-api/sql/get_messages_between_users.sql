-- Function to get messages between two users with pagination
CREATE OR REPLACE FUNCTION get_messages_between_users(
    user_a_id uuid,
    user_b_id uuid,
    page_limit integer,
    page_offset integer
)
RETURNS SETOF messages AS $$
BEGIN
  RETURN QUERY
  SELECT *
  FROM public.messages
  WHERE
    (sender_id = user_a_id AND receiver_id = user_b_id) OR
    (sender_id = user_b_id AND receiver_id = user_a_id)
  ORDER BY created_at DESC
  LIMIT page_limit
  OFFSET page_offset;
END;
$$ LANGUAGE plpgsql;
