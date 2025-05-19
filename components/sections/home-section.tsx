"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { fadeUp, staggerContainer, staggerItem } from "@/lib/framer-motion"
import { useEffect, useState } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Terminal } from "lucide-react"

interface ProfileData {
  name: string;
  title: string;
  bio: string;
  skills: string[];
  image_url: string;
  resume_url: string;
}

export function HomeSection() {
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/profile');
        if (!response.ok) {
          throw new Error('Failed to fetch profile data');
        }
        const data = await response.json();
        setProfileData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleProjectsClick = () => {
    document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })
  }

  const handleContactClick = () => {
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })
  }

  if (isLoading) {
    return (
      <div className="container flex items-center justify-center min-h-[calc(100vh-200px)]">
        <p>Loading profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container flex items-center justify-center min-h-[calc(100vh-200px)]">
        <Alert variant="destructive" className="max-w-md">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error}. Please try refreshing the page.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="container flex items-center justify-center min-h-[calc(100vh-200px)]">
        <p>No profile data available. Please configure it in the admin panel.</p>
      </div>
    );
  }


  return (
    <div className="container">
      <motion.div
        className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 min-h-[calc(100vh-200px)] py-10"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          className="relative w-full max-w-[200px] sm:max-w-[250px] md:max-w-[300px]"
          variants={fadeUp}
        >
          {/* Decorative circle behind profile image */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-primary/20 to-primary/5 blur-md -z-10 scale-110" />

          <div className="relative aspect-square w-full max-w-[200px] sm:max-w-[250px] md:max-w-[300px] rounded-full overflow-hidden border-4 border-primary/20 backdrop-blur-sm">
            <Image 
              src={profileData.image_url || "/placeholder.svg?height=300&width=300"} 
              alt={profileData.name || "Profile"} 
              fill 
              className="object-cover" 
              priority 
            />
          </div>
        </motion.div>

        <motion.div
          className="flex flex-col items-center md:items-start gap-6 text-center md:text-left"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={staggerItem}>
            <motion.h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
              {profileData.name}
            </motion.h1>
            <motion.h2 className="text-xl md:text-2xl lg:text-3xl font-medium text-muted-foreground mt-2">
              {profileData.title}
            </motion.h2>
            {profileData.bio && (
                <motion.p className="mt-4 text-muted-foreground max-w-prose" variants={staggerItem}>
                    {profileData.bio}
                </motion.p>
            )}
          </motion.div>

          {profileData.skills && profileData.skills.length > 0 && (
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
          )}

          <motion.div className="flex gap-4 mt-2" variants={staggerItem}>
            <Button onClick={handleProjectsClick} className="relative overflow-hidden group">
              <span className="relative z-10">View Projects</span>
              <span className="absolute inset-0 bg-primary/20 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            </Button>
            <Button variant="outline" onClick={handleContactClick} className="relative overflow-hidden group">
              <span className="relative z-10">Contact Me</span>
              <span className="absolute inset-0 bg-primary/10 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            </Button>
            {profileData.resume_url && (
                 <Button asChild variant="ghost" className="relative overflow-hidden group">
                    <a href={profileData.resume_url} target="_blank" rel="noopener noreferrer">
                        <span className="relative z-10">View Resume</span>
                        <span className="absolute inset-0 bg-primary/10 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                    </a>
                </Button>
            )}
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  )
}
