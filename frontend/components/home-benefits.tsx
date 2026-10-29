import { Headphones, ShieldCheck, Truck, Wallet } from "lucide-react";

const benefits = [
  { icon: Truck, title: "Doorstep delivery", description: "We bring your order to you" },
  { icon: Wallet, title: "Pay 50% upfront", description: "The rest when your order arrives" },
  { icon: ShieldCheck, title: "Confirmed orders", description: "Every payment is checked by our team" },
  { icon: Headphones, title: "Real support", description: "Call or message us anytime" },
];

/**
 * A strip of the store's key benefits shown under the hero.
 */
export default function HomeBenefits() {
  return (
    <section aria-label="Why shop with NardiShop" className="border-y border-zinc-200 bg-white">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-6 py-8 sm:grid-cols-2 lg:grid-cols-4">
        {benefits.map(({ icon: Icon, title, description }) => (
          <div key={title} className="flex items-center gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#FBF7EE] text-[#B8962E] ring-1 ring-[#D4AF37]/30">
              <Icon className="h-5 w-5" />
            </span>
            <div>
              <p className="font-semibold text-[#281E18]">{title}</p>
              <p className="text-sm text-[#5C5148]">{description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
