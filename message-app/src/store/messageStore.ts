import { create } from 'zustand';
import type { Message } from '../types';
import { useAuthStore } from './authStore';

const API_URL = 'http://localhost:3000';

interface MessageState {
  messages: Message[];
  fetchMessages: (contactId: string) => Promise<void>;
  sendMessage: (receiverId: string, content: string) => Promise<void>;
}

export const useMessageStore = create<MessageState>((set, get) => ({
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
    get().fetchMessages(receiverId);
  },
}));
