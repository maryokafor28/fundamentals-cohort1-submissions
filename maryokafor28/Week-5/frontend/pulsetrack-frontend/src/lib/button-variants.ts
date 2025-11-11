import { cva } from "class-variance-authority";

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-500 disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 active:scale-[0.98] disabled:bg-primary/40 disabled:text-primary-foreground/70",
        outline:
          "border-2 border-primary text-primary bg-background shadow-sm hover:bg-primary/10 active:scale-[0.98] disabled:border-primary/40 disabled:text-primary/50 disabled:bg-primary/5",
        destructive:
          "bg-destructive text-white shadow-sm hover:bg-destructive/90 active:scale-[0.98] focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 disabled:bg-destructive/40 disabled:text-white/70",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80 active:scale-[0.98] disabled:bg-secondary/40 disabled:text-secondary-foreground/70",
        outlineSecondary:
          "border-2 border-secondary text-secondary-foreground bg-background shadow-sm hover:bg-secondary/10 active:scale-[0.98] disabled:border-secondary/40 disabled:text-secondary-foreground/50 disabled:bg-secondary/5",
        ghost:
          "text-foreground hover:bg-accent hover:text-accent-foreground active:scale-[0.98] disabled:text-muted-foreground disabled:bg-accent/30",
        link: "text-primary underline-offset-4 hover:underline disabled:text-primary/40 disabled:no-underline",
      },
      size: {
        default: "h-10 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 text-xs has-[>svg]:px-2.5",
        lg: "h-12 rounded-lg px-8 text-base has-[>svg]:px-6",
        icon: "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);
