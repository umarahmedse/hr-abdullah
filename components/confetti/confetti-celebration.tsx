"use client"

import { useEffect, useState } from "react"

interface ConfettiPiece {
  id: number
  x: number
  y: number
  vx: number
  vy: number
  color: string
  size: number
  rotation: number
  rotationSpeed: number
}

interface ConfettiCelebrationProps {
  trigger: boolean
  onComplete?: () => void
  duration?: number
}

export function ConfettiCelebration({ trigger, onComplete, duration = 3000 }: ConfettiCelebrationProps) {
  const [confetti, setConfetti] = useState<ConfettiPiece[]>([])
  const [isActive, setIsActive] = useState(false)

  const colors = [
    "#FF6B6B", // Red
    "#4ECDC4", // Teal
    "#45B7D1", // Blue
    "#96CEB4", // Green
    "#FFEAA7", // Yellow
    "#DDA0DD", // Plum
    "#98D8C8", // Mint
    "#F7DC6F", // Light Yellow
    "#BB8FCE", // Light Purple
    "#85C1E9", // Light Blue
  ]

  const createConfettiPiece = (id: number): ConfettiPiece => {
    return {
      id,
      x: Math.random() * window.innerWidth,
      y: -10,
      vx: (Math.random() - 0.5) * 4,
      vy: Math.random() * 3 + 2,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: Math.random() * 8 + 4,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 10,
    }
  }

  useEffect(() => {
    if (!trigger) return

    setIsActive(true)

    // Create initial confetti burst
    const initialConfetti = Array.from({ length: 100 }, (_, i) => createConfettiPiece(i))
    setConfetti(initialConfetti)

    let animationId: number
    const startTime = Date.now()

    const animate = () => {
      const currentTime = Date.now()
      const elapsed = currentTime - startTime

      if (elapsed > duration) {
        setIsActive(false)
        setConfetti([])
        onComplete?.()
        return
      }

      setConfetti((prevConfetti) => {
        return prevConfetti
          .map((piece) => ({
            ...piece,
            x: piece.x + piece.vx,
            y: piece.y + piece.vy,
            vy: piece.vy + 0.1, // gravity
            rotation: piece.rotation + piece.rotationSpeed,
          }))
          .filter((piece) => piece.y < window.innerHeight + 50) // Remove pieces that fall off screen
      })

      // Add new confetti pieces occasionally during the first second
      if (elapsed < 1000 && Math.random() < 0.3) {
        setConfetti((prev) => [...prev, ...Array.from({ length: 5 }, (_, i) => createConfettiPiece(prev.length + i))])
      }

      animationId = requestAnimationFrame(animate)
    }

    animationId = requestAnimationFrame(animate)

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId)
      }
    }
  }, [trigger, duration, onComplete])

  if (!isActive || confetti.length === 0) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {confetti.map((piece) => (
        <div
          key={piece.id}
          className="absolute"
          style={{
            left: `${piece.x}px`,
            top: `${piece.y}px`,
            width: `${piece.size}px`,
            height: `${piece.size}px`,
            backgroundColor: piece.color,
            transform: `rotate(${piece.rotation}deg)`,
            borderRadius: Math.random() > 0.5 ? "50%" : "2px",
          }}
        />
      ))}
    </div>
  )
}
