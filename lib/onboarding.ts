export interface OnboardingState {
  hasCompletedOnboarding: boolean
  completedAt?: string
  skippedAt?: string
}

const ONBOARDING_STORAGE_KEY = "hrms_onboarding_state"

export function getOnboardingState(userId: string): OnboardingState {
  if (typeof window === "undefined") {
    return { hasCompletedOnboarding: false }
  }

  try {
    const stored = localStorage.getItem(`${ONBOARDING_STORAGE_KEY}_${userId}`)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (error) {
    console.error("Error reading onboarding state:", error)
  }

  return { hasCompletedOnboarding: false }
}

export function setOnboardingCompleted(userId: string): void {
  if (typeof window === "undefined") return

  const state: OnboardingState = {
    hasCompletedOnboarding: true,
    completedAt: new Date().toISOString(),
  }

  try {
    localStorage.setItem(`${ONBOARDING_STORAGE_KEY}_${userId}`, JSON.stringify(state))
  } catch (error) {
    console.error("Error saving onboarding state:", error)
  }
}

export function setOnboardingSkipped(userId: string): void {
  if (typeof window === "undefined") return

  const state: OnboardingState = {
    hasCompletedOnboarding: true,
    skippedAt: new Date().toISOString(),
  }

  try {
    localStorage.setItem(`${ONBOARDING_STORAGE_KEY}_${userId}`, JSON.stringify(state))
  } catch (error) {
    console.error("Error saving onboarding state:", error)
  }
}

export function resetOnboarding(userId: string): void {
  if (typeof window === "undefined") return

  try {
    localStorage.removeItem(`${ONBOARDING_STORAGE_KEY}_${userId}`)
  } catch (error) {
    console.error("Error resetting onboarding state:", error)
  }
}
