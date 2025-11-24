-- Create the public.users table for storing user profile information.
-- This table is linked to the auth.users table via a foreign key relationship.
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE,
  full_name TEXT,
  phone_number TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable Row Level Security (RLS) on the public.users table.
-- RLS is a security feature that allows you to control which rows users can access.
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Create a policy that makes records in public.users viewable by everyone.
-- This is necessary for the contact search feature to find users.
CREATE POLICY "Public users are viewable by everyone"
ON public.users
FOR SELECT
USING (true);

-- Create a function that will be triggered when a new user signs up.
-- This function inserts a new record into public.users, copying the id and email
-- from the auth.users table and extracting metadata like full_name.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, phone_number)
  VALUES (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'phone_number'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a trigger that calls the handle_new_user function
-- automatically after a new user is inserted into the auth.users table.
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
