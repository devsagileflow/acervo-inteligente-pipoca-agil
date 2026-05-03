"use client";

import * as React from "react";

import { trackEvent } from "@/lib/analytics";

type TrackedLinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  eventName?: "click";
  targetId: string;
  pagePath?: string;
};

export function TrackedLink({
  targetId,
  pagePath,
  onClick,
  children,
  ...props
}: TrackedLinkProps) {
  return (
    <a
      {...props}
      onClick={async (event) => {
        onClick?.(event);
        void trackEvent({
          eventName: "click",
          pagePath: pagePath ?? window.location.pathname,
          targetId,
          properties: {
            href: props.href,
            text: typeof children === "string" ? children : undefined,
          },
        });
      }}
    >
      {children}
    </a>
  );
}
