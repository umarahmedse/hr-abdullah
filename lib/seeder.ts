export interface DemoUser {
  id: string
  email: string
  password: string
  name: string
  role: "employee" | "hr"
  avatar: string
}

export interface DemoEmployee {
  id: string
  name: string
  email: string
  phone: string
  department: string
  position: string
  salary: number
  hireDate: string
  status: "active" | "inactive"
  avatar: string
  address: string
  emergencyContact: string
  emergencyPhone: string
}

export interface DemoLeaveRequest {
  id: string
  employeeId: string
  employeeName: string
  type: string
  startDate: string
  endDate: string
  days: number
  reason: string
  status: "pending" | "approved" | "rejected"
  appliedDate: string
  hrComments?: string
}

export interface DemoPerformanceReview {
  id: string
  employeeId: string
  employeeName: string
  reviewPeriod: string
  overallRating: number
  ratings: {
    productivity: number
    quality: number
    communication: number
    teamwork: number
    leadership: number
    initiative: number
    reliability: number
    adaptability: number
  }
  goals: Array<{
    id: string
    title: string
    description: string
    progress: number
    status: "not-started" | "in-progress" | "completed"
  }>
  strengths: string
  improvements: string
  comments: string
  reviewDate: string
  reviewerId: string
  reviewerName: string
}

export interface DemoFeedback {
  id: string
  type: "complaint" | "suggestion" | "accident"
  title: string
  description: string
  priority: "low" | "medium" | "high" | "critical"
  status: "open" | "in-progress" | "resolved" | "closed"
  submittedBy: string
  submittedDate: string
  assignedTo?: string
  resolution?: string
  anonymous: boolean
  category: string
  location?: string
  injuryType?: string
  witnessInfo?: string
}

// Demo Users Data
export const demoUsers: DemoUser[] = [
  {
    id: "1",
    email: "john.doe@company.com",
    password: "password123",
    name: "John Doe",
    role: "employee",
    avatar: "/professional-male-avatar.png",
  },
  {
    id: "2",
    email: "sarah.wilson@company.com",
    password: "password123",
    name: "Sarah Wilson",
    role: "hr",
    avatar: "/professional-female-avatar.png",
  },
  {
    id: "3",
    email: "mike.johnson@company.com",
    password: "password123",
    name: "Mike Johnson",
    role: "employee",
    avatar: "/professional-male-avatar.png",
  },
  {
    id: "4",
    email: "emily.davis@company.com",
    password: "password123",
    name: "Emily Davis",
    role: "employee",
    avatar: "/professional-female-avatar.png",
  },
  {
    id: "5",
    email: "alex.brown@company.com",
    password: "password123",
    name: "Alex Brown",
    role: "hr",
    avatar: "/professional-male-avatar.png",
  },
]

// Demo Employees Data
export const demoEmployees: DemoEmployee[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john.doe@company.com",
    phone: "+1 (555) 123-4567",
    department: "Engineering",
    position: "Senior Software Developer",
    salary: 95000,
    hireDate: "2022-03-15",
    status: "active",
    avatar: "/professional-male-avatar.png",
    address: "123 Main St, San Francisco, CA 94105",
    emergencyContact: "Jane Doe",
    emergencyPhone: "+1 (555) 987-6543",
  },
  {
    id: "3",
    name: "Mike Johnson",
    email: "mike.johnson@company.com",
    phone: "+1 (555) 234-5678",
    department: "Marketing",
    position: "Marketing Manager",
    salary: 75000,
    hireDate: "2021-08-20",
    status: "active",
    avatar: "/professional-male-avatar.png",
    address: "456 Oak Ave, San Francisco, CA 94102",
    emergencyContact: "Lisa Johnson",
    emergencyPhone: "+1 (555) 876-5432",
  },
  {
    id: "4",
    name: "Emily Davis",
    email: "emily.davis@company.com",
    phone: "+1 (555) 345-6789",
    department: "Design",
    position: "UX Designer",
    salary: 80000,
    hireDate: "2023-01-10",
    status: "active",
    avatar: "/professional-female-avatar.png",
    address: "789 Pine St, San Francisco, CA 94108",
    emergencyContact: "Robert Davis",
    emergencyPhone: "+1 (555) 765-4321",
  },
  {
    id: "6",
    name: "David Wilson",
    email: "david.wilson@company.com",
    phone: "+1 (555) 456-7890",
    department: "Sales",
    position: "Sales Representative",
    salary: 65000,
    hireDate: "2022-11-05",
    status: "active",
    avatar: "/professional-male-avatar.png",
    address: "321 Elm St, San Francisco, CA 94103",
    emergencyContact: "Mary Wilson",
    emergencyPhone: "+1 (555) 654-3210",
  },
  {
    id: "7",
    name: "Lisa Chen",
    email: "lisa.chen@company.com",
    phone: "+1 (555) 567-8901",
    department: "Finance",
    position: "Financial Analyst",
    salary: 70000,
    hireDate: "2021-06-12",
    status: "active",
    avatar: "/professional-female-avatar.png",
    address: "654 Maple Ave, San Francisco, CA 94104",
    emergencyContact: "James Chen",
    emergencyPhone: "+1 (555) 543-2109",
  },
  {
    id: "8",
    name: "Tom Rodriguez",
    email: "tom.rodriguez@company.com",
    phone: "+1 (555) 678-9012",
    department: "Engineering",
    position: "DevOps Engineer",
    salary: 90000,
    hireDate: "2020-09-18",
    status: "active",
    avatar: "/professional-male-avatar.png",
    address: "987 Cedar St, San Francisco, CA 94107",
    emergencyContact: "Maria Rodriguez",
    emergencyPhone: "+1 (555) 432-1098",
  },
]

