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

  // Add cache busting for Supabase images with a more stable approach
  const getCacheBustedSrc = (imageSrc: string) => {
    if (!imageSrc) return "https://placehold.co/300x300?text=Placeholder"

    // If it's a Supabase image, add a version parameter based on the current hour
    // This will update the cache every hour instead of every render
    if (imageSrc.includes('supabase.co')) {
      const currentHour = Math.floor(Date.now() / (1000 * 60 * 60)) // Changes every hour
      const separator = imageSrc.includes('?') ? '&' : '?'
      return `${imageSrc}${separator}v=${currentHour}`
    }

    return imageSrc
  }

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
    src={getCacheBustedSrc(src)}
    alt={alt}
    width={!fill ? width : undefined}
    height={!fill ? height : undefined}
    fill={fill}
    priority={priority}
    className={cn(fill ? "object-cover" : "", "w-full h-full")}
    unoptimized={src?.includes('supabase.co')} // Disable optimization for Supabase images on Vercel
    {...props}
  />
</div>
  )
}