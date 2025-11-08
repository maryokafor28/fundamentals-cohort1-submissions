"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface ToastProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
}

export const Toast = React.forwardRef<HTMLDivElement, ToastProps>(
  ({ title, description, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 shadow-lg rounded-xl p-4 w-full max-w-sm transition-all",
          className
        )}
        {...props}
      >
        {title && <div className="font-semibold mb-1">{title}</div>}
        {description && (
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {description}
          </div>
        )}
      </div>
    );
  }
);
Toast.displayName = "Toast";
