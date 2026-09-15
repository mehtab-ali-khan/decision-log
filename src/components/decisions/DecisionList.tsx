import type { Decision } from "../../types/decision";
import { DecisionCard } from "./DecisionCard";
import { getDateGroupLabel } from "./formatDate";

type DecisionListProps = {
  decisions: Decision[];
  onDelete: (decision: Decision) => void;
  onEdit: (decision: Decision) => void;
  onToggle: (decision: Decision) => void;
  query: string;
};

function groupByPeriod(decisions: Decision[]) {
  const groups: Array<{ label: string; decisions: Decision[] }> = [];

  for (const decision of decisions) {
    const label = getDateGroupLabel(decision.date);
    const lastGroup = groups[groups.length - 1];

    if (lastGroup?.label === label) lastGroup.decisions.push(decision);
    else groups.push({ label, decisions: [decision] });
  }

  return groups;
}

export function DecisionList({ decisions, onDelete, onEdit, onToggle, query }: DecisionListProps) {
  return (
    <div className="flex flex-col gap-7">
      {groupByPeriod(decisions).map((group) => (
        <section key={group.label}>
          <div className="sticky top-16 z-10 -mx-1 mb-3 flex items-center gap-3 bg-background/85 px-1 py-2 backdrop-blur-sm">
            <h2 className="text-small font-semibold text-text-primary">{group.label}</h2>
            <span aria-hidden="true" className="h-px flex-1 bg-border/50" />
            <span className="text-caption tabular-nums text-text-tertiary">
              {group.decisions.length}
            </span>
          </div>
          <ul className="flex flex-col gap-3">
            {group.decisions.map((decision) => (
              <li key={decision.id}>
                <DecisionCard
                  decision={decision}
                  onDelete={onDelete}
                  onEdit={onEdit}
                  onToggle={onToggle}
                  query={query}
                />
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

const SKELETON_WIDTHS = ["w-[82%]", "w-[68%]", "w-[74%]", "w-[60%]"] as const;

export function DecisionListSkeleton() {
  return (
    <div aria-hidden="true" className="flex flex-col gap-3">
      <div className="ui-skeleton mb-1 h-4 w-28" />
      {SKELETON_WIDTHS.map((width, index) => (
        <div className="ui-card py-4 pl-5 pr-4 sm:py-5 sm:pr-5" key={index}>
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="ui-skeleton h-5 w-20 rounded-full" />
              <div className="ui-skeleton h-3 w-16" />
            </div>
            <div className="ui-skeleton h-6 w-16 rounded-full" />
          </div>
          <div className="ui-skeleton mt-4 h-4 w-[45%]" />
          <div className={`ui-skeleton mt-2.5 h-3.5 ${width}`} />
        </div>
      ))}
    </div>
  );
}
