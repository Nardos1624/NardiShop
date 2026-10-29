import type { CSSProperties } from "react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import PoweredBy from "@/components/powered-by";
import { ArrowUpRight, MapPin, MessageCircle, Phone, ShoppingBag, Truck, Wallet } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { socialLinks } from "@/lib/social-links";

const PHONE_DISPLAY = "0960 246 425";
const PHONE_HREF = "tel:+251960246425";

const highlights = [
  { value: "50%", label: "Pay upfront, rest on delivery" },
  { value: `${socialLinks.length}`, label: "Social channels to reach us" },
  { value: "Guest", label: "Checkout, no account needed" },
];

// const steps = [
//   { icon: ShoppingBag, title: "Pick your products", text: "Browse the shop and add what you love to your cart." },
//   { icon: MessageCircle, title: "Call or message us", text: "Ask anything about sizes, stock or your order." },
//   { icon: Wallet, title: "Pay 50% upfront", text: "Upload your payment screenshot at checkout." },
//   { icon: Truck, title: "Receive & pay the rest", text: "Pay the remaining 50% when your order arrives." },
// ];

const faqs = [
  {
    question: "How do I pay for my order?",
    answer:
      "At checkout you pay half (50%) of your order and upload a screenshot of the payment. You pay the remaining 50% when your order is delivered.",
  },
  {
    question: "Why do I need to upload a payment screenshot?",
    answer:
      "The screenshot confirms your 50% payment, so our team can verify it and start preparing your order.",
  },
 {
  question: "Do I need an account to order?",
  answer: "No account needed! Just add your items to the cart and check out.",
},
  {
    question: "What is the fastest way to reach you?",
    answer: "Call us or send a message on Telegram. You can also reach us on Instagram, TikTok or Facebook.",
  },
];

// TikTok's brand color is white, which disappears on light cards
const accentFor = (color: string) => (color.toUpperCase() === "#FFFFFF" ? "#281E18" : color);

