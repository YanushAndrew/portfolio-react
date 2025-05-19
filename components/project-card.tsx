"use client"

import Link from "next/link"
import Image from "next/image"
import { ExternalLink, Github } from "lucide-react"
import { motion } from "framer-motion"

import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AnimatedCard } from "@/components/ui/animated-card"

export interface Project {
  id: string
  title: string
  description: string
  image: string
  technologies: string[]
  githubUrl?: string
  liveUrl?: string
}

interface ProjectCardProps {
  project: Project
  index?: number
}

export function ProjectCard({ project, index = 0 }: ProjectCardProps) {
  return (
    <AnimatedCard index={index}>
      <Card className="overflow-hidden flex flex-col h-full border border-border/50 backdrop-blur-sm">
        <div className="relative h-48 w-full overflow-hidden group">
          <Image
            src={project.image || "/placeholder.svg?height=200&width=400"}
            alt={project.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        <CardContent className="flex-1 flex flex-col gap-4 p-6">
          <h3 className="text-xl font-bold">{project.title}</h3>

          <div className="flex flex-wrap gap-2">
            {project.technologies.map((tech) => (
              <motion.span
                key={tech}
                className="px-2 py-1 bg-secondary text-secondary-foreground rounded-md text-xs border border-secondary/50"
                whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
              >
                {tech}
              </motion.span>
            ))}
          </div>

          <p className="text-muted-foreground flex-1">{project.description}</p>
        </CardContent>

        <CardFooter className="flex gap-2 p-6 pt-0">
          {project.githubUrl && (
            <Button asChild variant="outline" size="sm" className="group">
              <Link href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                <Github className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
                <span>GitHub</span>
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
              </Link>
            </Button>
          )}

          {project.liveUrl && (
            <Button asChild size="sm" className="group">
              <Link href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
                <span>Live Demo</span>
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary-foreground scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
              </Link>
            </Button>
          )}
        </CardFooter>
      </Card>
    </AnimatedCard>
  )
}
