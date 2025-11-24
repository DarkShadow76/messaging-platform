-- Insert existing users from auth.users into public.users.
-- This statement will only insert users whose 'id' does not already exist in public.users,
-- thanks to 'ON CONFLICT (id) DO NOTHING;'. This makes the script safe to run multiple times.
INSERT INTO public.users (id, email, full_name, phone_number)
SELECT
  id,
  email,
  raw_user_meta_data->>'full_name' AS full_name,
  raw_user_meta_data->>'phone_number' AS phone_number
FROM
  auth.users
ON CONFLICT (id) DO NOTHING; -- Ensures existing entries are not duplicated or cause errors

-- Ensure the function to handle new user creation exists or is updated.
-- 'CREATE OR REPLACE' will create the function if it doesn't exist, or replace it if it does.
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

-- Ensure the trigger 'on_auth_user_created' exists.
-- This block checks if the trigger already exists before attempting to create it,
-- preventing errors if the trigger was created previously.
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'on_auth_user_created') THEN
        CREATE TRIGGER on_auth_user_created
        AFTER INSERT ON auth.users
        FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
    END IF;
END $$;
