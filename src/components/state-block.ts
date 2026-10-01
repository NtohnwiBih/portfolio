import React from "react";

export function LoadingState() {
  return React.createElement(
    "div",
    { className: "flex min-h-[50vh] items-center justify-center px-4" },
    React.createElement("p", { className: "text-sm text-muted-foreground" }, "Loading…")
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