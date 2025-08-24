"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  seedDemoData,
  clearAllData,
  demoUsers,
  demoEmployees,
  demoLeaveRequests,
  demoPerformanceReviews,
  demoFeedback,
} from "@/lib/seeder"
import { Database, Trash2, RefreshCw, Users, Calendar, TrendingUp, MessageSquare } from "lucide-react"

export function DataSeeder() {
  const [isSeeding, setIsSeeding] = useState(false)
  const [isClearing, setIsClearing] = useState(false)
  const [lastAction, setLastAction] = useState<string>("")

  const handleSeedData = async () => {
    setIsSeeding(true)
    try {
      seedDemoData()
      setLastAction("Data seeded successfully!")
      // Refresh the page to show new data
      setTimeout(() => {
        window.location.reload()
      }, 1000)
    } catch (error) {
      setLastAction("Error seeding data")
    } finally {
      setIsSeeding(false)
    }
  }

  const handleClearData = async () => {
    setIsClearing(true)
    try {
      clearAllData()
      setLastAction("All data cleared successfully!")
      // Refresh the page
      setTimeout(() => {
        window.location.reload()
      }, 1000)
    } catch (error) {
      setLastAction("Error clearing data")
    } finally {
      setIsClearing(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            HRMS Demo Data Management
          </CardTitle>
          <CardDescription>
            Manage demo data for the HRMS application. This is useful for testing and demonstration purposes.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <Button onClick={handleSeedData} disabled={isSeeding} className="flex items-center gap-2">
              {isSeeding ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Database className="h-4 w-4" />}
              {isSeeding ? "Seeding..." : "Seed Demo Data"}
            </Button>

            <Button
              variant="destructive"
              onClick={handleClearData}
              disabled={isClearing}
              className="flex items-center gap-2"
            >
              {isClearing ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
              {isClearing ? "Clearing..." : "Clear All Data"}
            </Button>
          </div>

          {lastAction && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-md">
              <p className="text-sm text-green-800">{lastAction}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Demo Data Overview</CardTitle>
          <CardDescription>Preview of the data that will be seeded into the application</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
              <Users className="h-8 w-8 text-blue-600" />
              <div>
                <p className="font-semibold text-blue-900">{demoUsers.length} Users</p>
                <p className="text-sm text-blue-700">Login accounts</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
              <Users className="h-8 w-8 text-green-600" />
              <div>
                <p className="font-semibold text-green-900">{demoEmployees.length} Employees</p>
                <p className="text-sm text-green-700">Employee records</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
              <Calendar className="h-8 w-8 text-orange-600" />
              <div>
                <p className="font-semibold text-orange-900">{demoLeaveRequests.length} Leave Requests</p>
                <p className="text-sm text-orange-700">Various statuses</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
              <TrendingUp className="h-8 w-8 text-purple-600" />
              <div>
                <p className="font-semibold text-purple-900">{demoPerformanceReviews.length} Reviews</p>
                <p className="text-sm text-purple-700">Performance data</p>
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Feedback Items ({demoFeedback.length})
            </h4>
            <div className="flex gap-2 flex-wrap">
              <Badge variant="outline">{demoFeedback.filter((f) => f.type === "complaint").length} Complaints</Badge>
              <Badge variant="outline">{demoFeedback.filter((f) => f.type === "suggestion").length} Suggestions</Badge>
              <Badge variant="outline">
                {demoFeedback.filter((f) => f.type === "accident").length} Accident Reports
              </Badge>
            </div>
          </div>

          <Separator />

          <div>
            <h4 className="font-semibold mb-3">Demo Login Credentials</h4>
            <div className="space-y-2">
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="font-medium">HR Manager:</p>
                <p className="text-sm text-gray-600">Email: sarah.wilson@company.com</p>
                <p className="text-sm text-gray-600">Password: password123</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="font-medium">Employee:</p>
                <p className="text-sm text-gray-600">Email: john.doe@company.com</p>
                <p className="text-sm text-gray-600">Password: password123</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
