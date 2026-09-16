import { ArrowRight, Github, Linkedin, Slack, Twitter, Youtube } from "lucide-react";
import { Link } from "react-router-dom";
import { BrandMark } from "./TopBar";

export const SITE_LINKS = [
  { href: "/#demo", label: "Demo" },
  { href: "/#why", label: "Why it works" },
  { href: "/#product", label: "Product" },
  { href: "/#pricing", label: "Pricing" },
];

const SOCIAL_LINKS = [
  { href: "https://x.com/decisionlog", icon: Twitter, label: "Decision Log on X" },
  { href: "https://github.com/decisionlog", icon: Github, label: "Decision Log on GitHub" },
  { href: "https://linkedin.com/company/decisionlog", icon: Linkedin, label: "Decision Log on LinkedIn" },
  { href: "https://youtube.com/@decisionlog", icon: Youtube, label: "Decision Log on YouTube" },
  { href: "https://decisionlog.slack.com", icon: Slack, label: "Decision Log community on Slack" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/70 backdrop-blur-xl">
      <div className="ui-page flex h-16 items-center justify-between gap-8">
        <Link className="ui-focus flex items-center gap-2.5 rounded-md" to="/">
          <BrandMark className="h-7 w-7" />
          <span className="text-small font-semibold tracking-[-0.015em]">Decision Log</span>
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-8 md:flex">
          {SITE_LINKS.map((link) => (
            <a
              className="ui-focus rounded-sm text-small font-medium text-text-secondary transition-colors hover:text-text-primary"
              href={link.href}
              key={link.href}
            >
              {link.label}
            </a>
          ))}
          <Link
            className="ui-focus rounded-sm text-small font-medium text-text-secondary transition-colors hover:text-text-primary"
            to="/contact"
          >
            Contact
          </Link>
        </nav>

        <Link className="ui-button-primary h-9 px-4" to="/app">
          Try demo
          <ArrowRight aria-hidden="true" className="h-3.5 w-3.5" />
        </Link>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-border/70">
      <div className="ui-page flex flex-col items-center gap-8 py-10 lg:flex-row lg:justify-between">
        <div className="flex items-center gap-2.5">
          <BrandMark className="h-7 w-7" />
          <span className="text-small font-semibold tracking-[-0.015em]">Decision Log</span>
        </div>

        <nav
          aria-label="Footer"
          className="flex flex-wrap items-center justify-center gap-x-7 gap-y-3"
        >
          {SITE_LINKS.map((link) => (
            <a
              className="ui-focus rounded-sm text-small text-text-secondary transition-colors hover:text-text-primary"
              href={link.href}
              key={link.href}
            >
              {link.label}
            </a>
          ))}
          <Link
            className="ui-focus rounded-sm text-small text-text-secondary transition-colors hover:text-text-primary"
            to="/contact"
          >
            Contact
          </Link>
          <Link className="ui-focus rounded-sm text-small font-medium text-text-primary" to="/app">
            Try demo
          </Link>
        </nav>

        <div className="flex items-center gap-1">
          {SOCIAL_LINKS.map(({ href, icon: Icon, label }) => (
            <a
              aria-label={label}
              className="ui-button-icon"
              href={href}
              key={label}
              rel="noreferrer"
              target="_blank"
            >
              <Icon aria-hidden="true" className="h-4 w-4" />
            </a>
          ))}
        </div>
      </div>

      <div className="ui-page border-t border-border/60 py-5">
        <p className="text-center text-caption text-text-tertiary">© 2026 Decision Log</p>
      </div>
    </footer>
  );
}
