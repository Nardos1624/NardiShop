import Link from "next/link";
import Image from "next/image";
import { MapPin, Phone } from "lucide-react";
import { socialLinks } from "@/lib/social-links";

const footerLinks = [
  {
    title: "Shop",
    links: [
      { href: "/products", label: "All products" },
      { href: "/categories", label: "Categories" },
      { href: "/search", label: "Search" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About us" },
      { href: "/contact", label: "Support" },
      { href: "/checkout", label: "Checkout" },
    ],
  },
];

/**
 * Footer component.
 *
 * This component renders the footer of the application.
 *
 * @returns {JSX.Element}
 */
function Footer() {
  return (
    <footer className="border-t border-zinc-200 bg-white">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 py-14 sm:grid-cols-2 lg:grid-cols-4">
        {/* Brand */}
        <div className="space-y-4">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/placeholder/Nardi%20shop%20logo%20Transparent.png"
              alt="NardiShop logo"
              width={48}
              height={48}
              className="object-contain"
            />
            <span className="text-xl font-bold text-[#D4AF37]">NardiShop</span>
          </Link>
          <p className="text-sm leading-relaxed text-[#5C5148]">
            Order your favorite brands in minutes, and we’ll deliver them to your door.
          </p>
          <div className="flex gap-2">
            {socialLinks.map(({ name, href, icon: Icon }) => (
              <a
                key={name}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Visit NardiShop on ${name}`}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-zinc-200 text-[#281E18] transition-colors hover:border-[#D4AF37] hover:bg-[#D4AF37]"
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
              </a>
            ))}
          </div>
        </div>

        {/* Link columns */}
        {footerLinks.map((column) => (
          <div key={column.title}>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.15em] text-[#281E18]">{column.title}</h3>
            <ul className="space-y-3">
              {column.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-[#5C5148] transition-colors hover:text-[#B8962E]">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        {/* Contact */}
        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.15em] text-[#281E18]">Get in touch</h3>
          <ul className="space-y-3 text-sm text-[#5C5148]">
            <li>
              <a href="tel:+251960246425" className="flex items-center gap-2 transition-colors hover:text-[#B8962E]">
                <Phone className="h-4 w-4 text-[#D4AF37]" /> +251 960 246 425
              </a>
            </li>
            <li className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-[#D4AF37]" /> Addis Ababa, Ethiopia
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-zinc-200">
        <p className="mx-auto max-w-7xl px-6 py-5 text-center text-sm text-[#5C5148]">
          &copy; 2026 <span className="text-[#D4AF37]">NardiShop</span>. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
