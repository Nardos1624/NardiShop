import { Phone, Send } from "lucide-react";
import { socialLinks } from "@/lib/social-links";

const telegramHref = socialLinks.find((link) => link.name === "Telegram")?.href ?? "/contact";

/**
 * Banner inviting shoppers to contact the store before ordering.
 */
export default function ContactCta() {
  return (
    <section className="w-full bg-white py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="relative overflow-hidden rounded-[2rem] bg-linear-to-br from-[#FBF7EE] via-white to-[#F6EBCB] p-10 ring-1 ring-[#D4AF37]/30 md:p-14">
          <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-[#D4AF37]/20 blur-3xl" />
          <div className="relative flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
            <div className="max-w-xl">
              <h2 className="text-3xl font-bold tracking-tight text-[#281E18] md:text-4xl">
                Questions before you order?
              </h2>
              <p className="mt-3 text-[#5C5148]">
                Our team is happy to help with sizes, availability or delivery. Reach us on Telegram or give us a call.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <a
                href={telegramHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-12 items-center gap-2 rounded-full bg-[#281E18] px-6 font-semibold text-white transition-colors hover:bg-[#3a2c23]"
              >
                <Send className="h-4 w-4" /> Message on Telegram
              </a>
              <a
                href="tel:+251960246425"
                className="inline-flex h-12 items-center gap-2 rounded-full border border-[#281E18]/20 bg-white px-6 font-semibold text-[#281E18] transition-colors hover:border-[#D4AF37] hover:text-[#B8962E]"
              >
                <Phone className="h-4 w-4" /> +251 960 246 425
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
