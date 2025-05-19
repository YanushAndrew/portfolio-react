"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"

interface FooterProps {
  onAdminClick: () => void
}

export function Footer({ onAdminClick }: FooterProps) {
  const currentYear = new Date().getFullYear()

  return (
    <motion.footer
      className="border-t bg-background/80 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="container flex flex-col sm:flex-row items-center justify-between py-6 gap-4">
        <p className="text-sm text-muted-foreground">© {currentYear} Portfolio. All rights reserved.</p>

        <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
          <Button
            variant="outline"
            onClick={onAdminClick}
            className="text-sm font-medium relative overflow-hidden group"
          >
            <span className="relative z-10">Admin</span>
            <span className="absolute inset-0 bg-primary/10 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          </Button>
        </motion.div>
      </div>
    </motion.footer>
  )
}
