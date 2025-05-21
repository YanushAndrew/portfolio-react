import { Mail, Github, MessageCircle } from "lucide-react"

import { ContactItem, type ContactItemPropsForServer } from "@/components/contact-item"

// This would be fetched from the backend in a real application
// Example API route: GET /api/contacts
const contactsData: ContactItemPropsForServer[] = [
  {
    id: "1",
    type: "Email",
    value: "john.doe@example.com",
    url: "mailto:john.doe@example.com",
    iconName: "Mail",
  },
  {
    id: "2",
    type: "GitHub",
    value: "github.com/johndoe",
    url: "https://github.com/johndoe",
    iconName: "Github",
  },
  {
    id: "3",
    type: "Telegram",
    value: "@johndoe",
    url: "https://t.me/johndoe",
    iconName: "MessageCircle",
  },
]

export default async function ContactPage() {
  // In a real application, you would fetch the contacts data from the backend
  // const contactsData = await fetch('/api/contacts').then(res => res.json())

  return (
    <div className="container py-12">
      <h1 className="text-4xl font-bold mb-8">Contact Me</h1>

      <div className="max-w-2xl mx-auto">
        <p className="text-lg text-muted-foreground mb-8">
          Feel free to reach out to me through any of the following channels. I'll get back to you as soon as possible.
        </p>

        <div className="grid gap-4">
          {contactsData.map((contact) => (
            <ContactItem key={contact.id} contact={contact} />
          ))}
        </div>
      </div>
    </div>
  )
}
