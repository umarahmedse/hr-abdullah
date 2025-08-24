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
import { Calendar } from "lucide-react"
import { addLeaveRequest, calculateLeaveDays, getLeaveBalance, getLeaveTypeLabel, type LeaveType } from "@/lib/leave"
import { getCurrentUser } from "@/lib/auth"

interface LeaveRequestFormProps {
  isOpen: boolean
  onClose: () => void
  onSave: () => void
}

export function LeaveRequestForm({ isOpen, onClose, onSave }: LeaveRequestFormProps) {
  const [formData, setFormData] = useState({
    type: "" as LeaveType,
    startDate: "",
    endDate: "",
    reason: "",
  })
  const [calculatedDays, setCalculatedDays] = useState(0)
  const [leaveBalance, setLeaveBalance] = useState<any>(null)
  const [user] = useState(getCurrentUser())

  const leaveTypes: LeaveType[] = ["vacation", "sick", "personal", "maternity", "paternity", "bereavement", "other"]

  useEffect(() => {
    if (user) {
      const balance = getLeaveBalance(user.employeeId)
      setLeaveBalance(balance)
    }
  }, [user])

  useEffect(() => {
    if (formData.startDate && formData.endDate) {
      const days = calculateLeaveDays(formData.startDate, formData.endDate)
      setCalculatedDays(days)
    } else {
      setCalculatedDays(0)
    }
  }, [formData.startDate, formData.endDate])

  useEffect(() => {
    if (!isOpen) {
      // Reset form when dialog closes
      setFormData({
        type: "" as LeaveType,
        startDate: "",
        endDate: "",
        reason: "",
      })
      setCalculatedDays(0)
    }
  }, [isOpen])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    const leaveRequest = {
      employeeId: user.employeeId,
      employeeName: user.name,
      type: formData.type,
      startDate: formData.startDate,
      endDate: formData.endDate,
      days: calculatedDays,
      reason: formData.reason,
      status: "pending" as const,
    }

    addLeaveRequest(leaveRequest)
    onSave()
    onClose()
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const getAvailableBalance = (type: LeaveType): number => {
    if (!leaveBalance) return 0
    return leaveBalance[type] || 0
  }

  const isBalanceSufficient = (type: LeaveType): boolean => {
    return getAvailableBalance(type) >= calculatedDays
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Request Leave</DialogTitle>
          <DialogDescription>Submit a new leave request for approval</DialogDescription>
        </DialogHeader>

        {leaveBalance && (
          <Card className="mb-4">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Your Leave Balance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="text-center">
                  <div className="font-semibold text-lg">{leaveBalance.vacation}</div>
                  <div className="text-muted-foreground">Vacation</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-lg">{leaveBalance.sick}</div>
                  <div className="text-muted-foreground">Sick</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-lg">{leaveBalance.personal}</div>
                  <div className="text-muted-foreground">Personal</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="type">Leave Type</Label>
            <Select value={formData.type} onValueChange={(value) => handleInputChange("type", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select leave type" />
              </SelectTrigger>
              <SelectContent>
                {leaveTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {getLeaveTypeLabel(type)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => handleInputChange("startDate", e.target.value)}
                min={new Date().toISOString().split("T")[0]}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) => handleInputChange("endDate", e.target.value)}
                min={formData.startDate || new Date().toISOString().split("T")[0]}
                required
              />
            </div>
          </div>

          {calculatedDays > 0 && (
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Duration: {calculatedDays} day(s)</span>
                  </div>
                  {formData.type && (
                    <div className="flex items-center space-x-2">
                      <span className="text-sm">Available: {getAvailableBalance(formData.type)}</span>
                      <Badge variant={isBalanceSufficient(formData.type) ? "default" : "destructive"}>
                        {isBalanceSufficient(formData.type) ? "Sufficient" : "Insufficient"}
                      </Badge>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          <div className="space-y-2">
            <Label htmlFor="reason">Reason</Label>
            <Textarea
              id="reason"
              placeholder="Please provide a reason for your leave request..."
              value={formData.reason}
              onChange={(e) => handleInputChange("reason", e.target.value)}
              required
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={
                !formData.type || calculatedDays === 0 || (formData.type && !isBalanceSufficient(formData.type))
              }
            >
              Submit Request
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
