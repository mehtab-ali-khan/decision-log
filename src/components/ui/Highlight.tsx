import { Fragment } from "react";

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

type HighlightProps = {
  query: string;
  text: string;
};

export function Highlight({ query, text }: HighlightProps) {
  const trimmedQuery = query.trim();
  if (trimmedQuery.length === 0) return <>{text}</>;

  const parts = text.split(new RegExp(`(${escapeRegExp(trimmedQuery)})`, "ig"));

  return (
    <>
      {parts.map((part, index) =>
        part.toLowerCase() === trimmedQuery.toLowerCase() ? (
          <mark
            className="rounded-[3px] bg-warning-subtle px-0.5 text-inherit ring-1 ring-warning/30"
            key={index}
          >
            {part}
          </mark>
        ) : (
          <Fragment key={index}>{part}</Fragment>
        ),
      )}
    </>
  );
}
