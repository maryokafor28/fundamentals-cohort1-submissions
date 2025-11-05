import type { InputHTMLAttributes, ReactElement, Ref } from "react";
import { forwardRef } from "react";
import clsx from "clsx";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, helperText, error, className, id, ...props }: InputProps,
  ref: Ref<HTMLInputElement>
): ReactElement {
  const inputId = id ?? props.name;
  return (
    <label className="flex w-full flex-col gap-2 text-sm font-medium" htmlFor={inputId}>
      {label}
      <input
        id={inputId}
        ref={ref}
        className={clsx(
          "w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-400",
          error && "border-red-500 focus:border-red-500 focus:ring-red-500",
          className
        )}
        {...props}
      />
      {error ? (
        <span className="text-xs text-red-400">{error}</span>
      ) : helperText ? (
        <span className="text-xs text-slate-400">{helperText}</span>
      ) : null}
    </label>
  );
});
