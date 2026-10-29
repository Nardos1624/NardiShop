"use client";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Link from "next/link";
import { Button } from "./ui/button";
import { useRef } from "react";
import Image from "next/image";
import { ArrowRight, Truck, Wallet } from "lucide-react";

gsap.registerPlugin(useGSAP);

const HeroSection = () => {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: "expo.out" } });

    tl.from(".hero-content", { x: -50, opacity: 0, duration: 1.5 })
      .from(".hero-title > span", { y: 40, opacity: 0, stagger: 0.12, duration: 1, filter: "blur(10px)" }, "-=1")
      .from(".hero-image-container", { scale: 0.9, opacity: 0, duration: 1.6 }, "-=1.2")
      .from(".hero-badge", { y: 20, opacity: 0, stagger: 0.15, duration: 0.8 }, "-=0.8");
  }, { scope: container });

  return (
    <section
      ref={container}
      className="relative w-full overflow-hidden bg-linear-to-b from-[#FBF7EE] to-white"
    >
      {/* Soft gold background glows */}
      <div className="pointer-events-none absolute -left-32 top-10 h-96 w-96 rounded-full bg-[#D4AF37]/15 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-amber-200/30 blur-3xl" />

      <div className="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-12 px-6 py-16 md:py-20 lg:grid-cols-2 lg:py-24">
        <div className="hero-content flex flex-col items-start gap-8 text-left">
          <div className="space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/40 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#B8962E] shadow-sm">
              <span className="h-2 w-2 rounded-full bg-[#D4AF37] shadow-[0_0_12px_rgba(212,175,55,0.7)]" />
              Shopping, made joyful
            </div>
            <h1 className="hero-title flex flex-col items-start gap-2">
              <span className="block text-4xl font-bold tracking-[-0.03em] text-[#281E18] sm:text-5xl lg:text-6xl">
                Click. Order.{" "}
                <span className="bg-linear-to-r from-amber-300 via-[#D4AF37] to-yellow-600 bg-clip-text font-extrabold text-transparent">
                  Smile.
                </span>
              </span>
              <span className="block text-2xl font-semibold tracking-tight text-[#5C5148] sm:text-3xl">
                That’s <span className="font-black text-[#281E18]">NardiShop<span className="text-[#D4AF37]">.</span></span>
              </span>
            </h1>

            <p className="hero-description max-w-[480px] text-lg leading-relaxed text-[#5C5148]">
              Order your favorite brands in minutes, and we’ll deliver them to your door.
            </p>
          </div>

          <div className="hero-button flex flex-wrap items-center gap-4">
            <Button
              asChild
              size="lg"
              className="h-14 rounded-full bg-[#D4AF37] px-10 text-base font-bold text-[#281E18] shadow-[0_10px_30px_rgba(212,175,55,0.45)] transition-transform hover:scale-105 hover:bg-amber-300"
            >
              <Link href="/products">
                Shop Now <ArrowRight className="ml-1 h-5 w-5" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-14 rounded-full border-[#281E18]/20 bg-white px-8 text-base font-semibold text-[#281E18] hover:border-[#D4AF37] hover:bg-white hover:text-[#B8962E]"
            >
              <Link href="/categories">Browse Categories</Link>
            </Button>
          </div>
          
        </div>

        {/* Hidden on phones; shown from tablet size up */}
        <div className="hero-image-container relative hidden items-center justify-center md:flex">
          <div className="relative aspect-square w-full max-w-[520px] overflow-hidden rounded-[2.5rem] bg-[#281E18] shadow-[0_30px_80px_rgba(40,30,24,0.25)] ring-1 ring-[#D4AF37]/30">
            <Image
              src="/placeholder/home-image.png"
              alt="Products available at NardiShop"
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Floating info badges */}
          <div className="hero-badge absolute -left-2 top-8 hidden items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-xl ring-1 ring-black/5 sm:flex lg:-left-6">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#D4AF37]/15 text-[#B8962E]">
              <Wallet className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm font-bold text-[#281E18]">Pay 50% now</p>
              <p className="text-xs text-[#5C5148]">The rest on delivery</p>
            </div>
          </div>
          <div className="hero-badge absolute -right-2 bottom-10 hidden items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-xl ring-1 ring-black/5 sm:flex lg:-right-4">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#D4AF37]/15 text-[#B8962E]">
              <Truck className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm font-bold text-[#281E18]">Delivered to your door</p>
              <p className="text-xs text-[#5C5148]">Order in minutes</p>
            </div>
          </div>
        </div>
      </div>
      
    </section>
    
  );
};

export default HeroSection;
