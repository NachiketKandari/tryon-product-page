"use client";

import { ChevronDown, ImagePlus } from "lucide-react";
import { useState } from "react";

import { SizeGuide } from "@/components/pdp/size-guide";
import { useBag } from "@/components/site/bag-provider";
import { useFeedback } from "@/components/site/feedback-provider";
import { formatAmount, type Product } from "@/lib/catalog";

interface BuyPanelProps {
  hasUserImages: boolean;
  onTryOn: () => void;
  outOfStock: boolean;
  product: Product;
}

function AccordionRow({
  children,
  defaultOpen = false,
  title,
}: {
  children: React.ReactNode;
  defaultOpen?: boolean;
  title: string;
}) {
  return (
    <details className="group border-b border-ink" open={defaultOpen}>
      <summary className="pdp-copy flex min-h-[49px] cursor-pointer list-none items-center justify-between gap-4 pt-4 pb-4 group-open:pb-0 desktop:min-h-0 desktop:pt-8 desktop:pb-8 desktop:group-open:pb-0 [&::-webkit-details-marker]:hidden">
        {title}
        <ChevronDown
          className="size-3 shrink-0 transition-transform duration-200 group-open:rotate-180"
          strokeWidth={1.25}
        />
      </summary>
      <div className="pdp-copy mt-3 pb-4 text-ink-muted desktop:pb-8">{children}</div>
    </details>
  );
}

export function BuyPanel({ hasUserImages, onTryOn, outOfStock, product }: BuyPanelProps) {
  const { add } = useBag();
  const { info } = useFeedback();
  const [size, setSize] = useState<string | null>(null);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const lowStock = size ? product.lowStockSizes.includes(size) : false;

  return (
    <div className="desktop:py-[140px] desktop:pr-[80px] desktop:pl-[80px]">
      <div className="grid gap-10 px-(--gutter) pt-6 pb-10 desktop:px-0 desktop:py-0">
        <div className="grid gap-3">
          <h1 className="pdp-title">{product.title}</h1>
          <p className="pdp-price">{formatAmount(product.price)}</p>
        </div>

        <fieldset className="grid gap-3">
          <legend className="pdp-label">Colors</legend>
          <div className="flex items-center">
            <span
              aria-label={`${product.colorName} selected`}
              className="size-4 border border-ink bg-ink"
              role="img"
            />
          </div>
        </fieldset>

        <fieldset className="grid gap-3">
          <div className="flex items-baseline justify-between gap-4">
            <legend className="pdp-label">Size</legend>
            <button
              className="pdp-label flex items-center gap-1.5 text-[#666666] focus-ring"
              onClick={() => setSizeGuideOpen(true)}
              type="button"
            >
              Size recommendation
            </button>
          </div>

          <div aria-label="Select a size" className="flex flex-wrap gap-3" role="group">
            {product.sizes.map((option) => {
              const selected = size === option;
              return (
                <button
                  aria-pressed={!outOfStock && selected}
                  className={`pdp-label flex h-[26px] min-w-8 items-center justify-center border px-1.5 transition-colors focus-ring desktop:h-11 desktop:px-4 ${
                    outOfStock
                      ? "cursor-not-allowed border-[#DCDCDC] bg-[#F2F2F2] text-[#DCDCDC]"
                      : selected
                        ? "border-ink bg-ink text-inverse"
                        : "border-ink text-ink hover:border-ink desktop:border-[#DCDCDC] desktop:text-ink-muted desktop:hover:text-ink"
                  }`}
                  disabled={outOfStock}
                  key={option}
                  onClick={() => setSize(option)}
                  type="button"
                >
                  {option}
                </button>
              );
            })}
          </div>

          {!outOfStock && lowStock ? (
            <p aria-live="polite" className="pdp-label mt-3 text-ink desktop:text-[#A66100]">
              Only 1 left in stock
            </p>
          ) : null}
        </fieldset>

        <div className="grid gap-2.5">
          {outOfStock ? (
            <button
              className="pdp-cta flex h-[50px] w-full items-center justify-center border border-[#353535] text-[#353535] transition-colors hover:bg-[#353535] hover:text-inverse focus-ring"
              onClick={() =>
                info(
                  "Notify me when available",
                  <div className="grid gap-4">
                    <p className="pdp-copy text-ink-muted">
                      The {product.title} is currently out of stock. Leave your email and the
                      client team will write the moment it returns.
                    </p>
                    <input
                      aria-label="Email for the waitlist"
                      className="type-body h-11 border border-ink px-3"
                      placeholder="Your Email"
                      type="email"
                    />
                    <button
                      className="pdp-cta flex h-11 items-center justify-center bg-[#353535] uppercase text-inverse"
                      onClick={() => info("You are on the list", <p className="pdp-copy text-ink-muted">We will write to you as soon as the {product.title} is back in stock.</p>)}
                      type="button"
                    >
                      Notify me
                    </button>
                  </div>,
                )
              }
              type="button"
            >
              Notify me when available
            </button>
          ) : (
            <button
              className={`pdp-cta flex h-12 w-full items-center justify-center ${
                size
                  ? "bg-[#353535] text-inverse hover:bg-ink"
                  : "cursor-not-allowed bg-[#DFDFDF] text-white"
              }`}
              disabled={!size}
              onClick={() => {
                if (!size) return;
                add({
                  image: product.images[0].src,
                  price: product.price,
                  size,
                  title: product.title,
                });
              }}
              type="button"
            >
              {size ? "Add to cart" : "Select size"}
            </button>
          )}

          <button
            className="pdp-cta flex h-12 w-full items-center justify-center gap-2 border border-[#353535] text-[#353535] transition-colors hover:bg-[#353535] hover:text-inverse focus-ring"
            onClick={onTryOn}
            type="button"
          >
            <ImagePlus className="size-4" strokeWidth={1.25} />
            {hasUserImages ? "Edit your images" : "Upload your images"}
          </button>
        </div>

        <div>
          <AccordionRow defaultOpen title="Description">
            <p>{product.description}</p>
          </AccordionRow>
          <AccordionRow title="Details">
            <ul className="grid gap-1.5" role="list">
              {product.details.map((line) => (
                <li className="flex gap-2" key={line}>
                  <span aria-hidden="true">—</span>
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </AccordionRow>
          <AccordionRow title="Shipping">
            <ul className="grid gap-1.5" role="list">
              {product.shipping.map((line) => (
                <li className="flex gap-2" key={line}>
                  <span aria-hidden="true">—</span>
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </AccordionRow>
        </div>

        <p className="pdp-label font-medium text-[#666666]">
          Need help?{" "}
          <a
            className="underline underline-offset-4 transition-colors hover:text-ink"
            href="mailto:hello@loremipsum.example"
          >
            Contact us
          </a>
        </p>
      </div>

      <SizeGuide onClose={() => setSizeGuideOpen(false)} open={sizeGuideOpen} />
    </div>
  );
}
