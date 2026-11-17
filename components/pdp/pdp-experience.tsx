"use client";

import { useState } from "react";

import { BuyPanel } from "@/components/pdp/buy-panel";
import { ProductMedia } from "@/components/pdp/product-media";
import { Recommendations } from "@/components/pdp/recommendations";
import { TryOnStudio } from "@/components/try-on/try-on-studio";
import type { Product, Recommendation } from "@/lib/catalog";

export function PdpExperience({
  product,
  recommendations,
}: {
  product: Product;
  recommendations: Recommendation[];
}) {
  const [userImages, setUserImages] = useState<string[]>([]);
  const [studioOpen, setStudioOpen] = useState(false);
  const [outOfStock, setOutOfStock] = useState(false);

  return (
    <>
      <div className="flex h-10 items-center justify-between border-b border-rule px-(--gutter)">
        <p className="type-label text-ink-muted">Demo state</p>
        <button
          aria-pressed={outOfStock}
          className={`type-label flex h-7 items-center border px-3 uppercase transition-colors focus-ring ${
            outOfStock ? "border-ink bg-ink text-inverse" : "border-rule text-ink-muted hover:border-ink hover:text-ink"
          }`}
          onClick={() => setOutOfStock((current) => !current)}
          type="button"
        >
          {outOfStock ? "Back in stock" : "Out of stock"}
        </button>
      </div>

      <section className="grid desktop:grid-cols-[800fr_592fr] desktop:px-(--gutter)" id="product">
        <div>
          <ProductMedia
            images={product.images}
            onRemoveUserImage={(index) =>
              setUserImages((current) => current.filter((_, entryIndex) => entryIndex !== index))
            }
            onTryOn={() => setStudioOpen(true)}
            outOfStock={outOfStock}
            userImages={userImages}
          />
        </div>
        <BuyPanel
          hasUserImages={userImages.length > 0}
          onTryOn={() => setStudioOpen(true)}
          outOfStock={outOfStock}
          product={product}
        />
      </section>

      <Recommendations items={recommendations} />

      <TryOnStudio
        onApply={setUserImages}
        onClose={() => setStudioOpen(false)}
        open={studioOpen}
        product={product}
        userImages={userImages}
      />
    </>
  );
}
