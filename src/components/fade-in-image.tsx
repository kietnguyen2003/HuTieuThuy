"use client"

import type React from "react"
import Image from "next/image"
import { useIntersectionObserver } from "@/hooks/use-intersection-observer"
import { cn } from "@/lib/utils"

interface FadeInImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  fill?: boolean
  className?: string
  style?: React.CSSProperties
  priority?: boolean
}

export function FadeInImage({
  src,
  alt,
  width,
  height,
  fill = false, // Mặc định là false
  className,
  style,
  priority = false,
  ...props
}: FadeInImageProps) {
  const { ref, hasIntersected } = useIntersectionObserver()

  return (
    <div
  ref={ref}
  className={cn(
    "relative overflow-hidden will-change-transform transition-opacity transition-transform duration-[1200ms] ease-[cubic-bezier(0.2,0.8,0.2,1)]",
    hasIntersected ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8",
    className,
    fill ? "w-full h-full" : ""
  )}
  style={{
    ...style,
    ...(fill ? { position: "relative", aspectRatio: "1/1" } : {}), // Thêm aspect-ratio hoặc height
  }}
>
  <Image
    src={src || "https://placehold.co/300x300?text=Placeholder"}
    alt={alt}
    width={!fill ? width : undefined}
    height={!fill ? height : undefined}
    fill={fill}
    priority={priority}
    className={cn(fill ? "object-cover" : "", "w-full h-full")}
    {...props}
  />
</div>
  )
}