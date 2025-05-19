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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAuthHeaders } from "@/lib/auth";

// Helper for optional URL fields that can also be empty strings
const optionalUrlOrEmptyString = z.preprocess(
  (val) => (val === "" ? undefined : val),
  z.string().url({ message: "Please enter a valid URL." }).optional()
);

// Helper for optional fields that are just strings but can be empty
const optionalString = z.preprocess(
  (val) => (val === "" ? undefined : val),
  z.string().optional()
);

const contactFormSchema = z.object({
  id: z.string().uuid().optional(),
  type: z.string().min(1, { message: "Contact type is required (e.g., Email, GitHub)." }),
  value: z.string().min(1, { message: "Value is required (e.g., email address, username)." }),
  url: optionalUrlOrEmptyString,
  icon: optionalString, // Icon name is optional string
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

interface ContactFormProps {
  contact?: ContactFormValues;
  onSuccess?: () => void;
}

const defaultValues: Partial<ContactFormValues> = {
  type: "",
  value: "",
  url: undefined,
  icon: undefined,
};

export default function ContactForm({ contact, onSuccess }: ContactFormProps) {
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: contact || defaultValues,
    mode: "onChange",
  });

  async function onSubmit(data: ContactFormValues) {
    const apiData = {
      type: data.type,
      value: data.value,
      url: data.url || null,
      icon: data.icon || null,
    };

    console.log("Submitting contact data:", apiData);

    try {
      let response;
      if (contact?.id) {
        response = await fetch(`/api/contacts/${contact.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
          body: JSON.stringify(apiData),
        });
      } else {
        response = await fetch('/api/contacts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
          body: JSON.stringify(apiData),
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      await response.json(); // Consume JSON body
      alert("Contact saved successfully!");
      if (onSuccess) {
        onSuccess();
      }
      form.reset(defaultValues);
    } catch (error) {
      console.error("Failed to save contact:", error);
      alert(`Error saving contact: ${(error as Error).message}`);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{contact?.id ? "Edit Contact" : "Create New Contact"}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Email, GitHub, LinkedIn" {...field} />
                  </FormControl>
                  <FormDescription>
                    The type of contact (e.g., Email, GitHub, LinkedIn, Telegram).
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Value</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., your@email.com, yourusername" {...field} />
                  </FormControl>
                  <FormDescription>
                    The actual contact detail (email address, username, phone number).
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com/yourprofile" {...field} value={field.value || ''} />
                  </FormControl>
                  <FormDescription>
                    The full clickable URL for this contact method.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="icon"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Icon Name (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Mail, Github, Linkedin (Lucide icon name)" {...field} value={field.value || ''}/>
                  </FormControl>
                  <FormDescription>
                    Name of the Lucide React icon to use (e.g., Mail, Github, Linkedin).
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex justify-end">
              <Button type="submit">Save Contact</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
} 