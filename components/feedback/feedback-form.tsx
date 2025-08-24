"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MessageSquare, Lightbulb, AlertTriangle } from "lucide-react"
import { addFeedback, type FeedbackType, type Priority, type Severity } from "@/lib/feedback"
import { getCurrentUser } from "@/lib/auth"

interface FeedbackFormProps {
  isOpen: boolean
  onClose: () => void
  onSave: () => void
  defaultType?: FeedbackType
}

export function FeedbackForm({ isOpen, onClose, onSave, defaultType = "complaint" }: FeedbackFormProps) {
  const [activeTab, setActiveTab] = useState<FeedbackType>(defaultType)
  const [user] = useState(getCurrentUser())

  // Common fields
  const [commonData, setCommonData] = useState({
    title: "",
    description: "",
    priority: "medium" as Priority,
  })

  // Complaint specific fields
  const [complaintData, setComplaintData] = useState({
    category: "workplace" as const,
    anonymous: false,
  })

  // Suggestion specific fields
  const [suggestionData, setSuggestionData] = useState({
    category: "process" as const,
    estimatedImpact: "medium" as const,
    implementationCost: "medium" as const,
  })

  // Accident specific fields
  const [accidentData, setAccidentData] = useState({
    incidentDate: "",
    location: "",
    severity: "minor" as Severity,
    injuryType: "none" as const,
    witnessNames: "",
    medicalAttention: false,
    reportedToAuthorities: false,
    immediateActions: "",
  })

  useEffect(() => {
    if (!isOpen) {
      // Reset all forms when dialog closes
      setCommonData({
        title: "",
        description: "",
        priority: "medium",
      })
      setComplaintData({
        category: "workplace",
        anonymous: false,
      })
      setSuggestionData({
        category: "process",
        estimatedImpact: "medium",
        implementationCost: "medium",
      })
      setAccidentData({
        incidentDate: "",
        location: "",
        severity: "minor",
        injuryType: "none",
        witnessNames: "",
        medicalAttention: false,
        reportedToAuthorities: false,
        immediateActions: "",
      })
    }
  }, [isOpen])

  useEffect(() => {
    setActiveTab(defaultType)
  }, [defaultType])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    const baseData = {
      employeeId: user.employeeId,
      employeeName: user.name,
      status: "open" as const,
      ...commonData,
    }

    let feedbackData: any = baseData

    switch (activeTab) {
      case "complaint":
        feedbackData = {
          ...baseData,
          type: "complaint",
          ...complaintData,
        }
        break
      case "suggestion":
        feedbackData = {
          ...baseData,
          type: "suggestion",
          ...suggestionData,
        }
        break
      case "accident":
        feedbackData = {
          ...baseData,
          type: "accident",
          ...accidentData,
        }
        break
    }

    addFeedback(feedbackData)
    onSave()
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Submit Feedback</DialogTitle>
          <DialogDescription>Choose the type of feedback you'd like to submit</DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as FeedbackType)}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="complaint" className="flex items-center space-x-2">
              <MessageSquare className="h-4 w-4" />
              <span>Complaint</span>
            </TabsTrigger>
            <TabsTrigger value="suggestion" className="flex items-center space-x-2">
              <Lightbulb className="h-4 w-4" />
              <span>Suggestion</span>
            </TabsTrigger>
            <TabsTrigger value="accident" className="flex items-center space-x-2">
              <AlertTriangle className="h-4 w-4" />
              <span>Accident</span>
            </TabsTrigger>
          </TabsList>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Common Fields */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={commonData.title}
                  onChange={(e) => setCommonData((prev) => ({ ...prev, title: e.target.value }))}
                  placeholder="Brief summary of your feedback"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={commonData.description}
                  onChange={(e) => setCommonData((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Provide detailed information..."
                  rows={4}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select
                  value={commonData.priority}
                  onValueChange={(value) => setCommonData((prev) => ({ ...prev, priority: value as Priority }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Type-specific Fields */}
            <TabsContent value="complaint" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Complaint Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="complaintCategory">Category</Label>
                    <Select
                      value={complaintData.category}
                      onValueChange={(value) => setComplaintData((prev) => ({ ...prev, category: value as any }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="workplace">Workplace Environment</SelectItem>
                        <SelectItem value="harassment">Harassment</SelectItem>
                        <SelectItem value="discrimination">Discrimination</SelectItem>
                        <SelectItem value="policy">Policy Issues</SelectItem>
                        <SelectItem value="management">Management</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="anonymous"
                      checked={complaintData.anonymous}
                      onCheckedChange={(checked) =>
                        setComplaintData((prev) => ({ ...prev, anonymous: checked as boolean }))
                      }
                    />
                    <Label htmlFor="anonymous">Submit anonymously</Label>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="suggestion" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Suggestion Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="suggestionCategory">Category</Label>
                    <Select
                      value={suggestionData.category}
                      onValueChange={(value) => setSuggestionData((prev) => ({ ...prev, category: value as any }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="process">Process Improvement</SelectItem>
                        <SelectItem value="technology">Technology</SelectItem>
                        <SelectItem value="workplace">Workplace</SelectItem>
                        <SelectItem value="benefits">Benefits</SelectItem>
                        <SelectItem value="training">Training</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="estimatedImpact">Estimated Impact</Label>
                      <Select
                        value={suggestionData.estimatedImpact}
                        onValueChange={(value) =>
                          setSuggestionData((prev) => ({ ...prev, estimatedImpact: value as any }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="implementationCost">Implementation Cost</Label>
                      <Select
                        value={suggestionData.implementationCost}
                        onValueChange={(value) =>
                          setSuggestionData((prev) => ({ ...prev, implementationCost: value as any }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="accident" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Accident Report Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="incidentDate">Incident Date</Label>
                      <Input
                        id="incidentDate"
                        type="date"
                        value={accidentData.incidentDate}
                        onChange={(e) => setAccidentData((prev) => ({ ...prev, incidentDate: e.target.value }))}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={accidentData.location}
                        onChange={(e) => setAccidentData((prev) => ({ ...prev, location: e.target.value }))}
                        placeholder="Where did the incident occur?"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="severity">Severity</Label>
                      <Select
                        value={accidentData.severity}
                        onValueChange={(value) => setAccidentData((prev) => ({ ...prev, severity: value as Severity }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="minor">Minor</SelectItem>
                          <SelectItem value="moderate">Moderate</SelectItem>
                          <SelectItem value="major">Major</SelectItem>
                          <SelectItem value="critical">Critical</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="injuryType">Injury Type</Label>
                      <Select
                        value={accidentData.injuryType}
                        onValueChange={(value) => setAccidentData((prev) => ({ ...prev, injuryType: value as any }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">No Injury</SelectItem>
                          <SelectItem value="minor">Minor Injury</SelectItem>
                          <SelectItem value="major">Major Injury</SelectItem>
                          <SelectItem value="fatal">Fatal</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="witnessNames">Witness Names</Label>
                    <Input
                      id="witnessNames"
                      value={accidentData.witnessNames}
                      onChange={(e) => setAccidentData((prev) => ({ ...prev, witnessNames: e.target.value }))}
                      placeholder="Names of any witnesses (optional)"
                    />
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="medicalAttention"
                        checked={accidentData.medicalAttention}
                        onCheckedChange={(checked) =>
                          setAccidentData((prev) => ({ ...prev, medicalAttention: checked as boolean }))
                        }
                      />
                      <Label htmlFor="medicalAttention">Medical attention required</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="reportedToAuthorities"
                        checked={accidentData.reportedToAuthorities}
                        onCheckedChange={(checked) =>
                          setAccidentData((prev) => ({ ...prev, reportedToAuthorities: checked as boolean }))
                        }
                      />
                      <Label htmlFor="reportedToAuthorities">Reported to authorities</Label>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="immediateActions">Immediate Actions Taken</Label>
                    <Textarea
                      id="immediateActions"
                      value={accidentData.immediateActions}
                      onChange={(e) => setAccidentData((prev) => ({ ...prev, immediateActions: e.target.value }))}
                      placeholder="Describe any immediate actions taken after the incident..."
                      rows={3}
                      required
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">
                Submit {activeTab === "complaint" ? "Complaint" : activeTab === "suggestion" ? "Suggestion" : "Report"}
              </Button>
            </DialogFooter>
          </form>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
