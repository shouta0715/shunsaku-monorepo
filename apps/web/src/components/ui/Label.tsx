import { cva, type VariantProps } from "class-variance-authority";
import type { LabelHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
);

export type LabelProps = LabelHTMLAttributes<HTMLLabelElement> &
  VariantProps<typeof labelVariants> & {
    children: ReactNode;
  };

export function Label({ className, children, ...props }: LabelProps) {
  return (
    <label className={cn(labelVariants(), className)} {...props}>
      {children}
    </label>
  );
}
