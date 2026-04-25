import { create } from 'zustand';
import api from '@/lib/api';

interface User {
  _id: string;
  name: string;
  email?: string;
  phone?: string;
  role: 'user' | 'admin';
  examTarget?: string;
  isPremium: boolean;
  savedResources: string[];
  createdAt?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  login: (identifier: string, password: string) => Promise<void>;
  register: (name: string, email: string, phone: string, password: string, examTarget: string) => Promise<void>;
  loadUser: () => Promise<void>;
  setUser: (user: User | null) => void;
  logout: () => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: typeof window !== 'undefined' ? localStorage.getItem('edubag_token') : null,
  loading: false,
  error: null,

  login: async (identifier, password) => {
    try {
      set({ loading: true, error: null });
      const res = await api.post('/auth/login', { identifier, password });
      const { token } = res.data;
      localStorage.setItem('edubag_token', token);
      set({ token, loading: false });
      // Load user data after login
      const userRes = await api.get('/auth/me');
      set({ user: userRes.data.data });
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: string } } };
      set({ error: error.response?.data?.error || 'Login failed', loading: false });
    }
  },

  register: async (name, email, phone, password, examTarget) => {
    try {
      set({ loading: true, error: null });
      const res = await api.post('/auth/register', { name, email, phone, password, examTarget });
      const { token } = res.data;
      localStorage.setItem('edubag_token', token);
      set({ token, loading: false });
      const userRes = await api.get('/auth/me');
      set({ user: userRes.data.data });
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: string } } };
      set({ error: error.response?.data?.error || 'Registration failed', loading: false });
    }
  },

  loadUser: async () => {
    try {
      const token = localStorage.getItem('edubag_token');
      if (!token) return;
      set({ loading: true });
      const res = await api.get('/auth/me');
      set({ user: res.data.data, token, loading: false });
    } catch {
      localStorage.removeItem('edubag_token');
      set({ user: null, token: null, loading: false });
    }
  },

  setUser: (user) => set({ user }),

  logout: () => {
    localStorage.removeItem('edubag_token');
    set({ user: null, token: null });
  },

  clearError: () => set({ error: null }),
}));
