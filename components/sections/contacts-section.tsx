"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Mail, Github, MessageCircle } from "lucide-react"
import { ContactItem, type ContactInfo } from "@/components/contact-item"
import { SectionHeader } from "@/components/ui/section-header"

// This would be fetched from the backend in a real application
// Example API route: GET /api/contacts
const contactsData: ContactInfo[] = [
  {
    id: "1",
    type: "Email",
    value: "john.doe@example.com",
    url: "mailto:john.doe@example.com",
    icon: Mail,
  },
  {
    id: "2",
    type: "GitHub",
    value: "github.com/johndoe",
    url: "https://github.com/johndoe",
    icon: Github,
  },
  {
    id: "3",
    type: "Telegram",
    value: "@johndoe",
    url: "https://t.me/johndoe",
    icon: MessageCircle,
  },
]

export function ContactsSection() {
  // In a real application, you would fetch the contacts data from the backend
  // const contactsData = await fetch('/api/contacts').then(res => res.json())
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-100px 0px" })

  return (
    <div className="container">
      <SectionHeader>Contact Me</SectionHeader>

      <div className="max-w-2xl mx-auto">
        <motion.p
          className="text-lg text-muted-foreground mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          Feel free to reach out to me through any of the following channels. I'll get back to you as soon as possible.
        </motion.p>

        <motion.div
          ref={ref}
          className="grid gap-4"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {contactsData.map((contact, index) => (
            <ContactItem key={contact.id} contact={contact} index={index} />
          ))}
        </motion.div>
      </div>
    </div>
  )
}
