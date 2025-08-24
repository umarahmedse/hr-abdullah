"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { FeedbackList } from "@/components/feedback/feedback-list"
import { FeedbackForm } from "@/components/feedback/feedback-form"
import type { FeedbackType } from "@/lib/feedback"

export default function ComplaintsPage() {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [formType, setFormType] = useState<FeedbackType>("complaint")
  const [refreshKey, setRefreshKey] = useState(0)

  const handleAddFeedback = (type: FeedbackType = "complaint") => {
    setFormType(type)
    setIsFormOpen(true)
  }

  const handleFormClose = () => {
    setIsFormOpen(false)
  }

  const handleFormSave = () => {
    setRefreshKey((prev) => prev + 1) // Force refresh of feedback list
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <FeedbackList key={refreshKey} onAddFeedback={handleAddFeedback} />

        <FeedbackForm isOpen={isFormOpen} onClose={handleFormClose} onSave={handleFormSave} defaultType={formType} />
      </div>
    </DashboardLayout>
  )
}
