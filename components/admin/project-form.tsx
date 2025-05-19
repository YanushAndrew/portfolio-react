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

// Define the schema for project validation
const projectFormSchema = z.object({
  name: z.string().min(1, { message: "Project name is required." }),
  description: z.string().min(1, { message: "Description is required." }),
  webLinks: z.array(z.string().url({ message: "Please enter a valid URL." })).optional(),
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

export default function ProjectForm({ project }: { project?: ProjectFormValues }) {
  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: project || defaultValues,
    mode: "onChange",
  });

  function onSubmit(data: ProjectFormValues) {
    console.log("Project data:", data);
    // Here you would typically call an API to save the project data
    // For example:
    // if (project) {
    //   // Update existing project
    //   await fetch(`/api/projects/${project.id}`, { method: 'PUT', body: JSON.stringify(data) });
    // } else {
    //   // Create new project
    //   await fetch('/api/projects', { method: 'POST', body: JSON.stringify(data) });
    // }
    alert("Changes would be saved. Check console for data.");
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