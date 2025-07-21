"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, Edit, Trash2 } from "lucide-react"
import { useForm, Controller } from "react-hook-form"
import toast from "react-hot-toast"

interface Lot {
  _id: string
  lot_no: string
  sauda: {
    _id: string
    sauda_code: string
  }
  agreement: {
    _id: string
    agreement_no: string
  }
  qtl: number
  bags: number
  moisture_cut: number
  net_rice_qtl: number
  net_amount: number
  nett_amount_final: number
  vehicle: {
    _id: string
    vehicle_no: string
  }
  createdAt: string
}

interface Sauda {
  _id: string
  sauda_code: string
}

interface Agreement {
  _id: string
  agreement_no: string
}

interface Vehicle {
  _id: string
  vehicle_no: string
}

interface LotForm {
  lot_no: string
  sauda: string
  agreement: string
  frk_qtl: number
  frk_invoice: string
  frk_description: string
  bora_sent_date: string
  flap_sticker_date: string
  gate_pass: {
    date: string
    truck: string
  }
  rice_pass_date: string
  deposit_centre: string
  qtl: number
  bags: number
  moisture_cut: number
  net_rice_qtl: number
  amount_moisture: number
  net_amount: number
  qi_exp: number
  lot_dalali: number
  other_costs: number
  brokerage: number
  invoice_no: string
  invoice_amount: number
  purchase_expense: number
  total_amount: number
  vehicle: string
  notes: string
}

