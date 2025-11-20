-- Enable RLS on tables
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Policy for contacts: Users can only see their own contacts
CREATE POLICY "Users can view their own contacts"
ON contacts
FOR SELECT
USING (auth.uid() = user_id);

-- Policy for contacts: Users can insert their own contacts
CREATE POLICY "Users can insert their own contacts"
ON contacts
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Policy for messages: Users can view messages where they are sender or receiver
CREATE POLICY "Users can view their own messages"
ON messages
FOR SELECT
USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

-- Policy for messages: Users can insert messages where they are the sender
CREATE POLICY "Users can insert messages as sender"
ON messages
FOR INSERT
WITH CHECK (auth.uid() = sender_id);
