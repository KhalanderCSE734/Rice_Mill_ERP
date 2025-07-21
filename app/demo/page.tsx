"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  FileText,
  ShoppingCart,
  Package,
  CreditCard,
  TrendingUp,
  Building2,
  ArrowLeftRight,
  Plus,
  Edit,
  Trash2,
  ArrowUp,
  ArrowDown,
} from "lucide-react"

// Mock data for demonstration
const mockData = {
  stats: {
    totalAgreements: 45,
    activeSaudas: 23,
    pendingLots: 12,
    totalPayments: 156,
    totalRevenue: 2450000,
    activeMills: 8,
  },
  cmrYears: [
    { _id: "1", year_range: "2024-25", createdAt: "2024-01-15" },
    { _id: "2", year_range: "2023-24", createdAt: "2023-01-15" },
  ],
  mills: [
    {
      _id: "1",
      mill_code: "MILL001",
      name: "Sunrise Rice Mill",
      cmr_year: { year_range: "2024-25" },
      phone: "+91 9876543210",
      is_active: true,
    },
    {
      _id: "2",
      mill_code: "MILL002",
      name: "Golden Grain Mill",
      cmr_year: { year_range: "2024-25" },
      phone: "+91 9876543211",
      is_active: true,
    },
  ],
  brokers: [
    { _id: "1", broker_code: "BRK001", name: "Rajesh Kumar", phone: "+91 9876543212", brokerage_rate: 2.5 },
    { _id: "2", broker_code: "BRK002", name: "Suresh Patel", phone: "+91 9876543213", brokerage_rate: 3.0 },
  ],
  parties: [
    {
      _id: "1",
      party_code: "PTY001",
      name: "ABC Traders",
      category: "Trader",
      phone: "+91 9876543214",
      gst_no: "27ABCDE1234F1Z5",
    },
    {
      _id: "2",
      party_code: "PTY002",
      name: "XYZ Farmers Co-op",
      category: "Farmer",
      phone: "+91 9876543215",
      gst_no: "",
    },
  ],
  vehicles: [
    { _id: "1", vehicle_no: "CG07CG4240", owner_name: "Ram Singh", capacity_ton: 10, remarks: "Good condition" },
    { _id: "2", vehicle_no: "MP09AB1234", owner_name: "Shyam Verma", capacity_ton: 15, remarks: "Heavy duty truck" },
  ],
  agreements: [
    {
      _id: "1",
      agreement_no: "AC122024430119",
      mill: { name: "Sunrise Rice Mill" },
      rice_type: "Boiled",
      base_rate: 2500,
      validity_from: "2024-01-01",
      validity_to: "2024-12-31",
    },
    {
      _id: "2",
      agreement_no: "AC122024430120",
      mill: { name: "Golden Grain Mill" },
      rice_type: "Raw",
      base_rate: 2400,
      validity_from: "2024-01-01",
      validity_to: "2024-12-31",
    },
  ],
  saudas: [
    {
      _id: "1",
      sauda_code: "SDA001",
      sauda_date: "2024-01-15",
      party: { name: "ABC Traders" },
      broker: { name: "Rajesh Kumar" },
      rice_type: "Boiled",
      rate_per_qtl: 2500,
      status: "Open",
    },
    {
      _id: "2",
      sauda_code: "SDA002",
      sauda_date: "2024-01-16",
      party: { name: "XYZ Farmers Co-op" },
      broker: { name: "Suresh Patel" },
      rice_type: "Raw",
      rate_per_qtl: 2400,
      status: "Partial",
    },
  ],
  lots: [
    {
      _id: "1",
      lot_no: "14127",
      sauda: { sauda_code: "SDA001" },
      qtl: 100,
      bags: 200,
      net_rice_qtl: 95,
      net_amount: 237500,
      nett_amount_final: 235000,
    },
    {
      _id: "2",
      lot_no: "14128",
      sauda: { sauda_code: "SDA002" },
      qtl: 150,
      bags: 300,
      net_rice_qtl: 145,
      net_amount: 348000,
      nett_amount_final: 345000,
    },
  ],
  payments: [
    {
      _id: "1",
      payment_date: "2024-01-20",
      payer: { name: "ABC Traders" },
      payee: { name: "Sunrise Rice Mill" },
      amount: 100000,
      mode: "Bank",
      reference_no: "TXN123456",
    },
    {
      _id: "2",
      payment_date: "2024-01-21",
      payer: { name: "XYZ Farmers Co-op" },
      payee: { name: "Golden Grain Mill" },
      amount: 150000,
      mode: "UPI",
      reference_no: "UPI789012",
    },
  ],
  bagTransactions: [
    {
      _id: "1",
      date: "2024-01-15",
      ref_type: "Lot",
      ref_id: "14127",
      bag_type: "NewJute",
      quantity: 200,
      action: "In",
      remarks: "Fresh stock",
    },
    {
      _id: "2",
      date: "2024-01-16",
      ref_type: "Sale",
      ref_id: "SAL001",
      bag_type: "NewJute",
      quantity: 100,
      action: "Out",
      remarks: "Sold to customer",
    },
  ],
}

