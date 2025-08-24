"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Search,
  Plus,
  MoreHorizontal,
  Edit,
  Eye,
  MessageSquare,
  Lightbulb,
  AlertTriangle,
  Calendar,
  CheckCircle,
  XCircle,
} from "lucide-react"
import {
  getAllFeedback,
  getFeedbackByEmployee,
  updateFeedback,
  getFeedbackTypeLabel,
  type FeedbackItem,
  type FeedbackType,
  type FeedbackStatus,
} from "@/lib/feedback"
import { getCurrentUser } from "@/lib/auth"

interface FeedbackListProps {
  onAddFeedback: (type?: FeedbackType) => void
}

export function FeedbackList({ onAddFeedback }: FeedbackListProps) {
  const [feedback, setFeedback] = useState<FeedbackItem[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [filteredFeedback, setFilteredFeedback] = useState<FeedbackItem[]>([])
  const [user] = useState(getCurrentUser())
  const [activeTab, setActiveTab] = useState<FeedbackType>("complaint")
  const [selectedFeedback, setSelectedFeedback] = useState<FeedbackItem | null>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)

  useEffect(() => {
    const loadFeedback = () => {
      if (user?.role === "hr") {
        const allFeedback = getAllFeedback()
        setFeedback(allFeedback)
      } else if (user) {
        const userFeedback = getFeedbackByEmployee(user.employeeId)
        setFeedback(userFeedback)
      }
    }
    loadFeedback()
  }, [user])

  useEffect(() => {
    let filtered = feedback.filter((item) => item.type === activeTab)

    if (searchTerm) {
      filtered = filtered.filter(
        (item) =>
          item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.employeeName.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((item) => item.status === statusFilter)
    }

    setFilteredFeedback(filtered)
  }, [searchTerm, statusFilter, feedback, activeTab])

  const handleStatusChange = (id: string, status: FeedbackStatus) => {
    if (!user) return
    const updates: any = { status }
    if (status === "resolved" || status === "closed") {
      updates.resolvedDate = new Date().toISOString().split("T")[0]
      updates.assignedTo = user.name
    }
    updateFeedback(id, updates)
    // Refresh the list
    const updatedFeedback = feedback.map((item) => (item.id === id ? { ...item, ...updates } : item))
    setFeedback(updatedFeedback)
  }

  const handleAssign = (id: string) => {
    if (!user) return
    updateFeedback(id, { assignedTo: user.name, status: "in-review" })
    const updatedFeedback = feedback.map((item) =>
      item.id === id ? { ...item, assignedTo: user.name, status: "in-review" as FeedbackStatus } : item,
    )
    setFeedback(updatedFeedback)
  }

  const handleViewDetails = (item: FeedbackItem) => {
    setSelectedFeedback(item)
    setIsDetailModalOpen(true)
  }

  const getStatusBadge = (status: FeedbackStatus) => {
    switch (status) {
      case "open":
        return <Badge className="bg-blue-100 text-blue-800">Open</Badge>
      case "in-review":
        return <Badge className="bg-yellow-100 text-yellow-800">In Review</Badge>
      case "resolved":
        return <Badge className="bg-green-100 text-green-800">Resolved</Badge>
      case "closed":
        return <Badge variant="secondary">Closed</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "low":
        return (
          <Badge variant="outline" className="text-green-600">
            Low
          </Badge>
        )
      case "medium":
        return (
          <Badge variant="outline" className="text-yellow-600">
            Medium
          </Badge>
        )
      case "high":
        return (
          <Badge variant="outline" className="text-orange-600">
            High
          </Badge>
        )
      case "critical":
        return <Badge variant="destructive">Critical</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const getTabIcon = (type: FeedbackType) => {
    switch (type) {
      case "complaint":
        return <MessageSquare className="h-4 w-4" />
      case "suggestion":
        return <Lightbulb className="h-4 w-4" />
      case "accident":
        return <AlertTriangle className="h-4 w-4" />
    }
  }

  const getTabCount = (type: FeedbackType) => {
    return feedback.filter((item) => item.type === type).length
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{user?.role === "hr" ? "Feedback Management" : "My Feedback"}</CardTitle>
            <CardDescription>
              {user?.role === "hr"
                ? "Manage employee complaints, suggestions, and accident reports"
                : "View and submit your feedback"}
            </CardDescription>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Submit Feedback
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => onAddFeedback("complaint")}>
                <MessageSquare className="mr-2 h-4 w-4" />
                Complaint
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onAddFeedback("suggestion")}>
                <Lightbulb className="mr-2 h-4 w-4" />
                Suggestion
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onAddFeedback("accident")}>
                <AlertTriangle className="mr-2 h-4 w-4" />
                Accident Report
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as FeedbackType)}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="complaint" className="flex items-center space-x-2">
              {getTabIcon("complaint")}
              <span>Complaints ({getTabCount("complaint")})</span>
            </TabsTrigger>
            <TabsTrigger value="suggestion" className="flex items-center space-x-2">
              {getTabIcon("suggestion")}
              <span>Suggestions ({getTabCount("suggestion")})</span>
            </TabsTrigger>
            <TabsTrigger value="accident" className="flex items-center space-x-2">
              {getTabIcon("accident")}
              <span>Accidents ({getTabCount("accident")})</span>
            </TabsTrigger>
          </TabsList>

          <div className="flex items-center space-x-4 my-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search feedback..."
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
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="in-review">In Review</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {["complaint", "suggestion", "accident"].map((type) => (
            <TabsContent key={type} value={type}>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {user?.role === "hr" && <TableHead>Employee</TableHead>}
                      <TableHead>Title</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Status</TableHead>
                      {user?.role === "hr" && <TableHead>Assigned To</TableHead>}
                      <TableHead>Submitted</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredFeedback.map((item) => (
                      <TableRow key={item.id}>
                        {user?.role === "hr" && (
                          <TableCell>
                            <div>
                              <div className="font-medium">{item.employeeName}</div>
                              <div className="text-sm text-muted-foreground">{item.employeeId}</div>
                            </div>
                          </TableCell>
                        )}
                        <TableCell>
                          <div>
                            <div className="font-medium">{item.title}</div>
                            <div className="text-sm text-muted-foreground truncate max-w-48">{item.description}</div>
                          </div>
                        </TableCell>
                        <TableCell>{getPriorityBadge(item.priority)}</TableCell>
                        <TableCell>{getStatusBadge(item.status)}</TableCell>
                        {user?.role === "hr" && (
                          <TableCell>
                            {item.assignedTo ? (
                              <span className="text-sm">{item.assignedTo}</span>
                            ) : (
                              <span className="text-sm text-muted-foreground">Unassigned</span>
                            )}
                          </TableCell>
                        )}
                        <TableCell>
                          <div className="flex items-center space-x-1 text-sm">
                            <Calendar className="h-3 w-3" />
                            <span>{new Date(item.submittedDate).toLocaleDateString()}</span>
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
                              <DropdownMenuItem onClick={() => handleViewDetails(item)}>
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                              {user?.role === "hr" && (
                                <>
                                  {!item.assignedTo && (
                                    <DropdownMenuItem onClick={() => handleAssign(item.id)}>
                                      <Edit className="mr-2 h-4 w-4" />
                                      Assign to Me
                                    </DropdownMenuItem>
                                  )}
                                  {item.status === "open" || item.status === "in-review" ? (
                                    <DropdownMenuItem onClick={() => handleStatusChange(item.id, "resolved")}>
                                      <CheckCircle className="mr-2 h-4 w-4" />
                                      Mark Resolved
                                    </DropdownMenuItem>
                                  ) : null}
                                  {item.status === "resolved" && (
                                    <DropdownMenuItem onClick={() => handleStatusChange(item.id, "closed")}>
                                      <XCircle className="mr-2 h-4 w-4" />
                                      Close
                                    </DropdownMenuItem>
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

              {filteredFeedback.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    No {getFeedbackTypeLabel(type as FeedbackType).toLowerCase()}s found matching your criteria.
                  </p>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>

        {isDetailModalOpen && selectedFeedback && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-semibold">{getFeedbackTypeLabel(selectedFeedback.type)} Details</h2>
                <Button variant="ghost" onClick={() => setIsDetailModalOpen(false)}>
                  ×
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Title</label>
                  <p className="text-sm">{selectedFeedback.title}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground">Description</label>
                  <p className="text-sm whitespace-pre-wrap">{selectedFeedback.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Employee</label>
                    <p className="text-sm">
                      {selectedFeedback.employeeName} ({selectedFeedback.employeeId})
                    </p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Priority</label>
                    <div className="mt-1">{getPriorityBadge(selectedFeedback.priority)}</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Status</label>
                    <div className="mt-1">{getStatusBadge(selectedFeedback.status)}</div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Submitted Date</label>
                    <p className="text-sm">{new Date(selectedFeedback.submittedDate).toLocaleDateString()}</p>
                  </div>
                </div>

                {selectedFeedback.assignedTo && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Assigned To</label>
                    <p className="text-sm">{selectedFeedback.assignedTo}</p>
                  </div>
                )}

                {selectedFeedback.resolvedDate && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Resolved Date</label>
                    <p className="text-sm">{new Date(selectedFeedback.resolvedDate).toLocaleDateString()}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
