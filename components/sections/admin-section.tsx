"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface AdminSectionProps {
  onLogout: () => void
}

export function AdminSection({ onLogout }: AdminSectionProps) {
  return (
    <div className="container">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-4xl font-bold">Admin Panel</h2>
        <Button variant="outline" onClick={onLogout}>
          Logout
        </Button>
      </div>

      <Tabs defaultValue="profile">
        <TabsList className="mb-8">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="contacts">Contacts</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Manage your personal information displayed on the homepage</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                This is a placeholder for the profile management interface. In a real application, you would be able to
                update your name, title, bio, and skills here.
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
          <Card>
            <CardHeader>
              <CardTitle>Projects Management</CardTitle>
              <CardDescription>Add, edit, or remove projects from your portfolio</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                This is a placeholder for the projects management interface. In a real application, you would be able to
                add, edit, and delete projects here.
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
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>Manage your contact information displayed on the contact page</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                This is a placeholder for the contact information management interface. In a real application, you would
                be able to add, edit, and delete contact methods here.
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
      </Tabs>
    </div>
  )
}