// Demo Leave Requests Data
export const demoLeaveRequests: DemoLeaveRequest[] = [
  {
    id: "1",
    employeeId: "1",
    employeeName: "John Doe",
    type: "Annual Leave",
    startDate: "2024-03-15",
    endDate: "2024-03-20",
    days: 5,
    reason: "Family vacation",
    status: "approved",
    appliedDate: "2024-02-28",
    hrComments: "Approved. Enjoy your vacation!",
  },
  {
    id: "2",
    employeeId: "3",
    employeeName: "Mike Johnson",
    type: "Sick Leave",
    startDate: "2024-03-10",
    endDate: "2024-03-12",
    days: 2,
    reason: "Medical appointment and recovery",
    status: "approved",
    appliedDate: "2024-03-08",
    hrComments: "Get well soon!",
  },
  {
    id: "3",
    employeeId: "4",
    employeeName: "Emily Davis",
    type: "Personal Leave",
    startDate: "2024-03-25",
    endDate: "2024-03-25",
    days: 1,
    reason: "Personal matters",
    status: "pending",
    appliedDate: "2024-03-12",
  },
  {
    id: "4",
    employeeId: "6",
    employeeName: "David Wilson",
    type: "Annual Leave",
    startDate: "2024-04-01",
    endDate: "2024-04-05",
    days: 5,
    reason: "Spring break with family",
    status: "pending",
    appliedDate: "2024-03-14",
  },
]

// Demo Performance Reviews Data
export const demoPerformanceReviews: DemoPerformanceReview[] = [
  {
    id: "1",
    employeeId: "1",
    employeeName: "John Doe",
    reviewPeriod: "Q4 2023",
    overallRating: 4.2,
    ratings: {
      productivity: 4,
      quality: 5,
      communication: 4,
      teamwork: 4,
      leadership: 4,
      initiative: 4,
      reliability: 5,
      adaptability: 4,
    },
    goals: [
      {
        id: "1",
        title: "Complete React Migration",
        description: "Migrate legacy components to React",
        progress: 85,
        status: "in-progress",
      },
      {
        id: "2",
        title: "Mentor Junior Developers",
        description: "Guide 2 junior developers",
        progress: 100,
        status: "completed",
      },
    ],
    strengths: "Excellent technical skills, reliable delivery, good team collaboration",
    improvements: "Could improve presentation skills and take more leadership initiatives",
    comments: "John has been a valuable team member with consistent high-quality work.",
    reviewDate: "2024-01-15",
    reviewerId: "2",
    reviewerName: "Sarah Wilson",
  },
  {
    id: "2",
    employeeId: "3",
    employeeName: "Mike Johnson",
    reviewPeriod: "Q4 2023",
    overallRating: 3.8,
    ratings: {
      productivity: 4,
      quality: 4,
      communication: 5,
      teamwork: 4,
      leadership: 4,
      initiative: 3,
      reliability: 4,
      adaptability: 3,
    },
    goals: [
      {
        id: "3",
        title: "Launch Product Campaign",
        description: "Lead Q1 product marketing campaign",
        progress: 75,
        status: "in-progress",
      },
      {
        id: "4",
        title: "Improve Analytics Skills",
        description: "Complete Google Analytics certification",
        progress: 100,
        status: "completed",
      },
    ],
    strengths: "Great communication skills, creative thinking, strong client relationships",
    improvements: "Could be more proactive in suggesting new initiatives",
    comments: "Mike brings great energy to the marketing team and delivers solid results.",
    reviewDate: "2024-01-20",
    reviewerId: "2",
    reviewerName: "Sarah Wilson",
  },
]

