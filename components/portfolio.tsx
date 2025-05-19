"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { AnimatePresence, motion } from "framer-motion"

import { HomeSection } from "@/components/sections/home-section"
import { ProjectsSection } from "@/components/sections/projects-section"
import { ContactsSection } from "@/components/sections/contacts-section"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Blob } from "@/components/ui/blob"

export function Portfolio() {
  const [activeSection, setActiveSection] = useState("home")
  const router = useRouter()

  const handleAdminClick = () => {
    // Navigate to the login page
    router.push("/admin/login")
  }

  return (
    <div className="flex min-h-screen flex-col relative overflow-hidden">
      {/* Background blobs - light theme */}
      <div className="hidden dark:block">
        <Blob
          className="top-0 left-0 -translate-x-1/2 -translate-y-1/2"
          color="bg-purple-500"
          size="w-[500px] h-[500px]"
          blur="blur-3xl"
          opacity="opacity-10"
        />
        <Blob
          className="top-[30%] right-0 translate-x-1/2"
          color="bg-blue-500"
          size="w-[400px] h-[400px]"
          blur="blur-3xl"
          opacity="opacity-10"
        />
        <Blob
          className="bottom-0 left-1/3 -translate-y-1/2"
          color="bg-cyan-500"
          size="w-[600px] h-[600px]"
          blur="blur-3xl"
          opacity="opacity-5"
        />
      </div>

      {/* Background blobs - dark theme */}
      <div className="dark:hidden">
        <Blob
          className="top-0 left-0 -translate-x-1/2 -translate-y-1/2"
          color="bg-indigo-200"
          size="w-[500px] h-[500px]"
          blur="blur-3xl"
          opacity="opacity-30"
        />
        <Blob
          className="top-[30%] right-0 translate-x-1/2"
          color="bg-sky-200"
          size="w-[400px] h-[400px]"
          blur="blur-3xl"
          opacity="opacity-30"
        />
        <Blob
          className="bottom-0 left-1/3 -translate-y-1/2"
          color="bg-teal-200"
          size="w-[600px] h-[600px]"
          blur="blur-3xl"
          opacity="opacity-20"
        />
      </div>

      <Navbar activeSection={activeSection} setActiveSection={setActiveSection} />

      <AnimatePresence>
        <motion.main
          className="flex-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <section id="home" className="min-h-screen py-16 md:py-24">
            <HomeSection />
          </section>

          <section id="projects" className="min-h-screen py-16 bg-secondary/30 dark:bg-secondary/10 backdrop-blur-sm">
            <ProjectsSection />
          </section>

          <section id="contact" className="min-h-screen py-16">
            <ContactsSection />
          </section>
        </motion.main>
      </AnimatePresence>

      <Footer onAdminClick={handleAdminClick} />
    </div>
  )
}
