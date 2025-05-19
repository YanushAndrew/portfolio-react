/**
 * Authentication utility functions
 *
 * Backend Integration Points:
 * 1. Implement JWT-based authentication:
 *    - Generate JWT tokens on successful login
 *    - Verify tokens on protected routes
 *    - Store user information in the token payload
 *
 * 2. Create authentication middleware:
 *    - Verify the token in the Authorization header
 *    - Extract user information from the token
 *    - Add user information to the request object
 *
 * 3. Implement session management:
 *    - Store tokens in HTTP-only cookies for better security
 *    - Implement token refresh mechanism
 *    - Handle token expiration
 */

// Check if the user is authenticated
export function isAuthenticated(): boolean {
  if (typeof window === "undefined") return false

  const token = localStorage.getItem("token")
  return !!token
}

// Get the current user's token
export function getToken(): string | null {
  if (typeof window === "undefined") return null

  return localStorage.getItem("token")
}

// Set the user's token
export function setToken(token: string): void {
  if (typeof window === "undefined") return

  localStorage.setItem("token", token)
}

// Remove the user's token
export function removeToken(): void {
  if (typeof window === "undefined") return

  localStorage.removeItem("token")
}

// Get the authenticated headers
export function getAuthHeaders(): HeadersInit {
  const token = getToken()

  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}
