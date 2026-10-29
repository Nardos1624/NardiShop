import { Camera, PackageCheck, ShoppingCart } from "lucide-react";

const steps = [
  {
    icon: ShoppingCart,
    title: "Choose your products",
    description: "Browse the shop, pick a quantity and add what you love to your cart.",
  },
  {
    icon: Camera,
    title: "Pay 50% and upload your receipt",
    description: "At checkout, pay the 50% amount shown, upload a screenshot of the payment, fill in your details, and click Place Order.",
  },
  {
    icon: PackageCheck,
    title: "Receive your order",
    description: "We deliver your order to your door within 7–10 business days. You pay the remaining 50% on delivery.",
  },
];

/**
 * Explains NardiShop's ordering and half-payment process in three steps.
 */
export default function HowItWorks() {
  return (
    <section className="w-full bg-[#281E18] py-20 text-white">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#D4AF37]">How it works</p>
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Ordering is simple</h2>
          <p className="mt-3 text-zinc-300">Three easy steps from your cart to your door.</p>
        </div>

        <ol className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {steps.map(({ icon: Icon, title, description }, index) => (
            <li
              key={title}
              className="relative rounded-3xl border border-white/10 bg-white/5 p-8 transition-colors hover:border-[#D4AF37]/50"
            >
              <span className="absolute right-6 top-6 text-5xl font-black text-white/10">0{index + 1}</span>
              <span className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#D4AF37] text-[#281E18]">
                <Icon className="h-6 w-6" />
              </span>
              <h3 className="mb-2 text-xl font-semibold">{title}</h3>
              <p className="text-sm leading-relaxed text-zinc-300">{description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
