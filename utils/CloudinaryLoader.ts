import { ImageLoaderProps } from "next/image";

// Cloudinary loader to avoid _next/image 500 errors
export const CloudinaryLoader = ({ src, width, quality }: ImageLoaderProps) => {
  const q = quality ?? 75;
  // return `${src}?w=${width}&q=${q}&auto=format`;
  return src.replace("/upload/",`/upload/f_auto,q_${q},w_${width}/`);
};
