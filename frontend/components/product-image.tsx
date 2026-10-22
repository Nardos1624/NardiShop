"use client";

import Image from "next/image";
import { useState } from "react";

interface ProductImageProps {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
}

export default function ProductImage({
  src,
  alt,
  className,
  priority = false,
}: ProductImageProps) {
  const [hasError, setHasError] = useState(false);

  if (!src || hasError) return null;

  return (
    <Image
      src={src}
      alt={alt}
      fill
      unoptimized
      priority={priority}
      className={className}
      onError={() => setHasError(true)}
    />
  );
}
