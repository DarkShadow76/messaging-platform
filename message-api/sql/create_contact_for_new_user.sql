-- Creates a trigger function that inserts a new row into public.contacts
-- when a new user signs up in auth.users.
CREATE OR REPLACE FUNCTION public.create_contact_for_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.contacts (user_id, name, email, avatar_url)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data ->> 'full_name',
    NEW.email,
    NEW.raw_user_meta_data ->> 'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Creates the trigger that fires the function on new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.create_contact_for_new_user();
