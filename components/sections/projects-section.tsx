"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { ProjectCard, type Project } from "@/components/project-card"
import { SectionHeader } from "@/components/ui/section-header"

// This would be fetched from the backend in a real application
// Example API route: GET /api/projects
const projectsData: Project[] = [
  {
    id: "1",
    title: "E-commerce Website",
    description:
      "A fully responsive e-commerce website with product filtering, cart functionality, and checkout process.",
    image: "/placeholder.svg?height=200&width=400",
    technologies: ["React", "Next.js", "Tailwind CSS", "Stripe"],
    githubUrl: "https://github.com/username/ecommerce",
    liveUrl: "https://ecommerce-demo.com",
  },
  {
    id: "2",
    title: "Task Management App",
    description:
      "A task management application with drag-and-drop functionality, task categorization, and user authentication.",
    image: "/placeholder.svg?height=200&width=400",
    technologies: ["React", "TypeScript", "Firebase", "Tailwind CSS"],
    githubUrl: "https://github.com/username/task-manager",
    liveUrl: "https://task-manager-demo.com",
  },
  {
    id: "3",
    title: "Weather Dashboard",
    description: "A weather dashboard that displays current weather conditions and forecasts for multiple locations.",
    image: "/placeholder.svg?height=200&width=400",
    technologies: ["React", "OpenWeather API", "Chart.js", "Tailwind CSS"],
    githubUrl: "https://github.com/username/weather-dashboard",
  },
  {
    id: "4",
    title: "Blog Platform",
    description: "A blog platform with content management system, user authentication, and comment functionality.",
    image: "/placeholder.svg?height=200&width=400",
    technologies: ["Next.js", "PostgreSQL", "Prisma", "Tailwind CSS"],
    githubUrl: "https://github.com/username/blog-platform",
    liveUrl: "https://blog-platform-demo.com",
  },
]

export function ProjectsSection() {
  // In a real application, you would fetch the projects data from the backend
  // const projectsData = await fetch('/api/projects').then(res => res.json())
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-100px 0px" })

  return (
    <div className="container relative">
      <SectionHeader>Projects</SectionHeader>

      <motion.div
        ref={ref}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        {projectsData.map((project, index) => (
          <ProjectCard key={project.id} project={project} index={index} />
        ))}
      </motion.div>
    </div>
  )
}
