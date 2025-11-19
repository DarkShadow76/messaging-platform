export interface Message {
  id: number;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string; // Date will be a string when serialized
}

export interface Contact {
  id: number;
  user_id: string;
  name: string;
  avatar_url: string;
}
