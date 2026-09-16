import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  token: localStorage.getItem('token') || null,
  userId: localStorage.getItem('userId') || null,
  name: localStorage.getItem('name') || null,

  login: (token, userId, name) => {
    localStorage.setItem('token', token);
    localStorage.setItem('userId', userId);
    localStorage.setItem('name', name);
    set({ token, userId, name });
  },

  logout: () => {
    localStorage.clear();
    set({ token: null, userId: null, name: null });
  },
}));