export default function ContactPage() {
  return (
    <>
      <Navbar />

      <main className="overflow-hidden bg-white text-[#281E18]">
        {/* Hero */}
        <section className="relative bg-[#281E18] text-white">
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage:
                "linear-gradient(#D4AF37 1px, transparent 1px), linear-gradient(90deg, #D4AF37 1px, transparent 1px)",
              backgroundSize: "56px 56px",
              maskImage: "radial-gradient(ellipse at center, black 30%, transparent 75%)",
            }}
          />
          <div className="pointer-events-none absolute -left-40 -top-40 h-[28rem] w-[28rem] rounded-full bg-[#D4AF37]/25 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-48 right-0 h-[30rem] w-[30rem] rounded-full bg-amber-500/15 blur-3xl" />

          <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-6 pb-32 pt-20 md:pt-28 lg:grid-cols-2">
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/40 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#D4AF37] backdrop-blur">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#D4AF37] opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-[#D4AF37]" />
                </span>
                We’re here to help
              </div>
              {/* <h1 className="text-4xl font-bold leading-[1.05] tracking-[-0.03em] sm:text-5xl lg:text-6xl">
                Let’s talk about{" "}
                <span className="bg-linear-to-r from-amber-200 via-[#D4AF37] to-yellow-600 bg-clip-text text-transparent">
                  your next order
                </span>
              </h1> */}
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-zinc-300">
                Questions about a product, sizing or delivery? Skip the forms and reach us the way you like best —
                a quick call or a message on social media.
              </p>

              <dl className="mt-10 grid max-w-xl grid-cols-3 gap-4 border-t border-white/10 pt-8">
                {highlights.map(({ value, label }) => (
                  <div key={label}>
                    <dt className="sr-only">{label}</dt>
                    <dd className="text-2xl font-bold text-[#D4AF37] md:text-3xl">{value}</dd>
                    <dd className="mt-1 text-xs leading-snug text-zinc-400 md:text-sm">{label}</dd>
                  </div>
                ))}
              </dl>
            </div>

            {/* Featured call card */}
            <div className="relative animate-in fade-in slide-in-from-bottom-8 duration-1000">
              <div className="absolute -inset-px rounded-[2rem] bg-linear-to-br from-[#D4AF37] via-amber-200/40 to-transparent opacity-70" />
              <div className="relative rounded-[2rem] bg-[#1E1611]/95 p-8 shadow-[0_30px_80px_rgba(0,0,0,0.45)] backdrop-blur md:p-10">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#D4AF37]">Call us directly</p>
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#D4AF37]/15 text-[#D4AF37] ring-1 ring-[#D4AF37]/30">
                    <Phone className="h-5 w-5" />
                  </span>
                </div>
                <a
                  href={PHONE_HREF}
                  className="mt-6 block text-4xl font-bold tracking-tight text-white transition-colors hover:text-[#D4AF37] sm:text-5xl"
                >
                  {PHONE_DISPLAY}
                </a>
                <p className="mt-3 text-zinc-400">The fastest way to get an answer about any order or product.</p>

                <div className="mt-8 grid gap-3 sm:grid-cols-2">
                  <a
                    href={PHONE_HREF}
                    className="group flex h-13 items-center justify-center gap-2 rounded-full bg-[#D4AF37] font-semibold text-[#281E18] shadow-[0_10px_30px_rgba(212,175,55,0.35)] transition-all hover:scale-[1.02] hover:bg-amber-300"
                  >
                    <Phone className="h-4 w-4 transition-transform group-hover:rotate-12" /> Call now
                  </a>
                  {socialLinks[0] && (
                    <a
                      href={socialLinks[0].href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-13 items-center justify-center gap-2 rounded-full border border-white/15 font-semibold text-white transition-colors hover:border-[#D4AF37] hover:text-[#D4AF37]"
                    >
                      <MessageCircle className="h-4 w-4" /> Message on {socialLinks[0].name}
                    </a>
                  )}
                </div>

                <div className="mt-8 flex items-center gap-3 border-t border-white/10 pt-6 text-sm text-zinc-400">
                  <MapPin className="h-4 w-4 shrink-0 text-[#D4AF37]" />
                  Based in Addis Ababa, Ethiopia
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Social channels */}
        <section className="relative z-10 -mt-20 px-6">
          <div className="mx-auto max-w-7xl rounded-[2rem] bg-white p-6 shadow-[0_30px_80px_rgba(40,30,24,0.12)] ring-1 ring-zinc-200 md:p-10">
            <div className="mb-8 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#B8962E]">Find us online</p>
                <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Message us on social media</h2>
              </div>
              <p className="max-w-sm text-[#5C5148]">Follow along for new arrivals and send us a message anytime.</p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {socialLinks.map(({ name, description, href, icon: Icon, color }) => (
                <a
                  key={name}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Visit NardiShop on ${name}`}
                  style={{ "--accent": accentFor(color) } as CSSProperties}
                  className="group relative flex flex-col overflow-hidden rounded-3xl bg-[#FBF7EE]/70 p-6 ring-1 ring-zinc-200 transition-all duration-300 hover:-translate-y-1.5 hover:bg-white hover:shadow-[0_24px_50px_-12px_var(--accent)] hover:ring-(--accent)"
                >
                  <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-(--accent) opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-20" />
                  <div className="relative flex items-start justify-between">
                    <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-(--accent) shadow-sm ring-1 ring-zinc-200 transition-all duration-300 group-hover:bg-(--accent) group-hover:text-white group-hover:ring-transparent">
                      <Icon className="h-6 w-6" aria-hidden="true" />
                    </span>
                    <ArrowUpRight className="h-5 w-5 text-zinc-400 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-(--accent)" />
                  </div>
                  <p className="relative mt-8 text-lg font-bold">{name}</p>
                  <p className="relative mt-1 text-sm text-[#5C5148]">{description}</p>
                  <span className="relative mt-6 inline-flex items-center gap-1 text-sm font-semibold text-(--accent)">
                    Open {name}
                    <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                  </span>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* How ordering works */}
        {/* <section className="py-20 md:py-28">
          <div className="mx-auto max-w-7xl px-6">
            <div className="mx-auto mb-14 max-w-2xl text-center">
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#B8962E]">Simple & secure</p>
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl">How ordering works</h2>
            </div>
            <div className="relative">
              <div className="pointer-events-none absolute left-[12.5%] right-[12.5%] top-8 hidden h-px bg-linear-to-r from-transparent via-[#D4AF37]/50 to-transparent lg:block" />
              <ol className="relative grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {steps.map(({ icon: Icon, title, text }, index) => (
                <li key={title} className="relative flex flex-col items-center text-center">
                  <span className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-[#281E18] text-[#D4AF37] shadow-[0_15px_30px_rgba(40,30,24,0.25)]">
                    <Icon className="h-6 w-6" />
                    <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-[#D4AF37] text-xs font-bold text-[#281E18] ring-4 ring-white">
                      {index + 1}
                    </span>
                  </span>
                  <h3 className="mt-6 text-lg font-bold">{title}</h3>
                  <p className="mt-2 max-w-60 text-sm leading-relaxed text-[#5C5148]">{text}</p>
                </li>
              ))}
              </ol>
            </div>
          </div>
        </section> */}

        {/* FAQ */}
        <section className="bg-[#FBF7EE]/70 py-20 md:py-24">
          <div className="mx-auto grid max-w-6xl gap-12 px-6 lg:grid-cols-5">
            <div className="lg:col-span-2">
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#B8962E]">FAQ</p>
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Frequently asked questions</h2>
              <p className="mt-4 text-[#5C5148]">Can’t find what you’re looking for? Give us a call and we’ll sort it out.</p>
              <a
                href={PHONE_HREF}
                className="mt-6 inline-flex h-12 items-center gap-2 rounded-full bg-[#281E18] px-6 font-semibold text-white transition-colors hover:bg-[#D4AF37] hover:text-[#281E18]"
              >
                <Phone className="h-4 w-4" /> {PHONE_DISPLAY}
              </a>
            </div>
            <Accordion type="single" collapsible className="space-y-3 lg:col-span-3">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={faq.question}
                  value={`faq-${index}`}
                  className="rounded-2xl border-0 bg-white px-6 ring-1 ring-zinc-200 transition-shadow data-[state=open]:shadow-[0_15px_40px_rgba(40,30,24,0.08)] data-[state=open]:ring-[#D4AF37]/50"
                >
                  <AccordionTrigger className="gap-4 text-left text-base font-semibold hover:no-underline">
                    <span className="flex items-center gap-4">
                      <span className="text-sm font-bold text-[#D4AF37]">{String(index + 1).padStart(2, "0")}</span>
                      {faq.question}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="pl-10 text-[#5C5148]">{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>
      </main>

      {/* Floating call button on phones */}
      <a
        href={PHONE_HREF}
        aria-label={`Call NardiShop on ${PHONE_DISPLAY}`}
        className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#D4AF37] text-[#281E18] shadow-[0_15px_35px_rgba(212,175,55,0.5)] transition-transform hover:scale-105 md:hidden"
      >
        <span className="absolute inset-0 animate-ping rounded-full bg-[#D4AF37] opacity-30" />
        <Phone className="relative h-6 w-6" />
      </a>

      <Footer />
      <PoweredBy />
    </>
  );
}
