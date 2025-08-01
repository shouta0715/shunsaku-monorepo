import * as Headless from "@headlessui/react";
import React, { forwardRef } from "react";
import { TouchTarget } from "./button";
import { cn } from "./cn";
import { Link } from "./link";

type AvatarProps = {
  src?: string | null;
  square?: boolean;
  initials?: string;
  alt?: string;
  className?: string;
};

export function Avatar({
  src = null,
  square = false,
  initials,
  alt = "",
  className,
  ...props
}: AvatarProps & React.ComponentPropsWithoutRef<"span">) {
  return (
    <span
      data-slot="avatar"
      {...props}
      className={cn(
        // Basic layout
        "inline-grid shrink-0 align-middle [--avatar-radius:20%] *:col-start-1 *:row-start-1",
        "outline -outline-offset-1 outline-black/10 dark:outline-white/10",
        // Border radius
        square
          ? "rounded-(--avatar-radius) *:rounded-(--avatar-radius)"
          : "rounded-full *:rounded-full",
        className,
      )}
    >
      {initials && (
        <svg
          aria-hidden={alt ? undefined : "true"}
          className="size-full fill-current p-[5%] text-[48px] font-medium uppercase select-none"
          viewBox="0 0 100 100"
        >
          {alt && <title>{alt}</title>}
          <text
            alignmentBaseline="middle"
            dominantBaseline="middle"
            dy=".125em"
            textAnchor="middle"
            x="50%"
            y="50%"
          >
            {initials}
          </text>
        </svg>
      )}
      {src && <img alt={alt} className="size-full" src={src} />}
    </span>
  );
}

export const AvatarButton = forwardRef(function AvatarButton(
  {
    src,
    square = false,
    initials,
    alt,
    className,
    ...props
  }: AvatarProps &
    (
      | Omit<Headless.ButtonProps, "as" | "className">
      | Omit<React.ComponentPropsWithoutRef<typeof Link>, "className">
    ),
  ref: React.ForwardedRef<HTMLElement>,
) {
  const classes = cn(
    square ? "rounded-[20%]" : "rounded-full",
    "relative inline-grid focus:not-data-focus:outline-hidden data-focus:outline-2 data-focus:outline-offset-2 data-focus:outline-blue-500",
    className,
  );

  return "href" in props ? (
    <Link
      {...props}
      ref={ref as React.ForwardedRef<HTMLAnchorElement>}
      className={classes}
    >
      <TouchTarget>
        <Avatar alt={alt} initials={initials} square={square} src={src} />
      </TouchTarget>
    </Link>
  ) : (
    <Headless.Button {...props} ref={ref} className={classes}>
      <TouchTarget>
        <Avatar alt={alt} initials={initials} square={square} src={src} />
      </TouchTarget>
    </Headless.Button>
  );
});
