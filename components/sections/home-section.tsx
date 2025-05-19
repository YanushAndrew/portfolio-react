"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { fadeUp, staggerContainer, staggerItem } from "@/lib/framer-motion"

// This would be fetched from the backend in a real application
// Example API route: GET /api/profile
const profileData = {
  name: "John Doe",
  title: "Frontend Developer",
  skills: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Node.js"],
}

export function HomeSection() {
  // In a real application, you would fetch the profile data from the backend
  // const profileData = await fetch('/api/profile').then(res => res.json())

  const handleProjectsClick = () => {
    document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })
  }

  const handleContactClick = () => {
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <div className="container">
      <motion.div
        className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        <motion.div className="relative" variants={fadeUp}>
          {/* Decorative circle behind profile image */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-primary/20 to-primary/5 blur-md -z-10 scale-110" />

          <div className="relative aspect-square w-full max-w-[200px] rounded-full overflow-hidden border-4 border-primary/20 backdrop-blur-sm">
            <Image src="/placeholder.svg?height=200&width=200" alt="Profile" fill className="object-cover" priority />
          </div>
        </motion.div>

        <motion.div
          className="flex flex-col items-center md:items-start gap-6 text-center md:text-left"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={staggerItem}>
            <motion.h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
              {profileData.name}
            </motion.h1>
            <motion.h2 className="text-xl md:text-2xl font-medium text-muted-foreground mt-2">
              {profileData.title}
            </motion.h2>
          </motion.div>

          <motion.div className="flex flex-wrap gap-2 justify-center md:justify-start" variants={staggerItem}>
            {profileData.skills.map((skill, index) => (
              <motion.div
                key={skill}
                className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm backdrop-blur-sm border border-secondary/50"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.1, duration: 0.4 }}
                whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
              >
                {skill}
              </motion.div>
            ))}
          </motion.div>

          <motion.div className="flex gap-4 mt-2" variants={staggerItem}>
            <Button onClick={handleProjectsClick} className="relative overflow-hidden group">
              <span className="relative z-10">View Projects</span>
              <span className="absolute inset-0 bg-primary/20 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            </Button>
            <Button variant="outline" onClick={handleContactClick} className="relative overflow-hidden group">
              <span className="relative z-10">Contact Me</span>
              <span className="absolute inset-0 bg-primary/10 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            </Button>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  )
}
