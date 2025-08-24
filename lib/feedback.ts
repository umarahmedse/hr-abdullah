export type FeedbackType = "complaint" | "suggestion" | "accident"
export type FeedbackStatus = "open" | "in-review" | "resolved" | "closed"
export type Priority = "low" | "medium" | "high" | "critical"
export type Severity = "minor" | "moderate" | "major" | "critical"

export interface BaseFeedback {
  id: string
  type: FeedbackType
  employeeId: string
  employeeName: string
  title: string
  description: string
  status: FeedbackStatus
  priority: Priority
  submittedDate: string
  assignedTo?: string
  resolvedDate?: string
  response?: string
  attachments?: string[]
}

export interface Complaint extends BaseFeedback {
  type: "complaint"
  category: "workplace" | "harassment" | "discrimination" | "policy" | "management" | "other"
  anonymous: boolean
}

export interface Suggestion extends BaseFeedback {
  type: "suggestion"
  category: "process" | "technology" | "workplace" | "benefits" | "training" | "other"
  estimatedImpact: "low" | "medium" | "high"
  implementationCost: "low" | "medium" | "high"
}

export interface AccidentReport extends BaseFeedback {
  type: "accident"
  incidentDate: string
  location: string
  severity: Severity
  injuryType: "none" | "minor" | "major" | "fatal"
  witnessNames?: string
  medicalAttention: boolean
  reportedToAuthorities: boolean
  immediateActions: string
}

export type FeedbackItem = Complaint | Suggestion | AccidentReport

// Demo feedback data
export const demoFeedback: FeedbackItem[] = [
  {
    id: "1",
    type: "complaint",
    employeeId: "EMP001",
    employeeName: "John Doe",
    title: "Excessive noise in open office",
    description:
      "The noise level in the open office area has become disruptive, affecting concentration and productivity. Phone calls and conversations are constantly audible.",
    status: "in-review",
    priority: "medium",
    submittedDate: "2024-03-10",
    category: "workplace",
    anonymous: false,
    assignedTo: "Sarah Wilson",
  } as Complaint,
  {
    id: "2",
    type: "suggestion",
    employeeId: "EMP002",
    employeeName: "Mike Johnson",
    title: "Implement flexible working hours",
    description:
      "Allowing flexible start and end times would improve work-life balance and could increase productivity. Many employees have different peak performance hours.",
    status: "open",
    priority: "medium",
    submittedDate: "2024-03-08",
    category: "workplace",
    estimatedImpact: "high",
    implementationCost: "low",
  } as Suggestion,
  {
    id: "3",
    type: "accident",
    employeeId: "EMP003",
    employeeName: "Lisa Chen",
    title: "Slip and fall in cafeteria",
    description:
      "Slipped on wet floor near the coffee station. Floor was recently mopped but no warning signs were present.",
    status: "resolved",
    priority: "high",
    submittedDate: "2024-03-05",
    resolvedDate: "2024-03-06",
    incidentDate: "2024-03-05",
    location: "Employee Cafeteria - Coffee Station",
    severity: "minor",
    injuryType: "minor",
    witnessNames: "Robert Brown, Jane Smith",
    medicalAttention: false,
    reportedToAuthorities: false,
    immediateActions: "Applied ice pack, cleaned up spill, placed warning signs",
    response: "Implemented new policy requiring warning signs during cleaning. Additional non-slip mats installed.",
  } as AccidentReport,
  {
    id: "4",
    type: "complaint",
    employeeId: "EMP004",
    employeeName: "Robert Brown",
    title: "Inadequate parking spaces",
    description: "There are insufficient parking spaces for all employees, causing daily stress and tardiness issues.",
    status: "open",
    priority: "low",
    submittedDate: "2024-03-12",
    category: "workplace",
    anonymous: false,
  } as Complaint,
  {
    id: "5",
    type: "suggestion",
    employeeId: "EMP001",
    employeeName: "John Doe",
    title: "Upgrade development tools",
    description:
      "Investing in better development tools and faster computers would significantly improve developer productivity and code quality.",
    status: "in-review",
    priority: "medium",
    submittedDate: "2024-03-07",
    category: "technology",
    estimatedImpact: "high",
    implementationCost: "high",
    assignedTo: "Sarah Wilson",
  } as Suggestion,
]

