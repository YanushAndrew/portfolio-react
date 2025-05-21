"use client"

import Link from "next/link"
import type { LucideIcon } from "lucide-react"
import { motion } from "framer-motion"

import { cn } from "@/lib/utils"
import { Mail, Github, MessageCircle } from "lucide-react"

export interface ContactInfoBase {
  id: string
  type: string
  value: string
  url?: string
}

// Type for data coming from Server Components (uses iconName string)
export interface ContactItemPropsForServer extends ContactInfoBase {
  iconName: keyof typeof iconComponents // Use keys of the icon map
}

// Internal type used by ContactItem (maps iconName to actual icon component)
interface ContactInfoForClient extends ContactInfoBase {
  icon: LucideIcon
}

interface ContactItemProps {
  contact: ContactItemPropsForServer // Expects data with iconName
  className?: string
  index?: number
}

const iconComponents = {
  Mail,
  Github,
  MessageCircle,
  // Add other icons here if needed
}

export function ContactItem({ contact, className, index = 0 }: ContactItemProps) {
  const IconComponent = iconComponents[contact.iconName]

  if (!IconComponent) {
    // Handle cases where iconName might not match or return a default/null
    console.warn(`Icon not found for name: ${contact.iconName}`)
    return null 
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
    >
      {contact.url ? (
        <Link
          href={contact.url}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            "flex items-center gap-4 p-4 rounded-lg border border-border/50 bg-card/50 backdrop-blur-sm text-card-foreground hover:bg-accent/50 transition-all duration-300 hover:shadow-lg",
            className,
          )}
        >
          <motion.div
            className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10"
            whileHover={{ scale: 1.1, backgroundColor: "rgba(var(--primary), 0.2)" }}
            transition={{ duration: 0.2 }}
          >
            <IconComponent className="h-5 w-5 text-primary" />
          </motion.div>
          <div>
            <h3 className="font-medium">{contact.type}</h3>
            <p className="text-sm text-muted-foreground">{contact.value}</p>
          </div>
        </Link>
      ) : (
        <div
          className={cn(
            "flex items-center gap-4 p-4 rounded-lg border border-border/50 bg-card/50 backdrop-blur-sm text-card-foreground",
            className,
          )}
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
            <IconComponent className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-medium">{contact.type}</h3>
            <p className="text-sm text-muted-foreground">{contact.value}</p>
          </div>
        </div>
      )}
    </motion.div>
  )
}
