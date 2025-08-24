"use client"

import { useEffect } from "react"
import { initializeApp } from "@/lib/seeder"

export function SeederInitializer() {
  useEffect(() => {
    // Initialize demo data on client side
    initializeApp()
  }, [])

  return null // This component doesn't render anything
}
