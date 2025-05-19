/**
 * API utility functions for fetching data from the backend
 *
 * Backend Integration Points:
 * 1. Create a PostgreSQL database with the following tables:
 *    - profiles: Store user profile information
 *    - projects: Store project information
 *    - contacts: Store contact information
 *    - users: Store admin user credentials
 *
 * 2. Create API routes for each resource:
 *    - GET /api/profile: Fetch profile information
 *    - PUT /api/profile: Update profile information
 *    - GET /api/projects: Fetch all projects
 *    - GET /api/projects/:id: Fetch a specific project
 *    - POST /api/projects: Create a new project
 *    - PUT /api/projects/:id: Update a project
 *    - DELETE /api/projects/:id: Delete a project
 *    - GET /api/contacts: Fetch all contacts
 *    - POST /api/contacts: Create a new contact
 *    - PUT /api/contacts/:id: Update a contact
 *    - DELETE /api/contacts/:id: Delete a contact
 *
 * 3. Implement authentication:
 *    - POST /api/auth/login: Authenticate user with username/password
 *    - GET /api/auth/me: Get current user information
 *    - POST /api/auth/logout: Log out user
 */

// Base URL for API requests
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || ""

// Helper function for making API requests
export async function fetchAPI<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  }

  const response = await fetch(url, {
    ...options,
    headers,
  })

  if (!response.ok) {
    throw new Error(`API error: ${response.statusText}`)
  }

  return response.json()
}

// Authentication functions
export async function login(username: string, password: string) {
  return fetchAPI("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  })
}

export async function logout() {
  return fetchAPI("/api/auth/logout", {
    method: "POST",
  })
}

// Profile functions
export async function getProfile() {
  return fetchAPI("/api/profile")
}

export async function updateProfile(data: any) {
  return fetchAPI("/api/profile", {
    method: "PUT",
    body: JSON.stringify(data),
  })
}

// Project functions
export async function getProjects() {
  return fetchAPI("/api/projects")
}

export async function getProject(id: string) {
  return fetchAPI(`/api/projects/${id}`)
}

export async function createProject(data: any) {
  return fetchAPI("/api/projects", {
    method: "POST",
    body: JSON.stringify(data),
  })
}

export async function updateProject(id: string, data: any) {
  return fetchAPI(`/api/projects/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  })
}

export async function deleteProject(id: string) {
  return fetchAPI(`/api/projects/${id}`, {
    method: "DELETE",
  })
}

// Contact functions
export async function getContacts() {
  return fetchAPI("/api/contacts")
}

export async function createContact(data: any) {
  return fetchAPI("/api/contacts", {
    method: "POST",
    body: JSON.stringify(data),
  })
}

export async function updateContact(id: string, data: any) {
  return fetchAPI(`/api/contacts/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  })
}

export async function deleteContact(id: string) {
  return fetchAPI(`/api/contacts/${id}`, {
    method: "DELETE",
  })
}
