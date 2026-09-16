import {
  Aperture,
  ArrowRight,
  Boxes,
  Check,
  CircleDot,
  Clock3,
  Command,
  FolderKanban,
  Gem,
  Hexagon,
  History,
  Orbit,
  PenLine,
  Play,
  Search,
  Triangle,
  Waves,
  X,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { SiteFooter, SiteHeader } from "../components/layout/SiteChrome";
import { ContactSection } from "../components/marketing/ContactSection";
import { Modal } from "../components/ui/Modal";
import captureShot from "../assets/decision-form.png";
import searchShot from "../assets/decision-search.png";
import overviewShot from "../assets/decision-timeline.png";

const CUSTOMERS = [
  { logo: Hexagon, name: "Northwind" },
  { logo: Aperture, name: "Cadence" },
  { logo: Orbit, name: "Atlas Robotics" },
  { logo: Waves, name: "Lumen Health" },
  { logo: Triangle, name: "Foundry" },
  { logo: Command, name: "Sightline" },
  { logo: Gem, name: "Vantage" },
  { logo: Boxes, name: "Kestrel Labs" },
];

const PILLARS = [
  {
    body: "You write the reason at the same time as the decision, so the two stay together. Open one and you get both.",
    title: "The reason sits with the decision",
  },
  {
    body: "Search across decisions, reasons, projects and status from one box. It takes a few seconds, not an hour of scrolling old messages.",
    title: "You can find it again",
  },
  {
    body: "Changed your mind? Mark the old one inactive. It stays on the list with the reason you wrote at the time.",
    title: "Old decisions don’t disappear",
  },
];

const CAPABILITIES = [
  {
    body: "Give each decision a project. Projects are made as you type, so there is nothing to set up first.",
    icon: FolderKanban,
    title: "Sorted by project",
  },
  {
    body: "Grouped by today, yesterday, this week and this month, so the recent changes are the easiest to read.",
    icon: Clock3,
    title: "A list, not a spreadsheet",
  },
  {
    body: "Filter by status and project at the same time, sort by newest or oldest, and see your search terms highlighted.",
    icon: Search,
    title: "Filters you can combine",
  },
  {
    body: "Mark a decision active or inactive in one click. The reason you wrote stays exactly as it was.",
    icon: CircleDot,
    title: "Status you can trust",
  },
];

const CAPTURE_STEPS = [
  {
    alt: "The new decision form, with fields for the date, project, decision and the reason behind it.",
    caption: "One short form. What you decided, and why you decided it.",
    src: captureShot,
    step: "01",
    title: "Write it down",
  },
  {
    alt: "The list of decisions, grouped by date, each with its project, status and reason.",
    caption: "Saved straight away, sorted by date and tagged with its project.",
    src: overviewShot,
    step: "02",
    title: "It shows up on the list",
  },
  {
    alt: "The list filtered down to inactive API decisions, showing the filters that are switched on.",
    caption: "Search or filter to pull it back up, with the reason still attached.",
    src: searchShot,
    step: "03",
    title: "Find it later",
  },
];

const DEMO_VIDEO_URL = "https://www.loom.com/embed/cddbbe4aafdd4a07ab66338513f7b27b";

const PLANS = [
  {
    cta: "Try the demo",
    features: ["Up to 50 decisions", "One project", "Search and filters", "Nothing to install"],
    href: "/app",
    name: "Free",
    note: "For one person keeping their own log.",
    popular: false,
    price: "$0",
    unit: "forever",
  },
  {
    cta: "Try the demo",
    features: [
      "Everything in Free",
      "As many decisions and projects as you want",
      "One shared workspace for the team",
      "Export to CSV",
    ],
    href: "/app",
    name: "Team",
    note: "For teams making calls every week.",
    popular: true,
    price: "$8",
    unit: "per person, per month",
  },
  {
    cta: "Talk to us",
    features: ["Everything in Team", "Single sign on", "Audit log", "Priority support"],
    href: "#contact",
    name: "Company",
    note: "For bigger teams with access rules to follow.",
    popular: false,
    price: "Custom",
    unit: "billed yearly",
  },
];

const WITHOUT_LOG = [
  "People answer from memory, and the answer changes every time",
  "The same argument comes back every few months",
  "When someone leaves, what they knew leaves with them",
  "New people learn the rules but never the reasons",
];

const WITH_LOG = [
  "The reason is written down by the person who made the call",
  "If you look at it again, you start from what you already knew",
  "What your team worked out stays after people move on",
  "New people read the reason, not just the rule",
];

const STATS = [
  { label: "Decisions written down", value: "3.2M" },
  { label: "Teams using it every week", value: "28,000" },
  { label: "Average time to write one", value: "11s" },
  { label: "Say the repeat arguments stopped", value: "94%" },
];

const HERO_ROWS = [
  { description: "What you decided, and why you decided it", icon: PenLine, title: "Write" },
  { description: "One search box for all of it", icon: Search, title: "Find" },
  { description: "Old decisions stay, even after you change them", icon: History, title: "Keep" },
];

type RevealSectionProps = {
  children: ReactNode;
  className?: string;
  id?: string;
  onReveal?: () => void;
};

function RevealSection({ children, className = "", id, onReveal }: RevealSectionProps) {
  const [shown, setShown] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        setShown(true);
        onReveal?.();
      },
      { rootMargin: "0px 0px -12% 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [onReveal]);

  return (
    <section
      className={`transition-all duration-700 ease-out ${
        shown ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
      } ${className}`}
      id={id}
      ref={ref}
    >
      {children}
    </section>
  );
}

export default function Landing() {
  const [activeStep, setActiveStep] = useState(0);
  const [stepsInView, setStepsInView] = useState(false);
  const [videoOpen, setVideoOpen] = useState(false);
  const activeCapture = CAPTURE_STEPS[activeStep];

  const handleStepsReveal = useCallback(() => setStepsInView(true), []);

  useEffect(() => {
    if (!stepsInView) return;

    const timer = window.setInterval(() => {
      setActiveStep((currentStep) => (currentStep + 1) % CAPTURE_STEPS.length);
    }, 1800);

    return () => window.clearInterval(timer);
  }, [stepsInView]);

  function pickStep(index: number) {
    setActiveStep(index);
  }

  return (
    <div className="min-h-screen bg-background font-sans text-text-primary">
      <SiteHeader />

      <main>
        <a
          className="ui-focus flex flex-wrap items-center justify-center gap-x-2 border-b border-primary/10 bg-primary-subtle px-4 py-2.5 text-center text-caption transition-colors hover:bg-primary/10"
          href="#product"
        >
          <span className="font-semibold text-primary-fg">Decision Log 1.0 is out.</span>
          <span className="text-text-secondary">See what it does</span>
          <ArrowRight aria-hidden="true" className="h-3 w-3 text-primary-fg" />
        </a>

        <section className="grid animate-fade-in lg:grid-cols-2">
          <div className="relative flex overflow-hidden bg-[#0B1020] px-6 py-14 sm:px-10 lg:py-16 lg:pr-0">
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-[radial-gradient(85%_70%_at_0%_0%,rgba(36,80,224,0.4),transparent_62%)]"
            />
            <div className="relative flex w-full flex-col justify-between gap-14 lg:ml-auto lg:max-w-[36rem] lg:pr-14">
              <div>
                <h1 className="text-balance text-[2.25rem] font-light leading-[1.08] tracking-[-0.028em] text-white sm:text-[2.875rem] lg:text-[3.25rem]">
                  Stop making the same decision twice with Decision Log
                </h1>

                <p className="mt-6 max-w-md text-pretty text-body leading-relaxed text-white/60">
                  Write down what your team decided and why. Six months later you can look it up
                  instead of guessing.
                </p>

                <div className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-4">
                  <Link
                    className="ui-focus group inline-flex h-12 items-center gap-3 rounded-full bg-white pl-6 pr-2 text-small font-medium text-[#0B1020] shadow-[0_8px_28px_-12px_rgba(255,255,255,0.55)] transition-shadow hover:shadow-[0_14px_38px_-12px_rgba(255,255,255,0.75)]"
                    to="/app"
                  >
                    Try the demo
                    <span
                      aria-hidden="true"
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0B1020] text-white transition-transform group-hover:translate-x-0.5"
                    >
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  </Link>
                  <button
                    className="ui-focus inline-flex items-center gap-2 rounded-full text-small font-medium text-white/75 transition-colors hover:text-white"
                    onClick={() => setVideoOpen(true)}
                    type="button"
                  >
                    <Play aria-hidden="true" className="h-3.5 w-3.5" fill="currentColor" />
                    Watch the demo
                  </button>
                </div>
              </div>

              <div>
                <p className="text-caption text-white/40">
                  One place for every decision your team makes
                </p>
                <ul className="mt-4">
                  {HERO_ROWS.map(({ description, icon: Icon, title }) => (
                    <li
                      className="flex items-center gap-4 border-t border-white/10 py-3.5 last:border-b"
                      key={title}
                    >
                      <span
                        aria-hidden="true"
                        className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md bg-white/10 text-white/80"
                      >
                        <Icon className="h-4 w-4" />
                      </span>
                      <span className="w-20 flex-shrink-0 text-small font-medium text-white">
                        {title}
                      </span>
                      <span className="text-small text-white/50">{description}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div
            className="relative flex scroll-mt-16 items-center overflow-hidden px-6 py-12 sm:px-10 lg:px-14 lg:py-16"
            id="demo"
          >
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-[radial-gradient(55%_50%_at_18%_12%,rgba(124,92,255,0.5),transparent_62%),radial-gradient(48%_45%_at_88%_16%,rgba(255,141,176,0.42),transparent_62%),radial-gradient(75%_65%_at_55%_105%,rgba(36,80,224,0.4),transparent_68%),linear-gradient(155deg,#F6F4FF,#E9ECFF)]"
            />

            <div className="relative w-full">
              <img
                alt="The Decision Log timeline showing recent decisions grouped by date, each with its project, status and reasoning."
                className="w-full"
                src={overviewShot}
              />

              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-4">
                <button
                  aria-label="Play the Decision Log product walkthrough"
                  className="ui-focus pointer-events-auto relative flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-full bg-[#0B1020] shadow-overlay ring-1 ring-white/25 transition-transform hover:scale-105"
                  onClick={() => setVideoOpen(true)}
                  type="button"
                >
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 animate-ping rounded-full bg-[#0B1020]/25"
                  />
                  <Play
                    aria-hidden="true"
                    className="relative ml-1 h-7 w-7 text-white"
                    fill="currentColor"
                  />
                </button>
                <span className="rounded-full bg-[#0B1020]/85 px-3 py-1 text-caption font-medium text-white backdrop-blur">
                  Product walkthrough
                </span>
              </div>
            </div>
          </div>
        </section>

        <RevealSection className="py-20 sm:py-24">
          <p className="ui-page text-center text-caption font-medium uppercase tracking-[0.16em] text-text-tertiary">
            Used by teams at
          </p>

          <div className="relative mt-8 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
            <div className="flex w-max animate-marquee items-center gap-16 pr-16 hover:[animation-play-state:paused]">
              {[...CUSTOMERS, ...CUSTOMERS].map(({ logo: Logo, name }, index) => (
                <span
                  aria-hidden={index >= CUSTOMERS.length}
                  className="flex flex-shrink-0 items-center gap-2.5 text-text-tertiary transition-colors hover:text-text-primary"
                  key={`${name}-${index}`}
                >
                  <Logo className="h-[1.375rem] w-[1.375rem]" strokeWidth={1.75} />
                  <span className="whitespace-nowrap text-[1.0625rem] font-semibold tracking-[-0.025em]">
                    {name}
                  </span>
                </span>
              ))}
            </div>
          </div>
        </RevealSection>

        <RevealSection className="ui-page scroll-mt-24 pb-20 sm:pb-28" id="why">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,24rem)_1fr] lg:gap-20">
            <div className="lg:sticky lg:top-24 lg:self-start">
              <p className="text-caption font-semibold uppercase tracking-[0.16em] text-primary">
                Why it works
              </p>
              <h2 className="mt-3 text-balance text-[1.875rem] font-light leading-[1.14] tracking-[-0.026em] sm:text-[2.25rem]">
                People remember the decision. They forget the reason.
              </h2>
              <p className="mt-4 text-pretty text-body text-text-secondary">
                Everyone knows what was chosen. Nobody remembers why. So the question comes back,
                and the second answer is usually worse than the first.
              </p>
            </div>

            <ul>
              {PILLARS.map(({ body, title }, index) => (
                <li
                  className="group grid grid-cols-[2.5rem_1fr] gap-x-4 border-t border-border/70 py-8 first:border-t-0 first:pt-0 sm:grid-cols-[3.5rem_1fr]"
                  key={title}
                >
                  <span className="pt-1 text-small font-semibold tabular-nums text-text-tertiary transition-colors group-hover:text-primary">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="text-balance text-[1.25rem] font-light leading-snug tracking-[-0.022em] sm:text-[1.375rem]">
                      {title}
                    </h3>
                    <p className="mt-2.5 max-w-xl text-pretty text-body text-text-secondary">
                      {body}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </RevealSection>

        <RevealSection
          className="ui-page scroll-mt-24 pb-20 sm:pb-28"
          id="product"
          onReveal={handleStepsReveal}
        >
          <div className="max-w-2xl">
            <p className="text-caption font-semibold uppercase tracking-[0.16em] text-primary">
              How it works
            </p>
            <h2 className="mt-3 text-balance text-[1.875rem] font-light leading-[1.14] tracking-[-0.026em] sm:text-[2.375rem]">
              It takes about ten seconds to write one down.
            </h2>
            <p className="mt-4 text-pretty text-body text-text-secondary">
              Fill in one short form: what you decided, why you decided it, and which project it
              belongs to. Projects fill in as you type. After that it sits on the list, and anyone
              can find it later.
            </p>
          </div>

          <div className="mt-12 grid gap-8 lg:grid-cols-12 lg:items-start lg:gap-12">
            <div className="lg:col-span-4">
              {CAPTURE_STEPS.map(({ caption, step, title }, index) => {
                const isActive = index === activeStep;

                return (
                  <button
                    aria-pressed={isActive}
                    className={`ui-focus block w-full border-l-2 py-5 pl-5 pr-3 text-left transition-colors ${
                      isActive ? "border-primary" : "border-border hover:border-text-tertiary/70"
                    }`}
                    key={step}
                    onClick={() => pickStep(index)}
                    type="button"
                  >
                    <span
                      className={`text-caption font-semibold tabular-nums ${
                        isActive ? "text-primary" : "text-text-tertiary"
                      }`}
                    >
                      {step}
                    </span>
                    <span
                      className={`mt-1.5 block text-[1.0625rem] font-medium tracking-[-0.018em] ${
                        isActive ? "text-text-primary" : "text-text-secondary"
                      }`}
                    >
                      {title}
                    </span>
                    <span
                      className={`mt-1.5 block text-small leading-relaxed ${
                        isActive ? "text-text-secondary" : "text-text-tertiary"
                      }`}
                    >
                      {caption}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-[#EEF1FF] via-[#F7F5FF] to-[#FDF3F8] p-4 ring-1 ring-border/60 sm:p-8 lg:col-span-8">
              <img
                alt={activeCapture.alt}
                className="mx-auto aspect-[4/3] w-full animate-fade-in object-contain"
                key={activeCapture.step}
                src={activeCapture.src}
              />
            </div>
          </div>

          <dl className="mt-16 grid gap-8 border-t border-border/70 pt-10 sm:grid-cols-2 lg:grid-cols-4">
            {CAPABILITIES.map(({ body, icon: Icon, title }) => (
              <div key={title}>
                <dt className="flex items-center gap-2 text-small font-semibold">
                  <Icon aria-hidden="true" className="h-4 w-4 text-primary" />
                  {title}
                </dt>
                <dd className="mt-2 text-small leading-relaxed text-text-secondary">{body}</dd>
              </div>
            ))}
          </dl>
        </RevealSection>

        <RevealSection className="ui-page pb-20 sm:pb-28">
          <div className="max-w-2xl">
            <p className="text-caption font-semibold uppercase tracking-[0.16em] text-primary">
              The difference
            </p>
            <h2 className="mt-3 text-balance text-[1.875rem] font-light leading-[1.14] tracking-[-0.026em] sm:text-[2.375rem]">
              What changes once you write them down.
            </h2>
            <p className="mt-4 text-pretty text-body text-text-secondary">
              A decision on its own is just an instruction. With the reason next to it, your team
              doesn’t have to work the whole thing out again.
            </p>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-dashed border-border bg-muted/50 p-6 sm:p-8">
              <h3 className="text-caption font-semibold uppercase tracking-[0.14em] text-text-tertiary">
                Without a decision log
              </h3>
              <ul className="mt-6 flex flex-col gap-4">
                {WITHOUT_LOG.map((item) => (
                  <li className="flex gap-3 text-small leading-relaxed text-text-secondary" key={item}>
                    <X aria-hidden="true" className="mt-0.5 h-4 w-4 flex-shrink-0 text-text-tertiary" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="relative overflow-hidden rounded-2xl bg-surface p-6 shadow-lifted ring-1 ring-border/70 sm:p-8">
              <span
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary to-accent"
              />
              <h3 className="text-caption font-semibold uppercase tracking-[0.14em] text-primary">
                With Decision Log
              </h3>
              <ul className="mt-6 flex flex-col gap-4">
                {WITH_LOG.map((item) => (
                  <li className="flex gap-3 text-small leading-relaxed text-text-primary" key={item}>
                    <Check aria-hidden="true" className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </RevealSection>

        <RevealSection className="relative overflow-hidden bg-[#0B1020] py-16 sm:py-20">
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[radial-gradient(60%_80%_at_15%_0%,rgba(36,80,224,0.38),transparent_60%),radial-gradient(50%_70%_at_88%_100%,rgba(124,92,255,0.3),transparent_60%)]"
          />
          <dl className="ui-page relative grid grid-cols-2 gap-x-8 gap-y-10 lg:grid-cols-4">
            {STATS.map(({ label, value }) => (
              <div key={label}>
                <dt className="sr-only">{label}</dt>
                <dd>
                  <span className="block text-[2.25rem] font-light tabular-nums tracking-[-0.026em] text-white sm:text-[2.5rem]">
                    {value}
                  </span>
                  <span className="mt-1.5 block text-small text-white/55">{label}</span>
                </dd>
              </div>
            ))}
          </dl>
        </RevealSection>

        <RevealSection className="ui-page py-20 sm:py-28">
          <figure className="mx-auto max-w-3xl text-center">
            <blockquote className="text-balance text-[1.375rem] font-light leading-[1.45] tracking-[-0.02em] sm:text-[1.75rem]">
              “We had the same argument about our setup three times in one year. The reason only
              ever lived in one person’s head. It hasn’t come back since we started writing things
              down.”
            </blockquote>
            <figcaption className="mt-7 flex items-center justify-center gap-3">
              <img
                alt=""
                className="h-11 w-11 flex-shrink-0 rounded-full object-cover ring-1 ring-border"
                loading="lazy"
                src="https://mui.com/static/images/avatar/2.jpg"
              />
              <span className="text-left">
                <span className="block text-small font-semibold">Travis Howard</span>
                <span className="block text-caption text-text-secondary">CTO, Cadence</span>
              </span>
            </figcaption>
          </figure>
        </RevealSection>

        <RevealSection className="ui-page scroll-mt-24 pb-20 sm:pb-28" id="pricing">
          <div className="max-w-2xl">
            <p className="text-caption font-semibold uppercase tracking-[0.16em] text-primary">
              Pricing
            </p>
            <h2 className="mt-3 text-balance text-[1.875rem] font-light leading-[1.14] tracking-[-0.026em] sm:text-[2.375rem]">
              Simple pricing, and a free plan that stays free.
            </h2>
            <p className="mt-4 text-pretty text-body text-text-secondary">
              Everything is free while we are in beta. This is what it will cost once we are out.
            </p>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {PLANS.map(({ cta, features, href, name, note, popular, price, unit }) => (
              <div
                className={`flex flex-col rounded-2xl bg-surface p-7 sm:p-8 ${
                  popular
                    ? "relative z-10 shadow-overlay ring-1 ring-primary/40 lg:-my-6 lg:py-12"
                    : "shadow-raised ring-1 ring-border/70"
                }`}
                key={name}
              >
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-[1.0625rem] font-medium tracking-[-0.018em]">{name}</h3>
                  {popular && <span className="ui-chip bg-primary text-white">Most popular</span>}
                </div>
                <p className="mt-2 text-small text-text-secondary">{note}</p>

                <p className="mt-6 flex items-baseline gap-2">
                  <span className="text-[2.25rem] font-light tracking-[-0.026em]">{price}</span>
                  <span className="text-caption text-text-tertiary">{unit}</span>
                </p>

                <ul className="mt-6 flex flex-col gap-3">
                  {features.map((feature) => (
                    <li className="flex gap-2.5 text-small text-text-secondary" key={feature}>
                      <Check aria-hidden="true" className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <div className="mt-8 flex flex-1 items-end">
                  {href.startsWith("#") ? (
                    <a className="ui-button-secondary w-full" href={href}>
                      {cta}
                    </a>
                  ) : (
                    <Link
                      className={`w-full ${popular ? "ui-button-primary" : "ui-button-secondary"}`}
                      to={href}
                    >
                      {cta}
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </RevealSection>

        <RevealSection className="ui-page scroll-mt-24 pb-20 sm:pb-28" id="contact">
          <ContactSection intro="Tell us about your team and we will work out the right plan with you. Questions about the product or the pricing are welcome too." />
        </RevealSection>

        <RevealSection className="ui-page pb-20 sm:pb-28">
          <div className="relative overflow-hidden rounded-2xl bg-[#0B1020] px-6 py-16 text-center shadow-overlay sm:px-16 sm:py-20">
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-[radial-gradient(70%_100%_at_50%_0%,rgba(36,80,224,0.4),transparent_65%),radial-gradient(50%_80%_at_85%_100%,rgba(124,92,255,0.3),transparent_60%)]"
            />
            <div className="relative flex flex-col items-center">
              <h2 className="max-w-2xl text-balance text-[1.875rem] font-light leading-[1.12] tracking-[-0.026em] text-white sm:text-[2.5rem]">
                Your next decision is worth keeping.
              </h2>
              <p className="mt-4 max-w-lg text-pretty text-body text-white/65">
                Free while we are in beta. No limits, no card. The demo already has sample data in
                it, so you can try everything right away.
              </p>
              <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row">
                <Link
                  className="ui-focus inline-flex h-12 items-center justify-center gap-2 rounded-md bg-white px-6 text-[0.9375rem] font-semibold text-text-primary transition-transform hover:scale-[1.02] active:scale-[0.99]"
                  to="/app"
                >
                  Try the demo
                  <ArrowRight aria-hidden="true" className="h-4 w-4" />
                </Link>
                <button
                  className="ui-focus inline-flex h-12 items-center justify-center gap-2 rounded-md border border-white/20 px-5 text-[0.9375rem] font-medium text-white/85 transition-colors hover:bg-white/10 hover:text-white"
                  onClick={() => setVideoOpen(true)}
                  type="button"
                >
                  Watch the walkthrough
                </button>
              </div>
            </div>
          </div>
        </RevealSection>
      </main>

      <SiteFooter />

      {videoOpen && (
        <Modal
          labelledBy="demo-video-title"
          onClose={() => setVideoOpen(false)}
          panelClassName="w-full max-w-4xl !bg-[#0B1020]"
        >
          <h2 className="sr-only" id="demo-video-title">
            Decision Log product walkthrough
          </h2>
          <div className="relative h-0 w-full pb-[62.5%]">
            <iframe
              allowFullScreen
              className="absolute inset-0 h-full w-full border-0"
              src={DEMO_VIDEO_URL}
              title="Decision Log product walkthrough"
            />
          </div>
        </Modal>
      )}
    </div>
  );
}
