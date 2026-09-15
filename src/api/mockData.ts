import type { Decision } from "../types/decision";
import type { Project } from "../types/project";

// The app starts empty — sample content is opt-in via "Add sample data".
export const mockProjects: Project[] = [];

export const mockDecisions: Decision[] = [];

type SampleSeed = Omit<Decision, "id" | "date"> & { daysAgo: number };

const SAMPLE_SEEDS: SampleSeed[] = [
  { daysAgo: 0, project: "Platform", text: "Use cards instead of a table view", reason: "Better for reading the full reasoning behind each decision", active: true },
  { daysAgo: 1, project: "Design", text: "Standardize focus states", reason: "Too many different focus ring styles across the UI", active: true },
  { daysAgo: 2, project: "Platform", text: "Add confirm before delete", reason: "Decisions contain important reasoning we don't want to lose by accident", active: true },
  { daysAgo: 4, project: "Design", text: "Use green for active status", reason: "Blue made it look selected, not active", active: true },
  { daysAgo: 6, project: "API", text: "Keep data in memory for now", reason: "Good enough to validate the flow before adding a backend", active: true },
  { daysAgo: 9, project: "Platform", text: "Group decisions by date", reason: "Easier to scan what changed recently", active: true },
  { daysAgo: 12, project: "API", text: "Hide pagination below one page", reason: "Disabled buttons look broken", active: true },
  { daysAgo: 15, project: "Design", text: "Build a real project picker", reason: "Browser datalist is inconsistent across browsers", active: true },
  { daysAgo: 21, project: "Growth", text: "Create a landing page first", reason: "New users need context for what this tool is", active: true },
  { daysAgo: 28, project: "Platform", text: "Debounce search at 200ms", reason: "Makes typing feel responsive", active: true },
  { daysAgo: 40, project: "API", text: "Store dates as YYYY-MM-DD strings", reason: "Simple and timezone-free", active: false },
  { daysAgo: 52, project: "Design", text: "Remove borders from cards", reason: "Shadow is enough for grouping", active: true },
  { daysAgo: 68, project: "Growth", text: "Start with empty data", reason: "Seeded data makes it feel like a demo", active: true },
  { daysAgo: 95, project: "Platform", text: "Everything in memory initially", reason: "Testing the core flow first", active: false },
  { daysAgo: 130, project: "API", text: "Projects are just strings", reason: "No need for full project management yet", active: false },
];

function toDateString(daysAgo: number): string {
  const date = new Date();
  date.setHours(12, 0, 0, 0);
  date.setDate(date.getDate() - daysAgo);

  return date.toISOString().slice(0, 10);
}

export function createSampleDecisions(): Decision[] {
  return SAMPLE_SEEDS.map(({ daysAgo, ...seed }, index) => ({
    ...seed,
    id: `sample-${index + 1}`,
    date: toDateString(daysAgo),
  }));
}
