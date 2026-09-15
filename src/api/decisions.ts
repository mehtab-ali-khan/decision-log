import { mockDecisions } from "./mockData";
import type { Decision } from "../types/decision";

const API_DELAY_MS = 300;

export function getDecisions(): Promise<Decision[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockDecisions.map((decision) => ({ ...decision })));
    }, API_DELAY_MS);
  });
}
