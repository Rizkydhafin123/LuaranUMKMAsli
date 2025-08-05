"use client"

import Image from "next/image"
import { useState } from "react"
import { cn } from "@/lib/utils"

/**
 * Reusable image component that applies a blur while the image is loading.
 * Props mirror `next/image` basic props plus an optional className.
 */
export function ImageWithBlur({
  src,
  alt,
  width,
  height,
  className,
}: {
  src: string
  alt: string
  width: number
  height: number
  className?: string
}) {
  const [isBlurred, setIsBlurred] = useState(true)

  return (
    <Image
      src={src || "/placeholder.svg"}
      alt={alt}
      width={width}
      height={height}
      className={cn(
        "w-full h-full object-cover absolute inset-0 transition-all duration-500",
        isBlurred ? "blur-lg" : "blur-0",
        className,
      )}
      onLoadingComplete={() => setIsBlurred(false)}
    />
  )
}
