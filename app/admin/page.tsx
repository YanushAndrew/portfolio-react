"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2, ChevronLeft } from "lucide-react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Blob } from "@/components/ui/blob"
import { isAuthenticated, removeToken, getCurrentUser } from "@/lib/auth"; // Import auth functions

export default function AdminPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("profile")
  const [user, setUser] = useState<any>(null); // To store user info

  useEffect(() => {
    const checkAuth = async () => {
      if (!isAuthenticated()) {
        router.push('/admin/login');
      } else {
        // Optionally, verify token with backend or get user details
        const currentUser = await getCurrentUser();
        if (!currentUser) {
          removeToken(); // Token might be invalid
          router.push('/admin/login');
        } else {
          setUser(currentUser);
          setIsLoading(false);
        }
      }
    };

    checkAuth();
  }, [router]);

  const handleLogout = async () => {
    try {
      // Optional: Call logout API endpoint if you have one that invalidates server-side sessions or logs activity
      // await fetch('/api/auth/logout', { method: 'POST', headers: getAuthHeaders() });
    } catch (error) {
      console.error("Logout failed:", error);
      // Handle logout error if necessary, though client-side token removal is usually sufficient for JWT
    } finally {
      removeToken(); // Remove token from localStorage
      router.push("/admin/login"); // Redirect to login page
    }
  };

  if (isLoading) {
    return (
      <div className="container flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  // If not loading and still no user (should have been redirected, but as a fallback)
  if (!user) {
     return (
      <div className="container flex flex-col justify-center items-center min-h-screen">
        <p className="mb-4">Redirecting to login...</p>
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container py-8 relative overflow-hidden">
      {/* Background blobs */}
      <div className="hidden dark:block">
        <Blob
          className="top-0 right-0 translate-x-1/2 -translate-y-1/2"
          color="bg-purple-500"
          size="w-[500px] h-[500px]"
          blur="blur-3xl"
          opacity="opacity-5"
        />
        <Blob
          className="bottom-0 left-0 -translate-x-1/2 translate-y-1/2"
          color="bg-blue-500"
          size="w-[400px] h-[400px]"
          blur="blur-3xl"
          opacity="opacity-5"
        />
      </div>

      <div className="dark:hidden">
        <Blob
          className="top-0 right-0 translate-x-1/2 -translate-y-1/2"
          color="bg-indigo-200"
          size="w-[500px] h-[500px]"
          blur="blur-3xl"
          opacity="opacity-20"
        />
        <Blob
          className="bottom-0 left-0 -translate-x-1/2 translate-y-1/2"
          color="bg-sky-200"
          size="w-[400px] h-[400px]"
          blur="blur-3xl"
          opacity="opacity-20"
        />
      </div>

      <motion.div
        className="flex justify-between items-center mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center text-sm text-muted-foreground hover:text-primary group">
            <ChevronLeft className="mr-1 h-4 w-4 transition-transform group-hover:-translate-x-1" />
            <span>Back to Home</span>
          </Link>
          <h1 className="text-4xl font-bold">Admin Panel</h1>
        </div>
        <Button variant="outline" onClick={handleLogout} className="relative overflow-hidden group">
          <span className="relative z-10">Logout</span>
          <span className="absolute inset-0 bg-destructive/10 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
        </Button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Tabs defaultValue="profile" onValueChange={setActiveTab}>
          <TabsList className="mb-8 backdrop-blur-sm bg-background/50">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="contacts">Contacts</TabsTrigger>
          </TabsList>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <TabsContent value="profile">
                <Card className="border border-border/50 backdrop-blur-sm bg-card/80">
                  <CardHeader>
                    <CardTitle>Profile Information</CardTitle>
                    <CardDescription>Manage your personal information displayed on the homepage. Welcome, {user?.username || 'Admin'}!</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      This is a placeholder for the profile management interface. In a real application, you would be
                      able to update your name, title, bio, and skills here.
                    </p>

                    {/* 
                      Backend Integration Point:
                      - Create an API endpoint at /api/profile to fetch and update profile data
                      - Implement a form to update profile information
                      - Add image upload functionality for the profile picture
                    */}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="projects">
                <Card className="border border-border/50 backdrop-blur-sm bg-card/80">
                  <CardHeader>
                    <CardTitle>Projects Management</CardTitle>
                    <CardDescription>Add, edit, or remove projects from your portfolio</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      This is a placeholder for the projects management interface. In a real application, you would be
                      able to add, edit, and delete projects here.
                    </p>

                    {/* 
                      Backend Integration Point:
                      - Create API endpoints at /api/projects to fetch, create, update, and delete projects
                      - Implement a form to add/edit project details
                      - Add image upload functionality for project thumbnails
                      - Implement a confirmation dialog for project deletion
                    */}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="contacts">
                <Card className="border border-border/50 backdrop-blur-sm bg-card/80">
                  <CardHeader>
                    <CardTitle>Contact Information</CardTitle>
                    <CardDescription>Manage your contact information displayed on the contact page</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      This is a placeholder for the contact information management interface. In a real application, you
                      would be able to add, edit, and delete contact methods here.
                    </p>

                    {/* 
                      Backend Integration Point:
                      - Create API endpoints at /api/contacts to fetch, create, update, and delete contact information
                      - Implement a form to add/edit contact details
                      - Implement a confirmation dialog for contact deletion
                    */}
                  </CardContent>
                </Card>
              </TabsContent>
            </motion.div>
          </AnimatePresence>
        </Tabs>
      </motion.div>
    </div>
  )
}
