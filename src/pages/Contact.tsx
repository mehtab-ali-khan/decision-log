import { SiteFooter, SiteHeader } from "../components/layout/SiteChrome";
import { ContactSection } from "../components/marketing/ContactSection";

export default function Contact() {
  return (
    <div className="flex min-h-screen flex-col bg-background font-sans text-text-primary">
      <SiteHeader />

      <main className="flex-1">
        <section className="ui-page py-16 sm:py-24">
          <ContactSection heading="h1" />
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
