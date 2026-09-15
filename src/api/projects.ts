import { mockProjects } from "./mockData";
import type { Project } from "../types/project";

const API_DELAY_MS = 300;

export function getProjects(): Promise<Project[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockProjects.map((project) => ({ ...project })));
    }, API_DELAY_MS);
  });
}
