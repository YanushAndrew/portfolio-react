import type React from "react"
import type { Metadata } from "next"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"

export const metadata: Metadata = {
  title: "Admin Panel | Portfolio Website",
  description: "Manage your portfolio content",
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="container py-8">
      <Link href="/" className="flex items-center text-sm text-muted-foreground hover:text-primary mb-8">
        <ChevronLeft className="mr-1 h-4 w-4" />
        Back to Home
      </Link>

      {children}
    </div>
  )
}