export default function LotsPage() {
  const [lots, setLots] = useState<Lot[]>([])
  const [saudas, setSaudas] = useState<Sauda[]>([])
  const [agreements, setAgreements] = useState<Agreement[]>([])
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { errors },
  } = useForm<LotForm>()

  useEffect(() => {
    fetchLots()
    fetchSaudas()
    fetchAgreements()
    fetchVehicles()
  }, [])

  const fetchLots = async () => {
    try {
      const response = await fetch("/api/lots")
      const data = await response.json()
      setLots(data)
    } catch (error) {
      toast.error("Failed to fetch lots")
    } finally {
      setLoading(false)
    }
  }

  const fetchSaudas = async () => {
    try {
      const response = await fetch("/api/saudas")
      const data = await response.json()
      setSaudas(data)
    } catch (error) {
      toast.error("Failed to fetch saudas")
    }
  }

  const fetchAgreements = async () => {
    try {
      const response = await fetch("/api/agreements")
      const data = await response.json()
      setAgreements(data)
    } catch (error) {
      toast.error("Failed to fetch agreements")
    }
  }

  const fetchVehicles = async () => {
    try {
      const response = await fetch("/api/vehicles")
      const data = await response.json()
      setVehicles(data)
    } catch (error) {
      toast.error("Failed to fetch vehicles")
    }
  }

  const onSubmit = async (data: LotForm) => {
    try {
      const url = editingId ? `/api/lots/${editingId}` : "/api/lots"
      const method = editingId ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        toast.success(editingId ? "Lot updated" : "Lot created")
        setDialogOpen(false)
        reset()
        setEditingId(null)
        fetchLots()
      } else {
        const error = await response.json()
        toast.error(error.error || "Operation failed")
      }
    } catch (error) {
      toast.error("Operation failed")
    }
  }

  const handleEdit = (lot: Lot) => {
    setEditingId(lot._id)
    setValue("lot_no", lot.lot_no)
    setValue("sauda", lot.sauda?._id || "")
    setValue("agreement", lot.agreement?._id || "")
    setValue("qtl", lot.qtl || 0)
    setValue("bags", lot.bags || 0)
    setValue("moisture_cut", lot.moisture_cut || 0)
    setValue("net_rice_qtl", lot.net_rice_qtl || 0)
    setValue("net_amount", lot.net_amount || 0)
    setValue("vehicle", lot.vehicle?._id || "")
    setDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this lot?")) return

    try {
      const response = await fetch(`/api/lots/${id}`, { method: "DELETE" })
      if (response.ok) {
        toast.success("Lot deleted")
        fetchLots()
      } else {
        toast.error("Failed to delete lot")
      }
    } catch (error) {
      toast.error("Failed to delete lot")
    }
  }

  const handleDialogClose = () => {
    setDialogOpen(false)
    reset()
    setEditingId(null)
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Lots</h1>
          <p className="text-muted-foreground">Manage rice lots</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Lot
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingId ? "Edit" : "Add"} Lot</DialogTitle>
              <DialogDescription>{editingId ? "Update the" : "Create a new"} rice lot.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid gap-6 py-4">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Basic Information</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="lot_no">Lot Number</Label>
                      <Input
                        id="lot_no"
                        placeholder="e.g., 14127"
                        {...register("lot_no", { required: "Lot number is required" })}
                      />
                      {errors.lot_no && <p className="text-sm text-red-500">{errors.lot_no.message}</p>}
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="sauda">Sauda</Label>
                      <Controller
                        name="sauda"
                        control={control}
                        rules={{ required: "Sauda is required" }}
                        render={({ field }) => (
                          <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select sauda" />
                            </SelectTrigger>
                            <SelectContent>
                              {saudas.map((sauda) => (
                                <SelectItem key={sauda._id} value={sauda._id}>
                                  {sauda.sauda_code}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                      {errors.sauda && <p className="text-sm text-red-500">{errors.sauda.message}</p>}
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="agreement">Agreement</Label>
                      <Controller
                        name="agreement"
                        control={control}
                        render={({ field }) => (
                          <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select agreement" />
                            </SelectTrigger>
                            <SelectContent>
                              {agreements.map((agreement) => (
                                <SelectItem key={agreement._id} value={agreement._id}>
                                  {agreement.agreement_no}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </div>
                  </div>
                </div>

                {/* FRK Details */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">FRK Details</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="frk_qtl">FRK Qtl</Label>
                      <Input id="frk_qtl" type="number" step="0.01" placeholder="0.00" {...register("frk_qtl")} />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="frk_invoice">FRK Invoice</Label>
                      <Input id="frk_invoice" placeholder="Invoice number" {...register("frk_invoice")} />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="frk_description">FRK Description</Label>
                      <Input id="frk_description" placeholder="Description" {...register("frk_description")} />
                    </div>
                  </div>
                </div>

                {/* Dates */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Important Dates</h3>
                  <div className="grid grid-cols-4 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="bora_sent_date">Bora Sent Date</Label>
                      <Input id="bora_sent_date" type="date" {...register("bora_sent_date")} />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="flap_sticker_date">Flap Sticker Date</Label>
                      <Input id="flap_sticker_date" type="date" {...register("flap_sticker_date")} />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="gate_pass_date">Gate Pass Date</Label>
                      <Input id="gate_pass_date" type="date" {...register("gate_pass.date")} />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="rice_pass_date">Rice Pass Date</Label>
                      <Input id="rice_pass_date" type="date" {...register("rice_pass_date")} />
                    </div>
                  </div>
                </div>

                {/* Quantity & Quality */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Quantity & Quality</h3>
                  <div className="grid grid-cols-4 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="qtl">Qtl</Label>
                      <Input
                        id="qtl"
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        {...register("qtl", { min: { value: 0, message: "Qtl must be positive" } })}
                      />
                      {errors.qtl && <p className="text-sm text-red-500">{errors.qtl.message}</p>}
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="bags">Bags</Label>
                      <Input
                        id="bags"
                        type="number"
                        placeholder="0"
                        {...register("bags", { min: { value: 0, message: "Bags must be positive" } })}
                      />
                      {errors.bags && <p className="text-sm text-red-500">{errors.bags.message}</p>}
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="moisture_cut">Moisture Cut (%)</Label>
                      <Input
                        id="moisture_cut"
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        {...register("moisture_cut")}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="net_rice_qtl">Net Rice Qtl</Label>
                      <Input
                        id="net_rice_qtl"
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        {...register("net_rice_qtl")}
                      />
                    </div>
                  </div>
                </div>

                {/* Financial Details */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Financial Details</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="net_amount">Net Amount (₹)</Label>
                      <Input id="net_amount" type="number" step="0.01" placeholder="0.00" {...register("net_amount")} />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="qi_exp">QI Exp (₹)</Label>
                      <Input id="qi_exp" type="number" step="0.01" placeholder="0.00" {...register("qi_exp")} />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="lot_dalali">Lot Dalali (₹)</Label>
                      <Input id="lot_dalali" type="number" step="0.01" placeholder="0.00" {...register("lot_dalali")} />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="other_costs">Other Costs (₹)</Label>
                      <Input
                        id="other_costs"
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        {...register("other_costs")}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="brokerage">Brokerage (₹)</Label>
                      <Input id="brokerage" type="number" step="0.01" placeholder="0.00" {...register("brokerage")} />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="invoice_amount">Invoice Amount (₹)</Label>
                      <Input
                        id="invoice_amount"
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        {...register("invoice_amount")}
                      />
                    </div>
                  </div>
                </div>

                {/* Vehicle & Other Details */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Other Details</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="vehicle">Vehicle</Label>
                      <Controller
                        name="vehicle"
                        control={control}
                        render={({ field }) => (
                          <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select vehicle" />
                            </SelectTrigger>
                            <SelectContent>
                              {vehicles.map((vehicle) => (
                                <SelectItem key={vehicle._id} value={vehicle._id}>
                                  {vehicle.vehicle_no}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="deposit_centre">Deposit Centre</Label>
                      <Input id="deposit_centre" placeholder="Deposit centre" {...register("deposit_centre")} />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="invoice_no">Invoice No</Label>
                      <Input id="invoice_no" placeholder="Invoice number" {...register("invoice_no")} />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea id="notes" placeholder="Additional notes..." {...register("notes")} />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={handleDialogClose}>
                  Cancel
                </Button>
                <Button type="submit">{editingId ? "Update" : "Create"}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
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
              {lots.map((lot) => (
                <TableRow key={lot._id}>
                  <TableCell className="font-medium">{lot.lot_no}</TableCell>
                  <TableCell>{lot.sauda?.sauda_code}</TableCell>
                  <TableCell>{lot.qtl || "-"}</TableCell>
                  <TableCell>{lot.bags || "-"}</TableCell>
                  <TableCell>{lot.net_rice_qtl || "-"}</TableCell>
                  <TableCell>{lot.net_amount ? `₹${lot.net_amount.toLocaleString()}` : "-"}</TableCell>
                  <TableCell>{lot.nett_amount_final ? `₹${lot.nett_amount_final.toLocaleString()}` : "-"}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(lot)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDelete(lot._id)}>
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
}
