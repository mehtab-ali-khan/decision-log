import { ArrowRight, GitFork, History, Search, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { BrandMark, TopBar } from "../components/layout/TopBar";

const FEATURES = [
  {
    description: "Every decision is stored with the reasoning that produced it, not just the outcome.",
    icon: History,
    title: "Capture the why",
  },
  {
    description: "One search box across decisions, reasons and projects, with status and project filters.",
    icon: Search,
    title: "Find it in seconds",
  },
  {
    description: "Mark decisions inactive when they are superseded — the history stays intact.",
    icon: ShieldCheck,
    title: "Keep the trail",
  },
];

const PREVIEW_ROWS = [
  { active: true, project: "Platform", text: "Ship the first release with a single project view." },
  { active: true, project: "Design", text: "Adopt a card timeline instead of a data table." },
  { active: false, project: "Platform", text: "Keep all data in memory for the prototype." },
];

export default function Landing() {
  return (
    <div className="min-h-screen font-sans text-text-primary">
      <TopBar
        action={
          <Link className="ui-button-primary" to="/app">
            Try it now
            <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </Link>
        }
      />

      <main className="ui-page flex flex-col gap-16 py-16 sm:gap-24 sm:py-24">
        <section className="flex animate-fade-in-up flex-col items-center text-center">
          <span className="ui-chip border border-primary/20 bg-primary-subtle text-primary-fg">
            <GitFork aria-hidden="true" className="h-3.5 w-3.5" />
            For teams that keep re-deciding the same things
          </span>
          <h1 className="mt-5 max-w-3xl text-[2rem] font-bold leading-[1.1] tracking-[-0.032em] sm:text-display">
            Every decision, with the reasoning still attached.
          </h1>
          <p className="mt-5 max-w-xl text-body text-text-secondary sm:text-[1.0625rem]">
            Decision Log is a lightweight record of what your team chose and why — so six months
            later nobody has to guess, and nobody has to argue it twice.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
            <Link className="ui-button-primary h-11 px-6" to="/app">
              Try it now
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Link>
            <span className="text-caption text-text-tertiary">
              No sign-up — sample data is already loaded.
            </span>
          </div>

          <div className="relative mt-14 w-full max-w-3xl">
            <div
              aria-hidden="true"
              className="absolute -inset-x-6 -top-6 bottom-8 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 blur-2xl"
            />
            <div className="ui-card relative flex flex-col gap-3 p-4 text-left shadow-overlay sm:p-5">
              {PREVIEW_ROWS.map((row) => (
                <div
                  className="flex items-center justify-between gap-4 rounded-md bg-muted/50 px-3.5 py-3"
                  key={row.text}
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <BrandMark className="h-7 w-7 flex-shrink-0" />
                    <span className="min-w-0">
                      <span className="block truncate text-small font-medium text-text-primary">
                        {row.text}
                      </span>
                      <span className="block text-caption text-text-tertiary">{row.project}</span>
                    </span>
                  </div>
                  <span
                    className={`ui-chip flex-shrink-0 ${
                      row.active
                        ? "bg-success-subtle text-success-fg"
                        : "bg-muted text-text-secondary"
                    }`}
                  >
                    {row.active ? "Active" : "Inactive"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-3">
          {FEATURES.map(({ description, icon: Icon, title }) => (
            <div className="ui-card p-5" key={title}>
              <span
                aria-hidden="true"
                className="flex h-9 w-9 items-center justify-center rounded-md bg-primary-subtle text-primary"
              >
                <Icon className="h-4 w-4" />
              </span>
              <h2 className="mt-4 text-h3 text-text-primary">{title}</h2>
              <p className="mt-1.5 text-small text-text-secondary">{description}</p>
            </div>
          ))}
        </section>

        <footer className="flex flex-col items-center gap-2 border-t border-border/70 pt-8 text-center">
          <p className="text-small text-text-secondary">Ready to stop re-deciding?</p>
          <Link className="ui-button-secondary" to="/app">
            Open the decision log
            <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </Link>
        </footer>
      </main>
    </div>
  );
}
