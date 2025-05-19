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
import { isAuthenticated, removeToken, getCurrentUser, getAuthHeaders } from "@/lib/auth"; // Added getAuthHeaders
import { Input } from "@/components/ui/input"; // Added Input
import { Label } from "@/components/ui/label"; // Added Label
import { Textarea } from "@/components/ui/textarea"; // Added Textarea
import { fetchAPI } from "@/lib/api"; // To make API calls
import ProjectForm from "@/components/admin/project-form"; // Import ProjectForm

// Define a type for the profile form data
interface ProfileFormData {
  name: string;
  title: string;
  bio: string;
  image_url: string;
  skills: string; // Comma-separated string for the form
}

export default function AdminPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true) // Overall page loading
  const [activeTab, setActiveTab] = useState("profile")
  const [user, setUser] = useState<any>(null);

  // Profile specific state
  const [profileForm, setProfileForm] = useState<ProfileFormData>({
    name: "",
    title: "",
    bio: "",
    image_url: "",
    skills: "",
  });
  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const [isProfileSaving, setIsProfileSaving] = useState(false);
  const [profileSaveSuccess, setProfileSaveSuccess] = useState<string | null>(null);
  const [profileSaveError, setProfileSaveError] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      if (!isAuthenticated()) {
        router.push('/admin/login');
      } else {
        const currentUser = await getCurrentUser();
        if (!currentUser) {
          removeToken();
          router.push('/admin/login');
        } else {
          setUser(currentUser);
          setIsLoading(false); // Overall page loading finished
        }
      }
    };
    checkAuth();
  }, [router]);

  // Fetch profile data when tab is active and user is loaded
  useEffect(() => {
    if (activeTab === 'profile' && user) {
      const fetchProfileData = async () => {
        setIsProfileLoading(true);
        setProfileSaveError(null);
        setProfileSaveSuccess(null);
        try {
          const data = await fetchAPI<any>('/api/profile'); // Using fetchAPI from lib/api.ts
          if (data) {
            setProfileForm({
              name: data.name || "",
              title: data.title || "",
              bio: data.bio || "",
              image_url: data.image_url || "",
              skills: Array.isArray(data.skills) ? data.skills.join(", ") : "",
            });
          }
        } catch (error) {
          console.error("Failed to fetch profile:", error);
          setProfileSaveError(error instanceof Error ? error.message : "Failed to load profile data.");
        } finally {
          setIsProfileLoading(false);
        }
      };
      fetchProfileData();
    }
  }, [activeTab, user]);


  const handleProfileInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfileForm(prev => ({ ...prev, [name]: value }));
  };

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProfileSaving(true);
    setProfileSaveError(null);
    setProfileSaveSuccess(null);

    const payload = {
      ...profileForm,
      skills: profileForm.skills.split(',').map(s => s.trim()).filter(Boolean),
    };

    try {
      const updatedProfile = await fetchAPI<any>('/api/profile', {
        method: 'PUT',
        headers: getAuthHeaders(), // Ensure auth headers are included
        body: JSON.stringify(payload),
      });
      setProfileSaveSuccess("Profile updated successfully!");
      // Optionally re-set form with returned data if backend modifies it
      if (updatedProfile) {
        setProfileForm({
            name: updatedProfile.name || "",
            title: updatedProfile.title || "",
            bio: updatedProfile.bio || "",
            image_url: updatedProfile.image_url || "",
            skills: Array.isArray(updatedProfile.skills) ? updatedProfile.skills.join(", ") : "",
        });
      }
    } catch (error) {
      console.error("Failed to save profile:", error);
      setProfileSaveError(error instanceof Error ? error.message : "Failed to save profile.");
    } finally {
      setIsProfileSaving(false);
    }
  };


  const handleLogout = async () => {
    try {
      // No explicit server-side logout needed for JWT if not implemented
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      removeToken();
      router.push("/admin/login");
    }
  };

  if (isLoading) {
    return (
      <div className="container flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

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
                    {isProfileLoading && <div className="flex items-center justify-center p-4"><Loader2 className="h-6 w-6 animate-spin" /> <span className="ml-2">Loading profile...</span></div>}
                    {!isProfileLoading && (
                      <form onSubmit={handleProfileSave} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="name">Name</Label>
                            <Input id="name" name="name" value={profileForm.name} onChange={handleProfileInputChange} placeholder="Your Name" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="title">Title / Position</Label>
                            <Input id="title" name="title" value={profileForm.title} onChange={handleProfileInputChange} placeholder="Your Title (e.g., Software Engineer)" />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="bio">Bio</Label>
                          <Textarea id="bio" name="bio" value={profileForm.bio} onChange={handleProfileInputChange} placeholder="A short bio about yourself." rows={4} />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="image_url">Profile Image URL</Label>
                          <Input id="image_url" name="image_url" value={profileForm.image_url} onChange={handleProfileInputChange} placeholder="https://example.com/your-image.jpg" />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="skills">Skills (comma-separated)</Label>
                          <Input id="skills" name="skills" value={profileForm.skills} onChange={handleProfileInputChange} placeholder="e.g., React, Next.js, Tailwind CSS" />
                        </div>

                        {profileSaveSuccess && <p className="text-sm text-green-600 dark:text-green-500">{profileSaveSuccess}</p>}
                        {profileSaveError && <p className="text-sm text-destructive">{profileSaveError}</p>}
                        
                        <Button type="submit" disabled={isProfileSaving} className="w-full md:w-auto">
                          {isProfileSaving ? (
                            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</>
                          ) : (
                            "Save Profile"
                          )}
                        </Button>
                      </form>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="projects">
                <Card className="border border-border/50 backdrop-blur-sm bg-card/80">
                  <CardHeader>
                    <CardTitle>Manage Projects</CardTitle>
                    <CardDescription>
                      Add, edit, or remove projects from your portfolio.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ProjectForm />
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
