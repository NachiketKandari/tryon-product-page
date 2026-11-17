"use client";

import { Search, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import { useBag } from "@/components/site/bag-provider";
import { useFeedback } from "@/components/site/feedback-provider";
import { product } from "@/lib/catalog";

const MOBILE_LINKS = [
  { href: "#product", label: "New In" },
  { href: "#product", label: "Dresses" },
  { href: "#product", label: "Racer Backs" },
  { href: "#product", label: "Tops" },
  { href: "#product", label: "Skirts" },
  { href: "#recommendations", label: "The Edit" },
];

const UTILITY_LINKS = ["My Account", "Delivery", "Returns", "Contact Us"];

export function SiteHeader() {
  const { count, setOpen } = useBag();
  const { info, isWishlisted, openSearch, toast, toggleWishlist, wishlistCount } = useFeedback();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  function openCategory(title: string) {
    info(
      title,
      <div className="grid gap-5">
        <p className="pdp-copy text-ink-muted">
          {title === "Woman" ? "Shop woman" : "Shop man"} — this build hosts a single product page,
          so the category links below return to the dress.
        </p>
        <ul className="divide-y divide-rule" role="list">
          {(title === "Woman"
            ? ["All", "Bralettes", "Dresses", "Pants", "Racer Backs", "Shirts", "Skirts", "Tops"]
            : ["All", "Jackets", "Pants", "Shirts", "Shorts", "T-shirts"]
          ).map((label) => (
            <li key={label}>
              <Link
                className="type-body flex min-h-11 items-center justify-between"
                href="#product"
                onClick={() => {
                  setMenuOpen(false);
                  toast(`Showing the ${product.title}`);
                }}
              >
                {label}
                <span aria-hidden="true">→</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>,
    );
  }

  function openAccount() {
    info(
      "Account",
      <div className="grid gap-4">
        <p className="pdp-copy text-ink-muted">
          Accounts are not connected in this demo. The storefront keeps your bag and wishlist in
          this browser for the session.
        </p>
        <a className="type-body underline underline-offset-4" href="mailto:hello@loremipsum.example">
          hello@loremipsum.example
        </a>
      </div>,
    );
  }

  function openHelp() {
    info(
      "Client services",
      <div className="grid gap-5">
        <p className="pdp-copy text-ink-muted">
          Our client advisors are available Monday to Saturday, 11am – 8pm IST.
        </p>
        <div className="grid gap-2">
          <a className="type-body underline underline-offset-4" href="mailto:hello@loremipsum.example">
            hello@loremipsum.example
          </a>
          <a className="type-body underline underline-offset-4" href="tel:+919000000000">
            +91 90000 00000
          </a>
          <a className="type-body underline underline-offset-4" href="https://wa.me/919000000000">
            WhatsApp
          </a>
        </div>
      </div>,
    );
  }

  return (
    <>
      <header className="sticky top-0 z-(--z-header) h-(--header-bar-h)" data-app-header>
        <div className="h-full border-b border-ink bg-paper desktop:border-b-0">
          <div className="grid h-full grid-cols-[auto_1fr_auto] items-center gap-2 px-(--gutter) desktop:grid-cols-[1fr_auto_1fr] desktop:gap-3">
            <div className="flex min-w-0 items-center gap-2.5">
              <nav aria-label="Main menu" className="hidden desktop:block">
                <ul className="flex items-center gap-6" role="list">
                  <li>
                    <button className="nav-link focus-ring uppercase" onClick={() => openCategory("Woman")} type="button">
                      Woman
                    </button>
                  </li>
                  <li>
                    <button className="nav-link focus-ring uppercase" onClick={() => openCategory("Man")} type="button">
                      Man
                    </button>
                  </li>
                  <li>
                    <button className="nav-link focus-ring uppercase" onClick={openSearch} type="button">
                      Search
                    </button>
                  </li>
                </ul>
              </nav>

              <button
                aria-label="Open menu"
                className="type-body focus-ring flex h-[43px] items-center border border-ink px-2 uppercase text-[13px] desktop:hidden"
                onClick={() => setMenuOpen(true)}
                type="button"
              >
                Menu
              </button>
            </div>

            <Link
              aria-label="Lorem Ipsum — home"
              className="flex min-h-9 shrink-0 items-center justify-self-center"
              href="/"
            >
              <span className="flex h-[27px] items-center whitespace-nowrap text-[15px] font-medium tracking-[0.03em] uppercase desktop:hidden">
                Lorem Ipsum
              </span>
              <Image
                alt="Lorem Ipsum"
                className="hidden h-auto w-[303px] desktop:block"
                height={82}
                priority
                src="/brand/wordmark.png"
                width={950}
              />
            </Link>

            <div className="flex min-w-0 items-center justify-end gap-2.5 desktop:gap-6">
              <button
                aria-pressed={isWishlisted}
                className="nav-link focus-ring hidden items-center gap-1.5 uppercase desktop:flex"
                onClick={toggleWishlist}
                type="button"
              >
                Wishlist
                {wishlistCount > 0 ? <span className="tabular-nums">({wishlistCount})</span> : null}
              </button>
              <button
                className="nav-link focus-ring hidden uppercase desktop:block"
                onClick={() => setOpen(true)}
                type="button"
              >
                Bag <span className="tabular-nums">({count})</span>
              </button>
              <button
                className="nav-link focus-ring hidden uppercase desktop:block"
                onClick={openHelp}
                type="button"
              >
                Help
              </button>
              <button
                className="nav-link focus-ring hidden uppercase desktop:block"
                onClick={openAccount}
                type="button"
              >
                Account
              </button>

              <button
                className="type-body focus-ring flex h-[43px] items-center gap-1 border border-ink px-2 uppercase text-[13px] desktop:hidden"
                onClick={() => setOpen(true)}
                type="button"
              >
                Bag <span className="tabular-nums">({count})</span>
              </button>
              <button
                className="type-body focus-ring flex h-[43px] items-center border border-ink px-2 uppercase text-[13px] desktop:hidden"
                onClick={openHelp}
                type="button"
              >
                Help
              </button>
            </div>
          </div>
        </div>
      </header>

      {menuOpen ? (
        <div
          aria-label="Menu"
          aria-modal="true"
          className="fixed inset-0 z-(--z-overlay) flex flex-col overflow-y-auto bg-paper desktop:hidden"
          role="dialog"
        >
          <div className="flex h-[76px] shrink-0 items-center justify-between border-b border-ink px-6">
            <div className="flex items-center gap-5">
              <button
                className="type-nav border-b border-ink py-2"
                onClick={() => {
                  setMenuOpen(false);
                  openCategory("Woman");
                }}
                type="button"
              >
                Woman
              </button>
              <button
                className="type-nav py-2 text-ink-muted"
                onClick={() => {
                  setMenuOpen(false);
                  openCategory("Man");
                }}
                type="button"
              >
                Man
              </button>
            </div>
            <div className="flex items-center gap-2">
              <button
                aria-label="Search"
                className="focus-ring flex size-9 items-center justify-center"
                onClick={() => {
                  setMenuOpen(false);
                  openSearch();
                }}
                type="button"
              >
                <Search className="size-5" strokeWidth={1.25} />
              </button>
              <button
                aria-label="Close menu"
                className="focus-ring flex size-9 items-center justify-center"
                onClick={() => setMenuOpen(false)}
                type="button"
              >
                <X className="size-4" strokeWidth={1.25} />
              </button>
            </div>
          </div>

          <nav className="grid gap-4 px-6 pt-8">
            {MOBILE_LINKS.map((link) => (
              <Link
                className="type-h3 focus-ring flex min-h-6 items-center"
                href={link.href}
                key={link.label}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="mt-auto grid gap-3 px-6 pt-10 pb-10">
            {UTILITY_LINKS.map((label) => (
              <button
                className="type-body text-left text-ink-muted focus-ring"
                key={label}
                onClick={() => {
                  setMenuOpen(false);
                  if (label === "My Account") openAccount();
                  else if (label === "Contact Us") openHelp();
                  else openHelp();
                }}
                type="button"
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </>
  );
}
