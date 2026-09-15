export type StatusFilter = "all" | "active" | "inactive";

type DecisionFiltersProps = {
  projectFilter: string;
  projects: string[];
  search: string;
  statusFilter: StatusFilter;
  onProjectFilterChange: (value: string) => void;
  onSearchChange: (value: string) => void;
  onStatusFilterChange: (value: StatusFilter) => void;
};

export function DecisionFilters({ projectFilter, projects, search, statusFilter, onProjectFilterChange, onSearchChange, onStatusFilterChange }: DecisionFiltersProps) {
  return (
    <div className="grid gap-3 rounded border border-border bg-surface p-4 md:grid-cols-[minmax(0,1fr)_auto_auto]">
      <label className="flex flex-col gap-2 text-sm font-medium">Search decisions
        <input className="rounded border border-border bg-surface px-3 py-2 font-normal outline-none transition-colors focus:border-primary" onChange={(event) => onSearchChange(event.target.value)} placeholder="Search all fields" type="search" value={search} />
      </label>
      <label className="flex flex-col gap-2 text-sm font-medium">Status
        <select className="rounded border border-border bg-surface px-3 py-2 font-normal outline-none transition-colors focus:border-primary" onChange={(event) => onStatusFilterChange(event.target.value as StatusFilter)} value={statusFilter}>
          <option value="all">All statuses</option><option value="active">Active</option><option value="inactive">Inactive</option>
        </select>
      </label>
      <label className="flex flex-col gap-2 text-sm font-medium">Project
        <select className="rounded border border-border bg-surface px-3 py-2 font-normal outline-none transition-colors focus:border-primary" onChange={(event) => onProjectFilterChange(event.target.value)} value={projectFilter}>
          <option value="all">All projects</option>
          {projects.map((project) => <option key={project} value={project}>{project}</option>)}
        </select>
      </label>
    </div>
  );
}
