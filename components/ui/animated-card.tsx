"use client"

import type React from "react"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { cn } from "@/lib/utils"

interface AnimatedCardProps {
  children: React.ReactNode
  className?: string
  index?: number
}

export function AnimatedCard({ children, className, index = 0 }: AnimatedCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-50px 0px" })

  return (
    <motion.div
      ref={ref}
      className={cn("", className)}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{
        scale: 1.02,
        boxShadow: "0 10px 30px -15px rgba(0, 0, 0, 0.2)",
        transition: { duration: 0.2 },
      }}
    >
      {children}
    </motion.div>
  )
}
