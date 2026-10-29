"use client";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarDays, Gem, Headphones, MapPin, ShieldCheck, Truck, Wallet } from "lucide-react";
import Footer from "@/components/footer";
import PoweredBy from "@/components/powered-by";
import Navbar from "@/components/navbar";
import SectionHeader from "@/components/section-header";
import HowItWorks from "@/components/how-it-works";
import ContactCta from "@/components/contact-cta";
import { Button } from "@/components/ui/button";

const facts = [
  { icon: CalendarDays, label: "Founded", value: "2026" },
  { icon: MapPin, label: "Based in", value: "Addis Ababa, Ethiopia" },
  { icon: Wallet, label: "Payment", value: "50% now, 50% on delivery" },
  { icon: Headphones, label: "Support", value: "Phone & Telegram" },
];

const values = [
  { icon: Gem, title: "Premium Quality", desc: "Curated from the best sources." },
  { icon: Truck, title: "Fast Delivery", desc: "Shipping that keeps up with you." },
  { icon: ShieldCheck, title: "Secure Payments", desc: "Your data is always protected." },
];

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="bg-white text-[#281E18]">
        {/* Hero */}
        <section className="relative overflow-hidden bg-linear-to-b from-[#FBF7EE] to-white">
          <div className="pointer-events-none absolute -left-32 top-0 h-96 w-96 rounded-full bg-[#D4AF37]/15 blur-3xl" />
          <div className="pointer-events-none absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-amber-200/30 blur-3xl" />
          <div className="relative mx-auto max-w-4xl px-6 py-20 text-center md:py-28">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/40 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#B8962E] shadow-sm">
              <span className="h-2 w-2 rounded-full bg-[#D4AF37] shadow-[0_0_12px_rgba(212,175,55,0.7)]" />
              About us
            </div>
            <h1 className="text-4xl font-bold tracking-[-0.03em] sm:text-5xl lg:text-6xl">
              Good products, <span className="bg-linear-to-r from-amber-300 via-[#D4AF37] to-yellow-600 bg-clip-text text-transparent">easy to find</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-[#5C5148]">
              <span className="font-semibold text-[#D4AF37]">NardiShop</span> brings carefully chosen products
              to your door, with simple ordering and friendly support from people who care.
            </p>
          </div>
        </section>

        {/* At a glance */}
        <section aria-label="NardiShop at a glance" className="border-y border-zinc-200">
          <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-6 py-8 sm:grid-cols-2 lg:grid-cols-4">
            {facts.map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center gap-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#FBF7EE] text-[#B8962E] ring-1 ring-[#D4AF37]/30">
                  <Icon className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#5C5148]">{label}</p>
                  <p className="font-semibold">{value}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Story */}
        <section className="py-16 md:py-24">
          <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-6 lg:grid-cols-2">
            <div className="relative">
              <div className="relative aspect-4/3 overflow-hidden rounded-4xl bg-[#281E18] shadow-[0_30px_80px_rgba(40,30,24,0.2)] ring-1 ring-[#D4AF37]/30">
                <Image
                  src="/placeholder/home-image.png"
                  alt="Shopping bags from NardiShop"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="absolute -bottom-6 right-6 rounded-2xl bg-white px-5 py-4 shadow-xl ring-1 ring-black/5">
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#B8962E]">Since</p>
                <p className="text-3xl font-black">2026</p>
              </div>
            </div>

            <div>
              <SectionHeader eyebrow="Our story" title="How NardiShop started" />
              <div className="-mt-4 space-y-5 text-lg leading-relaxed text-[#5C5148]">
                <p>
                  Founded in 2026, NardiShop began with a simple idea that high-quality
                  products should not be hard to find. We curated a collection that
                  blends modern aesthetics with everyday functionality.
                </p>
                <p>
                  Every item in our shop is a reflection of our commitment to
                  <span className="font-bold text-[#281E18]"> excellence, durability, and style.</span>
                </p>
              </div>
              <Button
                asChild
                size="lg"
                className="mt-8 h-12 rounded-full bg-[#D4AF37] px-8 font-bold text-[#281E18] hover:bg-amber-300"
              >
                <Link href="/products">
                  Explore our products <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="bg-[#FBF7EE]/60 py-16 md:py-20">
          <div className="mx-auto max-w-7xl px-6">
            <SectionHeader
              eyebrow="What we stand for"
              title="Our values"
              description="The promises behind every order we deliver."
            />
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {values.map(({ icon: Icon, title, desc }) => (
                <div
                  key={title}
                  className="rounded-3xl bg-white p-8 ring-1 ring-zinc-200 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(212,175,55,0.2)] hover:ring-[#D4AF37]/50"
                >
                  <span className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#D4AF37] text-[#281E18]">
                    <Icon className="h-6 w-6" />
                  </span>
                  <h3 className="mb-2 text-xl font-bold">{title}</h3>
                  <p className="text-[#5C5148]">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <HowItWorks />
        <ContactCta />
      </main>
      <Footer />
      <PoweredBy />
    </>
  );
}
