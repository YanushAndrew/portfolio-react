"use client"

import { useEffect, useState, useRef, type ElementType } from "react"
import { motion, useInView } from "framer-motion"
import { Mail, Github, MessageCircle, Linkedin, Phone, FileText, Twitter, HelpCircle } from "lucide-react" // Add more icons as needed
import { ContactItem, type ContactInfo } from "@/components/contact-item"
import { SectionHeader } from "@/components/ui/section-header"
import { Loader2 } from "lucide-react" // For loading indicator

// API Contact type
interface ApiContact {
  id: string;
  type: string;
  value: string;
  url: string | null;
  icon: string | null; // Icon name as string
}

// Map icon names to Lucide components
const iconMap: { [key: string]: ElementType } = {
  mail: Mail,
  github: Github,
  linkedin: Linkedin,
  telegram: MessageCircle, // Using MessageCircle for Telegram as an example
  phone: Phone,
  resume: FileText,
  twitter: Twitter,
  default: HelpCircle, // Fallback icon
};

const getIconComponent = (iconName: string | null): ElementType => {
  if (iconName && iconMap[iconName.toLowerCase()]) {
    return iconMap[iconName.toLowerCase()];
  }
  return iconMap.default;
};

export function ContactsSection() {
  const [contacts, setContacts] = useState<ContactInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px 0px" });

  useEffect(() => {
    async function fetchContactsData() {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch("/api/contacts");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: ApiContact[] = await response.json();
        
        const mappedContacts: ContactInfo[] = data.map(c => ({
          id: c.id,
          type: c.type,
          value: c.value,
          url: c.url || undefined, // ContactItem expects url to be string | undefined
          icon: getIconComponent(c.icon),
        }));
        setContacts(mappedContacts);
      } catch (e) {
        console.error("Failed to fetch contacts:", e);
        setError(e instanceof Error ? e.message : "An unknown error occurred");
      } finally {
        setIsLoading(false);
      }
    }

    fetchContactsData();
  }, []);

  if (isLoading) {
    return (
      <div className="container flex justify-center items-center min-h-[200px]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container text-center py-10">
        <SectionHeader>Contact Me</SectionHeader>
        <p className="text-destructive">Error loading contacts: {error}</p>
      </div>
    );
  }

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

        {contacts.length === 0 && !isLoading ? (
          <motion.p 
            className="text-center text-muted-foreground py-10 text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            Contact methods will be listed here soon.
          </motion.p>
        ) : (
          <motion.div
            ref={ref}
            className="grid gap-4"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {contacts.map((contact, index) => (
              <ContactItem key={contact.id} contact={contact} index={index} />
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
