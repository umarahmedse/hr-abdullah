"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { getCurrentUser, type User } from "@/lib/auth"
import {
  Bell,
  Moon,
  Sun,
  Shield,
  Smartphone,
  Mail,
  Calendar,
  MessageSquare,
  AlertTriangle,
  Save,
  RefreshCw,
} from "lucide-react"

export default function SettingsPage() {
  const [user, setUser] = useState<User | null>(null)
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: true,
      leaveRequests: true,
      performanceReviews: true,
      complaints: false,
      suggestions: true,
      accidents: true,
      systemUpdates: false,
    },
    preferences: {
      theme: "system",
      language: "en",
      timezone: "UTC-5",
      dateFormat: "MM/DD/YYYY",
      startOfWeek: "monday",
    },
    privacy: {
      profileVisibility: "team",
      showSalary: false,
      showContactInfo: true,
      allowDirectMessages: true,
    },
  })

  useEffect(() => {
    const currentUser = getCurrentUser()
    if (currentUser) {
      setUser(currentUser)
      // In a real app, load user settings from backend
    }
  }, [])

  const handleNotificationChange = (key: string, value: boolean) => {
    setSettings((prev) => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: value,
      },
    }))
  }

  const handlePreferenceChange = (key: string, value: string) => {
    setSettings((prev) => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [key]: value,
      },
    }))
  }

  const handlePrivacyChange = (key: string, value: boolean | string) => {
    setSettings((prev) => ({
      ...prev,
      privacy: {
        ...prev.privacy,
        [key]: value,
      },
    }))
  }

  const handleSaveSettings = () => {
    // In a real app, save settings to backend
    console.log("Saving settings:", settings)
    // Show success message
  }

  const handleResetSettings = () => {
    // Reset to default settings
    setSettings({
      notifications: {
        email: true,
        push: true,
        leaveRequests: true,
        performanceReviews: true,
        complaints: false,
        suggestions: true,
        accidents: true,
        systemUpdates: false,
      },
      preferences: {
        theme: "system",
        language: "en",
        timezone: "UTC-5",
        dateFormat: "MM/DD/YYYY",
        startOfWeek: "monday",
      },
      privacy: {
        profileVisibility: "team",
        showSalary: false,
        showContactInfo: true,
        allowDirectMessages: true,
      },
    })
  }

  if (!user) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Settings</h1>
            <p className="text-muted-foreground">Manage your application preferences and privacy settings</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleResetSettings} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Reset
            </Button>
            <Button onClick={handleSaveSettings} size="sm">
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </div>

        <div className="grid gap-6">
          {/* Notification Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Preferences
              </CardTitle>
              <CardDescription>
                Choose how you want to be notified about important updates and activities
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-4">
                  <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                    Delivery Methods
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <Label htmlFor="email-notifications">Email Notifications</Label>
                      </div>
                      <Switch
                        id="email-notifications"
                        checked={settings.notifications.email}
                        onCheckedChange={(value) => handleNotificationChange("email", value)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Smartphone className="h-4 w-4 text-muted-foreground" />
                        <Label htmlFor="push-notifications">Push Notifications</Label>
                      </div>
                      <Switch
                        id="push-notifications"
                        checked={settings.notifications.push}
                        onCheckedChange={(value) => handleNotificationChange("push", value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">Activity Types</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <Label htmlFor="leave-notifications">Leave Requests</Label>
                      </div>
                      <Switch
                        id="leave-notifications"
                        checked={settings.notifications.leaveRequests}
                        onCheckedChange={(value) => handleNotificationChange("leaveRequests", value)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Badge className="h-4 w-4 text-muted-foreground" />
                        <Label htmlFor="performance-notifications">Performance Reviews</Label>
                      </div>
                      <Switch
                        id="performance-notifications"
                        checked={settings.notifications.performanceReviews}
                        onCheckedChange={(value) => handleNotificationChange("performanceReviews", value)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <MessageSquare className="h-4 w-4 text-muted-foreground" />
                        <Label htmlFor="complaint-notifications">Complaints</Label>
                      </div>
                      <Switch
                        id="complaint-notifications"
                        checked={settings.notifications.complaints}
                        onCheckedChange={(value) => handleNotificationChange("complaints", value)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                        <Label htmlFor="accident-notifications">Accident Reports</Label>
                      </div>
                      <Switch
                        id="accident-notifications"
                        checked={settings.notifications.accidents}
                        onCheckedChange={(value) => handleNotificationChange("accidents", value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Appearance & Preferences */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sun className="h-5 w-5" />
                Appearance & Preferences
              </CardTitle>
              <CardDescription>Customize how the application looks and behaves for you</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="theme">Theme</Label>
                    <Select
                      value={settings.preferences.theme}
                      onValueChange={(value) => handlePreferenceChange("theme", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">
                          <div className="flex items-center gap-2">
                            <Sun className="h-4 w-4" />
                            Light
                          </div>
                        </SelectItem>
                        <SelectItem value="dark">
                          <div className="flex items-center gap-2">
                            <Moon className="h-4 w-4" />
                            Dark
                          </div>
                        </SelectItem>
                        <SelectItem value="system">
                          <div className="flex items-center gap-2">
                            <Smartphone className="h-4 w-4" />
                            System
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="language">Language</Label>
                    <Select
                      value={settings.preferences.language}
                      onValueChange={(value) => handlePreferenceChange("language", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Español</SelectItem>
                        <SelectItem value="fr">Français</SelectItem>
                        <SelectItem value="de">Deutsch</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select
                      value={settings.preferences.timezone}
                      onValueChange={(value) => handlePreferenceChange("timezone", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="UTC-8">Pacific Time (UTC-8)</SelectItem>
                        <SelectItem value="UTC-7">Mountain Time (UTC-7)</SelectItem>
                        <SelectItem value="UTC-6">Central Time (UTC-6)</SelectItem>
                        <SelectItem value="UTC-5">Eastern Time (UTC-5)</SelectItem>
                        <SelectItem value="UTC+0">UTC</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="date-format">Date Format</Label>
                    <Select
                      value={settings.preferences.dateFormat}
                      onValueChange={(value) => handlePreferenceChange("dateFormat", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                        <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                        <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="start-of-week">Start of Week</Label>
                    <Select
                      value={settings.preferences.startOfWeek}
                      onValueChange={(value) => handlePreferenceChange("startOfWeek", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sunday">Sunday</SelectItem>
                        <SelectItem value="monday">Monday</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Privacy Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Privacy & Security
              </CardTitle>
              <CardDescription>Control who can see your information and how you interact with others</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="profile-visibility">Profile Visibility</Label>
                    <p className="text-sm text-muted-foreground">Who can view your profile information</p>
                  </div>
                  <Select
                    value={settings.privacy.profileVisibility}
                    onValueChange={(value) => handlePrivacyChange("profileVisibility", value)}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Public</SelectItem>
                      <SelectItem value="team">Team Only</SelectItem>
                      <SelectItem value="private">Private</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="show-salary">Show Salary Information</Label>
                    <p className="text-sm text-muted-foreground">Display salary in your profile</p>
                  </div>
                  <Switch
                    id="show-salary"
                    checked={settings.privacy.showSalary}
                    onCheckedChange={(value) => handlePrivacyChange("showSalary", value)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="show-contact">Show Contact Information</Label>
                    <p className="text-sm text-muted-foreground">Allow others to see your contact details</p>
                  </div>
                  <Switch
                    id="show-contact"
                    checked={settings.privacy.showContactInfo}
                    onCheckedChange={(value) => handlePrivacyChange("showContactInfo", value)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="direct-messages">Allow Direct Messages</Label>
                    <p className="text-sm text-muted-foreground">Let colleagues send you direct messages</p>
                  </div>
                  <Switch
                    id="direct-messages"
                    checked={settings.privacy.allowDirectMessages}
                    onCheckedChange={(value) => handlePrivacyChange("allowDirectMessages", value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
