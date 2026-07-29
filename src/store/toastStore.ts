import { create } from "zustand";

export type ToastType = "success" | "error" | "warning" | "info";

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
  /** Auto-dismiss delay in ms; `0` keeps the toast until dismissed. */
  duration: number;
}

export interface ToastState {
  toasts: Toast[];
  addToast: (toast: Partial<Toast> & { message: string }) => string;
  removeToast: (id: string) => void;
  success: (message: string, duration?: number) => string;
  error: (message: string, duration?: number) => string;
  warning: (message: string, duration?: number) => string;
  info: (message: string, duration?: number) => string;
  clear: () => void;
}

let toastCounter = 0;

/** Unique even when several toasts are queued within the same millisecond. */
function nextToastId(): string {
  toastCounter += 1;
  return `toast-${Date.now()}-${toastCounter}`;
}

const useToastStore = create<ToastState>((set, get) => ({
  toasts: [],

  addToast: ({ message, type = "info", duration = 3000 }) => {
    const id = nextToastId();
    const toast: Toast = { id, type, message, duration };

    set((state) => ({ toasts: [...state.toasts, toast] }));

    if (duration > 0) {
      setTimeout(() => {
        get().removeToast(id);
      }, duration);
    }

    return id;
  },

  removeToast: (id) => {
    set((state) => ({ toasts: state.toasts.filter((toast) => toast.id !== id) }));
  },

  success: (message, duration = 3000) => get().addToast({ type: "success", message, duration }),
  error: (message, duration = 4000) => get().addToast({ type: "error", message, duration }),
  warning: (message, duration = 3000) => get().addToast({ type: "warning", message, duration }),
  info: (message, duration = 3000) => get().addToast({ type: "info", message, duration }),

  clear: () => set({ toasts: [] }),
}));

export default useToastStore;
