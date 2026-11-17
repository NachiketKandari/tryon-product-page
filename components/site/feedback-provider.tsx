"use client";

import { ArrowRight, Heart, Search, X } from "lucide-react";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

import { formatInr, product, recommendations } from "@/lib/catalog";

interface FeedbackContextValue {
  info: (title: string, body: React.ReactNode) => void;
  isWishlisted: boolean;
  openSearch: () => void;
  toast: (message: string) => void;
  toggleWishlist: () => void;
  wishlistCount: number;
}

const FeedbackContext = createContext<FeedbackContextValue | null>(null);

export function useFeedback(): FeedbackContextValue {
  const context = useContext(FeedbackContext);
  if (!context) throw new Error("useFeedback must be used inside <FeedbackProvider>");
  return context;
}

export function FeedbackProvider({ children }: { children: React.ReactNode }) {
  const [message, setMessage] = useState<string | null>(null);
  const [sheet, setSheet] = useState<{ body: React.ReactNode; title: string } | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);

  const toast = useCallback((next: string) => setMessage(next), []);

  useEffect(() => {
    if (!message) return;
    const timer = window.setTimeout(() => setMessage(null), 3200);
    return () => window.clearTimeout(timer);
  }, [message]);

  useEffect(() => {
    if (!sheet && !searchOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSheet(null);
        setSearchOpen(false);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [searchOpen, sheet]);

  const value = useMemo<FeedbackContextValue>(
    () => ({
      info: (title, body) => setSheet({ body, title }),
      isWishlisted: wishlisted,
      openSearch: () => setSearchOpen(true),
      toast,
      toggleWishlist: () => {
        setWishlisted((current) => {
          toast(current ? "Removed from wishlist" : "Saved to wishlist");
          return !current;
        });
      },
      wishlistCount: wishlisted ? 1 : 0,
    }),
    [toast, wishlisted],
  );

  return (
    <FeedbackContext.Provider value={value}>
      {children}

      {message ? (
        <div
          aria-live="polite"
          className="fixed bottom-6 left-1/2 z-(--z-toast) -translate-x-1/2 bg-ink px-5 py-3 text-inverse"
          role="status"
        >
          <p className="type-body-sm">{message}</p>
        </div>
      ) : null}

      {sheet ? (
        <div className="fixed inset-0 z-(--z-overlay) flex justify-end">
          <button
            aria-label="Close panel"
            className="absolute inset-0 cursor-default bg-black/30"
            onClick={() => setSheet(null)}
            type="button"
          />
          <aside
            aria-label={sheet.title}
            aria-modal="true"
            className="relative flex h-full w-full max-w-[592px] flex-col bg-paper"
            data-testid="info-sheet"
            role="dialog"
          >
            <div className="flex h-(--header-bar-h) shrink-0 items-center justify-between border-b border-rule px-(--gutter)">
              <p className="type-h4">{sheet.title}</p>
              <button
                aria-label="Close panel"
                className="focus-ring flex size-9 items-center justify-center"
                onClick={() => setSheet(null)}
                type="button"
              >
                <X className="size-4" strokeWidth={1.25} />
              </button>
            </div>
            <div className="grid content-start gap-5 overflow-y-auto p-(--gutter)">
              {sheet.body}
              <button
                className="type-control mt-4 flex h-10 w-full items-center justify-center bg-ink uppercase text-inverse focus-ring"
                onClick={() => setSheet(null)}
                type="button"
              >
                Close
              </button>
            </div>
          </aside>
        </div>
      ) : null}

      {searchOpen ? (
        <div className="fixed inset-0 z-(--z-overlay) bg-paper" data-testid="search-overlay">
          <div className="mx-auto flex h-full w-full max-w-[880px] flex-col px-(--gutter)">
            <div className="flex h-(--header-bar-h) shrink-0 items-center gap-4 border-b border-ink">
              <Search className="size-5 shrink-0" strokeWidth={1.25} />
              <input
                autoFocus
                className="type-body min-w-0 flex-1 bg-transparent py-2 focus:outline-none"
                placeholder="Search the collection"
                type="search"
              />
              <button
                aria-label="Close search"
                className="focus-ring flex size-9 items-center justify-center"
                onClick={() => setSearchOpen(false)}
                type="button"
              >
                <X className="size-4" strokeWidth={1.25} />
              </button>
            </div>
            <div className="overflow-y-auto py-6">
              <p className="type-label text-ink-muted">Suggested</p>
              <ul className="mt-3 divide-y divide-rule" role="list">
                {[product, ...recommendations].map((item) => (
                  <li key={item.handle}>
                    <button
                      className="group flex w-full items-center justify-between gap-4 py-4 text-left focus-ring"
                      onClick={() => {
                        setSearchOpen(false);
                        if (item.handle === product.handle) {
                          document.getElementById("product")?.scrollIntoView({ behavior: "smooth" });
                        } else {
                          setSheet({
                            body: (
                              <p className="pdp-copy text-ink-muted">
                                {item.title} is part of the wider Lorem Ipsum catalogue. This build
                                hosts a single product page, so only the Racer back mini dress is
                                shoppable here.
                              </p>
                            ),
                            title: item.title,
                          });
                        }
                      }}
                      type="button"
                    >
                      <span className="grid gap-1">
                        <span className="pdp-title">{item.title}</span>
                        <span className="type-label text-ink-muted">
                          {"price" in item ? formatInr(item.price) : ""}
                        </span>
                      </span>
                      <ArrowRight className="size-4 shrink-0 transition-transform group-hover:translate-x-1" strokeWidth={1.25} />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ) : null}
    </FeedbackContext.Provider>
  );
}

export function WishlistIcon({ className }: { className?: string }) {
  const { isWishlisted } = useFeedback();
  return (
    <Heart
      className={className}
      fill={isWishlisted ? "currentColor" : "none"}
      strokeWidth={1.25}
    />
  );
}
