import { cva, type VariantProps } from "class-variance-authority";
import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

const alertVariants = cva(
  "relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground",
        destructive:
          "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive",
        warning:
          "border-yellow-500/50 text-yellow-600 dark:border-yellow-500 [&>svg]:text-yellow-600",
        success:
          "border-green-500/50 text-green-600 dark:border-green-500 [&>svg]:text-green-600",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export type AlertProps = HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof alertVariants> & {
    children: ReactNode;
  };

export function Alert({ className, variant, children, ...props }: AlertProps) {
  return (
    <div
      {...props}
      className={cn(alertVariants({ variant }), className)}
      role="alert"
    >
      {children}
    </div>
  );
}

export type AlertTitleProps = HTMLAttributes<HTMLHeadingElement> & {
  children: ReactNode;
};

export function AlertTitle({ className, children, ...props }: AlertTitleProps) {
  return (
    <h5
      className={cn("mb-1 leading-none font-medium tracking-tight", className)}
      {...props}
    >
      {children}
    </h5>
  );
}

export type AlertDescriptionProps = HTMLAttributes<HTMLParagraphElement> & {
  children: ReactNode;
};

export function AlertDescription({
  className,
  children,
  ...props
}: AlertDescriptionProps) {
  return (
    <div className={cn("text-sm [&_p]:leading-relaxed", className)} {...props}>
      {children}
    </div>
  );
}
