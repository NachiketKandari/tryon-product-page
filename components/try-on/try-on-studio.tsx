"use client";

import {
  Camera,
  Check,
  Download,
  ImagePlus,
  ShieldCheck,
  Trash2,
  X,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import { formatInr, type Product } from "@/lib/catalog";

const MAX_FILES = 5;
const MAX_BYTES = 12 * 1024 * 1024;

interface TryOnStudioProps {
  onApply: (images: string[]) => void;
  onClose: () => void;
  open: boolean;
  product: Product;
  userImages: string[];
}

export function TryOnStudio({
  onApply,
  onClose,
  open,
  product,
  userImages,
}: TryOnStudioProps) {
  const [drafts, setDrafts] = useState<string[]>(userImages);
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [dragItem, setDragItem] = useState<number | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);
  const created = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!open) return;
    setDrafts(userImages);
    setError(null);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose, open, userImages]);

  function accept(list: FileList | null) {
    if (!list?.length) return;
    const files = Array.from(list);
    const accepted: string[] = [];

    for (const file of files) {
      if (!file.type.startsWith("image/")) {
        setError("Some files were skipped — use JPG, PNG, WebP or HEIC images.");
        continue;
      }
      if (file.size > MAX_BYTES) {
        setError("Some files were skipped — each image must be under 12 MB.");
        continue;
      }
      if (drafts.length + accepted.length >= MAX_FILES) break;
      const url = URL.createObjectURL(file);
      created.current.add(url);
      accepted.push(url);
    }

    if (accepted.length > 0) {
      setDrafts((current) => [...current, ...accepted].slice(0, MAX_FILES));
      setError(null);
    }
  }

  function remove(index: number) {
    setDrafts((current) => current.filter((_, entryIndex) => entryIndex !== index));
  }

  function move(index: number, direction: -1 | 1) {
    setDrafts((current) => {
      const target = index + direction;
      if (target < 0 || target >= current.length) return current;
      const next = [...current];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  function makeHero(index: number) {
    setDrafts((current) => {
      if (index === 0) return current;
      const next = [...current];
      const [item] = next.splice(index, 1);
      return [item, ...next];
    });
  }

  function reorder(from: number, to: number) {
    setDrafts((current) => {
      if (from === to) return current;
      const next = [...current];
      const [item] = next.splice(from, 1);
      next.splice(to, 0, item);
      return next;
    });
  }

  function clearAll() {
    for (const url of drafts) {
      if (created.current.has(url)) URL.revokeObjectURL(url);
    }
    setDrafts([]);
    setError(null);
  }

  function apply() {
    for (const url of created.current) {
      if (!drafts.includes(url)) URL.revokeObjectURL(url);
    }
    onApply(drafts);
    onClose();
  }

  if (!open) return null;

  const [first] = drafts;

  return (
    <div className="fixed inset-0 z-(--z-overlay) flex items-stretch justify-center desktop:items-center">
      <button
        aria-label="Close image studio"
        className="absolute inset-0 cursor-default bg-black/40"
        onClick={onClose}
        type="button"
      />
      <div
        aria-label="Upload your images"
        aria-modal="true"
        className="studio-scroll relative flex h-full max-h-[100dvh] w-full flex-col overflow-y-auto overscroll-contain bg-paper desktop:h-auto desktop:max-h-[92dvh] desktop:max-w-[1040px] desktop:flex-row"
        data-testid="studio-dialog"
        role="dialog"
      >
        {/* Preview */}
        <div className="relative flex shrink-0 flex-col bg-surface desktop:min-h-0 desktop:flex-1"
          data-testid="studio-preview"
        >
          <div className="flex items-center justify-between border-b border-rule px-5 py-3 desktop:hidden">
            <p className="type-label">Upload your images</p>
            <button
              aria-label="Close"
              className="focus-ring flex size-8 items-center justify-center"
              onClick={onClose}
              type="button"
            >
              <X className="size-4" strokeWidth={1.25} />
            </button>
          </div>

          <div className="relative flex flex-col items-center justify-center gap-3 p-5 desktop:flex-1 desktop:p-8">
            {first ? (
              <>
                <figure className="relative aspect-[4/5] w-full max-w-[420px] overflow-hidden bg-paper shadow-modal">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    alt="Your uploaded image, enlarged"
                    className="h-full w-full bg-paper object-contain"
                    src={first}
                  />
                  <span className="type-label absolute top-3 left-3 bg-paper px-2 py-1">
                    Your image · enlarged
                  </span>
                  <button
                    aria-label="Remove enlarged image"
                    className="absolute top-2 right-2 flex size-8 items-center justify-center bg-paper/90 text-ink transition-colors hover:bg-ink hover:text-inverse"
                    onClick={() => remove(0)}
                    type="button"
                  >
                    <X className="size-4" strokeWidth={1.25} />
                  </button>
                  <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 bg-gradient-to-t from-black/55 to-transparent p-4 text-inverse">
                    <div className="grid gap-0.5">
                      <p className="type-label">Lorem Ipsum · {product.colorName}</p>
                      <p className="pdp-title !text-inverse">{product.title}</p>
                    </div>
                    <p className="pdp-price !text-inverse">{formatInr(product.price)}</p>
                  </div>
                </figure>

                {drafts.length > 1 ? (
                  <div className="grid w-full max-w-[420px] grid-cols-2 gap-2">
                    {drafts.slice(1).map((src, index) => (
                      <figure className="relative aspect-[2/3] overflow-hidden bg-paper" key={src}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          alt={`Your uploaded image ${index + 2}`}
                          className="h-full w-full bg-paper object-contain"
                          src={src}
                        />
                        <button
                          aria-label={`Remove image ${index + 2}`}
                          className="absolute top-1.5 right-1.5 flex size-6 items-center justify-center bg-paper/90 text-ink transition-colors hover:bg-ink hover:text-inverse"
                          onClick={() => remove(index + 1)}
                          type="button"
                        >
                          <X className="size-3" strokeWidth={1.25} />
                        </button>
                      </figure>
                    ))}
                  </div>
                ) : null}
              </>
            ) : (
              <div
                className={`grid w-full max-w-[420px] justify-items-center gap-5 border border-dashed p-8 text-center transition-colors ${
                  dragging ? "border-ink bg-paper" : "border-input bg-paper/60"
                }`}
                onDragEnter={(event) => {
                  event.preventDefault();
                  setDragging(true);
                }}
                onDragLeave={() => setDragging(false)}
                onDragOver={(event) => event.preventDefault()}
                onDrop={(event) => {
                  event.preventDefault();
                  setDragging(false);
                  accept(event.dataTransfer.files);
                }}
              >
                <span className="flex size-14 items-center justify-center border border-rule bg-paper">
                  <ImagePlus className="size-6" strokeWidth={1} />
                </span>
                <div className="grid gap-2">
                  <p className="type-h3">Add your images</p>
                  <p className="type-body-sm max-w-[36ch] text-ink-muted">
                    The first image is shown enlarged on the product page. Up to four more sit
                    two-up in the gallery, exactly like the design.
                  </p>
                </div>
                <div className="flex flex-wrap justify-center gap-2">
                  <button
                    className="type-control flex h-10 items-center gap-2 bg-ink px-5 uppercase text-inverse focus-ring"
                    onClick={() => fileRef.current?.click()}
                    type="button"
                  >
                    <ImagePlus className="size-4" strokeWidth={1.25} />
                    Choose images
                  </button>
                  <button
                    className="type-control flex h-10 items-center gap-2 border border-ink px-5 uppercase focus-ring"
                    onClick={() => cameraRef.current?.click()}
                    type="button"
                  >
                    <Camera className="size-4" strokeWidth={1.25} />
                    Camera
                  </button>
                </div>
                <p className="type-label text-ink-muted">
                  JPG, PNG or WebP · up to 12 MB · {MAX_FILES} images max
                </p>
              </div>
            )}
          </div>

          {first ? (
            <div className="flex flex-wrap items-center justify-center gap-2 border-t border-rule bg-paper px-5 py-4">
              <button
                className="type-control flex h-9 items-center gap-2 border border-ink px-4 uppercase focus-ring"
                onClick={() => fileRef.current?.click()}
                type="button"
              >
                <ImagePlus className="size-3.5" strokeWidth={1.25} />
                Add more
              </button>
              <a
                className="type-control flex h-9 items-center gap-2 border border-ink px-4 uppercase focus-ring"
                download="lorem-ipsum-image"
                href={first}
              >
                <Download className="size-3.5" strokeWidth={1.25} />
                Save
              </a>
              <button
                className="type-control flex h-9 items-center gap-2 border border-rule px-4 uppercase text-ink-muted focus-ring"
                onClick={clearAll}
                type="button"
              >
                <Trash2 className="size-3.5" strokeWidth={1.25} />
                Clear all
              </button>
            </div>
          ) : null}
        </div>

        {/* Controls */}
        <div className="flex w-full shrink-0 flex-col desktop:min-h-0 desktop:w-[360px] desktop:border-l desktop:border-rule"
          data-testid="studio-controls"
        >
          <div className="hidden items-center justify-between border-b border-rule px-6 py-4 desktop:flex">
            <p className="type-label">Upload your images</p>
            <button
              aria-label="Close image studio"
              className="focus-ring flex size-8 items-center justify-center"
              onClick={onClose}
              type="button"
            >
              <X className="size-4" strokeWidth={1.25} />
            </button>
          </div>

          <div className="grid flex-1 content-start gap-6 p-6">
            <div className="grid gap-2">
              <p className="type-label text-ink-muted">01 — Add your images</p>
              <p className="pdp-copy text-ink-muted">
                Upload the images you want to see on the product page. The first becomes the
                enlarged hero; the rest are placed two per row beneath it.
              </p>
            </div>

            <div className="border border-rule p-4">
              <div className="flex items-center gap-3">
                <div className="relative aspect-[4/5] w-14 shrink-0 overflow-hidden bg-surface">
                  <Image
                    alt=""
                    className="object-cover"
                    fill
                    sizes="56px"
                    src={first ?? product.images[0].src}
                  />
                </div>
                <div className="min-w-0">
                  <p className="pdp-label truncate">{product.title}</p>
                  <p className="type-label text-ink-muted">
                    {product.colorName} · {formatInr(product.price)}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-2">
              <div className="flex items-baseline justify-between">
                <p className="type-label text-ink-muted">Your gallery</p>
                <p className="type-label text-ink-muted tabular-nums">
                  {drafts.length} / {MAX_FILES}
                </p>
              </div>

              {drafts.length > 0 ? (
                <ul className="divide-y divide-rule border border-rule" role="list">
                  {drafts.map((src, index) => (
                    <li
                      className="flex items-center gap-2 bg-paper px-2 py-2"
                      draggable
                      key={src}
                      onDragOver={(event) => event.preventDefault()}
                      onDragStart={() => setDragItem(index)}
                      onDrop={(event) => {
                        event.preventDefault();
                        if (dragItem !== null) reorder(dragItem, index);
                        setDragItem(null);
                      }}
                    >
                      <span className="type-label w-4 shrink-0 text-ink-muted tabular-nums">
                        {index + 1}
                      </span>
                      <span className="relative h-10 w-8 shrink-0 overflow-hidden bg-surface">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img alt="" className="h-full w-full object-cover" src={src} />
                      </span>
                      <span className="type-label min-w-0 flex-1 truncate">
                        {index === 0 ? "Hero · enlarged" : `Gallery · two-up`}
                      </span>
                      <span className="flex shrink-0 items-center gap-0.5">
                        <button
                          aria-label={`Move image ${index + 1} up`}
                          className="focus-ring flex size-7 items-center justify-center text-ink-muted hover:text-ink disabled:opacity-30"
                          disabled={index === 0}
                          onClick={() => move(index, -1)}
                          type="button"
                        >
                          ↑
                        </button>
                        <button
                          aria-label={`Move image ${index + 1} down`}
                          className="focus-ring flex size-7 items-center justify-center text-ink-muted hover:text-ink disabled:opacity-30"
                          disabled={index === drafts.length - 1}
                          onClick={() => move(index, 1)}
                          type="button"
                        >
                          ↓
                        </button>
                        {index > 0 ? (
                          <button
                            aria-label={`Make image ${index + 1} the hero`}
                            className="type-label focus-ring ml-1 border border-rule px-1.5 py-1 text-ink-muted hover:border-ink hover:text-ink"
                            onClick={() => makeHero(index)}
                            type="button"
                          >
                            Hero
                          </button>
                        ) : null}
                        <button
                          aria-label={`Remove image ${index + 1}`}
                          className="focus-ring flex size-7 items-center justify-center text-ink-muted hover:text-ink"
                          onClick={() => remove(index)}
                          type="button"
                        >
                          <X className="size-3.5" strokeWidth={1.25} />
                        </button>
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <button
                  className="grid place-items-center gap-1 border border-dashed border-input py-5 text-ink-muted"
                  onClick={() => fileRef.current?.click()}
                  type="button"
                >
                  <ImagePlus className="size-4" strokeWidth={1.25} />
                  <span className="type-label">Add up to 5 at once</span>
                </button>
              )}

              <p className="type-label text-ink-muted">
                Drag a row to reorder, use ↑ ↓, or promote any image to the enlarged hero.
              </p>
            </div>

            {error ? (
              <p className="type-body-sm border border-error-rule bg-error-soft p-3 text-error-rule">
                {error}
              </p>
            ) : null}

            <div className="grid gap-2">
              <p className="type-label text-ink-muted">02 — Place them on the page</p>
              <button
                className="type-control flex h-11 w-full items-center justify-center gap-2 bg-ink uppercase text-inverse focus-ring disabled:cursor-not-allowed disabled:bg-input disabled:text-ink-muted"
                disabled={drafts.length === 0}
                onClick={apply}
                type="button"
              >
                <Check className="size-4" strokeWidth={1.5} />
                Add {drafts.length || ""} image{drafts.length === 1 ? "" : "s"} to the page
              </button>
              {userImages.length > 0 ? (
                <button
                  className="type-control h-9 w-full border border-rule text-ink-muted uppercase focus-ring"
                  onClick={() => {
                    onApply([]);
                    onClose();
                  }}
                  type="button"
                >
                  Reset to product photos
                </button>
              ) : null}
            </div>

            <div className="mt-auto flex items-start gap-2 border-t border-rule pt-4">
              <ShieldCheck className="mt-0.5 size-4 shrink-0" strokeWidth={1.25} />
              <p className="type-label text-ink-muted">
                Private by design. Your images stay in this browser — nothing is uploaded to a
                server.
              </p>
            </div>
          </div>
        </div>

        <input
          accept="image/*"
          className="sr-only"
          multiple
          onChange={(event) => {
            accept(event.target.files);
            event.target.value = "";
          }}
          ref={fileRef}
          type="file"
        />
        <input
          accept="image/*"
          capture="environment"
          className="sr-only"
          onChange={(event) => {
            accept(event.target.files);
            event.target.value = "";
          }}
          ref={cameraRef}
          type="file"
        />
      </div>
    </div>
  );
}
