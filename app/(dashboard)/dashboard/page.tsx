import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, ShoppingCart, Package, CreditCard, TrendingUp, Building2 } from "lucide-react"

async function getDashboardStats() {
  // In a real app, you'd fetch this from your API
  return {
    totalAgreements: 45,
    activeSaudas: 23,
    pendingLots: 12,
    totalPayments: 156,
    totalRevenue: 2450000,
    activeMills: 8,
  }
}

export default async function DashboardPage() {
  const stats = await getDashboardStats()

  const cards = [
    {
      title: "Total Agreements",
      value: stats.totalAgreements,
      description: "Active agreements",
      icon: FileText,
      color: "text-blue-600",
    },
    {
      title: "Active Saudas",
      value: stats.activeSaudas,
      description: "Purchase agreements",
      icon: ShoppingCart,
      color: "text-green-600",
    },
    {
      title: "Pending Lots",
      value: stats.pendingLots,
      description: "Lots in processing",
      icon: Package,
      color: "text-orange-600",
    },
    {
      title: "Total Payments",
      value: stats.totalPayments,
      description: "Payment transactions",
      icon: CreditCard,
      color: "text-purple-600",
    },
    {
      title: "Total Revenue",
      value: `₹${stats.totalRevenue.toLocaleString()}`,
      description: "This month",
      icon: TrendingUp,
      color: "text-emerald-600",
    },
    {
      title: "Active Mills",
      value: stats.activeMills,
      description: "Operational mills",
      icon: Building2,
      color: "text-indigo-600",
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your paddy rice processing operations</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {cards.map((card, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
              <card.icon className={`h-4 w-4 ${card.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              <p className="text-xs text-muted-foreground">{card.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest transactions and updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">New agreement created</p>
                  <p className="text-xs text-muted-foreground">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Lot #14127 processed</p>
                  <p className="text-xs text-muted-foreground">4 hours ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Payment received</p>
                  <p className="text-xs text-muted-foreground">6 hours ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <button className="w-full text-left p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800">
                Create New Agreement
              </button>
              <button className="w-full text-left p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800">
                Add New Sauda
              </button>
              <button className="w-full text-left p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800">
                Process Lot
              </button>
              <button className="w-full text-left p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800">
                Record Payment
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
