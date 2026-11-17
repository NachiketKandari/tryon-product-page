"use client";

import Image from "next/image";

import { useFeedback } from "@/components/site/feedback-provider";
import { formatInr, type Recommendation } from "@/lib/catalog";

export function Recommendations({ items }: { items: Recommendation[] }) {
  const { info } = useFeedback();

  return (
    <section className="mt-6 py-10 desktop:py-20" id="recommendations">
      <p className="pdp-rec-heading px-(--gutter)">You may also like</p>
      <div
        className="scrollbar-hide mt-2.5 flex snap-x overflow-x-auto desktop:mt-5 desktop:grid desktop:grid-cols-4 desktop:overflow-visible"
        data-testid="recommendations-track"
      >
        {items.map((item) => (
          <button
            className="group block w-1/2 shrink-0 snap-start border-r border-rule text-left last:border-r-0 desktop:w-auto desktop:border-0"
            key={item.handle}
            onClick={() =>
              info(
                item.title,
                <div className="grid gap-4">
                  <p className="pdp-copy text-ink-muted">
                    {formatInr(item.price)} · A piece from the wider Lorem Ipsum catalogue. This
                    build hosts one product page, so only the Racer back mini dress is shoppable
                    here.
                  </p>
                  <a
                    className="type-control flex h-10 items-center justify-center bg-ink uppercase text-inverse"
                    href="#product"
                  >
                    View the dress
                  </a>
                </div>,
              )
            }
            type="button"
          >
            <div className="relative mx-auto aspect-[2/3] w-full overflow-hidden bg-surface desktop:aspect-[250/447] desktop:w-[250px]">
              <Image
                alt={item.image.alt}
                className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                fill
                sizes="(min-width: 1100px) 250px, 50vw"
                src={item.image.src}
              />
            </div>
            <div className="mt-4 grid gap-2 px-2 desktop:mt-6 desktop:px-6">
              <p className="pdp-rec-name truncate">{item.title}</p>
              <p className="pdp-rec-price">{formatInr(item.price)}</p>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}
