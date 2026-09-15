import { CircleDot, FolderKanban, Layers, MinusCircle } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { StatusFilter } from "./DecisionFilters";

type StatTile = {
  accent: string;
  filter: StatusFilter | null;
  icon: LucideIcon;
  label: string;
  value: number;
};

type DecisionStatsProps = {
  activeCount: number;
  inactiveCount: number;
  onStatusFilterChange: (value: StatusFilter) => void;
  projectCount: number;
  statusFilter: StatusFilter;
  total: number;
};

export function DecisionStats({
  activeCount,
  inactiveCount,
  onStatusFilterChange,
  projectCount,
  statusFilter,
  total,
}: DecisionStatsProps) {
  const tiles: StatTile[] = [
    { accent: "bg-primary-subtle text-primary", filter: null, icon: Layers, label: "Decisions", value: total },
    { accent: "bg-success-subtle text-success", filter: "active", icon: CircleDot, label: "Active", value: activeCount },
    { accent: "bg-muted text-text-secondary", filter: "inactive", icon: MinusCircle, label: "Inactive", value: inactiveCount },
    { accent: "bg-accent-subtle text-accent-fg", filter: null, icon: FolderKanban, label: "Projects", value: projectCount },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {tiles.map(({ accent, filter, icon: Icon, label, value }) => {
        const isSelected = filter !== null && statusFilter === filter;
        const content = (
          <>
            <span
              aria-hidden="true"
              className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-md ${accent}`}
            >
              <Icon className="h-4 w-4" />
            </span>
            <span className="min-w-0 text-left">
              <span className="block text-caption text-text-secondary">{label}</span>
              <span className="block text-h2 tabular-nums text-text-primary">{value}</span>
            </span>
          </>
        );

        if (filter === null) {
          return (
            <div className="ui-card flex items-center gap-3 p-3.5" key={label}>
              {content}
            </div>
          );
        }

        return (
          <button
            aria-pressed={isSelected}
            className={`ui-card ui-focus flex items-center gap-3 p-3.5 text-left transition-all hover:shadow-lifted ${
              isSelected ? "ring-2 ring-primary/40" : ""
            }`}
            key={label}
            onClick={() => onStatusFilterChange(isSelected ? "all" : filter)}
            type="button"
          >
            {content}
          </button>
        );
      })}
    </div>
  );
}
