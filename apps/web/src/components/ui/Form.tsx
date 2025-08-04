import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

export type FormProps = HTMLAttributes<HTMLFormElement> & {
  children: ReactNode;
};

export function Form({ className, children, ...props }: FormProps) {
  return (
    <form className={cn("space-y-6", className)} {...props}>
      {children}
    </form>
  );
}

export type FormFieldProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
};

export function FormField({ className, children, ...props }: FormFieldProps) {
  return (
    <div className={cn("space-y-2", className)} {...props}>
      {children}
    </div>
  );
}

export type FormMessageProps = HTMLAttributes<HTMLParagraphElement> & {
  children?: ReactNode;
  error?: boolean;
};

export function FormMessage({
  className,
  children,
  error = false,
  ...props
}: FormMessageProps) {
  if (!children) return null;

  return (
    <p
      className={cn(
        "text-sm",
        error ? "text-destructive" : "text-muted-foreground",
        className,
      )}
      {...props}
    >
      {children}
    </p>
  );
}
