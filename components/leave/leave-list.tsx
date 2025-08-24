"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Plus, MoreHorizontal, Check, X, Eye, Calendar } from "lucide-react"
import {
  getAllLeaveRequests,
  getLeaveRequestsByEmployee,
  updateLeaveRequest,
  getLeaveTypeLabel,
  type LeaveRequest,
  type LeaveStatus,
} from "@/lib/leave"
import { getCurrentUser } from "@/lib/auth"

interface LeaveListProps {
  onAddRequest: () => void
  onViewRequest?: (request: LeaveRequest) => void
}

export function LeaveList({ onAddRequest, onViewRequest }: LeaveListProps) {
  const [requests, setRequests] = useState<LeaveRequest[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [filteredRequests, setFilteredRequests] = useState<LeaveRequest[]>([])
  const [user] = useState(getCurrentUser())

  useEffect(() => {
    const loadRequests = () => {
      if (user?.role === "hr") {
        const allRequests = getAllLeaveRequests()
        setRequests(allRequests)
      } else if (user) {
        const userRequests = getLeaveRequestsByEmployee(user.employeeId)
        setRequests(userRequests)
      }
    }
    loadRequests()
  }, [user])

  useEffect(() => {
    let filtered = requests

    if (searchTerm) {
      filtered = filtered.filter(
        (request) =>
          request.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          request.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
          getLeaveTypeLabel(request.type).toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((request) => request.status === statusFilter)
    }

    setFilteredRequests(filtered)
  }, [searchTerm, statusFilter, requests])

  const handleApproveRequest = (id: string) => {
    if (!user) return
    updateLeaveRequest(id, {
      status: "approved",
      reviewedBy: user.name,
      reviewedDate: new Date().toISOString().split("T")[0],
      reviewComments: "Approved",
    })
    // Refresh the list
    const updatedRequests = requests.map((req) =>
      req.id === id
        ? {
            ...req,
            status: "approved" as LeaveStatus,
            reviewedBy: user.name,
            reviewedDate: new Date().toISOString().split("T")[0],
            reviewComments: "Approved",
          }
        : req,
    )
    setRequests(updatedRequests)
  }

  const handleRejectRequest = (id: string) => {
    if (!user) return
    const reason = prompt("Please provide a reason for rejection:")
    if (reason) {
      updateLeaveRequest(id, {
        status: "rejected",
        reviewedBy: user.name,
        reviewedDate: new Date().toISOString().split("T")[0],
        reviewComments: reason,
      })
      // Refresh the list
      const updatedRequests = requests.map((req) =>
        req.id === id
          ? {
              ...req,
              status: "rejected" as LeaveStatus,
              reviewedBy: user.name,
              reviewedDate: new Date().toISOString().split("T")[0],
              reviewComments: reason,
            }
          : req,
      )
      setRequests(updatedRequests)
    }
  }

  const handleCancelRequest = (id: string) => {
    if (confirm("Are you sure you want to cancel this leave request?")) {
      updateLeaveRequest(id, { status: "cancelled" })
      const updatedRequests = requests.map((req) =>
        req.id === id ? { ...req, status: "cancelled" as LeaveStatus } : req,
      )
      setRequests(updatedRequests)
    }
  }

  const getStatusBadge = (status: LeaveStatus) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>
      case "pending":
        return <Badge variant="secondary">Pending</Badge>
      case "cancelled":
        return <Badge variant="outline">Cancelled</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{user?.role === "hr" ? "Leave Management" : "My Leave Requests"}</CardTitle>
            <CardDescription>
              {user?.role === "hr" ? "Manage employee leave requests" : "View and manage your leave requests"}
            </CardDescription>
          </div>
          <Button onClick={onAddRequest}>
            <Plus className="h-4 w-4 mr-2" />
            Request Leave
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search requests..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                {user?.role === "hr" && <TableHead>Employee</TableHead>}
                <TableHead>Type</TableHead>
                <TableHead>Dates</TableHead>
                <TableHead>Days</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Applied</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRequests.map((request) => (
                <TableRow key={request.id}>
                  {user?.role === "hr" && (
                    <TableCell>
                      <div>
                        <div className="font-medium">{request.employeeName}</div>
                        <div className="text-sm text-muted-foreground">{request.employeeId}</div>
                      </div>
                    </TableCell>
                  )}
                  <TableCell>
                    <div>
                      <div className="font-medium">{getLeaveTypeLabel(request.type)}</div>
                      <div className="text-sm text-muted-foreground truncate max-w-32">{request.reason}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1 text-sm">
                      <Calendar className="h-3 w-3" />
                      <span>
                        {new Date(request.startDate).toLocaleDateString()} -{" "}
                        {new Date(request.endDate).toLocaleDateString()}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{request.days}</TableCell>
                  <TableCell>{getStatusBadge(request.status)}</TableCell>
                  <TableCell>{new Date(request.appliedDate).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onViewRequest?.(request)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        {user?.role === "hr" && request.status === "pending" && (
                          <>
                            <DropdownMenuItem onClick={() => handleApproveRequest(request.id)}>
                              <Check className="mr-2 h-4 w-4" />
                              Approve
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleRejectRequest(request.id)}>
                              <X className="mr-2 h-4 w-4" />
                              Reject
                            </DropdownMenuItem>
                          </>
                        )}
                        {user?.role === "employee" && request.status === "pending" && (
                          <DropdownMenuItem onClick={() => handleCancelRequest(request.id)}>
                            <X className="mr-2 h-4 w-4" />
                            Cancel
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {filteredRequests.length === 0 && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No leave requests found matching your criteria.</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
