"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { X, ArrowRight, ArrowLeft, Sparkles } from "lucide-react"
import type { User } from "@/lib/auth"
import { ConfettiCelebration } from "@/components/confetti/confetti-celebration"
import { PartyPopper } from "@/components/confetti/party-popper"

interface OnboardingStep {
  id: string
  title: string
  description: string
  target: string
  position: "top" | "bottom" | "left" | "right"
  content?: React.ReactNode
}

interface OnboardingTourProps {
  user: User
  onComplete: () => void
  onSkip: () => void
}

export function OnboardingTour({ user, onComplete, onSkip }: OnboardingTourProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [isVisible, setIsVisible] = useState(true)
  const [showCelebration, setShowCelebration] = useState(false)
  const [showPartyPopper, setShowPartyPopper] = useState(false)

  const employeeSteps: OnboardingStep[] = [
    {
      id: "welcome",
      title: "Welcome to Your HRMS Dashboard!",
      description: "Let's take a quick tour to help you get started with your personal workspace.",
      target: "dashboard-header",
      position: "bottom",
      content: (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-yellow-500" />
            <span className="font-medium">Welcome aboard, {user.name.split(" ")[0]}!</span>
          </div>
          <p className="text-sm text-muted-foreground">
            This dashboard is your central hub for managing your work life, tracking performance, and staying connected
            with your team.
          </p>
        </div>
      ),
    },
    {
      id: "navigation",
      title: "Navigation Sidebar",
      description: "Access all your tools and features from the sidebar. Click on any item to navigate.",
      target: "sidebar",
      position: "right",
    },
    {
      id: "profile",
      title: "Your Profile Menu",
      description: "Click your avatar to access your profile, settings, and logout options.",
      target: "user-avatar",
      position: "left",
    },
    {
      id: "performance",
      title: "Your Performance",
      description: "Track your goals, review scores, and monitor your professional growth.",
      target: "performance-card",
      position: "top",
    },
    {
      id: "leave",
      title: "Leave Balance",
      description: "View your available leave days and track your time off usage.",
      target: "leave-card",
      position: "top",
    },
  ]

  const hrSteps: OnboardingStep[] = [
    {
      id: "welcome",
      title: "Welcome to HR Analytics Dashboard!",
      description: "Your comprehensive command center for managing the entire organization.",
      target: "dashboard-header",
      position: "bottom",
      content: (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-yellow-500" />
            <span className="font-medium">Welcome, {user.name.split(" ")[0]}!</span>
          </div>
          <p className="text-sm text-muted-foreground">
            As an HR Manager, you have access to powerful analytics, employee management tools, and organizational
            insights.
          </p>
        </div>
      ),
    },
    {
      id: "navigation",
      title: "HR Navigation",
      description: "Access employee management, departments, performance reviews, and more from the sidebar.",
      target: "sidebar",
      position: "right",
    },
    {
      id: "metrics",
      title: "Key Metrics",
      description: "Monitor employee count, departments, pending actions, and overall performance at a glance.",
      target: "metrics-grid",
      position: "bottom",
    },
    {
      id: "charts",
      title: "Analytics Charts",
      description: "Visualize department performance, leave trends, and workforce insights with interactive charts.",
      target: "charts-section",
      position: "top",
    },
    {
      id: "profile",
      title: "Your Profile Menu",
      description: "Access your profile, settings, and logout options from your avatar.",
      target: "user-avatar",
      position: "left",
    },
  ]

  const steps = user.role === "hr" ? hrSteps : employeeSteps

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      handleComplete()
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleComplete = () => {
    setIsVisible(false)
    setShowPartyPopper(true)
    setShowCelebration(true)
  }

  const handleSkip = () => {
    setIsVisible(false)
    onSkip()
  }

  const handleCelebrationComplete = () => {
    setShowCelebration(false)
    setShowPartyPopper(false)
    onComplete()
  }

  if (!isVisible && !showCelebration && !showPartyPopper) return null

  const currentStepData = steps[currentStep]

  return (
    <>
      {/* Tour Card */}
      {isVisible && (
        <>
          {/* Overlay */}
          <div className="fixed inset-0 bg-black/50 z-50" />

          {/* Tour Card */}
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md mx-4">
            <Card className="shadow-2xl border-2">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      Step {currentStep + 1} of {steps.length}
                    </Badge>
                    <Badge variant={user.role === "hr" ? "default" : "secondary"} className="text-xs">
                      {user.role === "hr" ? "HR Tour" : "Employee Tour"}
                    </Badge>
                  </div>
                  <Button variant="ghost" size="sm" onClick={handleSkip}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <CardTitle className="text-xl">{currentStepData.title}</CardTitle>
                <CardDescription>{currentStepData.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {currentStepData.content && <div className="p-3 bg-muted rounded-lg">{currentStepData.content}</div>}

                <div className="flex items-center justify-between">
                  <Button variant="outline" size="sm" onClick={handlePrevious} disabled={currentStep === 0}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Previous
                  </Button>

                  <div className="flex gap-1">
                    {steps.map((_, index) => (
                      <div
                        key={index}
                        className={`w-2 h-2 rounded-full transition-colors ${
                          index === currentStep ? "bg-primary" : "bg-muted"
                        }`}
                      />
                    ))}
                  </div>

                  <Button size="sm" onClick={handleNext}>
                    {currentStep === steps.length - 1 ? "Finish" : "Next"}
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>

                <div className="text-center">
                  <Button variant="ghost" size="sm" onClick={handleSkip} className="text-muted-foreground">
                    Skip tour
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}

      <PartyPopper trigger={showPartyPopper} onComplete={() => setShowPartyPopper(false)} />
      <ConfettiCelebration trigger={showCelebration} onComplete={handleCelebrationComplete} duration={4000} />
    </>
  )
}
