import { create } from 'zustand';
import type { Message } from '../types';
import { useAuthStore } from './authStore';

const API_URL = 'http://localhost:3000';

interface MessageState {
  messages: Message[];
  fetchMessages: (contactId: string) => Promise<void>;
  sendMessage: (receiverId: string, content: string) => Promise<void>;
  addMessage: (message: Message) => void;
}

export const useMessageStore = create<MessageState>((set) => ({
  messages: [],
  fetchMessages: async (contactId) => {
    const session = useAuthStore.getState().session;
    if (!session) return;

    const response = await fetch(`${API_URL}/messages/${contactId}`, {
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch messages');
    }

    const messages = await response.json();
    set({ messages });
  },
  sendMessage: async (receiverId, content) => {
    const session = useAuthStore.getState().session;
    if (!session) return;

    const response = await fetch(`${API_URL}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({ receiver_id: receiverId, content }),
    });

    if (!response.ok) {
      throw new Error('Failed to send message');
    }

    // For now, just re-fetch messages after sending.
    // A better approach would be to update the state directly or use websockets.
    // get().fetchMessages(receiverId); // Removed to rely on real-time or manual update
    // Actually, we should optimistically update or wait for real-time.
    // But for now, let's leave it as is or rely on the subscription.
    // If we rely on subscription, we don't need to fetch.
    // However, to be safe, let's keep fetching or just return.
    // The requirement says "The real-time subscription should handle displaying the sent message."
    // So I will remove the fetch here.
  },
  addMessage: (message) => {
    set((state) => ({ messages: [...state.messages, message] }));
  },
}));
