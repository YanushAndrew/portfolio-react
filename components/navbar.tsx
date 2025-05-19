"use client"

import { useState, useEffect } from "react"
import { Menu } from "lucide-react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

interface NavbarProps {
  activeSection: string
  setActiveSection: (section: string) => void
}

export function Navbar({ activeSection, setActiveSection }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false)

  // Update active section based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY
      setIsScrolled(scrollPosition > 10)

      const sections = ["home", "projects", "contact"]

      for (const section of sections) {
        const element = document.getElementById(section)
        if (!element) continue

        const rect = element.getBoundingClientRect()
        if (rect.top <= 100 && rect.bottom >= 100) {
          setActiveSection(section)
          break
        }
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [setActiveSection])

  const handleNavClick = (section: string) => {
    setActiveSection(section)
    document.getElementById(section)?.scrollIntoView({ behavior: "smooth" })
  }

  const navItems = [
    { name: "Home", section: "home" },
    { name: "Projects", section: "projects" },
    { name: "Contact", section: "contact" },
  ]

  return (
    <motion.header
      className={cn(
        "sticky top-0 z-50 w-full backdrop-blur transition-all duration-300",
        isScrolled ? "bg-background/80 border-b shadow-sm" : "bg-transparent",
      )}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container flex h-16 items-center justify-between">
        <motion.div className="flex items-center gap-2" whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
          <button onClick={() => handleNavClick("home")} className="font-bold text-xl">
            Portfolio
          </button>
        </motion.div>

        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <motion.button
              key={item.section}
              onClick={() => handleNavClick(item.section)}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary relative px-2 py-1",
                activeSection === item.section ? "text-foreground" : "text-muted-foreground",
              )}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              {item.name}
              {activeSection === item.section && (
                <motion.span
                  className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-full"
                  layoutId="navbar-indicator"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </motion.button>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />

          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" aria-label="Menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[240px] sm:w-[300px] backdrop-blur-lg bg-background/80">
              <nav className="flex flex-col gap-4 mt-8">
                {navItems.map((item) => (
                  <motion.button
                    key={item.section}
                    onClick={() => {
                      handleNavClick(item.section)
                      document.querySelector("[data-radix-collection-item]")?.click() // Close the sheet
                    }}
                    className={cn(
                      "text-sm font-medium transition-colors hover:text-primary text-left px-2 py-1 rounded relative overflow-hidden",
                      activeSection === item.section ? "bg-secondary text-foreground" : "text-muted-foreground",
                    )}
                    whileHover={{ scale: 1.02, x: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    {item.name}
                  </motion.button>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </motion.header>
  )
}
