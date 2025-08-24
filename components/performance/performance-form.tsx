"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Star, Plus, Trash2 } from "lucide-react"
import {
  addPerformanceReview,
  updatePerformanceReview,
  calculateOverallRating,
  type PerformanceReview,
  type ReviewType,
  type PerformanceGoal,
} from "@/lib/performance"
import { getAllEmployees } from "@/lib/employees"
import { getCurrentUser } from "@/lib/auth"

interface PerformanceFormProps {
  review?: PerformanceReview | null
  isOpen: boolean
  onClose: () => void
  onSave: () => void
}

export function PerformanceForm({ review, isOpen, onClose, onSave }: PerformanceFormProps) {
  const [formData, setFormData] = useState({
    employeeId: "",
    employeeName: "",
    reviewType: "annual" as ReviewType,
    reviewPeriod: "",
    dueDate: "",
    ratings: {
      jobKnowledge: 3,
      qualityOfWork: 3,
      productivity: 3,
      communication: 3,
      teamwork: 3,
      initiative: 3,
      reliability: 3,
      problemSolving: 3,
    },
    strengths: "",
    areasForImprovement: "",
    overallComments: "",
    goals: [] as PerformanceGoal[],
  })

  const [employees] = useState(getAllEmployees())
  const [user] = useState(getCurrentUser())
  const [newGoal, setNewGoal] = useState({
    title: "",
    description: "",
    targetDate: "",
    weight: 33,
  })

  useEffect(() => {
    if (review) {
      setFormData({
        employeeId: review.employeeId,
        employeeName: review.employeeName,
        reviewType: review.reviewType,
        reviewPeriod: review.reviewPeriod,
        dueDate: review.dueDate,
        ratings: review.ratings,
        strengths: review.strengths,
        areasForImprovement: review.areasForImprovement,
        overallComments: review.overallComments,
        goals: review.goals,
      })
    } else {
      // Reset form for new review
      const currentYear = new Date().getFullYear()
      const nextMonth = new Date()
      nextMonth.setMonth(nextMonth.getMonth() + 1)

      setFormData({
        employeeId: "",
        employeeName: "",
        reviewType: "annual",
        reviewPeriod: currentYear.toString(),
        dueDate: nextMonth.toISOString().split("T")[0],
        ratings: {
          jobKnowledge: 3,
          qualityOfWork: 3,
          productivity: 3,
          communication: 3,
          teamwork: 3,
          initiative: 3,
          reliability: 3,
          problemSolving: 3,
        },
        strengths: "",
        areasForImprovement: "",
        overallComments: "",
        goals: [],
      })
    }
  }, [review, isOpen])

  const handleSubmit = (e: React.FormEvent, status: "draft" | "pending-approval" = "draft") => {
    e.preventDefault()
    if (!user) return

    if (status === "pending-approval") {
      const requiredFields = [
        formData.employeeId,
        formData.strengths,
        formData.areasForImprovement,
        formData.overallComments,
      ]

      if (requiredFields.some((field) => !field.trim())) {
        alert(
          "Please fill in all required fields (Employee, Strengths, Areas for Improvement, and Overall Comments) before submitting for approval.",
        )
        return
      }
    }

    const overallRating = calculateOverallRating(formData.ratings)

    const reviewData: Omit<PerformanceReview, "id" | "createdDate"> = {
      employeeId: formData.employeeId,
      employeeName: formData.employeeName,
      reviewerId: user.employeeId,
      reviewerName: user.name,
      reviewType: formData.reviewType,
      reviewPeriod: formData.reviewPeriod,
      status: status, // Use the passed status instead of hardcoded "draft"
      dueDate: formData.dueDate,
      ratings: formData.ratings,
      strengths: formData.strengths,
      areasForImprovement: formData.areasForImprovement,
      goals: formData.goals,
      overallComments: formData.overallComments,
      overallRating,
    }

    if (review) {
      updatePerformanceReview(review.id, reviewData)
    } else {
      addPerformanceReview(reviewData)
    }

    onSave()
    onClose()
  }

  const handleEmployeeChange = (employeeId: string) => {
    const employee = employees.find((emp) => emp.id === employeeId)
    if (employee) {
      setFormData((prev) => ({
        ...prev,
        employeeId: employee.employeeId,
        employeeName: employee.name,
      }))
    }
  }

  const handleRatingChange = (category: string, value: number[]) => {
    setFormData((prev) => ({
      ...prev,
      ratings: {
        ...prev.ratings,
        [category]: value[0],
      },
    }))
  }

  const addGoal = () => {
    if (newGoal.title && newGoal.description) {
      const goal: PerformanceGoal = {
        id: Date.now().toString(),
        title: newGoal.title,
        description: newGoal.description,
        targetDate: newGoal.targetDate,
        status: "not-started",
        progress: 0,
        weight: newGoal.weight,
      }

      setFormData((prev) => ({
        ...prev,
        goals: [...prev.goals, goal],
      }))

      setNewGoal({
        title: "",
        description: "",
        targetDate: "",
        weight: 33,
      })
    }
  }

  const removeGoal = (goalId: string) => {
    setFormData((prev) => ({
      ...prev,
      goals: prev.goals.filter((goal) => goal.id !== goalId),
    }))
  }

  const ratingCategories = [
    { key: "jobKnowledge", label: "Job Knowledge" },
    { key: "qualityOfWork", label: "Quality of Work" },
    { key: "productivity", label: "Productivity" },
    { key: "communication", label: "Communication" },
    { key: "teamwork", label: "Teamwork" },
    { key: "initiative", label: "Initiative" },
    { key: "reliability", label: "Reliability" },
    { key: "problemSolving", label: "Problem Solving" },
  ]

  const overallRating = calculateOverallRating(formData.ratings)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{review ? "Edit Performance Review" : "Create Performance Review"}</DialogTitle>
          <DialogDescription>
            {review ? "Update the performance review details" : "Create a new performance review for an employee"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="employee">Employee</Label>
              <Select value={formData.employeeId} onValueChange={handleEmployeeChange} disabled={!!review}>
                <SelectTrigger>
                  <SelectValue placeholder="Select employee" />
                </SelectTrigger>
                <SelectContent>
                  {employees.map((employee) => (
                    <SelectItem key={employee.id} value={employee.employeeId}>
                      {employee.name} ({employee.employeeId})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="reviewType">Review Type</Label>
              <Select
                value={formData.reviewType}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, reviewType: value as ReviewType }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="annual">Annual Review</SelectItem>
                  <SelectItem value="quarterly">Quarterly Review</SelectItem>
                  <SelectItem value="mid-year">Mid-Year Review</SelectItem>
                  <SelectItem value="probation">Probation Review</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="reviewPeriod">Review Period</Label>
              <Input
                id="reviewPeriod"
                value={formData.reviewPeriod}
                onChange={(e) => setFormData((prev) => ({ ...prev, reviewPeriod: e.target.value }))}
                placeholder="e.g., 2024, Q1 2024"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dueDate">Due Date</Label>
              <Input
                id="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData((prev) => ({ ...prev, dueDate: e.target.value }))}
                required
              />
            </div>
          </div>

          {/* Ratings Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Performance Ratings
                <div className="flex items-center space-x-2">
                  <Star className="h-5 w-5 text-yellow-500" />
                  <span className="text-lg font-bold">{overallRating}/5</span>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {ratingCategories.map((category) => (
                <div key={category.key} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>{category.label}</Label>
                    <Badge variant="outline">{formData.ratings[category.key as keyof typeof formData.ratings]}/5</Badge>
                  </div>
                  <Slider
                    value={[formData.ratings[category.key as keyof typeof formData.ratings]]}
                    onValueChange={(value) => handleRatingChange(category.key, value)}
                    max={5}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Comments Section */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="strengths">Strengths</Label>
              <Textarea
                id="strengths"
                value={formData.strengths}
                onChange={(e) => setFormData((prev) => ({ ...prev, strengths: e.target.value }))}
                placeholder="Highlight the employee's key strengths and achievements..."
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="areasForImprovement">Areas for Improvement</Label>
              <Textarea
                id="areasForImprovement"
                value={formData.areasForImprovement}
                onChange={(e) => setFormData((prev) => ({ ...prev, areasForImprovement: e.target.value }))}
                placeholder="Identify areas where the employee can improve..."
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="overallComments">Overall Comments</Label>
              <Textarea
                id="overallComments"
                value={formData.overallComments}
                onChange={(e) => setFormData((prev) => ({ ...prev, overallComments: e.target.value }))}
                placeholder="Provide overall feedback and recommendations..."
                rows={3}
              />
            </div>
          </div>

          {/* Goals Section */}
          <Card>
            <CardHeader>
              <CardTitle>Performance Goals</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {formData.goals.map((goal) => (
                <div key={goal.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium">{goal.title}</div>
                    <div className="text-sm text-muted-foreground">{goal.description}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Due: {new Date(goal.targetDate).toLocaleDateString()} • Weight: {goal.weight}%
                    </div>
                  </div>
                  <Button type="button" variant="ghost" size="sm" onClick={() => removeGoal(goal.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}

              <div className="space-y-3 p-3 border-2 border-dashed rounded-lg">
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    placeholder="Goal title"
                    value={newGoal.title}
                    onChange={(e) => setNewGoal((prev) => ({ ...prev, title: e.target.value }))}
                  />
                  <Input
                    type="date"
                    value={newGoal.targetDate}
                    onChange={(e) => setNewGoal((prev) => ({ ...prev, targetDate: e.target.value }))}
                  />
                </div>
                <Textarea
                  placeholder="Goal description"
                  value={newGoal.description}
                  onChange={(e) => setNewGoal((prev) => ({ ...prev, description: e.target.value }))}
                  rows={2}
                />
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Label className="text-sm">Weight:</Label>
                    <Input
                      type="number"
                      min="1"
                      max="100"
                      value={newGoal.weight}
                      onChange={(e) => setNewGoal((prev) => ({ ...prev, weight: Number.parseInt(e.target.value) }))}
                      className="w-20"
                    />
                    <span className="text-sm text-muted-foreground">%</span>
                  </div>
                  <Button type="button" onClick={addGoal} size="sm">
                    <Plus className="h-4 w-4 mr-1" />
                    Add Goal
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="button" variant="secondary" onClick={(e) => handleSubmit(e, "draft")}>
              Save as Draft
            </Button>
            <Button type="button" onClick={(e) => handleSubmit(e, "pending-approval")}>
              Submit for Approval
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
