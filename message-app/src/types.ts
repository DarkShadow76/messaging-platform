export interface Message {
  id: number;
  sender_id: string;
  receiver_id: string;
  content: string;
  image_url?: string;
  created_at: string; // Date will be a string when serialized
}

export interface Contact {
  id: number;
  user_id: string;
  email?: string;
  full_name: string;
  avatar_url: string;
}

export interface UserSearchResult {
  id: string; // UUID from public.users
  email: string;
  full_name: string;
  phone_number?: string;
  avatar_url?: string;
}