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
      <div className="ui-page flex h-16 items-center justify-between gap-2 sm:gap-4">
        <Link className="ui-focus flex shrink-0 items-center gap-2 whitespace-nowrap rounded-md sm:gap-2.5" to="/">
          <BrandMark className="h-7 w-7 sm:h-8 sm:w-8" />
          <span className="text-small font-semibold text-text-primary sm:text-h3">Decision Log</span>
        </Link>

        <div className="flex shrink-0 items-center gap-2">{action}</div>
      </div>
    </header>
  );
}
