import { Check, Clock3, LifeBuoy, Mail, MapPin } from "lucide-react";
import { useId, useState, type FormEvent } from "react";
import toast from "react-hot-toast";

const CONTACT_METHODS = [
  {
    body: "hello@decisionlog.app",
    href: "mailto:hello@decisionlog.app",
    icon: Mail,
    title: "Email us",
  },
  {
    body: "support@decisionlog.app",
    href: "mailto:support@decisionlog.app",
    icon: LifeBuoy,
    title: "Get help with your account",
  },
];

const CONTACT_FACTS = [
  { body: "We answer every message within one working day.", icon: Clock3 },
  { body: "We work remotely, with a small office in Berlin.", icon: MapPin },
];

const EMPTY_FORM = { company: "", email: "", message: "", name: "" };

type ContactSectionProps = {
  heading?: "h1" | "h2";
  intro?: string;
  title?: string;
};

export function ContactSection({
  heading: Heading = "h2",
  intro = "Questions about the product, the pricing, or getting your team started. Write to us and a real person will read it and write back.",
  title = "Tell us what you need.",
}: ContactSectionProps) {
  const fieldId = useId();
  const [form, setForm] = useState(EMPTY_FORM);
  const [sent, setSent] = useState(false);

  function updateField(field: keyof typeof EMPTY_FORM, value: string) {
    setForm((currentForm) => ({ ...currentForm, [field]: value }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSent(true);
    toast.success("Message sent");
  }

  function startOver() {
    setForm(EMPTY_FORM);
    setSent(false);
  }

  return (
    <>
      <div className="max-w-2xl">
        <p className="text-caption font-semibold uppercase tracking-[0.16em] text-primary">
          Contact
        </p>
        <Heading className="mt-3 text-balance text-[1.875rem] font-light leading-[1.14] tracking-[-0.026em] sm:text-[2.375rem]">
          {title}
        </Heading>
        <p className="mt-4 text-pretty text-body text-text-secondary">{intro}</p>
      </div>

      <div className="mt-12 grid gap-10 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <div className="flex flex-col gap-4">
            {CONTACT_METHODS.map(({ body, href, icon: Icon, title: methodTitle }) => (
              <a
                className="ui-focus ui-card flex items-start gap-4 p-5 transition-shadow hover:shadow-lifted"
                href={href}
                key={methodTitle}
              >
                <span
                  aria-hidden="true"
                  className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-md bg-primary-subtle text-primary"
                >
                  <Icon className="h-4 w-4" />
                </span>
                <span className="min-w-0">
                  <span className="block text-small font-medium">{methodTitle}</span>
                  <span className="mt-0.5 block truncate text-small text-primary-fg">{body}</span>
                </span>
              </a>
            ))}
          </div>

          <ul className="mt-8 flex flex-col gap-4 border-t border-border/70 pt-8">
            {CONTACT_FACTS.map(({ body, icon: Icon }) => (
              <li className="flex gap-3 text-small text-text-secondary" key={body}>
                <Icon aria-hidden="true" className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                {body}
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-7">
          {sent ? (
            <div className="ui-card flex animate-fade-in-up flex-col items-start p-6 sm:p-8">
              <span
                aria-hidden="true"
                className="flex h-11 w-11 items-center justify-center rounded-full bg-success-subtle text-success"
              >
                <Check className="h-5 w-5" />
              </span>
              <h3 className="mt-5 text-[1.375rem] font-light tracking-[-0.022em]">
                Thanks, we have your message.
              </h3>
              <p className="mt-2 text-body text-text-secondary">
                We will reply to {form.email || "your inbox"} within one working day.
              </p>
              <button className="ui-button-secondary mt-7" onClick={startOver} type="button">
                Send another message
              </button>
            </div>
          ) : (
            <form className="ui-card flex flex-col gap-5 p-6 sm:p-8" onSubmit={handleSubmit}>
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="flex flex-col gap-1.5">
                  <label className="ui-label" htmlFor={`${fieldId}-name`}>
                    Your name
                  </label>
                  <input
                    autoComplete="name"
                    className="ui-input"
                    id={`${fieldId}-name`}
                    onChange={(event) => updateField("name", event.target.value)}
                    required
                    type="text"
                    value={form.name}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="ui-label" htmlFor={`${fieldId}-email`}>
                    Work email
                  </label>
                  <input
                    autoComplete="email"
                    className="ui-input"
                    id={`${fieldId}-email`}
                    onChange={(event) => updateField("email", event.target.value)}
                    required
                    type="email"
                    value={form.email}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="ui-label" htmlFor={`${fieldId}-company`}>
                  Company
                </label>
                <input
                  autoComplete="organization"
                  className="ui-input"
                  id={`${fieldId}-company`}
                  onChange={(event) => updateField("company", event.target.value)}
                  type="text"
                  value={form.company}
                />
                <p className="ui-hint">Optional, but it helps us answer properly.</p>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="ui-label" htmlFor={`${fieldId}-message`}>
                  How can we help?
                </label>
                <textarea
                  className="ui-textarea"
                  id={`${fieldId}-message`}
                  onChange={(event) => updateField("message", event.target.value)}
                  placeholder="Tell us a bit about your team and what you are trying to do."
                  required
                  value={form.message}
                />
              </div>

              <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="ui-hint">We will never share your details.</p>
                <button className="ui-button-primary px-6" type="submit">
                  Send message
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </>
  );
}