// CRUD operations
export function getAllFeedback(): FeedbackItem[] {
  if (typeof window === "undefined") return demoFeedback
  const stored = localStorage.getItem("feedback")
  return stored ? JSON.parse(stored) : demoFeedback
}

export function getFeedbackByEmployee(employeeId: string): FeedbackItem[] {
  const feedback = getAllFeedback()
  return feedback.filter((item) => item.employeeId === employeeId)
}

export function getFeedbackByType(type: FeedbackType): FeedbackItem[] {
  const feedback = getAllFeedback()
  return feedback.filter((item) => item.type === type)
}

export function getFeedbackById(id: string): FeedbackItem | undefined {
  const feedback = getAllFeedback()
  return feedback.find((item) => item.id === id)
}

export function addFeedback(feedback: Omit<FeedbackItem, "id" | "submittedDate">): FeedbackItem {
  const allFeedback = getAllFeedback()
  const newFeedback: FeedbackItem = {
    ...feedback,
    id: Date.now().toString(),
    submittedDate: new Date().toISOString().split("T")[0],
  } as FeedbackItem
  const updatedFeedback = [...allFeedback, newFeedback]
  if (typeof window !== "undefined") {
    localStorage.setItem("feedback", JSON.stringify(updatedFeedback))
  }
  return newFeedback
}

export function updateFeedback(id: string, updates: Partial<FeedbackItem>): FeedbackItem | null {
  const feedback = getAllFeedback()
  const index = feedback.findIndex((item) => item.id === id)
  if (index === -1) return null

  const updatedItem = { ...feedback[index], ...updates }
  feedback[index] = updatedItem

  if (typeof window !== "undefined") {
    localStorage.setItem("feedback", JSON.stringify(feedback))
  }
  return updatedItem
}

export function deleteFeedback(id: string): boolean {
  const feedback = getAllFeedback()
  const filteredFeedback = feedback.filter((item) => item.id !== id)

  if (filteredFeedback.length === feedback.length) return false

  if (typeof window !== "undefined") {
    localStorage.setItem("feedback", JSON.stringify(filteredFeedback))
  }
  return true
}

// Utility functions
export function getStatusColor(status: FeedbackStatus): string {
  switch (status) {
    case "open":
      return "text-blue-600 bg-blue-50"
    case "in-review":
      return "text-yellow-600 bg-yellow-50"
    case "resolved":
      return "text-green-600 bg-green-50"
    case "closed":
      return "text-gray-600 bg-gray-50"
    default:
      return "text-gray-600 bg-gray-50"
  }
}

export function getPriorityColor(priority: Priority): string {
  switch (priority) {
    case "low":
      return "text-green-600 bg-green-50"
    case "medium":
      return "text-yellow-600 bg-yellow-50"
    case "high":
      return "text-orange-600 bg-orange-50"
    case "critical":
      return "text-red-600 bg-red-50"
    default:
      return "text-gray-600 bg-gray-50"
  }
}

export function getSeverityColor(severity: Severity): string {
  switch (severity) {
    case "minor":
      return "text-green-600 bg-green-50"
    case "moderate":
      return "text-yellow-600 bg-yellow-50"
    case "major":
      return "text-orange-600 bg-orange-50"
    case "critical":
      return "text-red-600 bg-red-50"
    default:
      return "text-gray-600 bg-gray-50"
  }
}

export function getFeedbackTypeLabel(type: FeedbackType): string {
  switch (type) {
    case "complaint":
      return "Complaint"
    case "suggestion":
      return "Suggestion"
    case "accident":
      return "Accident Report"
    default:
      return "Unknown"
  }
}

export function getFeedbackTypeIcon(type: FeedbackType): string {
  switch (type) {
    case "complaint":
      return "MessageSquare"
    case "suggestion":
      return "Lightbulb"
    case "accident":
      return "AlertTriangle"
    default:
      return "FileText"
  }
}
