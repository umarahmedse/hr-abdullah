"use client"

import type React from "react"

import { useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Building, Plus, Edit, Trash2, Users } from "lucide-react"
import { getEmployeesByDepartment } from "@/lib/employees"

interface Department {
  id: string
  name: string
  description: string
  manager?: string
  employeeCount: number
  budget?: number
}

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState<Department[]>([
    {
      id: "1",
      name: "Human Resources",
      description: "Manages employee relations, recruitment, and organizational development",
      manager: "Sarah Johnson",
      employeeCount: getEmployeesByDepartment("Human Resources").length,
      budget: 500000,
    },
    {
      id: "2",
      name: "Engineering",
      description: "Software development and technical infrastructure",
      manager: "Mike Chen",
      employeeCount: getEmployeesByDepartment("Engineering").length,
      budget: 2000000,
    },
    {
      id: "3",
      name: "Marketing",
      description: "Brand management, advertising, and customer acquisition",
      manager: "Emily Davis",
      employeeCount: getEmployeesByDepartment("Marketing").length,
      budget: 800000,
    },
    {
      id: "4",
      name: "Finance",
      description: "Financial planning, accounting, and budget management",
      manager: "David Wilson",
      employeeCount: getEmployeesByDepartment("Finance").length,
      budget: 600000,
    },
  ])

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    manager: "",
    budget: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (editingDepartment) {
      // Update existing department
      setDepartments((prev) =>
        prev.map((dept) =>
          dept.id === editingDepartment.id
            ? {
                ...dept,
                name: formData.name,
                description: formData.description,
                manager: formData.manager,
                budget: Number.parseFloat(formData.budget) || 0,
              }
            : dept,
        ),
      )
    } else {
      // Create new department
      const newDepartment: Department = {
        id: Date.now().toString(),
        name: formData.name,
        description: formData.description,
        manager: formData.manager,
        employeeCount: 0,
        budget: Number.parseFloat(formData.budget) || 0,
      }
      setDepartments((prev) => [...prev, newDepartment])
    }

    setIsDialogOpen(false)
    setEditingDepartment(null)
    setFormData({ name: "", description: "", manager: "", budget: "" })
  }

  const handleEdit = (department: Department) => {
    setEditingDepartment(department)
    setFormData({
      name: department.name,
      description: department.description,
      manager: department.manager || "",
      budget: department.budget?.toString() || "",
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (departmentId: string) => {
    setDepartments((prev) => prev.filter((dept) => dept.id !== departmentId))
  }

  const openCreateDialog = () => {
    setEditingDepartment(null)
    setFormData({ name: "", description: "", manager: "", budget: "" })
    setIsDialogOpen(true)
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Department Management</h1>
            <p className="text-muted-foreground">Manage organizational departments and their details</p>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={openCreateDialog}>
                <Plus className="h-4 w-4 mr-2" />
                Add Department
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingDepartment ? "Edit Department" : "Create New Department"}</DialogTitle>
                <DialogDescription>
                  {editingDepartment ? "Update department information" : "Add a new department to your organization"}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Department Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g., Human Resources"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                      placeholder="Brief description of the department's role"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="manager">Department Manager</Label>
                    <Input
                      id="manager"
                      value={formData.manager}
                      onChange={(e) => setFormData((prev) => ({ ...prev, manager: e.target.value }))}
                      placeholder="Manager name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="budget">Annual Budget ($)</Label>
                    <Input
                      id="budget"
                      type="number"
                      value={formData.budget}
                      onChange={(e) => setFormData((prev) => ({ ...prev, budget: e.target.value }))}
                      placeholder="0"
                    />
                  </div>
                </div>
                <DialogFooter className="mt-6">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">{editingDepartment ? "Update" : "Create"} Department</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {departments.map((department) => (
            <Card key={department.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Building className="h-5 w-5 text-primary" />
                    <CardTitle className="text-lg">{department.name}</CardTitle>
                  </div>
                  <div className="flex space-x-1">
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(department)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(department.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <CardDescription className="text-sm">{department.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {department.manager && (
                  <div>
                    <p className="text-sm font-medium text-foreground">Manager</p>
                    <p className="text-sm text-muted-foreground">{department.manager}</p>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Employees</span>
                  </div>
                  <Badge variant="secondary">{department.employeeCount}</Badge>
                </div>

                {department.budget && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Annual Budget</span>
                    <span className="text-sm font-medium text-foreground">${department.budget.toLocaleString()}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}
