"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import { useState } from "react";

export default function ProductImages({
  images,
  name,
}: {
  images: string[];
  name: string;
}) {
  const [currentImg, setCurrentImg] = useState(0);

  return (
    <div className="space-y-4">
      <Image
        src={images[currentImg]}
        height={1000}
        width={1000}
        alt={`${name}-image-1`}
        className="min-h-[300px] object-cover object-center"
      />
      <div className="flex gap-3">
        {images.map((image, index) => (
          <div
            key={index}
            className={cn(
              "border cursor-pointer hover:border-orange-600",
              index === currentImg && "border-orange-600"
            )}
          >
            <Image
              src={image}
              alt={`${name}-image-${index + 1}`}
              height={100}
              width={100}
              onClick={() => setCurrentImg(index)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
