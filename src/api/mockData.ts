import type { Decision } from "../types/decision";
import type { Project } from "../types/project";

export const mockProjects: Project[] = [
  { id: "project-1", name: "Project1" },
  { id: "project-2", name: "Project2" },
];

export const mockDecisions: Decision[] = [
  {
    id: "decision-1",
    date: "2025-01-15",
    project: "Project1",
    text: "Use a small, focused first release.",
    reason: "A narrow scope lets the team validate the workflow quickly.",
    active: true,
  },
  {
    id: "decision-2",
    date: "2025-01-08",
    project: "Project2",
    text: "Keep data in memory for the initial version.",
    reason: "The first release is intended to validate the decision-capture experience.",
    active: false,
  },
];
