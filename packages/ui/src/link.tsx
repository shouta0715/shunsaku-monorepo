"use client";

import * as Headless from "@headlessui/react";
import NextLink from "next/link";
import React, { forwardRef } from "react";

export const Link = forwardRef(function Link(
  props: { href: string } & React.ComponentPropsWithoutRef<"a">,
  ref: React.ForwardedRef<HTMLAnchorElement>,
) {
  return (
    <Headless.DataInteractive>
      <NextLink {...props} ref={ref}>
        {props.children}
      </NextLink>
    </Headless.DataInteractive>
  );
});
