"use client";

import { ArrowRight } from "lucide-react";
import { useState } from "react";

import { useFeedback } from "@/components/site/feedback-provider";

const POLICY_COPY: Record<string, string> = {
  "Size Guide":
    "This dress runs true to size with a close fit through the bodice and an A-line skirt. Body measurements in centimetres are listed in the size guide on the product panel.",
  "Care Instruction":
    "Dry clean only. Steam lightly on low heat. Store on a padded hanger away from direct sunlight. Do not tumble dry.",
  FAQ: "Orders ship within 1–2 business days. Returns and exchanges are accepted within 14 days of delivery. For anything else, write to hello@loremipsum.example.",
  "Contact Us": "Client services: hello@loremipsum.example · +91 90000 00000 · Monday to Saturday, 11am – 8pm IST.",
  "Terms & Condition": "This is a demonstration storefront. No orders are fulfilled and no payment is taken.",
  Privacy: "Try-on images stay in your browser. Nothing you upload is sent to a server in this demo.",
  Shipping: "Complimentary express shipping across India, 2–4 business days. International delivery is available at checkout.",
  "Returns & Exchange": "Free returns and exchanges within 14 days of delivery. Pieces must be unworn with tags attached.",
  "About Us": "Lorem Ipsum is a contemporary atelier working in considered silhouettes and satin-matte fabrics, made in India.",
  Atelier: "Our atelier is in Mumbai. Each piece is cut in small runs and finished by hand.",
  Journal: "The Lorem Ipsum journal is published monthly. Subscribe below for the next letter.",
  Instagram: "Follow Lorem Ipsum on Instagram.",
  Facebook: "Follow Lorem Ipsum on Facebook.",
  Pinterest: "Follow Lorem Ipsum on Pinterest.",
};

const COLUMNS = [
  {
    title: "Help",
    links: [
      { label: "Size Guide", href: "#size-guide" },
      { label: "Care Instruction", href: "#details" },
      { label: "FAQ", href: "#service" },
      { label: "Contact Us", href: "#service" },
    ],
  },
  {
    title: "Policies",
    links: [
      { label: "Terms & Condition", href: "#service" },
      { label: "Privacy", href: "#service" },
      { label: "Shipping", href: "#service" },
      { label: "Returns & Exchange", href: "#service" },
    ],
  },
  {
    title: "The Brand",
    links: [
      { label: "About Us", href: "#service" },
    ],
  },
  {
    title: "Socials",
    links: [
      { label: "Instagram", href: "#service" },
      { label: "Facebook", href: "#service" },
      { label: "Pinterest", href: "#service" },
    ],
  },
];

export function SiteFooter() {
  const { info } = useFeedback();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  function openPolicy(label: string) {
    info(
      label,
      <p className="pdp-copy text-ink-muted">
        {POLICY_COPY[label] ?? "This page is part of the full storefront."}
      </p>,
    );
  }

  return (
    <footer className="border-t border-[#DFDFDF] bg-paper pt-16 pb-10 desktop:pt-[120px] desktop:pb-[120px]" id="service">
      <div className="px-(--gutter)">
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 desktop:grid-cols-[1.6fr_1fr_1fr_1fr_1fr_1.7fr] desktop:gap-x-8">
          <div className="col-span-2 grid content-start gap-5 tablet:col-span-1">
            <div className="grid gap-2">
              <p className="footer-heading">Flagship Store</p>
              <p className="type-body-sm max-w-[260px] text-ink-muted">
                123 Example Street, Mumbai, India
              </p>
              <p className="type-body-sm text-ink-muted">Open daily, 11am – 8pm</p>
            </div>
            <p className="mt-2 text-[36px] leading-[54px] font-normal tracking-[0.02em] text-ink uppercase">
              Lorem Ipsum
            </p>
          </div>

          {COLUMNS.map((column) => (
            <div className="grid content-start gap-2" key={column.title}>
              <p className="footer-heading">{column.title}</p>
              <ul className="grid" role="list">
                {column.links.map((link) => (
                  <li key={link.label}>
                    {column.title === "Socials" ? (
                      <a
                        className="type-body-sm focus-ring flex min-h-9 items-center text-ink-muted transition-colors hover:text-ink"
                        href={
                          link.label === "Instagram"
                            ? "https://www.instagram.com/"
                            : link.label === "Facebook"
                              ? "https://www.facebook.com/"
                              : "https://www.pinterest.com/"
                        }
                        rel="noreferrer"
                        target="_blank"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <button
                        className="type-body-sm focus-ring flex min-h-9 items-center text-left text-ink-muted transition-colors hover:text-ink"
                        onClick={() => openPolicy(link.label)}
                        type="button"
                      >
                        {link.label}
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="col-span-2 grid content-start gap-3 tablet:col-span-3 desktop:col-span-1">
            <p className="footer-heading">Subscribe to Our Newsletters</p>
            <form
              className="flex items-center border-b border-ink pb-2"
              onSubmit={(event) => {
                event.preventDefault();
                if (!email.trim()) return;
                setSubscribed(true);
                setEmail("");
              }}
            >
              <label className="sr-only" htmlFor="newsletter-email">
                Your Email
              </label>
              <input
                className="type-body min-w-0 flex-1 bg-transparent py-1 placeholder:text-ink-muted focus:outline-none"
                id="newsletter-email"
                onChange={(event) => {
                  setEmail(event.target.value);
                  setSubscribed(false);
                }}
                placeholder="Your Email"
                suppressHydrationWarning
                type="email"
                value={email}
              />
              <button
                aria-label="Subscribe"
                className="focus-ring flex size-8 shrink-0 items-center justify-center"
                type="submit"
              >
                <ArrowRight className="size-4" strokeWidth={1.25} />
              </button>
            </form>
            <p aria-live="polite" className="type-label min-h-4 text-ink-muted">
              {subscribed ? "Thank you — you are on the list." : "One letter a month. No noise."}
            </p>
          </div>
        </div>

      </div>
    </footer>
  );
}