export default function DemoPage() {
  const [activeTab, setActiveTab] = useState("dashboard")

  const DashboardContent = () => {
    const cards = [
      {
        title: "Total Agreements",
        value: mockData.stats.totalAgreements,
        description: "Active agreements",
        icon: FileText,
        color: "text-blue-600",
      },
      {
        title: "Active Saudas",
        value: mockData.stats.activeSaudas,
        description: "Purchase agreements",
        icon: ShoppingCart,
        color: "text-green-600",
      },
      {
        title: "Pending Lots",
        value: mockData.stats.pendingLots,
        description: "Lots in processing",
        icon: Package,
        color: "text-orange-600",
      },
      {
        title: "Total Payments",
        value: mockData.stats.totalPayments,
        description: "Payment transactions",
        icon: CreditCard,
        color: "text-purple-600",
      },
      {
        title: "Total Revenue",
        value: `₹${mockData.stats.totalRevenue.toLocaleString()}`,
        description: "This month",
        icon: TrendingUp,
        color: "text-emerald-600",
      },
      {
        title: "Active Mills",
        value: mockData.stats.activeMills,
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
                <Button variant="ghost" className="w-full justify-start" onClick={() => setActiveTab("agreements")}>
                  <FileText className="mr-2 h-4 w-4" />
                  Create New Agreement
                </Button>
                <Button variant="ghost" className="w-full justify-start" onClick={() => setActiveTab("saudas")}>
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Add New Sauda
                </Button>
                <Button variant="ghost" className="w-full justify-start" onClick={() => setActiveTab("lots")}>
                  <Package className="mr-2 h-4 w-4" />
                  Process Lot
                </Button>
                <Button variant="ghost" className="w-full justify-start" onClick={() => setActiveTab("payments")}>
                  <CreditCard className="mr-2 h-4 w-4" />
                  Record Payment
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const MastersContent = () => (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Masters</h1>
        <p className="text-muted-foreground">Manage master data</p>
      </div>

      <Tabs defaultValue="cmr-years" className="space-y-4">
        <TabsList>
          <TabsTrigger value="cmr-years">CMR Years</TabsTrigger>
          <TabsTrigger value="mills">Mills</TabsTrigger>
          <TabsTrigger value="brokers">Brokers</TabsTrigger>
          <TabsTrigger value="parties">Parties</TabsTrigger>
          <TabsTrigger value="vehicles">Vehicles</TabsTrigger>
        </TabsList>

        <TabsContent value="cmr-years">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>CMR Years</CardTitle>
                <CardDescription>Manage CMR year ranges</CardDescription>
              </div>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add CMR Year
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Year Range</TableHead>
                    <TableHead>Created At</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockData.cmrYears.map((year) => (
                    <TableRow key={year._id}>
                      <TableCell className="font-medium">{year.year_range}</TableCell>
                      <TableCell>{new Date(year.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="mills">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Mills</CardTitle>
                <CardDescription>Manage rice processing mills</CardDescription>
              </div>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Mill
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Mill Code</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>CMR Year</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockData.mills.map((mill) => (
                    <TableRow key={mill._id}>
                      <TableCell className="font-medium">{mill.mill_code}</TableCell>
                      <TableCell>{mill.name}</TableCell>
                      <TableCell>{mill.cmr_year.year_range}</TableCell>
                      <TableCell>{mill.phone}</TableCell>
                      <TableCell>
                        <Badge variant={mill.is_active ? "default" : "secondary"}>
                          {mill.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="brokers">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Brokers</CardTitle>
                <CardDescription>Manage rice brokers</CardDescription>
              </div>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Broker
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Broker Code</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Brokerage Rate</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockData.brokers.map((broker) => (
                    <TableRow key={broker._id}>
                      <TableCell className="font-medium">{broker.broker_code}</TableCell>
                      <TableCell>{broker.name}</TableCell>
                      <TableCell>{broker.phone}</TableCell>
                      <TableCell>{broker.brokerage_rate}%</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="parties">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Parties</CardTitle>
                <CardDescription>Manage business parties</CardDescription>
              </div>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Party
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Party Code</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>GST No</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockData.parties.map((party) => (
                    <TableRow key={party._id}>
                      <TableCell className="font-medium">{party.party_code}</TableCell>
                      <TableCell>{party.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{party.category}</Badge>
                      </TableCell>
                      <TableCell>{party.phone}</TableCell>
                      <TableCell>{party.gst_no || "-"}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vehicles">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Vehicles</CardTitle>
                <CardDescription>Manage transport vehicles</CardDescription>
              </div>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Vehicle
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Vehicle Number</TableHead>
                    <TableHead>Owner Name</TableHead>
                    <TableHead>Capacity</TableHead>
                    <TableHead>Remarks</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockData.vehicles.map((vehicle) => (
                    <TableRow key={vehicle._id}>
                      <TableCell className="font-medium">{vehicle.vehicle_no}</TableCell>
                      <TableCell>{vehicle.owner_name}</TableCell>
                      <TableCell>{vehicle.capacity_ton} tons</TableCell>
                      <TableCell>{vehicle.remarks}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )

  const AgreementsContent = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Agreements</h1>
          <p className="text-muted-foreground">Manage rice processing agreements</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Agreement
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Agreements</CardTitle>
          <CardDescription>List of all rice processing agreements</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Agreement No.</TableHead>
                <TableHead>Mill</TableHead>
                <TableHead>Rice Type</TableHead>
                <TableHead>Base Rate</TableHead>
                <TableHead>Valid From</TableHead>
                <TableHead>Valid To</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockData.agreements.map((agreement) => (
                <TableRow key={agreement._id}>
                  <TableCell className="font-medium">{agreement.agreement_no}</TableCell>
                  <TableCell>{agreement.mill.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{agreement.rice_type}</Badge>
                  </TableCell>
                  <TableCell>₹{agreement.base_rate}</TableCell>
                  <TableCell>{new Date(agreement.validity_from).toLocaleDateString()}</TableCell>
                  <TableCell>{new Date(agreement.validity_to).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )

  const SaudasContent = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Saudas</h1>
          <p className="text-muted-foreground">Manage purchase agreements</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Sauda
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Saudas</CardTitle>
          <CardDescription>List of all purchase agreements</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Sauda Code</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Party</TableHead>
                <TableHead>Broker</TableHead>
                <TableHead>Rice Type</TableHead>
                <TableHead>Rate/Qtl</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockData.saudas.map((sauda) => (
                <TableRow key={sauda._id}>
                  <TableCell className="font-medium">{sauda.sauda_code}</TableCell>
                  <TableCell>{new Date(sauda.sauda_date).toLocaleDateString()}</TableCell>
                  <TableCell>{sauda.party.name}</TableCell>
                  <TableCell>{sauda.broker.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{sauda.rice_type}</Badge>
                  </TableCell>
                  <TableCell>₹{sauda.rate_per_qtl}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        sauda.status === "Open" ? "default" : sauda.status === "Partial" ? "secondary" : "outline"
                      }
                    >
                      {sauda.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )

  const LotsContent = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Lots</h1>
          <p className="text-muted-foreground">Manage rice lots</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Lot
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lots</CardTitle>
          <CardDescription>List of all rice lots</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Lot No</TableHead>
                <TableHead>Sauda</TableHead>
                <TableHead>Qtl</TableHead>
                <TableHead>Bags</TableHead>
                <TableHead>Net Rice Qtl</TableHead>
                <TableHead>Net Amount</TableHead>
                <TableHead>Final Amount</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockData.lots.map((lot) => (
                <TableRow key={lot._id}>
                  <TableCell className="font-medium">{lot.lot_no}</TableCell>
                  <TableCell>{lot.sauda.sauda_code}</TableCell>
                  <TableCell>{lot.qtl}</TableCell>
                  <TableCell>{lot.bags}</TableCell>
                  <TableCell>{lot.net_rice_qtl}</TableCell>
                  <TableCell>₹{lot.net_amount.toLocaleString()}</TableCell>
                  <TableCell className="font-medium">₹{lot.nett_amount_final.toLocaleString()}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )

  const PaymentsContent = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Payments</h1>
          <p className="text-muted-foreground">Manage payment transactions</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Payment
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Payments</CardTitle>
          <CardDescription>List of all payment transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Payer</TableHead>
                <TableHead>Payee</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Mode</TableHead>
                <TableHead>Reference</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockData.payments.map((payment) => (
                <TableRow key={payment._id}>
                  <TableCell>{new Date(payment.payment_date).toLocaleDateString()}</TableCell>
                  <TableCell>{payment.payer.name}</TableCell>
                  <TableCell>{payment.payee.name}</TableCell>
                  <TableCell className="font-medium">₹{payment.amount.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{payment.mode}</Badge>
                  </TableCell>
                  <TableCell>{payment.reference_no}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )

  const BagTransactionsContent = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Bag Transactions</h1>
          <p className="text-muted-foreground">Track bag movements and inventory</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Transaction
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Bag Transactions</CardTitle>
          <CardDescription>List of all bag movement transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Ref Type</TableHead>
                <TableHead>Ref ID</TableHead>
                <TableHead>Bag Type</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Remarks</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockData.bagTransactions.map((transaction) => (
                <TableRow key={transaction._id}>
                  <TableCell>{new Date(transaction.date).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{transaction.ref_type}</Badge>
                  </TableCell>
                  <TableCell className="font-mono text-sm">{transaction.ref_id}</TableCell>
                  <TableCell>{transaction.bag_type.replace(/([A-Z])/g, " $1").trim()}</TableCell>
                  <TableCell className="font-medium">{transaction.quantity}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      {transaction.action === "In" ? (
                        <ArrowDown className="h-4 w-4 text-green-600" />
                      ) : (
                        <ArrowUp className="h-4 w-4 text-red-600" />
                      )}
                      <Badge variant={transaction.action === "In" ? "default" : "destructive"}>
                        {transaction.action}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>{transaction.remarks}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardContent />
      case "masters":
        return <MastersContent />
      case "agreements":
        return <AgreementsContent />
      case "saudas":
        return <SaudasContent />
      case "lots":
        return <LotsContent />
      case "payments":
        return <PaymentsContent />
      case "bag-transactions":
        return <BagTransactionsContent />
      default:
        return <DashboardContent />
    }
  }

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-950">
      {/* Sidebar */}
      <div className="flex h-full w-64 flex-col bg-gray-50 dark:bg-gray-900">
        <div className="flex h-16 items-center border-b px-6">
          <h1 className="text-xl font-semibold">Paddy Rice ERP</h1>
        </div>
        <div className="flex-1 px-3 py-4">
          <div className="space-y-1">
            <Button
              variant={activeTab === "dashboard" ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("dashboard")}
            >
              <TrendingUp className="mr-2 h-4 w-4" />
              Dashboard
            </Button>
            <Button
              variant={activeTab === "agreements" ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("agreements")}
            >
              <FileText className="mr-2 h-4 w-4" />
              Agreements
            </Button>
            <Button
              variant={activeTab === "saudas" ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("saudas")}
            >
              <ShoppingCart className="mr-2 h-4 w-4" />
              Saudas
            </Button>
            <Button
              variant={activeTab === "lots" ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("lots")}
            >
              <Package className="mr-2 h-4 w-4" />
              Lots
            </Button>
            <Button
              variant={activeTab === "payments" ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("payments")}
            >
              <CreditCard className="mr-2 h-4 w-4" />
              Payments
            </Button>
            <Button
              variant={activeTab === "bag-transactions" ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("bag-transactions")}
            >
              <ArrowLeftRight className="mr-2 h-4 w-4" />
              Bag Transactions
            </Button>
          </div>
          <div className="mt-8">
            <h3 className="mb-2 px-3 text-sm font-medium text-gray-500 dark:text-gray-400">Masters</h3>
            <div className="space-y-1">
              <Button
                variant={activeTab === "masters" ? "secondary" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveTab("masters")}
              >
                <Building2 className="mr-2 h-4 w-4" />
                All Masters
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header className="flex h-16 items-center justify-between border-b bg-white px-6 dark:bg-gray-950">
          <div className="flex items-center space-x-4">
            <h2 className="text-lg font-semibold">Rice Processing Management</h2>
          </div>
          <div className="flex items-center space-x-4">
            <Badge variant="outline">Demo Mode</Badge>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto p-6">{renderContent()}</main>
      </div>
    </div>
  )
}
