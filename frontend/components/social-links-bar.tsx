import { socialLinks } from "@/lib/social-links";
import { Phone } from "lucide-react";

function SocialLinksBar() {
  return (
    <nav
      aria-label="Contact and social links"
      className="fixed bottom-5 right-5 z-40 flex flex-col gap-2.5"
    >
      <a
        href="tel:+251960246425"
        aria-label="Call NardiShop at +251 960 246 425"
        title="Call +251 960 246 425"
        className="flex h-11 w-11 items-center justify-center rounded-full bg-[#D4AF37] text-[#281E18] shadow-lg shadow-black/20 transition duration-200 hover:scale-110 hover:bg-[#E7C96B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
      >
        <Phone className="h-5 w-5" aria-hidden="true" />
      </a>
        {socialLinks.map(({ name, href, icon: Icon }) => (
          <a
            key={name}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Visit NardiShop on ${name}`}
            title={name}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-[#D4AF37] text-[#281E18] shadow-lg shadow-black/20 transition duration-200 hover:scale-110 hover:bg-[#E7C96B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
          >
            <Icon className="h-5 w-5" aria-hidden="true" />
          </a>
        ))}
    </nav>
  );
}

export default SocialLinksBar;