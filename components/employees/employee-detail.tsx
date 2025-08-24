"use client"

import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { X, Mail, Phone, MapPin, Calendar, Building, User, CreditCard } from "lucide-react"
import type { Employee } from "@/lib/employees"

interface EmployeeDetailProps {
  employee: Employee
  isOpen: boolean
  onClose: () => void
  onEdit: () => void
}

export function EmployeeDetail({ employee, isOpen, onClose, onEdit }: EmployeeDetailProps) {
  if (!isOpen) return null

  const getStatusBadge = (status: Employee["status"]) => {
    switch (status) {
      case "active":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800 border-green-200">
            Active
          </Badge>
        )
      case "inactive":
        return <Badge variant="secondary">Inactive</Badge>
      case "terminated":
        return <Badge variant="destructive">Terminated</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle className="text-xl">Employee Details</CardTitle>
            <CardDescription>Complete information for {employee.name}</CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Profile Section */}
          <div className="flex items-start space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={employee.avatar || "/placeholder.svg"} alt={employee.name} />
              <AvatarFallback className="text-lg">{getInitials(employee.name)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-semibold">{employee.name}</h3>
                {getStatusBadge(employee.status)}
              </div>
              <p className="text-muted-foreground">{employee.position}</p>
              <p className="text-sm text-muted-foreground font-mono">ID: {employee.employeeId}</p>
            </div>
          </div>

          <Separator />

          {/* Contact Information */}
          <div className="space-y-4">
            <h4 className="text-lg font-medium flex items-center">
              <User className="h-5 w-5 mr-2" />
              Contact Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Email</p>
                  <p className="text-sm text-muted-foreground">{employee.email}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Phone</p>
                  <p className="text-sm text-muted-foreground">{employee.phone || "Not provided"}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Address</p>
                  <p className="text-sm text-muted-foreground">{employee.address || "Not provided"}</p>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Employment Information */}
          <div className="space-y-4">
            <h4 className="text-lg font-medium flex items-center">
              <Building className="h-5 w-5 mr-2" />
              Employment Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium">Department</p>
                <p className="text-sm text-muted-foreground">{employee.department}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Position</p>
                <p className="text-sm text-muted-foreground">{employee.position}</p>
              </div>
              <div className="flex items-center space-x-3">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Hire Date</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(employee.hireDate).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <CreditCard className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Salary</p>
                  <p className="text-sm text-muted-foreground">
                    {employee.salary ? `$${employee.salary.toLocaleString()}` : "Not disclosed"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button onClick={onEdit}>Edit Employee</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
