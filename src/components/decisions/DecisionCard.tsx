import { Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import type { Decision } from "../../types/decision";
import { Highlight } from "../ui/Highlight";
import { formatDate, formatRelativeDate } from "./formatDate";
import { getProjectStyle } from "./projectStyle";

const REASON_CLAMP_LENGTH = 160;

type DecisionCardProps = {
  decision: Decision;
  onDelete: (decision: Decision) => void;
  onEdit: (decision: Decision) => void;
  onToggle: (decision: Decision) => void;
  query: string;
};

export function DecisionCard({ decision, onDelete, onEdit, onToggle, query }: DecisionCardProps) {
  const [expanded, setExpanded] = useState(false);
  const projectStyle = getProjectStyle(decision.project);
  const isLongReason = decision.reason.length > REASON_CLAMP_LENGTH;

  return (
    <article
      className={`ui-card group relative animate-fade-in-up py-4 pl-5 pr-4 transition-shadow hover:shadow-lifted sm:py-5 sm:pr-5 ${
        decision.active ? "" : "bg-surface/70"
      }`}
    >
      <span
        aria-hidden="true"
        className={`absolute inset-y-4 left-0 w-[3px] rounded-full ${
          decision.active ? projectStyle.dot : "bg-border"
        }`}
      />

      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 flex-wrap items-center gap-x-2.5 gap-y-1">
          <span className={`ui-chip ${projectStyle.chip}`}>
            <Highlight query={query} text={decision.project} />
          </span>
          <time className="text-caption text-text-tertiary" dateTime={decision.date} title={formatDate(decision.date)}>
            {formatRelativeDate(decision.date)}
          </time>
        </div>

        <div className="flex flex-shrink-0 items-center gap-1">
          <button
            aria-label={decision.active ? "Mark decision inactive" : "Mark decision active"}
            aria-pressed={decision.active}
            className={`ui-chip ui-focus border transition-colors ${
              decision.active
                ? "border-success/25 bg-success-subtle text-success-fg hover:bg-success/10"
                : "border-border bg-muted text-text-secondary hover:bg-border/70"
            }`}
            onClick={() => onToggle(decision)}
            title={decision.active ? "Click to mark inactive" : "Click to mark active"}
            type="button"
          >
            <span
              aria-hidden="true"
              className={`h-1.5 w-1.5 rounded-full ${decision.active ? "bg-success" : "bg-text-tertiary"}`}
            />
            {decision.active ? "Active" : "Inactive"}
          </button>

          <div className="flex items-center gap-0.5 transition-opacity focus-within:opacity-100 group-hover:opacity-100 md:opacity-0">
            <button
              aria-label={`Edit decision: ${decision.text}`}
              className="ui-button-icon"
              onClick={() => onEdit(decision)}
              type="button"
            >
              <Pencil aria-hidden="true" className="h-4 w-4" />
            </button>
            <button
              aria-label={`Delete decision: ${decision.text}`}
              className="ui-button-icon-danger"
              onClick={() => onDelete(decision)}
              type="button"
            >
              <Trash2 aria-hidden="true" className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <h3
        className={`mt-3 text-h3 ${decision.active ? "text-text-primary" : "text-text-secondary"}`}
      >
        <Highlight query={query} text={decision.text} />
      </h3>

      <p
        className={`mt-1.5 max-w-[68ch] text-body text-text-secondary ${
          isLongReason && !expanded ? "line-clamp-2" : ""
        }`}
      >
        <Highlight query={query} text={decision.reason} />
      </p>

      {isLongReason && (
        <button
          aria-expanded={expanded}
          className="ui-focus mt-2 rounded-sm text-caption font-semibold text-primary-fg transition-colors hover:text-primary"
          onClick={() => setExpanded((currentExpanded) => !currentExpanded)}
          type="button"
        >
          {expanded ? "Show less" : "Show more"}
        </button>
      )}
    </article>
  );
}
