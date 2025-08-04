import type { SelectHTMLAttributes, ReactNode } from "react";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

export type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  children: ReactNode;
};

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, ...props }, ref) => (
    <select
      {...props}
      ref={ref}
      className={cn(
        "border-input bg-background ring-offset-background focus:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
    >
      {children}
    </select>
  ),
);

Select.displayName = "Select";

export type SelectOptionProps = {
  value: string | number;
  children: ReactNode;
  disabled?: boolean;
};

export function SelectOption({
  children,
  disabled = false,
  value,
}: SelectOptionProps) {
  return (
    <option disabled={disabled} value={value}>
      {children}
    </option>
  );
}
