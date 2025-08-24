"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { X, Calendar, User, FileText } from "lucide-react"
import type { LeaveRequest } from "@/lib/leave"

interface LeaveDetailProps {
  leave: LeaveRequest
  isOpen: boolean
  onClose: () => void
  onEdit: () => void
}

export function LeaveDetail({ leave, isOpen, onClose, onEdit }: LeaveDetailProps) {
  if (!isOpen) return null

  const getStatusBadge = (status: LeaveRequest["status"]) => {
    switch (status) {
      case "approved":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800 border-green-200">
            Approved
          </Badge>
        )
      case "pending":
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-200">
            Pending
          </Badge>
        )
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const calculateDays = (startDate: string, endDate: string) => {
    const start = new Date(startDate)
    const end = new Date(endDate)
    const diffTime = Math.abs(end.getTime() - start.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
    return diffDays
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle className="text-xl">Leave Request Details</CardTitle>
            <CardDescription>Request submitted by {leave.employeeName}</CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Status and Type */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-2xl font-semibold capitalize">{leave.type} Leave</h3>
              <p className="text-muted-foreground">Request ID: {leave.id}</p>
            </div>
            {getStatusBadge(leave.status)}
          </div>

          <Separator />

          {/* Employee Information */}
          <div className="space-y-4">
            <h4 className="text-lg font-medium flex items-center">
              <User className="h-5 w-5 mr-2" />
              Employee Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium">Employee Name</p>
                <p className="text-sm text-muted-foreground">{leave.employeeName}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Employee ID</p>
                <p className="text-sm text-muted-foreground font-mono">{leave.employeeId}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Leave Details */}
          <div className="space-y-4">
            <h4 className="text-lg font-medium flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Leave Details
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium">Leave Type</p>
                <p className="text-sm text-muted-foreground capitalize">{leave.type}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Duration</p>
                <p className="text-sm text-muted-foreground">{calculateDays(leave.startDate, leave.endDate)} day(s)</p>
              </div>
              <div>
                <p className="text-sm font-medium">Start Date</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(leave.startDate).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">End Date</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(leave.endDate).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
              <div className="md:col-span-2">
                <p className="text-sm font-medium">Applied Date</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(leave.appliedDate).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Reason */}
          <div className="space-y-4">
            <h4 className="text-lg font-medium flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              Reason for Leave
            </h4>
            <div className="bg-muted/50 p-4 rounded-lg">
              <p className="text-sm">{leave.reason || "No reason provided"}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button onClick={onEdit}>Edit Request</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
