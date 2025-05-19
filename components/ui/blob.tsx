"use client"

import { useRef } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface BlobProps {
  className?: string
  color?: string
  size?: string
  blur?: string
  opacity?: string
  animate?: boolean
}

export function Blob({
  className,
  color = "bg-primary",
  size = "w-64 h-64",
  blur = "blur-3xl",
  opacity = "opacity-10",
  animate = true,
}: BlobProps) {
  const ref = useRef<HTMLDivElement>(null)

  return (
    <motion.div
      ref={ref}
      className={cn("absolute rounded-full pointer-events-none", color, size, blur, opacity, className)}
      initial={animate ? { scale: 0.8 } : {}}
      animate={
        animate
          ? {
              scale: [0.8, 1.1, 0.9, 1],
              rotate: [0, 10, -10, 0],
            }
          : {}
      }
      transition={{
        duration: 20,
        repeat: Number.POSITIVE_INFINITY,
        repeatType: "reverse",
      }}
    />
  )
}
