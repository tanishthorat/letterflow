/**
 * Centralized toast utility for Letterflow.
 *
 * Import `toast` from here everywhere in the app instead of calling
 * `sonner` directly. This gives us a single place to change behaviour,
 * add analytics hooks, or swap the notification library in the future.
 *
 * Usage:
 *   import { toast } from "@/lib/toast";
 *   toast.success("Template saved!");
 *   toast.error("Something went wrong", { description: err.message });
 */

import { toast as sonnerToast, type ExternalToast } from "sonner";

type ToastOptions = ExternalToast;

export const toast = {
  /** Green — operation completed successfully */
  success: (message: string, opts?: ToastOptions) =>
    sonnerToast.success(message, opts),

  /** Red — action failed, user should know */
  error: (message: string, opts?: ToastOptions) =>
    sonnerToast.error(message, opts),

  /** Neutral info — informational nudge */
  info: (message: string, opts?: ToastOptions) =>
    sonnerToast.info(message, opts),

  /** Yellow — recoverable warning */
  warning: (message: string, opts?: ToastOptions) =>
    sonnerToast.warning(message, opts),

  /** Loading — returns an id you can resolve/reject later */
  loading: (message: string, opts?: ToastOptions) =>
    sonnerToast.loading(message, opts),

  /** Resolve a loading toast with success */
  promise: <T>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((err: unknown) => string);
    } & ToastOptions
  ) => sonnerToast.promise(promise, messages),

  /** Dismiss a toast by id */
  dismiss: (id?: string | number) => sonnerToast.dismiss(id),
};
