"use client"

import { useEffect, useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Bar,
  BarChart,
  Line,
  LineChart,
  Pie,
  PieChart,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Area,
  AreaChart,
} from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Users, MessageSquare, Building2, Award, AlertCircle, TrendingUp, Calendar, Clock } from "lucide-react"
import { getCurrentUser } from "@/lib/auth"
import {
  getDashboardMetrics,
  getDepartmentMetrics,
  getLeaveAnalytics,
  getPerformanceAnalytics,
  getFeedbackAnalytics,
  getWorkforceInsights,
} from "@/lib/analytics"
import { getAllEmployees } from "@/lib/employees"

export default function DashboardPage() {
  const [user, setUser] = useState(getCurrentUser())
  const [metrics, setMetrics] = useState(getDashboardMetrics())
  const [departmentMetrics, setDepartmentMetrics] = useState(getDepartmentMetrics())
  const [leaveAnalytics, setLeaveAnalytics] = useState(getLeaveAnalytics())
  const [performanceAnalytics, setPerformanceAnalytics] = useState(getPerformanceAnalytics())
  const [feedbackAnalytics, setFeedbackAnalytics] = useState(getFeedbackAnalytics())
  const [workforceInsights, setWorkforceInsights] = useState(getWorkforceInsights())

  useEffect(() => {
    // Refresh analytics data
    setMetrics(getDashboardMetrics())
    setDepartmentMetrics(getDepartmentMetrics())
    setLeaveAnalytics(getLeaveAnalytics())
    setPerformanceAnalytics(getPerformanceAnalytics())
    setFeedbackAnalytics(getFeedbackAnalytics())
    setWorkforceInsights(getWorkforceInsights())
  }, [])

  const chartColors = {
    primary: "#3b82f6",
    secondary: "#10b981",
    accent: "#f59e0b",
    danger: "#ef4444",
    purple: "#8b5cf6",
    pink: "#ec4899",
    teal: "#14b8a6",
    orange: "#f97316",
  }

  const stats = [
    {
      title: "Total Employees",
      value: metrics.totalEmployees,
      description: `${metrics.activeEmployees} active`,
      icon: Users,
      trend: `+${metrics.employeeGrowthRate}% growth`,
      color: "text-blue-600",
    },
    {
      title: "Departments",
      value: metrics.totalDepartments,
      description: "Active departments",
      icon: Building2,
      trend: "No change",
      color: "text-green-600",
    },
    {
      title: "Pending Actions",
      value: metrics.pendingLeaveRequests + metrics.openFeedback,
      description: `${metrics.pendingLeaveRequests} leaves, ${metrics.openFeedback} feedback`,
      icon: AlertCircle,
      trend: "-15% from last week",
      color: "text-orange-600",
    },
    {
      title: "Performance Score",
      value: `${metrics.avgPerformanceScore}/5`,
      description: "Company average",
      icon: Award,
      trend: "+0.2 from last quarter",
      color: "text-purple-600",
    },
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Analytics Dashboard</h1>
            <p className="text-muted-foreground">
              {user?.role === "hr" ? "Comprehensive HR Analytics & Insights" : "Your Personal Dashboard"}
            </p>
          </div>
          <Badge variant={user?.role === "hr" ? "default" : "secondary"} className="text-sm">
            {user?.role === "hr" ? "HR Manager" : "Employee"}
          </Badge>
        </div>

        {/* Key Metrics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground">{stat.description}</p>
                  <p className="text-xs text-green-600 mt-1">{stat.trend}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {user?.role === "hr" ? (
          <div className="space-y-8">
            {/* Charts Section */}
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Department Performance */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                    Department Performance
                  </CardTitle>
                  <CardDescription>Average performance scores by department</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      avgRating: {
                        label: "Average Rating",
                        color: chartColors.primary,
                      },
                    }}
                    className="h-[300px] w-full"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={performanceAnalytics.departmentPerformance}
                        margin={{ left: 20, right: 20, top: 20, bottom: 60 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis
                          dataKey="department"
                          angle={-45}
                          textAnchor="end"
                          height={80}
                          interval={0}
                          fontSize={12}
                        />
                        <YAxis domain={[0, 5]} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="avgRating" fill={chartColors.primary} radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              {/* Leave Trends */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-green-600" />
                    Leave Request Trends
                  </CardTitle>
                  <CardDescription>Monthly leave requests over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      requests: {
                        label: "Leave Requests",
                        color: chartColors.secondary,
                      },
                    }}
                    className="h-[300px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={leaveAnalytics.leaveByMonth}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Area
                          type="monotone"
                          dataKey="requests"
                          stroke={chartColors.secondary}
                          fill={chartColors.secondary}
                          fillOpacity={0.3}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              {/* Age Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-purple-600" />
                    Age Distribution
                  </CardTitle>
                  <CardDescription>Employee age demographics</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      count: {
                        label: "Employees",
                        color: chartColors.purple,
                      },
                    }}
                    className="h-[300px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={workforceInsights.ageDistribution}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          dataKey="count"
                          label={({ range, count }) => `${range}: ${count}`}
                        >
                          {workforceInsights.ageDistribution.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={Object.values(chartColors)[index % Object.values(chartColors).length]}
                            />
                          ))}
                        </Pie>
                        <ChartTooltip content={<ChartTooltipContent />} />
                      </PieChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              {/* Feedback Trends */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-orange-600" />
                    Feedback Trends
                  </CardTitle>
                  <CardDescription>Monthly feedback submissions</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      complaints: { label: "Complaints", color: chartColors.danger },
                      suggestions: { label: "Suggestions", color: chartColors.accent },
                      accidents: { label: "Accidents", color: chartColors.teal },
                    }}
                    className="h-[300px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={feedbackAnalytics.feedbackTrends}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Line type="monotone" dataKey="complaints" stroke={chartColors.danger} strokeWidth={3} />
                        <Line type="monotone" dataKey="suggestions" stroke={chartColors.accent} strokeWidth={3} />
                        <Line type="monotone" dataKey="accidents" stroke={chartColors.teal} strokeWidth={3} />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              {/* Department Overview Table */}
             <Card>
  <CardHeader>
    <CardTitle className="flex items-center gap-2">
      <Building2 className="h-5 w-5 text-blue-600" />
      Department Overview
    </CardTitle>
    <CardDescription>
      Comprehensive department metrics and performance indicators
    </CardDescription>
  </CardHeader>
  <CardContent>
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Department</TableHead>
          <TableHead className="text-center">Employees</TableHead>
          <TableHead className="text-center">Performance</TableHead>
          <TableHead className="text-center">Leave Usage</TableHead>
          <TableHead className="text-center">Feedback</TableHead>
          <TableHead className="text-center">Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {departmentMetrics.map((dept, index) => (
          <TableRow key={index}>
            <TableCell className="font-medium">{dept.name}</TableCell>
            <TableCell className="text-center">{dept.employeeCount}</TableCell>
            <TableCell className="text-center">
              <Badge
                variant={
                  dept.avgPerformanceScore >= 4
                    ? "default"
                    : dept.avgPerformanceScore >= 3
                    ? "secondary"
                    : "destructive"
                }
              >
                {dept.avgPerformanceScore}/5
              </Badge>
            </TableCell>
            <TableCell className="text-center">
              <div className="flex items-center justify-center gap-2">
                <span>{dept.leaveUtilization}%</span>
                <div className="w-16 h-2 bg-gray-200 rounded-full">
                  <div
                    className="h-2 bg-blue-500 rounded-full"
                    style={{ width: `${Math.min(dept.leaveUtilization, 100)}%` }}
                  />
                </div>
              </div>
            </TableCell>
            <TableCell className="text-center">{dept.feedbackCount}</TableCell>
            <TableCell className="text-center">
              <Badge variant={dept.avgPerformanceScore >= 4 ? "default" : "secondary"}>
                {dept.avgPerformanceScore >= 4
                  ? "Excellent"
                  : dept.avgPerformanceScore >= 3
                  ? "Good"
                  : "Needs Attention"}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </CardContent>
</Card>


              {/* Recent Activities Table */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-green-600" />
                    Recent Activities
                  </CardTitle>
                  <CardDescription>Latest HR activities and pending actions</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Activity</TableHead>
                        <TableHead>Employee</TableHead>
                        <TableHead>Department</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Priority</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">Leave Request</TableCell>
                        <TableCell>John Smith</TableCell>
                        <TableCell>Engineering</TableCell>
                        <TableCell>2024-01-15</TableCell>
                        <TableCell>
                          <Badge variant="secondary">Pending</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="default">Medium</Badge>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Performance Review</TableCell>
                        <TableCell>Sarah Johnson</TableCell>
                        <TableCell>Marketing</TableCell>
                        <TableCell>2024-01-14</TableCell>
                        <TableCell>
                          <Badge variant="default">Completed</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">Low</Badge>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Complaint</TableCell>
                        <TableCell>Mike Davis</TableCell>
                        <TableCell>Sales</TableCell>
                        <TableCell>2024-01-13</TableCell>
                        <TableCell>
                          <Badge variant="destructive">Open</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="destructive">High</Badge>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">New Hire</TableCell>
                        <TableCell>Emma Wilson</TableCell>
                        <TableCell>HR</TableCell>
                        <TableCell>2024-01-12</TableCell>
                        <TableCell>
                          <Badge variant="default">Completed</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">Low</Badge>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Training Request</TableCell>
                        <TableCell>Alex Brown</TableCell>
                        <TableCell>Engineering</TableCell>
                        <TableCell>2024-01-11</TableCell>
                        <TableCell>
                          <Badge variant="secondary">Approved</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="default">Medium</Badge>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              {/* Performance Summary Table */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-purple-600" />
                    Top Performers
                  </CardTitle>
                  <CardDescription>Highest performing employees across departments</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Employee</TableHead>
                        <TableHead>Department</TableHead>
                        <TableHead>Position</TableHead>
                        <TableHead className="text-center">Performance Score</TableHead>
                        <TableHead className="text-center">Goals Completed</TableHead>
                        <TableHead className="text-center">Recognition</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">Sarah Johnson</TableCell>
                        <TableCell>Marketing</TableCell>
                        <TableCell>Marketing Manager</TableCell>
                        <TableCell className="text-center">
                          <Badge variant="default">4.9/5</Badge>
                        </TableCell>
                        <TableCell className="text-center">12/12</TableCell>
                        <TableCell className="text-center">
                          <Badge variant="default">Employee of Month</Badge>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">John Smith</TableCell>
                        <TableCell>Engineering</TableCell>
                        <TableCell>Senior Developer</TableCell>
                        <TableCell className="text-center">
                          <Badge variant="default">4.8/5</Badge>
                        </TableCell>
                        <TableCell className="text-center">11/12</TableCell>
                        <TableCell className="text-center">
                          <Badge variant="secondary">Innovation Award</Badge>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Emma Wilson</TableCell>
                        <TableCell>HR</TableCell>
                        <TableCell>HR Specialist</TableCell>
                        <TableCell className="text-center">
                          <Badge variant="default">4.7/5</Badge>
                        </TableCell>
                        <TableCell className="text-center">10/12</TableCell>
                        <TableCell className="text-center">
                          <Badge variant="secondary">Team Player</Badge>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Mike Davis</TableCell>
                        <TableCell>Sales</TableCell>
                        <TableCell>Sales Representative</TableCell>
                        <TableCell className="text-center">
                          <Badge variant="default">4.6/5</Badge>
                        </TableCell>
                        <TableCell className="text-center">9/12</TableCell>
                        <TableCell className="text-center">
                          <Badge variant="secondary">Top Seller</Badge>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          // Employee Dashboard
          <div className="grid gap-6 md:grid-cols-2">
            {/* Personal Performance */}
            <Card>
              <CardHeader>
                <CardTitle>My Performance</CardTitle>
                <CardDescription>Your latest performance metrics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">4.2/5</div>
                  <p className="text-muted-foreground">Latest Review Score</p>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Goal Progress</span>
                    <span>75%</span>
                  </div>
                  <Progress value={75} className="h-2" />
                </div>
                <div className="grid grid-cols-2 gap-4 text-center text-sm">
                  <div>
                    <div className="font-semibold">3</div>
                    <div className="text-muted-foreground">Goals Completed</div>
                  </div>
                  <div>
                    <div className="font-semibold">1</div>
                    <div className="text-muted-foreground">In Progress</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Leave Balance */}
            <Card>
              <CardHeader>
                <CardTitle>Leave Balance</CardTitle>
                <CardDescription>Your available leave days</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-blue-600">15</div>
                    <div className="text-xs text-muted-foreground">Vacation</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">10</div>
                    <div className="text-xs text-muted-foreground">Sick</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-purple-600">5</div>
                    <div className="text-xs text-muted-foreground">Personal</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Used This Year</span>
                    <span>8 days</span>
                  </div>
                  <Progress value={26} className="h-2" />
                  <p className="text-xs text-muted-foreground">26% of annual allocation used</p>
                </div>
              </CardContent>
            </Card>

            {/* Salary Information */}
            <Card>
              <CardHeader>
                <CardTitle>Salary Information</CardTitle>
                <CardDescription>Your current compensation details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">
                    $
                    {user
                      ? getAllEmployees()
                          .find((emp) => emp.employeeId === user.employeeId)
                          ?.salary?.toLocaleString() || "N/A"
                      : "N/A"}
                  </div>
                  <p className="text-muted-foreground">Annual Salary</p>
                </div>
                <div className="grid grid-cols-2 gap-4 text-center text-sm">
                  <div>
                    <div className="font-semibold">
                      $
                      {user
                        ? Math.round(
                            (getAllEmployees().find((emp) => emp.employeeId === user.employeeId)?.salary || 0) / 12,
                          ).toLocaleString()
                        : "N/A"}
                    </div>
                    <div className="text-muted-foreground">Monthly</div>
                  </div>
                  <div>
                    <div className="font-semibold">
                      $
                      {user
                        ? Math.round(
                            (getAllEmployees().find((emp) => emp.employeeId === user.employeeId)?.salary || 0) / 26,
                          ).toLocaleString()
                        : "N/A"}
                    </div>
                    <div className="text-muted-foreground">Bi-weekly</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
