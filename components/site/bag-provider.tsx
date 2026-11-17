"use client";

import { X } from "lucide-react";
import Image from "next/image";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

import { formatPrice, type Product } from "@/lib/catalog";
import { useFeedback } from "@/components/site/feedback-provider";

export interface BagLine {
  image: string;
  price: number;
  quantity: number;
  size: string;
  title: string;
}

interface BagContextValue {
  add: (line: Omit<BagLine, "quantity">) => void;
  count: number;
  isOpen: boolean;
  lines: BagLine[];
  remove: (index: number) => void;
  setOpen: (open: boolean) => void;
  subtotal: number;
}

const BagContext = createContext<BagContextValue | null>(null);

export function useBag(): BagContextValue {
  const context = useContext(BagContext);
  if (!context) throw new Error("useBag must be used inside <BagProvider>");
  return context;
}

export function BagProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<BagLine[]>([]);
  const [isOpen, setOpen] = useState(false);

  const add = useCallback((line: Omit<BagLine, "quantity">) => {
    setLines((current) => {
      const index = current.findIndex(
        (entry) => entry.title === line.title && entry.size === line.size,
      );
      if (index === -1) return [...current, { ...line, quantity: 1 }];
      return current.map((entry, entryIndex) =>
        entryIndex === index ? { ...entry, quantity: entry.quantity + 1 } : entry,
      );
    });
    setOpen(true);
  }, []);

  const remove = useCallback((index: number) => {
    setLines((current) => current.filter((_, entryIndex) => entryIndex !== index));
  }, []);

  const value = useMemo<BagContextValue>(() => {
    const count = lines.reduce((total, line) => total + line.quantity, 0);
    const subtotal = lines.reduce((total, line) => total + line.price * line.quantity, 0);
    return { add, count, isOpen, lines, remove, setOpen, subtotal };
  }, [add, isOpen, lines, remove]);

  return (
    <BagContext.Provider value={value}>
      {children}
      <BagDrawer />
    </BagContext.Provider>
  );
}

function BagDrawer() {
  const { count, isOpen, lines, remove, setOpen, subtotal } = useBag();
  const { toast } = useFeedback();

  useEffect(() => {
    if (!isOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen, setOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-(--z-overlay) flex justify-end">
      <button
        aria-label="Close bag"
        className="absolute inset-0 cursor-default bg-black/25"
        onClick={() => setOpen(false)}
        type="button"
      />
      <aside
        aria-label="Shopping bag"
        aria-modal="true"
        className="relative flex h-full w-full max-w-[440px] flex-col bg-paper"
        data-testid="bag-drawer"
        role="dialog"
      >
        <div className="flex h-(--header-bar-h) shrink-0 items-center justify-between border-b border-rule px-(--gutter)">
          <p className="type-h4">Shopping bag ({count})</p>
          <button
            aria-label="Close bag"
            className="focus-ring flex size-9 items-center justify-center"
            onClick={() => setOpen(false)}
            type="button"
          >
            <X className="size-4" strokeWidth={1.25} />
          </button>
        </div>

        {lines.length === 0 ? (
          <div className="grid flex-1 content-center justify-items-center gap-4 px-6 text-center">
            <p className="pdp-label">Your bag is empty</p>
            <p className="pdp-copy max-w-[26ch] text-ink-muted">
              Pieces you add from the product page will appear here.
            </p>
            <button
              className="type-control mt-2 h-10 border border-ink px-6 uppercase focus-ring"
              onClick={() => setOpen(false)}
              type="button"
            >
              Continue shopping
            </button>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto px-(--gutter)">
            <ul className="divide-y divide-rule">
              {lines.map((line, index) => (
                <li className="flex gap-4 py-5" key={`${line.title}-${line.size}`}>
                  <div className="relative aspect-[4/5] w-20 shrink-0 overflow-hidden bg-surface">
                    <Image alt="" className="object-cover" fill sizes="80px" src={line.image} />
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col gap-1">
                    <p className="pdp-label truncate">{line.title}</p>
                    <p className="type-label text-ink-muted">
                      {line.size} · Qty {line.quantity}
                    </p>
                    <p className="pdp-price mt-1">{formatPrice(line.price * line.quantity)}</p>
                    <button
                      className="type-label mt-auto self-start text-ink-muted underline underline-offset-4 focus-ring"
                      onClick={() => remove(index)}
                      type="button"
                    >
                      Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="grid shrink-0 gap-4 border-t border-rule p-(--gutter)">
          <div className="flex items-baseline justify-between">
            <p className="type-label text-ink-muted">Subtotal</p>
            <p className="type-h3">{formatPrice(subtotal)}</p>
          </div>
          <p className="type-label text-ink-muted">Shipping and taxes calculated at checkout.</p>
          <button
            className="type-control h-11 w-full bg-ink uppercase text-inverse focus-ring disabled:opacity-40"
            disabled={lines.length === 0}
            onClick={() =>
              toast("This is a demonstration store — checkout is not connected.")
            }
            type="button"
          >
            Proceed to checkout
          </button>
        </div>
      </aside>
    </div>
  );
}

export type { Product };
