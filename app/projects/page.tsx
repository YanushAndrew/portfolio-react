import { ProjectCard, type Project } from "@/components/project-card"

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

export default async function ProjectsPage() {
  // In a real application, you would fetch the projects data from the backend
  // const projectsData = await fetch('/api/projects').then(res => res.json())

  return (
    <div className="container py-12">
      <h1 className="text-4xl font-bold mb-8">Projects</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projectsData.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  )
}
