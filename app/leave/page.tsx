"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { LeaveList } from "@/components/leave/leave-list"
import { LeaveRequestForm } from "@/components/leave/leave-request-form"
import { LeaveDetail } from "@/components/leave/leave-detail"
import type { LeaveRequest } from "@/lib/leave"

export default function LeavePage() {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [selectedLeave, setSelectedLeave] = useState<LeaveRequest | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  const handleAddRequest = () => {
    setIsFormOpen(true)
  }

  const handleViewRequest = (request: LeaveRequest) => {
    setSelectedLeave(request)
    setIsDetailOpen(true)
  }

  const handleFormClose = () => {
    setIsFormOpen(false)
  }

  const handleDetailClose = () => {
    setIsDetailOpen(false)
    setSelectedLeave(null)
  }

  const handleEditFromDetail = () => {
    setIsDetailOpen(false)
    // Could implement edit functionality here in the future
  }

  const handleFormSave = () => {
    setRefreshKey((prev) => prev + 1) // Force refresh of leave list
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <LeaveList key={refreshKey} onAddRequest={handleAddRequest} onViewRequest={handleViewRequest} />

        <LeaveRequestForm isOpen={isFormOpen} onClose={handleFormClose} onSave={handleFormSave} />

        {selectedLeave && (
          <LeaveDetail
            leave={selectedLeave}
            isOpen={isDetailOpen}
            onClose={handleDetailClose}
            onEdit={handleEditFromDetail}
          />
        )}
      </div>
    </DashboardLayout>
  )
}
