"use client"

import Link from "next/link"
import type { LucideIcon } from "lucide-react"
import { motion } from "framer-motion"

import { cn } from "@/lib/utils"
import { 
  Mail, Github, MessageCircle, Linkedin, Phone, FileText, Twitter, HelpCircle, AtSign, Youtube, Send,
  Instagram, Facebook, Dribbble, Gitlab, Slack, Globe, ExternalLink, User, Code, Server, Briefcase, Building, Home
} from "lucide-react" 

export interface ContactInfo {
  id: string
  type: string
  value: string
  url?: string
  icon: LucideIcon
}

// Map icon names to Lucide components
const iconMap: { [key: string]: LucideIcon } = {
  mail: Mail,
  email: Mail, // Alias for mail
  github: Github,
  gitlab: Gitlab,
  linkedin: Linkedin,
  telegram: MessageCircle, 
  message: MessageCircle, // Alias
  phone: Phone,
  call: Phone, // Alias
  resume: FileText,
  cv: FileText, // Alias
  twitter: Twitter,
  atsign: AtSign,
  youtube: Youtube,
  send: Send,
  instagram: Instagram,
  facebook: Facebook,
  dribbble: Dribbble,
  slack: Slack,
  website: Globe,
  web: Globe, // Alias
  link: ExternalLink,
  portfolio: Briefcase,
  profile: User,
  code: Code,
  server: Server,
  company: Building,
  office: Building, //Alias
  home: Home,
  default: HelpCircle, 
};

const getIconComponent = (iconName: string | null): LucideIcon => {
  if (!iconName) return iconMap.default;
  return iconMap[iconName.toLowerCase()] || iconMap.default;
};

interface ContactItemProps {
  contact: {
    id: string
    type: string
    value: string
    url?: string
    icon: string | null
  }
  className?: string
  index?: number
}

export function ContactItem({ contact, className, index = 0 }: ContactItemProps) {
  const IconComponent = getIconComponent(contact.icon);

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
