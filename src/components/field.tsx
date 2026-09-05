import type {
  InputHTMLAttributes,
  LabelHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";
import { cn } from "@/lib/cn";

/**
 * The shared control styling. Every text input, select, and textarea in the
 * app renders through this, so a rebrand changes borders and focus rings in
 * one place instead of across ~60 hand-written class strings.
 */
const CONTROL =
  "w-full rounded-md border border-line bg-surface px-3 py-2 text-ink " +
  "placeholder:text-ink-faint " +
  "focus-visible:outline-none focus-visible:border-brand-600 focus-visible:ring-1 focus-visible:ring-brand-600 " +
  "disabled:cursor-not-allowed disabled:bg-surface-sunken disabled:text-ink-subtle";

export function Label({ className, ...props }: LabelHTMLAttributes<HTMLLabelElement>) {
  return <label className={cn("block text-sm font-medium text-ink-muted", className)} {...props} />;
}

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(CONTROL, className)} {...props} />;
}

export function Select({ className, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select className={cn(CONTROL, className)} {...props} />;
}

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cn(CONTROL, className)} {...props} />;
}

/**
 * Label + control pairing. `hint` carries help text; `error` replaces it and
 * is announced to assistive tech.
 */
export function Field({
  label,
  hint,
  error,
  required,
  className,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn("space-y-1", className)}>
      <Label>
        {label}
        {required && (
          <span className="ml-0.5 text-red-600" aria-hidden="true">
            *
          </span>
        )}
      </Label>
      {children}
      {error ? (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      ) : hint ? (
        <p className="text-sm text-ink-subtle">{hint}</p>
      ) : null}
    </div>
  );
}
