export type ReviewStatus =
  | "draft"
  | "in-progress"
  | "completed"
  | "overdue"
  | "pending-approval"
  | "approved"
  | "rejected"
export type ReviewType = "annual" | "quarterly" | "probation" | "mid-year"

export interface PerformanceGoal {
  id: string
  title: string
  description: string
  targetDate: string
  status: "not-started" | "in-progress" | "completed" | "overdue"
  progress: number
  weight: number
}

export interface PerformanceReview {
  id: string
  employeeId: string
  employeeName: string
  reviewerId: string
  reviewerName: string
  reviewType: ReviewType
  reviewPeriod: string
  status: ReviewStatus
  createdDate: string
  dueDate: string
  completedDate?: string
  rejectionReason?: string

  // Rating categories (1-5 scale)
  ratings: {
    jobKnowledge: number
    qualityOfWork: number
    productivity: number
    communication: number
    teamwork: number
    initiative: number
    reliability: number
    problemSolving: number
  }

  // Comments
  strengths: string
  areasForImprovement: string
  goals: PerformanceGoal[]
  overallComments: string
  employeeComments?: string

  // Overall score
  overallRating: number
}

// Demo performance reviews
export const demoPerformanceReviews: PerformanceReview[] = [
  {
    id: "1",
    employeeId: "EMP001",
    employeeName: "John Doe",
    reviewerId: "HR001",
    reviewerName: "Sarah Wilson",
    reviewType: "annual",
    reviewPeriod: "2023",
    status: "approved",
    createdDate: "2024-01-15",
    dueDate: "2024-02-15",
    completedDate: "2024-02-10",
    ratings: {
      jobKnowledge: 4,
      qualityOfWork: 5,
      productivity: 4,
      communication: 4,
      teamwork: 5,
      initiative: 4,
      reliability: 5,
      problemSolving: 4,
    },
    strengths: "Excellent technical skills, strong team player, consistently delivers high-quality work on time.",
    areasForImprovement: "Could take more initiative in leading projects and mentoring junior developers.",
    goals: [
      {
        id: "g1",
        title: "Lead a major project",
        description: "Take ownership of a significant development project from planning to deployment",
        targetDate: "2024-06-30",
        status: "in-progress",
        progress: 60,
        weight: 40,
      },
      {
        id: "g2",
        title: "Mentor junior developers",
        description: "Provide guidance and support to 2-3 junior team members",
        targetDate: "2024-12-31",
        status: "in-progress",
        progress: 30,
        weight: 30,
      },
      {
        id: "g3",
        title: "Complete advanced certification",
        description: "Obtain AWS Solutions Architect certification",
        targetDate: "2024-09-30",
        status: "not-started",
        progress: 0,
        weight: 30,
      },
    ],
    overallComments:
      "John is a valuable team member with strong technical skills. Focus on leadership development for career growth.",
    employeeComments: "Thank you for the feedback. I'm excited to take on more leadership responsibilities.",
    overallRating: 4.25,
  },
  {
    id: "2",
    employeeId: "EMP002",
    employeeName: "Mike Johnson",
    reviewerId: "HR001",
    reviewerName: "Sarah Wilson",
    reviewType: "quarterly",
    reviewPeriod: "Q1 2024",
    status: "pending-approval",
    createdDate: "2024-03-01",
    dueDate: "2024-03-31",
    ratings: {
      jobKnowledge: 3,
      qualityOfWork: 4,
      productivity: 3,
      communication: 4,
      teamwork: 4,
      initiative: 3,
      reliability: 4,
      problemSolving: 3,
    },
    strengths: "Great communication skills, works well with clients, creative problem-solving approach.",
    areasForImprovement: "Need to improve time management and meet deadlines more consistently.",
    goals: [
      {
        id: "g4",
        title: "Improve project delivery",
        description: "Complete all assigned projects within agreed timelines",
        targetDate: "2024-06-30",
        status: "in-progress",
        progress: 40,
        weight: 50,
      },
      {
        id: "g5",
        title: "Client satisfaction",
        description: "Maintain client satisfaction score above 4.5/5",
        targetDate: "2024-06-30",
        status: "in-progress",
        progress: 70,
        weight: 50,
      },
    ],
    overallComments: "Mike shows good potential. Focus on time management and project planning skills.",
    overallRating: 3.5,
  },
  {
    id: "3",
    employeeId: "EMP003",
    employeeName: "Lisa Chen",
    reviewerId: "HR001",
    reviewerName: "Sarah Wilson",
    reviewType: "annual",
    reviewPeriod: "2023",
    status: "approved",
    createdDate: "2024-01-20",
    dueDate: "2024-02-20",
    completedDate: "2024-02-18",
    ratings: {
      jobKnowledge: 5,
      qualityOfWork: 5,
      productivity: 4,
      communication: 5,
      teamwork: 4,
      initiative: 5,
      reliability: 5,
      problemSolving: 5,
    },
    strengths: "Outstanding leadership skills, excellent strategic thinking, drives results consistently.",
    areasForImprovement: "Could delegate more effectively to develop team members.",
    goals: [
      {
        id: "g6",
        title: "Team development",
        description: "Implement team development program and succession planning",
        targetDate: "2024-08-31",
        status: "in-progress",
        progress: 50,
        weight: 40,
      },
      {
        id: "g7",
        title: "Revenue growth",
        description: "Achieve 25% revenue growth in marketing department",
        targetDate: "2024-12-31",
        status: "in-progress",
        progress: 35,
        weight: 60,
      },
    ],
    overallComments: "Lisa is an exceptional performer and leader. Ready for additional responsibilities.",
    employeeComments: "I appreciate the recognition and look forward to contributing more to the organization.",
    overallRating: 4.75,
  },
]

