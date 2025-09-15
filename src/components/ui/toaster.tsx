"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";

interface Toast {
  id: string;
  message: string;
  type: "success" | "error" | "warning" | "info";
}

let toastId = 0;
const toasts: Toast[] = [];
let setToastsCallback: ((toasts: Toast[]) => void) | null = null;

export function toast(
  message: string,
  type: "success" | "error" | "warning" | "info" = "info"
) {
  const id = `toast-${++toastId}`;
  const newToast: Toast = { id, message, type };

  toasts.push(newToast);
  if (setToastsCallback) {
    setToastsCallback([...toasts]);
  }

  // Auto-remove after 5 seconds
  setTimeout(() => {
    removeToast(id);
  }, 5000);

  return id;
}

export function removeToast(id: string) {
  const index = toasts.findIndex((t) => t.id === id);
  if (index > -1) {
    toasts.splice(index, 1);
    if (setToastsCallback) {
      setToastsCallback([...toasts]);
    }
  }
}

export function Toaster() {
  const [currentToasts, setCurrentToasts] = useState<Toast[]>([]);

  useEffect(() => {
    setToastsCallback = setCurrentToasts;
    return () => {
      setToastsCallback = null;
    };
  }, []);

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2">
      {currentToasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-center gap-3 p-4 rounded-md shadow-lg max-w-sm ${
            toast.type === "success"
              ? "bg-success-50 border border-success-200 text-success-800"
              : toast.type === "error"
              ? "bg-danger-50 border border-danger-200 text-danger-800"
              : toast.type === "warning"
              ? "bg-warning-50 border border-warning-200 text-warning-800"
              : "bg-primary-50 border border-primary-200 text-primary-800"
          }`}
        >
          <p className="flex-1 text-sm font-medium">{toast.message}</p>
          <button
            onClick={() => removeToast(toast.id)}
            className="text-current opacity-70 hover:opacity-100"
          >
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
}
