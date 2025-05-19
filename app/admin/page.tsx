"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2, ChevronLeft, ChevronUp, ChevronDown } from "lucide-react"
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
import ContactForm from "@/components/admin/contact-form"; // Import ContactForm

// Define a type for the profile form data
interface ProfileFormData {
  name: string;
  title: string;
  bio: string;
  image_url: string;
  skills: string; // Comma-separated string for the form
}

// Define a type for Project data from API
interface Project {
  id: string;
  title: string;
  description: string;
  image_url: string | null;
  technologies: string[]; // Assuming API returns it as array of strings
  github_url: string | null;
  live_url: string | null;
  created_at: string;
  updated_at: string;
}

// Define the form values for ProjectForm, ensuring compatibility
// This should align with ProjectForm's own ProjectFormValues type if possible
// For now, we'll use this to map API data to what ProjectForm expects.
interface ProjectFormInput {
  id?: string;
  name: string;
  description: string;
  webLinks?: string[];
  githubLink?: string;
  photoUrl?: string;
  technologies: string; // ProjectForm expects comma-separated string
}

// Define type for Contact data from API
interface Contact {
  id: string;
  type: string;
  value: string;
  url: string | null;
  icon: string | null;
  created_at: string;
  updated_at: string;
}

// Define form values for ContactForm (should align with ContactForm's ContactFormValues)
interface ContactFormInput {
  id?: string;
  type: string;
  value: string;
  url?: string;
  icon?: string;
}

