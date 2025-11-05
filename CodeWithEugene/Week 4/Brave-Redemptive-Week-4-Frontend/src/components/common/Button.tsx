import type { ButtonHTMLAttributes, ReactElement, Ref } from "react";
import { forwardRef } from "react";
import clsx from "clsx";

type ButtonVariant = "primary" | "secondary" | "ghost";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
};

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-primary-500 text-white hover:bg-primary-400 focus-visible:ring-primary-300",
  secondary:
    "bg-slate-800 text-white hover:bg-slate-700 focus-visible:ring-slate-600",
  ghost: "text-slate-200 hover:bg-slate-800 focus-visible:ring-slate-700"
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant = "primary", type = "button", ...props }: ButtonProps,
  ref: Ref<HTMLButtonElement>
): ReactElement {
  const resolvedVariant: ButtonVariant = variant ?? "primary";
  return (
    <button
      ref={ref}
      type={type}
      className={clsx(
        "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 disabled:cursor-not-allowed disabled:opacity-60",
        variantStyles[resolvedVariant],
        className
      )}
      {...props}
    />
  );
});
