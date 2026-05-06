import { create } from "zustand";

export type ToastType = "success" | "error" | "info" | "warning";

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

interface ToastStore {
  toasts: Toast[];
  addToast: (message: string, type?: ToastType, duration?: number) => void;
  removeToast: (id: string) => void;
}

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  addToast: (message, type = "info", duration = 3500) => {
    const id = Date.now().toString() + Math.random().toString(36).slice(2, 6);
    set((state) => ({
      toasts: [...state.toasts, { id, message, type, duration }],
    }));
    if (duration > 0) {
      setTimeout(() => {
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id),
        }));
      }, duration);
    }
  },
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),
}));

// Shorthand helpers
export const toast = {
  success: (msg: string, dur?: number) =>
    useToastStore.getState().addToast(msg, "success", dur),
  error: (msg: string, dur?: number) =>
    useToastStore.getState().addToast(msg, "error", dur),
  info: (msg: string, dur?: number) =>
    useToastStore.getState().addToast(msg, "info", dur),
  warning: (msg: string, dur?: number) =>
    useToastStore.getState().addToast(msg, "warning", dur),
};
