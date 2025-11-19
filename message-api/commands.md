# Commands for creathe the backend project

## Install Nestjs

```sh
npm i -g @nestjs/cli
```

## Creating the project

```sh
nest new project-name
```

---

## SQL Contact Seeding Script
-- Run this script AFTER running the seed.ts script to create users.

```sql
DO $$
DECLARE
    user_id_john UUID;
    user_id_jane UUID;
    user_id_peter UUID;
    user_id_susan UUID;
BEGIN
    -- Get the IDs of a few users to assign contacts to
    SELECT id INTO user_id_john FROM auth.users WHERE email = 'john.doe@example.com';
    SELECT id INTO user_id_jane FROM auth.users WHERE email = 'jane.smith@example.com';
    SELECT id INTO user_id_peter FROM auth.users WHERE email = 'peter.jones@example.com';
    SELECT id INTO user_id_susan FROM auth.users WHERE email = 'susan.williams@example.com';

    -- Insert contacts for John Doe
    INSERT INTO public.contacts (user_id, name, avatar_url)
    VALUES
        (user_id_john, 'Alice', 'https://i.pravatar.cc/150?u=alice'),
        (user_id_john, 'Bob', 'https://i.pravatar.cc/150?u=bob');

    -- Insert contacts for Jane Smith
    INSERT INTO public.contacts (user_id, name, avatar_url)
    VALUES
        (user_id_jane, 'Charlie', 'https://i.pravatar.cc/150?u=charlie');

    -- Insert contacts for Susan Williams
    INSERT INTO public.contacts (user_id, name, avatar_url)
    VALUES
        (user_id_susan, 'Diana', 'https://i.pravatar.cc/150?u=diana'),
        (user_id_susan, 'Eve', 'https://i.pravatar.cc/150?u=eve'),
        (user_id_susan, 'Frank', 'https://i.pravatar.cc/150?u=frank');

    -- Peter, Michael, Linda, Robert, Patricia, James, and Barbara will have no contacts.

END $$;
```