// Demo Feedback Data
export const demoFeedback: DemoFeedback[] = [
  {
    id: "1",
    type: "complaint",
    title: "Noise Level in Open Office",
    description:
      "The noise level in the open office area has been consistently high, making it difficult to concentrate on work. Phone calls and conversations are very distracting.",
    priority: "medium",
    status: "in-progress",
    submittedBy: "Anonymous",
    submittedDate: "2024-03-10",
    assignedTo: "Sarah Wilson",
    anonymous: true,
    category: "Workplace Environment",
  },
  {
    id: "2",
    type: "suggestion",
    title: "Implement Flexible Working Hours",
    description:
      "I suggest implementing flexible working hours to improve work-life balance. Many employees would benefit from being able to start earlier or later based on their personal schedules.",
    priority: "low",
    status: "open",
    submittedBy: "John Doe",
    submittedDate: "2024-03-12",
    anonymous: false,
    category: "Work Policy",
  },
  {
    id: "3",
    type: "accident",
    title: "Slip in Kitchen Area",
    description:
      "I slipped on a wet floor in the kitchen area near the coffee machine. The floor was wet from a spill that wasn't properly cleaned up.",
    priority: "high",
    status: "resolved",
    submittedBy: "Emily Davis",
    submittedDate: "2024-03-08",
    assignedTo: "Alex Brown",
    resolution: "Added warning signs and improved cleaning procedures. Kitchen area now checked hourly.",
    anonymous: false,
    category: "Safety",
    location: "Kitchen Area - Near Coffee Machine",
    injuryType: "Minor bruising on knee",
    witnessInfo: "Mike Johnson witnessed the incident",
  },
  {
    id: "4",
    type: "suggestion",
    title: "Add More Parking Spaces",
    description:
      "The parking lot is often full, and employees have to park on the street. Adding more parking spaces would be very helpful.",
    priority: "medium",
    status: "open",
    submittedBy: "David Wilson",
    submittedDate: "2024-03-14",
    anonymous: false,
    category: "Facilities",
  },
  {
    id: "5",
    type: "complaint",
    title: "Broken Air Conditioning",
    description:
      "The air conditioning in the east wing has been broken for over a week. It's getting very uncomfortable to work in that area.",
    priority: "high",
    status: "in-progress",
    submittedBy: "Lisa Chen",
    submittedDate: "2024-03-11",
    assignedTo: "Alex Brown",
    anonymous: false,
    category: "Facilities",
  },
]

// Seeder Functions
export const seedDemoData = () => {
  // Clear existing data
  localStorage.removeItem("hrms_users")
  localStorage.removeItem("hrms_employees")
  localStorage.removeItem("hrms_leave_requests")
  localStorage.removeItem("hrms_performance_reviews")
  localStorage.removeItem("hrms_feedback")
  localStorage.removeItem("hrms_current_user")

  // Seed new data
  localStorage.setItem("hrms_users", JSON.stringify(demoUsers))
  localStorage.setItem("hrms_employees", JSON.stringify(demoEmployees))
  localStorage.setItem("hrms_leave_requests", JSON.stringify(demoLeaveRequests))
  localStorage.setItem("hrms_performance_reviews", JSON.stringify(demoPerformanceReviews))
  localStorage.setItem("hrms_feedback", JSON.stringify(demoFeedback))

  console.log("Demo data seeded successfully!")
}

export const clearAllData = () => {
  localStorage.removeItem("hrms_users")
  localStorage.removeItem("hrms_employees")
  localStorage.removeItem("hrms_leave_requests")
  localStorage.removeItem("hrms_performance_reviews")
  localStorage.removeItem("hrms_feedback")
  localStorage.removeItem("hrms_current_user")

  console.log("All HRMS data cleared!")
}

export const initializeApp = () => {
  // Check if data exists, if not, seed it
  const existingUsers = localStorage.getItem("hrms_users")
  if (!existingUsers) {
    seedDemoData()
    return true // Data was seeded
  }
  return false // Data already exists
}

// Export demo data for use in other components;