const MotionCard = motion(Card); // Create a motion version of Card

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

  // Project specific state
  const [projects, setProjects] = useState<Project[]>([]);
  const [isProjectsLoading, setIsProjectsLoading] = useState(false);
  const [projectsError, setProjectsError] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState<ProjectFormInput | undefined>(undefined);
  const [showProjectForm, setShowProjectForm] = useState(false);

  // Contact specific state
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isContactsLoading, setIsContactsLoading] = useState(false);
  const [contactsError, setContactsError] = useState<string | null>(null);
  const [selectedContact, setSelectedContact] = useState<ContactFormInput | undefined>(undefined);
  const [showContactForm, setShowContactForm] = useState(false);
  const [isSavingOrder, setIsSavingOrder] = useState(false);

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

  // Fetch projects data when tab is active and user is loaded
  useEffect(() => {
    if (activeTab === 'projects' && user) {
      fetchProjects();
    }
  }, [activeTab, user]);

  // Fetch contacts data when tab is active and user is loaded
  useEffect(() => {
    if (activeTab === 'contacts' && user) {
      fetchContacts();
    }
  }, [activeTab, user]);

  const fetchProjects = async () => {
    setIsProjectsLoading(true);
    setProjectsError(null);
    try {
      // Assuming fetchAPI handles auth headers if needed, or using getAuthHeaders()
      const data = await fetchAPI<Project[]>('/api/projects');
      setProjects(data || []);
    } catch (error) {
      console.error("Failed to fetch projects:", error);
      setProjectsError(error instanceof Error ? error.message : "Failed to load projects data.");
    } finally {
      setIsProjectsLoading(false);
    }
  };

  const fetchContacts = async () => {
    setIsContactsLoading(true);
    setContactsError(null);
    try {
      const data = await fetchAPI<Contact[]>('/api/contacts');
      setContacts(data || []);
    } catch (error) {
      console.error("Failed to fetch contacts:", error);
      setContactsError(error instanceof Error ? error.message : "Failed to load contacts data.");
    } finally {
      setIsContactsLoading(false);
    }
  };

  const handleEditProject = (project: Project) => {
    setSelectedProject({
      id: project.id,
      name: project.title,
      description: project.description,
      webLinks: project.live_url ? [project.live_url] : [],
      githubLink: project.github_url || "",
      photoUrl: project.image_url || "",
      technologies: project.technologies.join(", "),
    });
    setShowProjectForm(true);
  };

  const handleEditContact = (contact: Contact) => {
    setSelectedContact({
      id: contact.id,
      type: contact.type,
      value: contact.value,
      url: contact.url || undefined,
      icon: contact.icon || undefined,
    });
    setShowContactForm(true);
  };

  const handleAddNewProject = () => {
    setSelectedProject(undefined); // Clear any selected project
    setShowProjectForm(true); // Show the form for a new project
  };
  
  const handleAddNewContact = () => {
    setSelectedContact(undefined);
    setShowContactForm(true);
  };

  const handleProjectFormSuccess = () => {
    setShowProjectForm(false);
    setSelectedProject(undefined);
    fetchProjects(); // Refresh the list of projects
  };

  const handleContactFormSuccess = () => {
    setShowContactForm(false);
    setSelectedContact(undefined);
    fetchContacts(); // Refresh contacts list
  };

  const handleDeleteProject = async (projectId: string) => {
    if (!confirm("Are you sure you want to delete this project?")) {
      return;
    }
    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(), // Assuming DELETE also needs auth
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      alert("Project deleted successfully!");
      fetchProjects(); // Refresh the list
    } catch (error) {
      console.error("Failed to delete project:", error);
      alert(`Error deleting project: ${(error as Error).message}`);
    }
  };

  const moveContact = (index: number, direction: 'up' | 'down') => {
    setContacts(currentContacts => {
      const newContacts = [...currentContacts];
      const contactToMove = newContacts[index];
      
      if (direction === 'up' && index > 0) {
        newContacts.splice(index, 1);
        newContacts.splice(index - 1, 0, contactToMove);
      } else if (direction === 'down' && index < newContacts.length - 1) {
        newContacts.splice(index, 1);
        newContacts.splice(index + 1, 0, contactToMove);
      }
      return newContacts;
    });
  };

  const handleSaveContactOrder = async () => {
    setIsSavingOrder(true);
    const orderedIds = contacts.map(c => c.id);
    try {
      const response = await fetch('/api/contacts/reorder', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify({ orderedIds }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to save contact order");
      }
      alert("Contact order saved successfully!");
      fetchContacts(); // Refresh to confirm order from DB, though local state should match
    } catch (error) {
      console.error("Failed to save contact order:", error);
      alert(`Error saving contact order: ${(error as Error).message}`);
    } finally {
      setIsSavingOrder(false);
    }
  };

  const handleDeleteContact = async (contactId: string) => {
    if (!confirm("Are you sure you want to delete this contact?")) {
      return;
    }
    try {
      const response = await fetch(`/api/contacts/${contactId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      alert("Contact deleted successfully!");
      fetchContacts(); // Refresh the list
    } catch (error) {
      console.error("Failed to delete contact:", error);
      alert(`Error deleting contact: ${(error as Error).message}`);
    }
  };

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
                    {isProjectsLoading && (
                      <div className="flex items-center justify-center p-4">
                        <Loader2 className="h-6 w-6 animate-spin" /> <span className="ml-2">Loading projects...</span>
                      </div>
                    )}
                    {!isProjectsLoading && projectsError && (
                      <p className="text-destructive">Error loading projects: {projectsError}</p>
                    )}
                    {!isProjectsLoading && !projectsError && !showProjectForm && (
                      <>
                        <div className="mb-4 flex justify-end">
                          <Button onClick={handleAddNewProject}>Add New Project</Button>
                        </div>
                        {projects.length === 0 ? (
                          <p className="text-muted-foreground italic">Oopsie, I will work on this, someday</p>
                        ) : (
                          <div className="space-y-4">
                            {projects.map((project) => (
                              <Card key={project.id} className="bg-card/50">
                                <CardHeader>
                                  <CardTitle className="flex justify-between items-center">
                                    {project.title}
                                    <div className="space-x-2">
                                      <Button variant="outline" size="sm" onClick={() => handleEditProject(project)}>Edit</Button>
                                      <Button variant="destructive" size="sm" onClick={() => handleDeleteProject(project.id)}>Delete</Button>
                                    </div>
                                  </CardTitle>
                                  <CardDescription>{project.description.substring(0,100)}...</CardDescription>
                                </CardHeader>
                                <CardContent>
                                  <p className="text-sm text-muted-foreground">
                                    Technologies: {project.technologies.join(", ")}
                                  </p>
                                  {project.live_url && <p className="text-sm text-muted-foreground">Live URL: <Link href={project.live_url} target="_blank" className="text-primary hover:underline">{project.live_url}</Link></p>}
                                  {project.github_url && <p className="text-sm text-muted-foreground">GitHub: <Link href={project.github_url} target="_blank" className="text-primary hover:underline">{project.github_url}</Link></p>}
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        )}
                      </>
                    )}
                    {showProjectForm && (
                      <>
                        <Button variant="outline" onClick={() => { setShowProjectForm(false); setSelectedProject(undefined); }} className="mb-4">
                          Back to Projects List
                        </Button>
                        <ProjectForm
                          project={selectedProject}
                          onSuccess={handleProjectFormSuccess}
                        />
                      </>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="contacts">
                <Card className="border border-border/50 backdrop-blur-sm bg-card/80">
                  <CardHeader>
                    <CardTitle>Manage Contact Information</CardTitle>
                    <CardDescription>Add, edit, or remove contact methods.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {isContactsLoading && (
                      <div className="flex items-center justify-center p-4">
                        <Loader2 className="h-6 w-6 animate-spin" /> <span className="ml-2">Loading contacts...</span>
                      </div>
                    )}
                    {!isContactsLoading && contactsError && (
                      <p className="text-destructive">Error loading contacts: {contactsError}</p>
                    )}
                    {!isContactsLoading && !contactsError && !showContactForm && (
                      <>
                        <div className="mb-4 flex justify-end">
                          <Button onClick={handleAddNewContact}>Add New Contact</Button>
                        </div>
                        {contacts.length === 0 ? (
                          <p className="text-muted-foreground italic">No contacts configured yet. Add some!</p>
                        ) : (
                          <>
                            <div className="space-y-4">
                             <AnimatePresence initial={false}>
                              {contacts.map((contact, index) => (
                                <MotionCard
                                  layout
                                  key={contact.id}
                                  className="bg-card/50 flex flex-col"
                                  initial={{ opacity: 0, y: 20 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: -20, transition: { duration: 0.2 } }}
                                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                >
                                  <CardHeader className="flex-grow">
                                    <CardTitle className="flex justify-between items-center">
                                      {contact.type}: {contact.value}
                                      <div className="space-x-2 flex items-center">
                                        <Button variant="ghost" size="sm" onClick={() => moveContact(index, 'up')} disabled={index === 0} aria-label="Move Up">
                                          <ChevronUp className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="sm" onClick={() => moveContact(index, 'down')} disabled={index === contacts.length - 1} aria-label="Move Down">
                                          <ChevronDown className="h-4 w-4" />
                                        </Button>
                                        <Button variant="outline" size="sm" onClick={() => handleEditContact(contact)}>Edit</Button>
                                        <Button variant="destructive" size="sm" onClick={() => handleDeleteContact(contact.id)}>Delete</Button>
                                      </div>
                                    </CardTitle>
                                    {contact.url && <CardDescription>URL: <Link href={contact.url} target="_blank" className="text-primary hover:underline">{contact.url}</Link></CardDescription>}
                                  </CardHeader>
                                  {contact.icon && <CardContent><p className="text-sm text-muted-foreground">Icon: {contact.icon}</p></CardContent>}
                                </MotionCard>
                              ))}
                             </AnimatePresence>
                            </div>
                            {contacts.length > 1 && (
                            <motion.div
                                layout
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mt-6 flex justify-end"
                            >
                                <Button onClick={handleSaveContactOrder} disabled={isSavingOrder}>
                                  {isSavingOrder ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving Order...</> : "Save Contact Order"}
                                </Button>
                            </motion.div>
                            )}
                          </>
                        )}
                      </>
                    )}
                    {showContactForm && (
                      <>
                        <Button variant="outline" onClick={() => { setShowContactForm(false); setSelectedContact(undefined); }} className="mb-4">
                          Back to Contacts List
                        </Button>
                        <ContactForm 
                          contact={selectedContact} 
                          onSuccess={handleContactFormSuccess} 
                        />
                      </>
                    )}
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
