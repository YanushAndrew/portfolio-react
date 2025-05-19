"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAuthHeaders } from "@/lib/auth"; // Import for authenticated API calls

// Define the schema for project validation
const projectFormSchema = z.object({
  id: z.string().uuid().optional(), // Add id for editing existing projects
  name: z.string().min(1, { message: "Project name is required." }),
  description: z.string().min(1, { message: "Description is required." }),
  webLinks: z.array(z.string().url({ message: "Please enter a valid URL." }).or(z.literal(''))).optional(), // Allow empty string for URL if field is left blank
  githubLink: z.string().url({ message: "Please enter a valid URL." }).optional().or(z.literal('')),
  photoUrl: z.string().url({ message: "Please enter a valid image URL." }).optional().or(z.literal('')), // For simplicity, using URL for photo
  technologies: z.string().min(1, {message: "Please list technologies used."}), // Comma-separated for now
});

type ProjectFormValues = z.infer<typeof projectFormSchema>;

// This can come from props if editing an existing project
const defaultValues: Partial<ProjectFormValues> = {
  name: "",
  description: "",
  webLinks: [],
  githubLink: "",
  photoUrl: "",
  technologies: "",
};

interface ProjectFormProps {
  project?: ProjectFormValues;
  onSuccess?: () => void; // Add onSuccess callback prop
}

export default function ProjectForm({ project, onSuccess }: ProjectFormProps) {
  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: project || defaultValues,
    mode: "onChange",
  });

  async function onSubmit(data: ProjectFormValues) {
    const apiData = {
      title: data.name,
      description: data.description,
      image_url: data.photoUrl || null,
      technologies: data.technologies.split(',').map(tech => tech.trim()).filter(tech => tech !== ""),
      github_url: data.githubLink || null,
      live_url: data.webLinks && data.webLinks.length > 0 && data.webLinks[0] ? data.webLinks[0] : null,
    };

    console.log("Submitting project data:", apiData);

    try {
      let response;
      if (project?.id) {
        // Update existing project
        response = await fetch(`/api/projects/${project.id}`, {
          method: 'PUT',
          headers: { 
            'Content-Type': 'application/json',
            ...getAuthHeaders() // Add auth headers
          }, 
          body: JSON.stringify(apiData),
        });
      } else {
        // Create new project
        response = await fetch('/api/projects', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            ...getAuthHeaders() // Add auth headers
          },
          body: JSON.stringify(apiData),
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Project saved:", result);
      alert("Project saved successfully!");
      if (onSuccess) {
        onSuccess(); // Call the callback
      }
      form.reset(); // Reset form after successful submission
    } catch (error) {
      console.error("Failed to save project:", error);
      alert(`Error saving project: ${(error as Error).message}`);
    }
  }

  // TODO: Implement UI for adding/removing webLinks dynamically
  // TODO: Implement actual file upload for photo instead of URL

  return (
    <Card>
      <CardHeader>
        <CardTitle>{project ? "Edit Project" : "Create New Project"}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Name</FormLabel>
                  <FormControl>
                    <Input placeholder="My Awesome Project" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell us a little bit about this project"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* TODO: Add a dynamic list for webLinks */}
            <FormField
              control={form.control}
              name="webLinks.0" // Placeholder for the first web link
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Website Link (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com" {...field} />
                  </FormControl>
                  <FormDescription>
                    Add a link to the live project if available.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />


            <FormField
              control={form.control}
              name="githubLink"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>GitHub Link (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="https://github.com/user/repo" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="photoUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Photo URL (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com/image.png" {...field} />
                  </FormControl>
                   <FormDescription>
                    For now, please use a URL. Actual file upload will be implemented later.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="technologies"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Technologies Used</FormLabel>
                  <FormControl>
                    <Input placeholder="React, Next.js, TailwindCSS" {...field} />
                  </FormControl>
                  <FormDescription>
                    Comma-separated list of technologies.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex justify-end space-x-2">
                {project && (
                    <Button type="button" variant="destructive" onClick={() => alert('Delete project clicked. API call needed.')}>Delete Project</Button>
                )}
                <Button type="submit">Save Changes</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
} 