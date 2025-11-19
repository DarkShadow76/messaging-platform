import { create } from 'zustand';
import { supabase } from '../supabaseClient';
import type { Session } from '@supabase/supabase-js';

interface AuthState {
  session: Session | null;
  setSession: (session: Session | null) => void;
  checkSession: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  session: null,
  setSession: (session) => set({ session }),
  checkSession: async () => {
    const { data } = await supabase.auth.getSession();
    set({ session: data.session });
  },

  login: async (email, password) => {
    const { error, data } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    set({ session: data.session });
  },
  
  logout: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    set({ session: null });
  },

  signup: async (email, password) => {
    const { error, data } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
    set({ session: data.session });
  }
}));
