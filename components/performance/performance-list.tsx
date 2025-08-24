"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Plus, MoreHorizontal, Edit, Eye, Star, Calendar, Check, X } from "lucide-react"
import {
  getAllPerformanceReviews,
  getPerformanceReviewsByEmployee,
  getRatingLabel,
  getRatingColor,
  approvePerformanceReview,
  rejectPerformanceReview,
  type PerformanceReview,
  type ReviewStatus,
} from "@/lib/performance"
import { getCurrentUser } from "@/lib/auth"
import { getAllEmployees } from "@/lib/employees"

interface PerformanceListProps {
  onAddReview: () => void
  onEditReview: (review: PerformanceReview) => void
  onViewReview: (review: PerformanceReview) => void
}

export function PerformanceList({ onAddReview, onEditReview, onViewReview }: PerformanceListProps) {
  const [reviews, setReviews] = useState<PerformanceReview[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [filteredReviews, setFilteredReviews] = useState<PerformanceReview[]>([])
  const [user] = useState(getCurrentUser())

  useEffect(() => {
    const loadReviews = () => {
      const employees = getAllEmployees()
      const employeeIds = new Set(employees.map((emp) => emp.employeeId))

      if (user?.role === "hr") {
        const allReviews = getAllPerformanceReviews()
        const validReviews = allReviews.filter((review) => employeeIds.has(review.employeeId))
        setReviews(validReviews)
      } else if (user) {
        const userReviews = getPerformanceReviewsByEmployee(user.employeeId)
        setReviews(userReviews)
      }
    }
    loadReviews()
  }, [user])

  useEffect(() => {
    let filtered = reviews

    if (searchTerm) {
      filtered = filtered.filter(
        (review) =>
          review.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          review.reviewPeriod.toLowerCase().includes(searchTerm.toLowerCase()) ||
          review.reviewType.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((review) => review.status === statusFilter)
    }

    setFilteredReviews(filtered)
  }, [searchTerm, statusFilter, reviews])

  const getStatusBadge = (status: ReviewStatus) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>
      case "completed":
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>
      case "pending-approval":
        return <Badge className="bg-orange-100 text-orange-800">Pending Approval</Badge>
      case "in-progress":
        return <Badge className="bg-blue-100 text-blue-800">In Progress</Badge>
      case "draft":
        return <Badge variant="secondary">Draft</Badge>
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>
      case "overdue":
        return <Badge variant="destructive">Overdue</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const getReviewTypeLabel = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1).replace("-", " ")
  }

  const handleApprove = async (reviewId: string) => {
    const updatedReview = approvePerformanceReview(reviewId)
    if (updatedReview) {
      setReviews((prev) => prev.map((review) => (review.id === reviewId ? updatedReview : review)))
    }
  }

  const handleReject = async (reviewId: string) => {
    const reason = prompt("Please provide a reason for rejection (optional):")
    const updatedReview = rejectPerformanceReview(reviewId, reason || undefined)
    if (updatedReview) {
      setReviews((prev) => prev.map((review) => (review.id === reviewId ? updatedReview : review)))
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{user?.role === "hr" ? "Performance Reviews" : "My Performance Reviews"}</CardTitle>
            <CardDescription>
              {user?.role === "hr"
                ? "Manage employee performance evaluations"
                : "View your performance evaluations and goals"}
            </CardDescription>
          </div>
          {user?.role === "hr" && (
            <Button onClick={onAddReview}>
              <Plus className="h-4 w-4 mr-2" />
              New Review
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search reviews..."
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
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="pending-approval">Pending Approval</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
              <SelectItem value="overdue">Overdue</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                {user?.role === "hr" && <TableHead>Employee</TableHead>}
                <TableHead>Review Type</TableHead>
                <TableHead>Period</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Overall Rating</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReviews.map((review) => (
                <TableRow key={review.id}>
                  {user?.role === "hr" && (
                    <TableCell>
                      <div>
                        <div className="font-medium">{review.employeeName}</div>
                        <div className="text-sm text-muted-foreground">{review.employeeId}</div>
                      </div>
                    </TableCell>
                  )}
                  <TableCell>
                    <div>
                      <div className="font-medium">{getReviewTypeLabel(review.reviewType)}</div>
                      <div className="text-sm text-muted-foreground">by {review.reviewerName}</div>
                    </div>
                  </TableCell>
                  <TableCell>{review.reviewPeriod}</TableCell>
                  <TableCell>{getStatusBadge(review.status)}</TableCell>
                  <TableCell>
                    {review.status === "completed" || review.status === "approved" ? (
                      <div className="flex items-center space-x-2">
                        <Star className={`h-4 w-4 ${getRatingColor(review.overallRating)}`} />
                        <span className={`font-medium ${getRatingColor(review.overallRating)}`}>
                          {review.overallRating}/5
                        </span>
                        <span className="text-sm text-muted-foreground">({getRatingLabel(review.overallRating)})</span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1 text-sm">
                      <Calendar className="h-3 w-3" />
                      <span>{new Date(review.dueDate).toLocaleDateString()}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onViewReview(review)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        {user?.role === "hr" && (
                          <>
                            <DropdownMenuItem onClick={() => onEditReview(review)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Review
                            </DropdownMenuItem>
                            {review.status === "pending-approval" && (
                              <>
                                <DropdownMenuItem onClick={() => handleApprove(review.id)}>
                                  <Check className="mr-2 h-4 w-4" />
                                  Approve
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleReject(review.id)}>
                                  <X className="mr-2 h-4 w-4" />
                                  Reject
                                </DropdownMenuItem>
                              </>
                            )}
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {filteredReviews.length === 0 && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No performance reviews found matching your criteria.</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
