const PROJECT_STYLES = [
  { chip: "bg-indigo-50 text-indigo-700", dot: "bg-indigo-500" },
  { chip: "bg-emerald-50 text-emerald-700", dot: "bg-emerald-500" },
  { chip: "bg-amber-50 text-amber-700", dot: "bg-amber-500" },
  { chip: "bg-rose-50 text-rose-700", dot: "bg-rose-500" },
  { chip: "bg-sky-50 text-sky-700", dot: "bg-sky-500" },
  { chip: "bg-violet-50 text-violet-700", dot: "bg-violet-500" },
] as const;

export function getProjectStyle(name: string) {
  let hash = 0;
  for (let index = 0; index < name.length; index += 1) {
    hash = (hash * 31 + name.charCodeAt(index)) >>> 0;
  }

  return PROJECT_STYLES[hash % PROJECT_STYLES.length];
}
