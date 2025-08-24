export interface Employee {
  id: string
  employeeId: string
  name: string
  email: string
  phone: string
  department: string
  position: string
  salary: number
  hireDate: string
  status: "active" | "inactive" | "terminated"
  manager?: string
  avatar?: string
  address: string
  emergencyContact: {
    name: string
    phone: string
    relationship: string
  }
}

// Demo employee data
export const demoEmployees: Employee[] = [
  {
    id: "1",
    employeeId: "EMP001",
    name: "John Doe",
    email: "john.doe@company.com",
    phone: "+1 (555) 123-4567",
    department: "Engineering",
    position: "Software Developer",
    salary: 85000,
    hireDate: "2022-03-15",
    status: "active",
    manager: "Sarah Wilson",
    avatar: "/professional-male-avatar.png",
    address: "123 Main St, New York, NY 10001",
    emergencyContact: {
      name: "Jane Doe",
      phone: "+1 (555) 987-6543",
      relationship: "Spouse",
    },
  },
  {
    id: "2",
    employeeId: "HR001",
    name: "Sarah Wilson",
    email: "sarah.wilson@company.com",
    phone: "+1 (555) 234-5678",
    department: "Human Resources",
    position: "HR Manager",
    salary: 95000,
    hireDate: "2021-01-10",
    status: "active",
    avatar: "/professional-female-avatar.png",
    address: "456 Oak Ave, New York, NY 10002",
    emergencyContact: {
      name: "Michael Wilson",
      phone: "+1 (555) 876-5432",
      relationship: "Spouse",
    },
  },
  {
    id: "3",
    employeeId: "EMP002",
    name: "Mike Johnson",
    email: "mike.johnson@company.com",
    phone: "+1 (555) 345-6789",
    department: "Marketing",
    position: "Marketing Specialist",
    salary: 65000,
    hireDate: "2022-07-20",
    status: "active",
    manager: "Lisa Chen",
    avatar: "/professional-male-avatar.png",
    address: "789 Pine St, New York, NY 10003",
    emergencyContact: {
      name: "Susan Johnson",
      phone: "+1 (555) 765-4321",
      relationship: "Mother",
    },
  },
  {
    id: "4",
    employeeId: "EMP003",
    name: "Lisa Chen",
    email: "lisa.chen@company.com",
    phone: "+1 (555) 456-7890",
    department: "Marketing",
    position: "Marketing Manager",
    salary: 80000,
    hireDate: "2021-09-05",
    status: "active",
    avatar: "/professional-female-avatar.png",
    address: "321 Elm St, New York, NY 10004",
    emergencyContact: {
      name: "David Chen",
      phone: "+1 (555) 654-3210",
      relationship: "Spouse",
    },
  },
  {
    id: "5",
    employeeId: "EMP004",
    name: "Robert Brown",
    email: "robert.brown@company.com",
    phone: "+1 (555) 567-8901",
    department: "Finance",
    position: "Financial Analyst",
    salary: 70000,
    hireDate: "2023-02-14",
    status: "active",
    manager: "Sarah Wilson",
    avatar: "/professional-male-avatar.png",
    address: "654 Maple Ave, New York, NY 10005",
    emergencyContact: {
      name: "Mary Brown",
      phone: "+1 (555) 543-2109",
      relationship: "Wife",
    },
  },
]

// CRUD operations for employees
export function getAllEmployees(): Employee[] {
  if (typeof window === "undefined") return demoEmployees
  const stored = localStorage.getItem("employees")
  return stored ? JSON.parse(stored) : demoEmployees
}

export function getEmployeeById(id: string): Employee | undefined {
  const employees = getAllEmployees()
  return employees.find((emp) => emp.id === id)
}

export function addEmployee(employee: Omit<Employee, "id">): Employee {
  const employees = getAllEmployees()
  const newEmployee: Employee = {
    ...employee,
    id: Date.now().toString(),
  }
  const updatedEmployees = [...employees, newEmployee]
  if (typeof window !== "undefined") {
    localStorage.setItem("employees", JSON.stringify(updatedEmployees))
  }
  return newEmployee
}

export function updateEmployee(id: string, updates: Partial<Employee>): Employee | null {
  const employees = getAllEmployees()
  const index = employees.findIndex((emp) => emp.id === id)
  if (index === -1) return null

  const updatedEmployee = { ...employees[index], ...updates }
  employees[index] = updatedEmployee

  if (typeof window !== "undefined") {
    localStorage.setItem("employees", JSON.stringify(employees))
  }
  return updatedEmployee
}

export function deleteEmployee(id: string): boolean {
  const employees = getAllEmployees()
  const filteredEmployees = employees.filter((emp) => emp.id !== id)

  if (filteredEmployees.length === employees.length) return false

  if (typeof window !== "undefined") {
    localStorage.setItem("employees", JSON.stringify(filteredEmployees))
  }
  return true
}

export function getEmployeesByDepartment(department: string): Employee[] {
  const employees = getAllEmployees()
  return employees.filter((emp) => emp.department === department)
}

export function getDepartments(): string[] {
  const employees = getAllEmployees()
  const departments = [...new Set(employees.map((emp) => emp.department))]
  return departments.sort()
}
