"use client"

import { useEffect, useState } from "react"

interface PartyPopperProps {
  trigger: boolean
  onComplete?: () => void
}

export function PartyPopper({ trigger, onComplete }: PartyPopperProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (!trigger) return

    setIsVisible(true)

    const timer = setTimeout(() => {
      setIsVisible(false)
      onComplete?.()
    }, 2000)

    return () => clearTimeout(timer)
  }, [trigger, onComplete])

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-50">
      <div className="text-8xl animate-bounce">🎉</div>
      <div className="absolute top-1/4 left-1/4 text-6xl animate-pulse animation-delay-200">🎊</div>
      <div className="absolute top-1/3 right-1/4 text-5xl animate-bounce animation-delay-500">✨</div>
      <div className="absolute bottom-1/3 left-1/3 text-4xl animate-pulse animation-delay-700">🎈</div>
      <div className="absolute bottom-1/4 right-1/3 text-6xl animate-bounce animation-delay-300">🎆</div>
    </div>
  )
}
