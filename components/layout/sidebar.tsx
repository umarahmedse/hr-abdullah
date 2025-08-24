"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Building2,
  LayoutDashboard,
  Users,
  Calendar,
  TrendingUp,
  MessageSquare,
  Lightbulb,
  AlertTriangle,
  X,
  Building,
} from "lucide-react"
import Image from "next/image"

interface SidebarProps {
  userRole: "employee" | "hr"
  isOpen?: boolean
  onClose?: () => void
}

export function Sidebar({ userRole, isOpen = false, onClose }: SidebarProps) {
  const pathname = usePathname()

  const employeeNavItems = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/leave", label: "Leave Requests", icon: Calendar },
    { href: "/performance", label: "Performance", icon: TrendingUp },
    { href: "/complaints", label: "Complaints", icon: MessageSquare },
    { href: "/suggestions", label: "Suggestions", icon: Lightbulb },
    { href: "/accidents", label: "Accident Reports", icon: AlertTriangle },
  ]

  const hrNavItems = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/employees", label: "Employee Management", icon: Users },
    { href: "/departments", label: "Department Management", icon: Building },
    { href: "/leave", label: "Leave Management", icon: Calendar },
    { href: "/performance", label: "Performance Reviews", icon: TrendingUp },
    { href: "/complaints", label: "Complaints", icon: MessageSquare },
    { href: "/suggestions", label: "Suggestions", icon: Lightbulb },
    { href: "/accidents", label: "Accident Reports", icon: AlertTriangle },
  ]

  const navItems = userRole === "hr" ? hrNavItems : employeeNavItems

  return (
    <div
      className={cn(
        "flex flex-col h-full bg-background border-r border-border transition-all duration-300",
        "md:static md:w-64",
        // Mobile: fixed overlay when open
        isOpen ? "fixed inset-y-0 left-0 w-64 z-50 md:relative" : "hidden md:flex",
      )}
    >
      <div className="flex items-center justify-between md:justify-center p-4 border-b border-border">
        <div className="flex items-center space-x-2">
          <Image
            src="/logo.gif"
            alt="Logo"
            width={200}
            height={100}
            className=" text-primary"
          />
        </div>

        <Button variant="ghost" size="sm" onClick={onClose} className="md:hidden text-foreground hover:bg-accent">
          <X className="h-4 w-4" />
        </Button>
      </div>

      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href

            return (
              <Link key={item.href} href={item.href} onClick={onClose}>
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start text-foreground hover:bg-accent hover:text-accent-foreground",
                    isActive && "bg-accent text-accent-foreground font-medium",
                  )}
                >
                  <Icon className="h-4 w-4 mr-3" />
                  <span>{item.label}</span>
                </Button>
              </Link>
            )
          })}
        </nav>
      </ScrollArea>
    </div>
  )
}
