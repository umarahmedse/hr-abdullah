"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { EmployeeList } from "@/components/employees/employee-list"
import { EmployeeForm } from "@/components/employees/employee-form"
import { EmployeeDetail } from "@/components/employees/employee-detail"
import type { Employee } from "@/lib/employees"

export default function EmployeesPage() {
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  const handleAddEmployee = () => {
    setSelectedEmployee(null)
    setIsFormOpen(true)
  }

  const handleEditEmployee = (employee: Employee) => {
    setSelectedEmployee(employee)
    setIsFormOpen(true)
  }

  const handleViewEmployee = (employee: Employee) => {
    setSelectedEmployee(employee)
    setIsDetailOpen(true)
  }

  const handleFormClose = () => {
    setIsFormOpen(false)
    setSelectedEmployee(null)
  }

  const handleDetailClose = () => {
    setIsDetailOpen(false)
    setSelectedEmployee(null)
  }

  const handleEditFromDetail = () => {
    setIsDetailOpen(false)
    setIsFormOpen(true)
  }

  const handleFormSave = () => {
    setRefreshKey((prev) => prev + 1) // Force refresh of employee list
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <EmployeeList
          key={refreshKey}
          onAddEmployee={handleAddEmployee}
          onEditEmployee={handleEditEmployee}
          onViewEmployee={handleViewEmployee}
        />

        <EmployeeForm
          employee={selectedEmployee}
          isOpen={isFormOpen}
          onClose={handleFormClose}
          onSave={handleFormSave}
        />

        {selectedEmployee && (
          <EmployeeDetail
            employee={selectedEmployee}
            isOpen={isDetailOpen}
            onClose={handleDetailClose}
            onEdit={handleEditFromDetail}
          />
        )}
      </div>
    </DashboardLayout>
  )
}