// CRUD operations for performance reviews
export function getAllPerformanceReviews(): PerformanceReview[] {
  if (typeof window === "undefined") return demoPerformanceReviews
  const stored = localStorage.getItem("performanceReviews")
  return stored ? JSON.parse(stored) : demoPerformanceReviews
}

export function getPerformanceReviewsByEmployee(employeeId: string): PerformanceReview[] {
  const reviews = getAllPerformanceReviews()
  return reviews.filter((review) => review.employeeId === employeeId)
}

export function getPerformanceReviewById(id: string): PerformanceReview | undefined {
  const reviews = getAllPerformanceReviews()
  return reviews.find((review) => review.id === id)
}

export function addPerformanceReview(review: Omit<PerformanceReview, "id" | "createdDate">): PerformanceReview {
  const reviews = getAllPerformanceReviews()
  const newReview: PerformanceReview = {
    ...review,
    id: Date.now().toString(),
    createdDate: new Date().toISOString().split("T")[0],
  }
  const updatedReviews = [...reviews, newReview]
  if (typeof window !== "undefined") {
    localStorage.setItem("performanceReviews", JSON.stringify(updatedReviews))
  }
  return newReview
}

export function updatePerformanceReview(id: string, updates: Partial<PerformanceReview>): PerformanceReview | null {
  const reviews = getAllPerformanceReviews()
  const index = reviews.findIndex((review) => review.id === id)
  if (index === -1) return null

  const updatedReview = { ...reviews[index], ...updates }
  reviews[index] = updatedReview

  if (typeof window !== "undefined") {
    localStorage.setItem("performanceReviews", JSON.stringify(reviews))
  }
  return updatedReview
}

export function deletePerformanceReview(id: string): boolean {
  const reviews = getAllPerformanceReviews()
  const filteredReviews = reviews.filter((review) => review.id !== id)

  if (filteredReviews.length === reviews.length) return false

  if (typeof window !== "undefined") {
    localStorage.setItem("performanceReviews", JSON.stringify(filteredReviews))
  }
  return true
}

// Approval functionality
export function approvePerformanceReview(id: string): PerformanceReview | null {
  const reviews = getAllPerformanceReviews()
  const index = reviews.findIndex((review) => review.id === id)
  if (index === -1) return null

  const updatedReview = {
    ...reviews[index],
    status: "approved" as ReviewStatus,
    completedDate: new Date().toISOString().split("T")[0],
  }
  reviews[index] = updatedReview

  if (typeof window !== "undefined") {
    localStorage.setItem("performanceReviews", JSON.stringify(reviews))
  }
  return updatedReview
}

export function rejectPerformanceReview(id: string, reason?: string): PerformanceReview | null {
  const reviews = getAllPerformanceReviews()
  const index = reviews.findIndex((review) => review.id === id)
  if (index === -1) return null

  const updatedReview = {
    ...reviews[index],
    status: "rejected" as ReviewStatus,
    rejectionReason: reason,
  }
  reviews[index] = updatedReview

  if (typeof window !== "undefined") {
    localStorage.setItem("performanceReviews", JSON.stringify(reviews))
  }
  return updatedReview
}

// Utility functions
export function calculateOverallRating(ratings: PerformanceReview["ratings"]): number {
  const values = Object.values(ratings)
  const sum = values.reduce((acc, val) => acc + val, 0)
  return Math.round((sum / values.length) * 100) / 100
}

export function getStatusColor(status: ReviewStatus): string {
  switch (status) {
    case "approved":
      return "text-green-600 bg-green-50"
    case "completed":
      return "text-green-600 bg-green-50"
    case "pending-approval":
      return "text-orange-600 bg-orange-50"
    case "in-progress":
      return "text-blue-600 bg-blue-50"
    case "draft":
      return "text-gray-600 bg-gray-50"
    case "rejected":
      return "text-red-600 bg-red-50"
    case "overdue":
      return "text-red-600 bg-red-50"
    default:
      return "text-gray-600 bg-gray-50"
  }
}

export function getGoalStatusColor(status: PerformanceGoal["status"]): string {
  switch (status) {
    case "completed":
      return "text-green-600 bg-green-50"
    case "in-progress":
      return "text-blue-600 bg-blue-50"
    case "not-started":
      return "text-gray-600 bg-gray-50"
    case "overdue":
      return "text-red-600 bg-red-50"
    default:
      return "text-gray-600 bg-gray-50"
  }
}

export function getRatingLabel(rating: number): string {
  if (rating >= 4.5) return "Excellent"
  if (rating >= 3.5) return "Good"
  if (rating >= 2.5) return "Satisfactory"
  if (rating >= 1.5) return "Needs Improvement"
  return "Unsatisfactory"
}

export function getRatingColor(rating: number): string {
  if (rating >= 4.5) return "text-green-600"
  if (rating >= 3.5) return "text-blue-600"
  if (rating >= 2.5) return "text-yellow-600"
  if (rating >= 1.5) return "text-orange-600"
  return "text-red-600"
}
