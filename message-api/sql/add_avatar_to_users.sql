-- Add the avatar_url column to the public.users table to store user profile images.
ALTER TABLE public.users
ADD COLUMN avatar_url TEXT;

-- Update all existing users who do not have an avatar_url set.
-- This backfills the avatar_url for users that existed before this change,
-- generating a unique avatar for each user based on their ID using the pravatar.cc service.
UPDATE public.users
SET avatar_url = 'https://i.pravatar.cc/150?u=' || id::text
WHERE avatar_url IS NULL;

-- Update the function that handles new user creation to include the default avatar.
-- 'CREATE OR REPLACE' ensures the function is updated if it already exists.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, phone_number, avatar_url)
  VALUES (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'phone_number',
    'https://i.pravatar.cc/150?u=' || new.id::text -- Generate a default avatar on signup
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
