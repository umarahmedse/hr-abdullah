"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getCurrentUser, type User } from "@/lib/auth"
import { getOnboardingState, setOnboardingCompleted, setOnboardingSkipped } from "@/lib/onboarding"
import { Sidebar } from "./sidebar"
import { Header } from "./header"
import { OnboardingTour } from "@/components/onboarding/onboarding-tour"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showOnboarding, setShowOnboarding] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const currentUser = getCurrentUser()
    if (!currentUser) {
      router.push("/")
      return
    }
    setUser(currentUser)

    const onboardingState = getOnboardingState(currentUser.id)
    if (!onboardingState.hasCompletedOnboarding) {
      setShowOnboarding(true)
    }

    setLoading(false)
  }, [router])

  const handleOnboardingComplete = () => {
    if (user) {
      setOnboardingCompleted(user.id)
      setShowOnboarding(false)
    }
  }

  const handleOnboardingSkip = () => {
    if (user) {
      setOnboardingSkipped(user.id)
      setShowOnboarding(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="flex h-screen bg-background">
      <div className="hidden md:block md:w-64 md:flex-shrink-0" id="sidebar">
        <Sidebar userRole={user.role} isOpen={false} onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setSidebarOpen(false)} />
          <div className="md:hidden">
            <Sidebar userRole={user.role} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
          </div>
        </>
      )}

      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <Header user={user} onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 overflow-auto p-4 md:p-6">{children}</main>
      </div>

      {showOnboarding && (
        <OnboardingTour user={user} onComplete={handleOnboardingComplete} onSkip={handleOnboardingSkip} />
      )}
    </div>
  )
}
