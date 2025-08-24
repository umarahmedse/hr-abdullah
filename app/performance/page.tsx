"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { PerformanceList } from "@/components/performance/performance-list"
import { PerformanceForm } from "@/components/performance/performance-form"
import type { PerformanceReview } from "@/lib/performance"

export default function PerformancePage() {
  const [selectedReview, setSelectedReview] = useState<PerformanceReview | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  const handleAddReview = () => {
    setSelectedReview(null)
    setIsFormOpen(true)
  }

  const handleEditReview = (review: PerformanceReview) => {
    setSelectedReview(review)
    setIsFormOpen(true)
  }

  const handleViewReview = (review: PerformanceReview) => {
    // For now, just edit - could implement a view-only modal later
    handleEditReview(review)
  }

  const handleFormClose = () => {
    setIsFormOpen(false)
    setSelectedReview(null)
  }

  const handleFormSave = () => {
    setRefreshKey((prev) => prev + 1) // Force refresh of review list
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <PerformanceList
          key={refreshKey}
          onAddReview={handleAddReview}
          onEditReview={handleEditReview}
          onViewReview={handleViewReview}
        />

        <PerformanceForm
          review={selectedReview}
          isOpen={isFormOpen}
          onClose={handleFormClose}
          onSave={handleFormSave}
        />
      </div>
    </DashboardLayout>
  )
}
