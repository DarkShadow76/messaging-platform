import { create } from 'zustand';
import type { Contact } from '../types';

interface ChatState {
  selectedContact: Contact | null;
  setSelectedContact: (contact: Contact | null) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  selectedContact: null,
  setSelectedContact: (contact) => set({ selectedContact: contact }),
}));