export interface ProductImage {
  alt: string;
  height: number;
  src: string;
  width: number;
}

export interface ProductOption {
  label: string;
  value: string;
}

export interface Recommendation {
  handle: string;
  image: ProductImage;
  price: number;
  title: string;
}

export interface Product {
  colorHex: string;
  colorName: string;
  description: string;
  details: string[];
  handle: string;
  images: ProductImage[];
  lowStockSizes: string[];
  price: number;
  shipping: string[];
  sizes: string[];
  title: string;
  vendor: string;
}

const image = (src: string, alt: string, width = 1066, height = 1600): ProductImage => ({
  alt,
  height,
  src,
  width,
});

export const product: Product = {
  title: "Racer back mini dress",
  handle: "racer-back-mini-dress",
  vendor: "UniPlus",
  price: 10000,
  colorName: "Black",
  colorHex: "#141414",
  description:
    "Minimalist in the front, unforgettable from the back. This sleek black mini dress combines an effortless A-line shift silhouette with a bold, deeply scooped racerback cut. Designed to drape smoothly with a subtle satin-matte sheen, it's the ultimate statement piece for warm nights out, cocktail parties, and modern minimalist wardrobes.",
  details: [
    "Satin-matte finish with a fluid A-line drape",
    "Deep scoop racerback with a clean bound edge",
    "Invisible side zip · fully lined bodice",
    "Made in India · 100% recycled polyester",
    "Model is 5'9\" and wears a size S",
  ],
  shipping: [
    "Complimentary express shipping across India, 2–4 business days",
    "Free returns and exchanges within 14 days of delivery",
    "International delivery available at checkout",
  ],
  sizes: ["XXS", "XS", "S", "M", "L", "XL", "XXL"],
  lowStockSizes: ["M"],
  images: [
    image("/images/product/dress-front.jpeg", "Black racer back mini dress, front view"),
    image("/images/product/dress-back.jpeg", "Black racer back mini dress, back view"),
    image("/images/product/dress-detail-front.jpeg", "Dress fabric and neckline detail"),
    image("/images/product/dress-detail-back.jpeg", "Scooped racerback detail"),
    image("/images/product/dress-detail-hem.jpeg", "A-line hem and satin-matte finish"),
  ],
};

export const recommendations: Recommendation[] = [
  {
    title: "Rouched Baby Tee",
    handle: "rouched-baby-tee",
    price: 6500,
    image: image(
      "/images/recommendations/rouched-baby-tee.jpeg",
      "Black rouched baby tee with a midi skirt",
    ),
  },
  {
    title: "Knotted Back Maxi Skirt",
    handle: "knotted-back-maxi-skirt",
    price: 12000,
    image: image(
      "/images/recommendations/knotted-back-maxi-skirt.jpeg",
      "Black tank top with a midi skirt",
    ),
  },
  {
    title: "Two Way Bodysuit",
    handle: "two-way-bodysuit",
    price: 8500,
    image: image(
      "/images/recommendations/two-way-bodysuit.jpeg",
      "White crop top with black wide leg jeans",
    ),
  },
  {
    title: "Slit Racer Back Shirt",
    handle: "slit-racer-back-shirt",
    price: 7500,
    image: image(
      "/images/recommendations/big-collar-shirt.jpeg",
      "White sheer shirt with a midi skirt",
    ),
  },
];

export function formatPrice(value: number): string {
  return new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0,
    style: "currency",
    currency: "INR",
  }).format(value);
}

export function formatAmount(value: number): string {
  return new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(value);
}

export function formatInr(value: number): string {
  return `INR ${formatAmount(value)}`;
}
