import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

type EmptyStateProps = {
  actions?: ReactNode;
  children?: ReactNode;
  description: string;
  icon: LucideIcon;
  title: string;
  tone?: "neutral" | "brand" | "danger";
};

const TONE_STYLES = {
  neutral: "bg-muted text-text-secondary ring-border/70",
  brand: "bg-primary-subtle text-primary ring-primary/15",
  danger: "bg-danger-subtle text-danger ring-danger/15",
} as const;

export function EmptyState({
  actions,
  children,
  description,
  icon: Icon,
  title,
  tone = "neutral",
}: EmptyStateProps) {
  return (
    <section className="ui-card flex animate-fade-in-up flex-col items-center px-6 py-14 text-center sm:py-16">
      <span
        aria-hidden="true"
        className={`flex h-14 w-14 items-center justify-center rounded-full ring-8 ${TONE_STYLES[tone]}`}
      >
        <Icon className="h-6 w-6" />
      </span>
      <h2 className="mt-5 text-h2 text-text-primary">{title}</h2>
      <p className="mt-2 max-w-sm text-small text-text-secondary">{description}</p>
      {children}
      {actions && <div className="mt-6 flex flex-wrap items-center justify-center gap-2.5">{actions}</div>}
    </section>
  );
}
