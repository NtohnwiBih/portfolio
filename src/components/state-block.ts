import React from "react";

export function LoadingState() {
  return React.createElement(
    "div",
    {
      className: "flex min-h-[50vh] items-center justify-center px-4",
      role: "status",
      "aria-live": "polite",
    },
    React.createElement("div", {
      className:
        "h-8 w-8 animate-spin rounded-full border-4 border-muted border-t-primary",
      "aria-hidden": "true",
    }),
    React.createElement("span", { className: "sr-only" }, "Loading…")
  );
}

export function ErrorState({ message }: { message: string }) {
  return React.createElement(
    "div",
    { className: "flex min-h-[50vh] items-center justify-center px-4 text-center" },
    React.createElement(
      "p",
      { className: "max-w-sm text-sm text-muted-foreground" },
      "Couldn't load this page: ",
      message
    )
  );
}