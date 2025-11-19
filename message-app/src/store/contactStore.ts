import { create } from 'zustand';
import { useAuthStore } from './authStore';
import type { Contact } from '../types';

const API_URL = 'http://localhost:3000';

interface ContactState {
  contacts: Contact[];
  fetchContacts: () => Promise<void>;
}

export const useContactStore = create<ContactState>((set) => ({
  contacts: [],
  fetchContacts: async () => {
    const session = useAuthStore.getState().session;
    if (!session) return;

    const response = await fetch(`${API_URL}/contacts`, {
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch contacts');
    }

    const contacts = await response.json();
    set({ contacts });
  },
}));
