import { ArrowUpDown, CircleDot, FolderKanban, Search, X } from "lucide-react";
import { useEffect, useRef } from "react";
import { Select } from "../ui/Select";
import { getProjectStyle } from "./projectStyle";

export type StatusFilter = "all" | "active" | "inactive";
export type SortOrder = "newest" | "oldest";

type DecisionFiltersProps = {
  onClearFilters: () => void;
  onProjectFilterChange: (value: string) => void;
  onSearchChange: (value: string) => void;
  onSortOrderChange: (value: SortOrder) => void;
  onStatusFilterChange: (value: StatusFilter) => void;
  projectFilter: string;
  projects: string[];
  search: string;
  sortOrder: SortOrder;
  statusFilter: StatusFilter;
};

const STATUS_OPTIONS: Record<StatusFilter, string> = {
  all: "All",
  active: "Active",
  inactive: "Inactive",
};

export function DecisionFilters({
  onClearFilters,
  onProjectFilterChange,
  onSearchChange,
  onSortOrderChange,
  onStatusFilterChange,
  projectFilter,
  projects,
  search,
  sortOrder,
  statusFilter,
}: DecisionFiltersProps) {
  const searchInputRef = useRef<HTMLInputElement>(null);
  const activeChips = [
    search.trim().length > 0 && {
      key: "search",
      label: `“${search.trim()}”`,
      onRemove: () => onSearchChange(""),
    },
    statusFilter !== "all" && {
      key: "status",
      label: STATUS_OPTIONS[statusFilter],
      onRemove: () => onStatusFilterChange("all"),
    },
    projectFilter !== "all" && {
      key: "project",
      label: projectFilter,
      onRemove: () => onProjectFilterChange("all"),
    },
  ].filter(Boolean) as Array<{ key: string; label: string; onRemove: () => void }>;

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key !== "/") return;
      const target = event.target as HTMLElement | null;
      const isTyping =
        target?.tagName === "INPUT" || target?.tagName === "TEXTAREA" || target?.isContentEditable;
      if (isTyping) return;

      event.preventDefault();
      searchInputRef.current?.focus();
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <section aria-label="Search and filter decisions" className="flex flex-col gap-3">
      <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
        <div className="relative min-w-0 flex-1">
          <label className="sr-only" htmlFor="decision-search">
            Search decisions
          </label>
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-tertiary"
          />
          <input
            className="ui-input pl-9 pr-16"
            id="decision-search"
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search..."
            ref={searchInputRef}
            type="text"
            value={search}
          />
          {search.length > 0 ? (
            <button
              aria-label="Clear search"
              className="ui-focus absolute right-2 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-sm text-text-tertiary transition-colors hover:bg-muted hover:text-text-primary"
              onClick={() => {
                onSearchChange("");
                searchInputRef.current?.focus();
              }}
              type="button"
            >
              <X aria-hidden="true" className="h-3.5 w-3.5" />
            </button>
          ) : (
            <kbd aria-hidden="true" className="ui-kbd absolute right-3 top-1/2 -translate-y-1/2">
              /
            </kbd>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Select
            ariaLabel="Filter by status"
            icon={<CircleDot aria-hidden="true" className="h-3.5 w-3.5 opacity-70" />}
            isActive={statusFilter !== "all"}
            onChange={onStatusFilterChange}
            options={[
              { label: STATUS_OPTIONS.all, value: "all" },
              { label: STATUS_OPTIONS.active, value: "active" },
              { label: STATUS_OPTIONS.inactive, value: "inactive" },
            ]}
            value={statusFilter}
          />
          <Select
            ariaLabel="Filter by project"
            icon={<FolderKanban aria-hidden="true" className="h-3.5 w-3.5 opacity-70" />}
            isActive={projectFilter !== "all"}
            onChange={onProjectFilterChange}
            options={[
              { label: "All", value: "all" },
              ...projects.map((project) => ({
                adornment: (
                  <span
                    aria-hidden="true"
                    className={`h-2 w-2 flex-shrink-0 rounded-full ${getProjectStyle(project).dot}`}
                  />
                ),
                label: project,
                value: project,
              })),
            ]}
            value={projectFilter}
          />
          <Select
            align="end"
            ariaLabel="Sort by date"
            icon={<ArrowUpDown aria-hidden="true" className="h-3.5 w-3.5 opacity-70" />}
            onChange={onSortOrderChange}
            options={[
              { label: "Newest", value: "newest" },
              { label: "Oldest", value: "oldest" },
            ]}
            value={sortOrder}
          />
        </div>
      </div>

      {activeChips.length > 0 && (
        <div className="flex animate-fade-in flex-wrap items-center gap-2">
          <span className="text-caption text-text-tertiary">Filters</span>
          {activeChips.map((chip) => (
            <span className="ui-filter-chip" key={chip.key}>
              <span className="max-w-[16rem] truncate">{chip.label}</span>
              <button
                aria-label={`Remove filter ${chip.label}`}
                className="ui-focus rounded-full p-0.5 transition-colors hover:bg-primary/15"
                onClick={chip.onRemove}
                type="button"
              >
                <X aria-hidden="true" className="h-3 w-3" />
              </button>
            </span>
          ))}
          <button className="ui-button-ghost" onClick={onClearFilters} type="button">
            Clear all
          </button>
        </div>
      )}
    </section>
  );
}
