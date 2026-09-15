import { GitFork } from "lucide-react";
import { Link } from "react-router-dom";
import type { ReactNode } from "react";

type TopBarProps = {
  action?: ReactNode;
};

export function BrandMark({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`flex items-center justify-center rounded-md bg-gradient-to-br from-primary to-accent text-surface shadow-raised ${className}`}
    >
      <GitFork className="h-[55%] w-[55%]" />
    </span>
  );
}

export function TopBar({ action }: TopBarProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-surface/80 backdrop-blur-md">
      <div className="ui-page flex h-16 items-center justify-between gap-4">
        <Link className="ui-focus flex items-center gap-2.5 rounded-md" to="/">
          <BrandMark />
          <span className="text-h3 text-text-primary">Decision Log</span>
        </Link>

        <div className="flex items-center gap-2">{action}</div>
      </div>
    </header>
  );
}
