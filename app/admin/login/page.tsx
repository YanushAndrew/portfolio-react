"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2, ChevronLeft } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Blob } from "@/components/ui/blob"

export default function LoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)
    setError("")

    const formData = new FormData(event.currentTarget)
    const username = formData.get("username") as string
    const password = formData.get("password") as string

    try {
      // In a real application, you would send a request to the backend
      // const response = await fetch('/api/auth/login', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ username, password }),
      // })

      // if (!response.ok) {
      //   throw new Error('Invalid credentials')
      // }

      // Simulate a successful login for demo purposes
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // For demo purposes, we'll just check if the username and password match a predefined value
      if (username === "admin" && password === "password") {
        // In a real application, you would store the token in localStorage or a cookie
        // localStorage.setItem('token', await response.json().token)

        router.push("/admin")
      } else {
        throw new Error("Invalid credentials")
      }
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError("An unexpected error occurred")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container flex flex-col items-center justify-center min-h-screen py-12 relative overflow-hidden">
      {/* Background blobs */}
      <div className="hidden dark:block">
        <Blob
          className="top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2"
          color="bg-purple-500"
          size="w-[400px] h-[400px]"
          blur="blur-3xl"
          opacity="opacity-10"
        />
        <Blob
          className="bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2"
          color="bg-blue-500"
          size="w-[300px] h-[300px]"
          blur="blur-3xl"
          opacity="opacity-10"
        />
      </div>

      <div className="dark:hidden">
        <Blob
          className="top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2"
          color="bg-indigo-200"
          size="w-[400px] h-[400px]"
          blur="blur-3xl"
          opacity="opacity-30"
        />
        <Blob
          className="bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2"
          color="bg-sky-200"
          size="w-[300px] h-[300px]"
          blur="blur-3xl"
          opacity="opacity-30"
        />
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Link href="/" className="flex items-center text-sm text-muted-foreground hover:text-primary mb-8 group">
          <ChevronLeft className="mr-1 h-4 w-4 transition-transform group-hover:-translate-x-1" />
          <span>Back to Home</span>
        </Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="w-full max-w-md"
      >
        <Card className="border border-border/50 backdrop-blur-sm bg-card/80">
          <CardHeader>
            <CardTitle>Admin Login</CardTitle>
            <CardDescription>Enter your credentials to access the admin panel</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {error && (
                <motion.div
                  className="p-3 text-sm text-white bg-destructive rounded-md"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  {error}
                </motion.div>
              )}

              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  name="username"
                  placeholder="admin"
                  required
                  className="bg-background/50 backdrop-blur-sm"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  required
                  className="bg-background/50 backdrop-blur-sm"
                />
              </div>
            </CardContent>

            <CardFooter>
              <Button type="submit" className="w-full relative overflow-hidden group" disabled={isLoading}>
                <span className="relative z-10">
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Logging in...
                    </>
                  ) : (
                    "Login"
                  )}
                </span>
                <span className="absolute inset-0 bg-primary/20 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              </Button>
            </CardFooter>
          </form>
        </Card>
      </motion.div>
    </div>
  )
}
