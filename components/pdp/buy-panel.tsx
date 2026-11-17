"use client";

import { ChevronDown, ImagePlus, Ruler } from "lucide-react";
import { useState } from "react";

import { SizeGuide } from "@/components/pdp/size-guide";
import { useBag } from "@/components/site/bag-provider";
import { formatAmount, type Product } from "@/lib/catalog";

interface BuyPanelProps {
  hasUserImages: boolean;
  onTryOn: () => void;
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
      <summary className="pdp-copy flex min-h-[49px] cursor-pointer list-none items-center justify-between gap-4 py-4 desktop:min-h-0 desktop:py-8 [&::-webkit-details-marker]:hidden">
        {title}
        <ChevronDown
          className="size-3 shrink-0 transition-transform duration-200 group-open:rotate-180"
          strokeWidth={1.25}
        />
      </summary>
      <div className="pdp-copy pb-4 text-ink-muted desktop:pb-8">{children}</div>
    </details>
  );
}

export function BuyPanel({ hasUserImages, onTryOn, product }: BuyPanelProps) {
  const { add } = useBag();
  const [size, setSize] = useState<string | null>(null);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const lowStock = size ? product.lowStockSizes.includes(size) : false;

  return (
    <div className="desktop:py-[140px] desktop:pr-[80px] desktop:pl-[80px]">
      <div className="grid gap-10 px-(--gutter) pt-6 pb-10 desktop:px-0 desktop:py-0">
        <div className="flex items-start justify-between gap-4">
          <div className="grid gap-1">
            <h1 className="pdp-title">{product.title}</h1>
          </div>
          <p className="pdp-price whitespace-nowrap pt-0.5">{formatAmount(product.price)}</p>
        </div>

        <fieldset className="grid gap-3">
          <legend className="pdp-label">Colors</legend>
          <div className="flex items-center gap-3">
            <span
              aria-label={`${product.colorName} selected`}
              className="size-4 bg-ink ring-1 ring-ink ring-offset-2"
              role="img"
            />
            <span className="pdp-copy text-ink-muted">{product.colorName}</span>
          </div>
        </fieldset>

        <fieldset className="grid gap-3">
          <div className="flex items-baseline justify-between gap-4">
            <legend className="pdp-label">Size</legend>
            <button
              className="pdp-copy flex items-center gap-1.5 text-ink-muted underline underline-offset-4 focus-ring"
              onClick={() => setSizeGuideOpen(true)}
              type="button"
            >
              <Ruler className="size-3" strokeWidth={1.25} />
              Size recommendation
            </button>
          </div>

          <div aria-label="Select a size" className="flex flex-wrap gap-3" role="group">
            {product.sizes.map((option) => {
              const selected = size === option;
              return (
                <button
                  aria-pressed={selected}
                  className={`pdp-label flex h-[26px] min-w-8 items-center justify-center border px-2 transition-colors focus-ring desktop:h-11 desktop:px-4 ${
                    selected
                      ? "border-ink bg-ink text-inverse"
                      : "border-ink text-ink hover:border-ink desktop:border-[#DCDCDC] desktop:text-ink-muted desktop:hover:text-ink"
                  }`}
                  key={option}
                  onClick={() => setSize(option)}
                  type="button"
                >
                  {option}
                </button>
              );
            })}
          </div>

          <p aria-live="polite" className="pdp-copy min-h-4">
            {lowStock ? (
              <span className="text-ink desktop:text-[#A66100]">Only 1 left in stock</span>
            ) : size ? (
              <span className="text-ink-muted">In stock · ships in 1–2 business days</span>
            ) : (
              <span className="text-ink-muted">Select a size to add to bag</span>
            )}
          </p>
        </fieldset>

        <div className="grid gap-2.5">
          <button
            className={`pdp-cta flex h-10 w-full items-center justify-center ${
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
            {size ? "Add to bag" : "select size"}
          </button>

          <button
            className="pdp-cta flex h-10 w-full items-center justify-center gap-2 border border-[#353535] text-[#353535] transition-colors hover:bg-[#353535] hover:text-inverse focus-ring"
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

        <p className="pdp-copy font-medium text-ink-muted">
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
