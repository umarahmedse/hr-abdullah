export type LeaveType = "vacation" | "sick" | "personal" | "maternity" | "paternity" | "bereavement" | "other"
export type LeaveStatus = "pending" | "approved" | "rejected" | "cancelled"

export interface LeaveRequest {
  id: string
  employeeId: string
  employeeName: string
  type: LeaveType
  startDate: string
  endDate: string
  days: number
  reason: string
  status: LeaveStatus
  appliedDate: string
  reviewedBy?: string
  reviewedDate?: string
  reviewComments?: string
}

export interface LeaveBalance {
  employeeId: string
  vacation: number
  sick: number
  personal: number
  maternity: number
  paternity: number
  bereavement: number
}

// Demo leave requests
export const demoLeaveRequests: LeaveRequest[] = [
  {
    id: "1",
    employeeId: "EMP001",
    employeeName: "John Doe",
    type: "vacation",
    startDate: "2024-03-15",
    endDate: "2024-03-20",
    days: 4,
    reason: "Family vacation to Hawaii",
    status: "approved",
    appliedDate: "2024-02-15",
    reviewedBy: "Sarah Wilson",
    reviewedDate: "2024-02-16",
    reviewComments: "Approved. Enjoy your vacation!",
  },
  {
    id: "2",
    employeeId: "EMP002",
    employeeName: "Mike Johnson",
    type: "sick",
    startDate: "2024-02-28",
    endDate: "2024-03-01",
    days: 2,
    reason: "Flu symptoms",
    status: "approved",
    appliedDate: "2024-02-28",
    reviewedBy: "Sarah Wilson",
    reviewedDate: "2024-02-28",
    reviewComments: "Get well soon!",
  },
  {
    id: "3",
    employeeId: "EMP003",
    employeeName: "Lisa Chen",
    type: "personal",
    startDate: "2024-03-25",
    endDate: "2024-03-25",
    days: 1,
    reason: "Personal appointment",
    status: "pending",
    appliedDate: "2024-03-10",
  },
  {
    id: "4",
    employeeId: "EMP001",
    employeeName: "John Doe",
    type: "vacation",
    startDate: "2024-04-10",
    endDate: "2024-04-12",
    days: 3,
    reason: "Long weekend getaway",
    status: "pending",
    appliedDate: "2024-03-05",
  },
  {
    id: "5",
    employeeId: "EMP004",
    employeeName: "Robert Brown",
    type: "sick",
    startDate: "2024-02-20",
    endDate: "2024-02-21",
    days: 2,
    reason: "Medical appointment and recovery",
    status: "rejected",
    appliedDate: "2024-02-19",
    reviewedBy: "Sarah Wilson",
    reviewedDate: "2024-02-19",
    reviewComments: "Please provide medical certificate for sick leave longer than 1 day.",
  },
]

// Demo leave balances
export const demoLeaveBalances: LeaveBalance[] = [
  {
    employeeId: "EMP001",
    vacation: 15,
    sick: 10,
    personal: 5,
    maternity: 0,
    paternity: 0,
    bereavement: 3,
  },
  {
    employeeId: "EMP002",
    vacation: 20,
    sick: 8,
    personal: 3,
    maternity: 0,
    paternity: 0,
    bereavement: 3,
  },
  {
    employeeId: "EMP003",
    vacation: 18,
    sick: 12,
    personal: 4,
    maternity: 12,
    paternity: 0,
    bereavement: 3,
  },
  {
    employeeId: "EMP004",
    vacation: 12,
    sick: 10,
    personal: 5,
    maternity: 0,
    paternity: 5,
    bereavement: 3,
  },
]

// CRUD operations for leave requests
export function getAllLeaveRequests(): LeaveRequest[] {
  if (typeof window === "undefined") return demoLeaveRequests
  const stored = localStorage.getItem("leaveRequests")
  return stored ? JSON.parse(stored) : demoLeaveRequests
}

export function getLeaveRequestsByEmployee(employeeId: string): LeaveRequest[] {
  const requests = getAllLeaveRequests()
  return requests.filter((request) => request.employeeId === employeeId)
}

export function addLeaveRequest(request: Omit<LeaveRequest, "id" | "appliedDate">): LeaveRequest {
  const requests = getAllLeaveRequests()
  const newRequest: LeaveRequest = {
    ...request,
    id: Date.now().toString(),
    appliedDate: new Date().toISOString().split("T")[0],
  }
  const updatedRequests = [...requests, newRequest]
  if (typeof window !== "undefined") {
    localStorage.setItem("leaveRequests", JSON.stringify(updatedRequests))
  }
  return newRequest
}

export function updateLeaveRequest(id: string, updates: Partial<LeaveRequest>): LeaveRequest | null {
  const requests = getAllLeaveRequests()
  const index = requests.findIndex((req) => req.id === id)
  if (index === -1) return null

  const updatedRequest = { ...requests[index], ...updates }
  requests[index] = updatedRequest

  if (typeof window !== "undefined") {
    localStorage.setItem("leaveRequests", JSON.stringify(requests))
  }
  return updatedRequest
}

export function deleteLeaveRequest(id: string): boolean {
  const requests = getAllLeaveRequests()
  const filteredRequests = requests.filter((req) => req.id !== id)

  if (filteredRequests.length === requests.length) return false

  if (typeof window !== "undefined") {
    localStorage.setItem("leaveRequests", JSON.stringify(filteredRequests))
  }
  return true
}

// Leave balance operations
export function getLeaveBalance(employeeId: string): LeaveBalance | null {
  if (typeof window === "undefined") {
    return demoLeaveBalances.find((balance) => balance.employeeId === employeeId) || null
  }
  const stored = localStorage.getItem("leaveBalances")
  const balances: LeaveBalance[] = stored ? JSON.parse(stored) : demoLeaveBalances
  return balances.find((balance) => balance.employeeId === employeeId) || null
}

export function getAllLeaveBalances(): LeaveBalance[] {
  if (typeof window === "undefined") return demoLeaveBalances
  const stored = localStorage.getItem("leaveBalances")
  return stored ? JSON.parse(stored) : demoLeaveBalances
}

// Utility functions
export function calculateLeaveDays(startDate: string, endDate: string): number {
  const start = new Date(startDate)
  const end = new Date(endDate)
  const diffTime = Math.abs(end.getTime() - start.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
  return diffDays
}

export function getLeaveTypeLabel(type: LeaveType): string {
  const labels: Record<LeaveType, string> = {
    vacation: "Vacation",
    sick: "Sick Leave",
    personal: "Personal Leave",
    maternity: "Maternity Leave",
    paternity: "Paternity Leave",
    bereavement: "Bereavement Leave",
    other: "Other",
  }
  return labels[type]
}

export function getStatusColor(status: LeaveStatus): string {
  switch (status) {
    case "approved":
      return "text-green-600 bg-green-50"
    case "rejected":
      return "text-red-600 bg-red-50"
    case "pending":
      return "text-yellow-600 bg-yellow-50"
    case "cancelled":
      return "text-gray-600 bg-gray-50"
    default:
      return "text-gray-600 bg-gray-50"
  }
}
