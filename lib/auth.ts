export type UserRole = "employee" | "hr"

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  employeeId: string
  department: string
  position: string
  avatar?: string
}

// Demo users for authentication
export const demoUsers: User[] = [
  {
    id: "1",
    email: "john.doe@company.com",
    name: "John Doe",
    role: "employee",
    employeeId: "EMP001",
    department: "Engineering",
    position: "Software Developer",
    avatar: "/professional-male-avatar.png",
  },
  {
    id: "2",
    email: "sarah.wilson@company.com",
    name: "Sarah Wilson",
    role: "hr",
    employeeId: "HR001",
    department: "Human Resources",
    position: "HR Manager",
    avatar: "/professional-female-avatar.png",
  },
  {
    id: "3",
    email: "mike.johnson@company.com",
    name: "Mike Johnson",
    role: "employee",
    employeeId: "EMP002",
    department: "Marketing",
    position: "Marketing Specialist",
    avatar: "/professional-male-avatar.png",
  },
]

// Simple authentication functions for demo
export function authenticateUser(email: string, password: string): User | null {
  // In demo, any password works for simplicity
  const user = demoUsers.find((u) => u.email === email)
  return user || null
}

export function getCurrentUser(): User | null {
  if (typeof window === "undefined") return null
  const userData = localStorage.getItem("currentUser")
  return userData ? JSON.parse(userData) : null
}

export function setCurrentUser(user: User): void {
  if (typeof window === "undefined") return
  localStorage.setItem("currentUser", JSON.stringify(user))
}

export function logout(): void {
  if (typeof window === "undefined") return
  localStorage.removeItem("currentUser")
}
