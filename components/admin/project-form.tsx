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

// Helper for optional URL fields that can also be empty strings
const optionalUrlOrEmptyString = z.preprocess(
  (val) => (val === "" ? undefined : val), // Treat empty string as undefined
  z.string().url({ message: "Please enter a valid URL." }).optional()
);

// Define the schema for project validation
const projectFormSchema = z.object({
  id: z.string().uuid().optional(), // Add id for editing existing projects
  name: z.string().min(1, { message: "Project name is required." }),
  description: z.string().min(1, { message: "Description is required." }),
  webLinks: z.array(optionalUrlOrEmptyString).optional(), // Allow empty string for URL if field is left blank
  githubLink: optionalUrlOrEmptyString, // Uses the helper
  photoUrl: optionalUrlOrEmptyString, // For simplicity, using URL for photo
  technologies: z.string().min(1, {message: "Please list technologies used."}), // Comma-separated for now
}).superRefine((data, ctx) => {
  // A link is considered successfully provided if it's a string after a
  // successful URL validation (empty strings/undefined would not be strings here).
  const isGithubLinkProvided = typeof data.githubLink === 'string';
  const isWebLinkProvided = data.webLinks && data.webLinks.length > 0 && typeof data.webLinks[0] === 'string';

  if (!isGithubLinkProvided && !isWebLinkProvided) {
    const errorMessage = "Either a valid Website link or a valid GitHub link is required.";
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: errorMessage,
      path: ["githubLink"],
    });
    // Also add to webLinks path so the message can appear there too.
    // Targeting webLinks[0] specifically if that's the only input shown.
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: errorMessage,
      path: ["webLinks", 0], 
    });
  }
});

type ProjectFormValues = z.infer<typeof projectFormSchema>;

// This can come from props if editing an existing project
const defaultValues: Partial<ProjectFormValues> = {
  name: "",
  description: "",
  webLinks: [],
  githubLink: undefined,
  photoUrl: undefined,
  technologies: "",
};

interface ProjectFormProps {
  project?: ProjectFormValues;
  onSuccess?: () => void; // Add onSuccess callback prop
}

export default function ProjectForm({ project, onSuccess }: ProjectFormProps) {
  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: project
      ? {
          ...defaultValues, // spread default first
          ...project,       // then project data
          // Ensure webLinks is an array, even if project.webLinks is undefined
          webLinks: project.webLinks || [], 
        }
      : defaultValues,
    mode: "onChange",
  });

  async function onSubmit(data: ProjectFormValues) {
    // Filter out undefined or empty webLinks before sending to API
    const validWebLinks = (data.webLinks || []).filter(link => typeof link === 'string' && link.trim() !== '');

    const apiData = {
      title: data.name,
      description: data.description,
      image_url: data.photoUrl || null,
      technologies: data.technologies.split(',').map(tech => tech.trim()).filter(tech => tech !== ""),
      github_url: data.githubLink || null,
      live_url: validWebLinks.length > 0 ? validWebLinks[0] : null,
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
      // Reset with base defaults, not potentially merged project data
      form.reset(defaultValues);
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
            
            <FormField
              control={form.control}
              name="webLinks.0" 
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Website Link (Optional)</FormLabel>
                  <FormControl>
                    {/* Ensure value is not null/undefined for controlled Input */}
                    <Input placeholder="https://example.com" {...field} value={field.value || ''} />
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
                     {/* Ensure value is not null/undefined for controlled Input */}
                    <Input placeholder="https://github.com/user/repo" {...field} value={field.value || ''} />
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
                     {/* Ensure value is not null/undefined for controlled Input */}
                    <Input placeholder="https://example.com/image.png" {...field} value={field.value || ''} />
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