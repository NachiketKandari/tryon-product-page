"use client";

import { ImagePlus, Sparkles, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import type { ProductImage } from "@/lib/catalog";

interface ProductMediaProps {
  images: ProductImage[];
  onRemoveUserImage: (index: number) => void;
  onTryOn: () => void;
  userImages: string[];
}

export function ProductMedia({
  images,
  onRemoveUserImage,
  onTryOn,
  userImages,
}: ProductMediaProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [hero, ...productTiles] = images;
  const showingUserImages = userImages.length > 0;
  const mobileSlides = showingUserImages ? userImages : images.map((image) => image.src);
  const desktopHero = showingUserImages ? userImages[0] : hero.src;
  const desktopTiles = (showingUserImages
    ? userImages.slice(1)
    : productTiles.map((image) => image.src)
  ).slice(0, 4);
  const userTileCount = showingUserImages ? desktopTiles.length : 0;

  useEffect(() => {
    trackRef.current?.scrollTo({ left: 0, behavior: "auto" });
    setActive(0);
  }, [showingUserImages, userImages.length]);

  function handleScroll() {
    const track = trackRef.current;
    if (!track) return;
    const index = Math.round(track.scrollLeft / track.clientWidth);
    setActive(Math.max(0, Math.min(mobileSlides.length - 1, index)));
  }

  return (
    <div className="relative" data-testid="pdp-gallery">
      {/* Mobile: 2:3 snap carousel, full-bleed */}
      <div
        className="scrollbar-hide flex snap-x snap-mandatory overflow-x-auto desktop:hidden"
        onScroll={handleScroll}
        ref={trackRef}
      >
        {mobileSlides.map((src, index) => {
          const isUser = showingUserImages;
          const image = showingUserImages ? null : images[index];
          return (
            <figure className="relative w-full shrink-0 snap-start" key={src}>
              <div className="relative aspect-[2/3] w-full overflow-hidden bg-surface">
                {isUser ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    alt={`Your uploaded image ${index + 1}`}
                    className="h-full w-full bg-paper object-contain"
                    src={src}
                  />
                ) : (
                  <Image
                    alt={image?.alt ?? "Product image"}
                    className="bg-paper object-contain"
                    fill
                    priority={index === 0}
                    sizes="100vw"
                    src={src}
                  />
                )}
                {isUser ? (
                  <>
                    {index === 0 ? (
                      <span className="type-label absolute top-3 left-3 bg-paper px-2 py-1 text-ink">
                        Your image
                      </span>
                    ) : null}
                    <button
                      aria-label={`Remove your image ${index + 1}`}
                      className="absolute top-2 right-2 flex size-8 items-center justify-center bg-paper/90 text-ink transition-colors hover:bg-ink hover:text-inverse"
                      onClick={() => onRemoveUserImage(index)}
                      type="button"
                    >
                      <X className="size-4" strokeWidth={1.25} />
                    </button>
                  </>
                ) : (
                  <button
                    aria-label="Upload your images"
                    className="type-label absolute top-3 right-3 flex items-center gap-1.5 bg-paper/95 px-2 py-1.5 text-ink"
                    onClick={onTryOn}
                    type="button"
                  >
                    <ImagePlus className="size-3.5" strokeWidth={1.25} />
                    Upload
                  </button>
                )}
              </div>
            </figure>
          );
        })}
      </div>

      <div className="mt-3 flex items-center justify-between px-(--gutter) desktop:hidden">
        <div aria-label="Product images" className="flex gap-1.5" role="tablist">
          {mobileSlides.map((_, index) => (
            <span
              aria-selected={index === active}
              className={`h-1 w-6 transition-colors ${index === active ? "bg-ink" : "bg-rule"}`}
              key={index}
              role="tab"
            />
          ))}
        </div>
        <div className="flex items-center gap-4">
          {showingUserImages ? (
            <button className="type-label text-ink-muted underline underline-offset-4" onClick={onTryOn} type="button">
              Edit images
            </button>
          ) : null}
          <span className="type-label text-ink-muted tabular-nums">
            {String(active + 1).padStart(2, "0")} / {String(mobileSlides.length).padStart(2, "0")}
          </span>
        </div>
      </div>

      {/* Desktop: enlarged first image over a two-up tile grid */}
      <div className="hidden desktop:block desktop:pt-[75px]">
        <div className="border border-ink">
          <div className="relative aspect-[800/1432] w-full overflow-hidden bg-surface">
            {showingUserImages ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  alt="Your uploaded hero image"
                  className="h-full w-full bg-paper object-contain"
                  src={desktopHero}
                />
                <span className="type-label absolute top-3 left-3 bg-paper px-2 py-1 text-ink">
                  Your image
                </span>
                <button
                  aria-label="Remove your hero image"
                  className="absolute top-2 right-2 flex size-8 items-center justify-center bg-paper/90 text-ink transition-colors hover:bg-ink hover:text-inverse"
                  onClick={() => onRemoveUserImage(0)}
                  type="button"
                >
                  <X className="size-4" strokeWidth={1.25} />
                </button>
              </>
            ) : (
              <Image
                alt={hero.alt}
                className="bg-paper object-contain"
                fill
                priority
                sizes="(min-width: 1100px) 56vw, 100vw"
                src={hero.src}
              />
            )}
          </div>
        </div>

        {desktopTiles.length > 0 ? (
          <div className="grid grid-cols-2">
            {desktopTiles.map((src, index) => {
              const isUser = index < userTileCount;
              const alt = isUser
                ? `Your uploaded image ${index + 2}`
                : (productTiles[index - userTileCount]?.alt ?? "Product detail");
              return (
                <figure className="relative aspect-[2/3] overflow-hidden bg-surface" key={src}>
                  {isUser ? (
                    <>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img alt={alt} className="h-full w-full bg-paper object-contain" src={src} />
                      <button
                        aria-label={`Remove your image ${index + 2}`}
                        className="absolute top-2 right-2 flex size-7 items-center justify-center bg-paper/90 text-ink transition-colors hover:bg-ink hover:text-inverse"
                        onClick={() => onRemoveUserImage(index + 1)}
                        type="button"
                      >
                        <X className="size-3.5" strokeWidth={1.25} />
                      </button>
                    </>
                  ) : (
                    <Image
                      alt={alt}
                      className="bg-paper object-contain"
                      fill
                      sizes="(min-width: 1100px) 28vw, 50vw"
                      src={src}
                    />
                  )}
                </figure>
              );
            })}
          </div>
        ) : null}
      </div>

      <button
        className="type-control absolute top-[87px] right-3 hidden h-10 items-center gap-2 bg-paper/95 px-4 uppercase text-ink shadow-modal backdrop-blur transition-colors hover:bg-ink hover:text-inverse desktop:flex"
        onClick={onTryOn}
        type="button"
      >
        {showingUserImages ? (
          <Sparkles className="size-4" strokeWidth={1.25} />
        ) : (
          <ImagePlus className="size-4" strokeWidth={1.25} />
        )}
        {showingUserImages ? "Edit your images" : "Upload your images"}
      </button>
    </div>
  );
}
