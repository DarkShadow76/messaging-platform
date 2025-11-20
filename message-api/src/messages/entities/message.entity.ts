export class Message {
  id: number;
  sender_id: string;
  receiver_id: string;
  content: string;
  image_url?: string;
  created_at: Date;
}
