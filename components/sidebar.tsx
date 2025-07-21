"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  LayoutDashboard,
  FileText,
  ShoppingCart,
  Package,
  CreditCard,
  ArrowLeftRight,
  Building2,
  Users,
  Truck,
  Calendar,
  UserCheck,
} from "lucide-react"

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Agreements",
    href: "/agreements",
    icon: FileText,
  },
  {
    name: "Saudas",
    href: "/saudas",
    icon: ShoppingCart,
  },
  {
    name: "Lots",
    href: "/lots",
    icon: Package,
  },
  {
    name: "Payments",
    href: "/payments",
    icon: CreditCard,
  },
  // {
  //   name: "Bag Transactions",
  //   href: "/bag-transactions",
  //   icon: ArrowLeftRight,
  // },
]

const masters = [
  {
    name: "CMR Years",
    href: "/masters/cmr-years",
    icon: Calendar,
  },
  {
    name: "Mills",
    href: "/masters/mills",
    icon: Building2,
  },
  {
    name: "Brokers",
    href: "/masters/brokers",
    icon: UserCheck,
  },
  {
    name: "Parties",
    href: "/masters/parties",
    icon: Users,
  },
  {
    name: "Vehicles",
    href: "/masters/vehicles",
    icon: Truck,
  },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="flex h-full w-64 flex-col bg-gray-50 dark:bg-gray-900">
      <div className="flex h-16 items-center border-b px-6">
        <h1 className="text-xl font-semibold">Paddy Rice ERP</h1>
      </div>
      <ScrollArea className="flex-1 px-3 py-4">
        <div className="space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Button
                key={item.name}
                variant={isActive ? "secondary" : "ghost"}
                className={cn("w-full justify-start", isActive && "bg-gray-200 dark:bg-gray-800")}
                asChild
              >
                <Link href={item.href}>
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.name}
                </Link>
              </Button>
            )
          })}
        </div>
        <div className="mt-8">
          <h3 className="mb-2 px-3 text-sm font-medium text-gray-500 dark:text-gray-400">Masters</h3>
          <div className="space-y-1">
            {masters.map((item) => {
              const isActive = pathname === item.href
              return (
                <Button
                  key={item.name}
                  variant={isActive ? "secondary" : "ghost"}
                  className={cn("w-full justify-start", isActive && "bg-gray-200 dark:bg-gray-800")}
                  asChild
                >
                  <Link href={item.href}>
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.name}
                  </Link>
                </Button>
              )
            })}
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}
