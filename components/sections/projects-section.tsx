"use client"

import { useEffect, useState, useRef } from "react"
import { motion, useInView } from "framer-motion"
import { ProjectCard, type Project as ProjectCardType } from "@/components/project-card"
import { SectionHeader } from "@/components/ui/section-header"
import { Loader2 } from "lucide-react" // For loading indicator

// API Project type (adjust if your API returns a slightly different structure)
interface ApiProject {
  id: string;
  title: string;
  description: string;
  image_url: string | null;
  technologies: string[];
  github_url: string | null;
  live_url: string | null;
  // Add any other fields your API returns that might be useful, like created_at
}

export function ProjectsSection() {
  const [projects, setProjects] = useState<ProjectCardType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px 0px" });

  useEffect(() => {
    async function fetchProjects() {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch("/api/projects");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: ApiProject[] = await response.json();
        
        // Map API data to ProjectCardType
        const mappedProjects: ProjectCardType[] = data.map(p => ({
          id: p.id,
          title: p.title,
          description: p.description,
          image: p.image_url || "/placeholder.svg?height=200&width=400", // Fallback placeholder
          technologies: p.technologies,
          githubUrl: p.github_url || undefined, // Ensure undefined if null for ProjectCard
          liveUrl: p.live_url || undefined,   // Ensure undefined if null for ProjectCard
        }));
        setProjects(mappedProjects);
      } catch (e) {
        console.error("Failed to fetch projects:", e);
        setError(e instanceof Error ? e.message : "An unknown error occurred");
      } finally {
        setIsLoading(false);
      }
    }

    fetchProjects();
  }, []); // Fetch on component mount

  if (isLoading) {
    return (
      <div className="container flex justify-center items-center min-h-[300px]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container text-center py-10">
        <SectionHeader>Projects</SectionHeader>
        <p className="text-destructive">Error loading projects: {error}</p>
        <p className="text-muted-foreground mt-2">Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="container relative">
      <SectionHeader>Projects</SectionHeader>

      {projects.length === 0 ? (
        <motion.p 
          ref={ref}
          className="text-center text-muted-foreground py-10 text-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          No projects yet. Stay tuned for exciting updates!
        </motion.p>
      ) : (
        <motion.div
          ref={ref}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {projects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </motion.div>
      )}
    </div>
  );
}
