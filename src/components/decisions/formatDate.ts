const DAY_MS = 24 * 60 * 60 * 1000;

function toDate(date: string): Date {
  return new Date(`${date}T00:00:00`);
}

function daysFromToday(date: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return Math.round((today.getTime() - toDate(date).getTime()) / DAY_MS);
}

export function formatDate(date: string): string {
  return new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(toDate(date));
}

export function getDateGroupLabel(date: string): string {
  const days = daysFromToday(date);

  if (days < 0) return "Upcoming";
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return "Earlier this week";
  if (days < 30) return "Earlier this month";

  return new Intl.DateTimeFormat("en", { month: "long", year: "numeric" }).format(toDate(date));
}

export function formatRelativeDate(date: string): string {
  const days = daysFromToday(date);

  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days > 1 && days < 7) return `${days} days ago`;

  return formatDate(date);
}
