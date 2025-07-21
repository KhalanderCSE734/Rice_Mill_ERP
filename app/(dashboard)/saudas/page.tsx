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

interface Sauda {
  _id: string
  sauda_code: string
  sauda_date: string
  broker: {
    _id: string
    name: string
    broker_code: string
  }
  party: {
    _id: string
    name: string
    party_code: string
  }
  mill: {
    _id: string
    name: string
    mill_code: string
  }
  rice_type: string
  rate_per_qtl: number
  brokerage_rate: number
  condition_text: string
  status: string
  createdAt: string
}

interface Broker {
  _id: string
  name: string
  broker_code: string
  brokerage_rate: number
}

interface Party {
  _id: string
  name: string
  party_code: string
}

interface Mill {
  _id: string
  name: string
  mill_code: string
}

interface SaudaForm {
  sauda_code: string
  sauda_date: string
  broker: string
  party: string
  mill: string
  rice_type: string
  rate_per_qtl: number
  brokerage_rate: number
  condition_text: string
  frk_bheja: {
    total_qtl: number
    invoice_no: string
    description: string
    sent_date: string
  }
  status: string
}

const riceTypes = ["Boiled", "Raw", "Sarna", "Mota", "Patla", "Common", "FCI", "NAN"]
const statusOptions = ["Open", "Partial", "Closed", "Cancelled"]

export default function SaudasPage() {
  const [saudas, setSaudas] = useState<Sauda[]>([])
  const [brokers, setBrokers] = useState<Broker[]>([])
  const [parties, setParties] = useState<Party[]>([])
  const [mills, setMills] = useState<Mill[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    watch,
    formState: { errors },
  } = useForm<SaudaForm>()

  const selectedBroker = watch("broker")

  useEffect(() => {
    fetchSaudas()
    fetchBrokers()
    fetchParties()
    fetchMills()
  }, [])

  useEffect(() => {
    // Auto-fill brokerage rate when broker is selected
    if (selectedBroker) {
      const broker = brokers.find((b) => b._id === selectedBroker)
      if (broker) {
        setValue("brokerage_rate", broker.brokerage_rate)
      }
    }
  }, [selectedBroker, brokers, setValue])

  const fetchSaudas = async () => {
    try {
      const response = await fetch("/api/saudas")
      const data = await response.json()
      setSaudas(data)
    } catch (error) {
      toast.error("Failed to fetch saudas")
    } finally {
      setLoading(false)
    }
  }

  const fetchBrokers = async () => {
    try {
      const response = await fetch("/api/brokers")
      const data = await response.json()
      setBrokers(data)
    } catch (error) {
      toast.error("Failed to fetch brokers")
    }
  }

  const fetchParties = async () => {
    try {
      const response = await fetch("/api/parties")
      const data = await response.json()
      setParties(data)
    } catch (error) {
      toast.error("Failed to fetch parties")
    }
  }

  const fetchMills = async () => {
    try {
      const response = await fetch("/api/mills")
      const data = await response.json()
      setMills(data)
    } catch (error) {
      toast.error("Failed to fetch mills")
    }
  }

  const onSubmit = async (data: SaudaForm) => {
    try {
      const url = editingId ? `/api/saudas/${editingId}` : "/api/saudas"
      const method = editingId ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        toast.success(editingId ? "Sauda updated" : "Sauda created")
        setDialogOpen(false)
        reset()
        setEditingId(null)
        fetchSaudas()
      } else {
        const error = await response.json()
        toast.error(error.error || "Operation failed")
      }
    } catch (error) {
      toast.error("Operation failed")
    }
  }

  const handleEdit = (sauda: Sauda) => {
    setEditingId(sauda._id)
    setValue("sauda_code", sauda.sauda_code)
    setValue("sauda_date", sauda.sauda_date?.split("T")[0] || "")
    setValue("broker", sauda.broker?._id || "")
    setValue("party", sauda.party?._id || "")
    setValue("mill", sauda.mill?._id || "")
    setValue("rice_type", sauda.rice_type || "")
    setValue("rate_per_qtl", sauda.rate_per_qtl)
    setValue("brokerage_rate", sauda.brokerage_rate || 0)
    setValue("condition_text", sauda.condition_text || "")
    setValue("status", sauda.status)
    setDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this sauda?")) return

    try {
      const response = await fetch(`/api/saudas/${id}`, { method: "DELETE" })
      if (response.ok) {
        toast.success("Sauda deleted")
        fetchSaudas()
      } else {
        toast.error("Failed to delete sauda")
      }
    } catch (error) {
      toast.error("Failed to delete sauda")
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
          <h1 className="text-3xl font-bold tracking-tight">Saudas</h1>
          <p className="text-muted-foreground">Manage purchase agreements</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Sauda
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingId ? "Edit" : "Add"} Sauda</DialogTitle>
              <DialogDescription>{editingId ? "Update the" : "Create a new"} purchase agreement.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="sauda_code">Sauda Code</Label>
                    <Input
                      id="sauda_code"
                      placeholder="Sauda code"
                      {...register("sauda_code", { required: "Sauda code is required" })}
                    />
                    {errors.sauda_code && <p className="text-sm text-red-500">{errors.sauda_code.message}</p>}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="sauda_date">Sauda Date</Label>
                    <Input
                      id="sauda_date"
                      type="date"
                      {...register("sauda_date", { required: "Sauda date is required" })}
                    />
                    {errors.sauda_date && <p className="text-sm text-red-500">{errors.sauda_date.message}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="broker">Broker</Label>
                    <Controller
                      name="broker"
                      control={control}
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select broker" />
                          </SelectTrigger>
                          <SelectContent>
                            {brokers.map((broker) => (
                              <SelectItem key={broker._id} value={broker._id}>
                                {broker.name} ({broker.broker_code})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="party">Party</Label>
                    <Controller
                      name="party"
                      control={control}
                      rules={{ required: "Party is required" }}
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select party" />
                          </SelectTrigger>
                          <SelectContent>
                            {parties.map((party) => (
                              <SelectItem key={party._id} value={party._id}>
                                {party.name} ({party.party_code})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.party && <p className="text-sm text-red-500">{errors.party.message}</p>}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="mill">Mill</Label>
                    <Controller
                      name="mill"
                      control={control}
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select mill" />
                          </SelectTrigger>
                          <SelectContent>
                            {mills.map((mill) => (
                              <SelectItem key={mill._id} value={mill._id}>
                                {mill.name} ({mill.mill_code})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="rice_type">Rice Type</Label>
                    <Controller
                      name="rice_type"
                      control={control}
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select rice type" />
                          </SelectTrigger>
                          <SelectContent>
                            {riceTypes.map((type) => (
                              <SelectItem key={type} value={type}>
                                {type}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="rate_per_qtl">Rate per Qtl (₹)</Label>
                    <Input
                      id="rate_per_qtl"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      {...register("rate_per_qtl", {
                        required: "Rate per qtl is required",
                        min: { value: 0, message: "Rate must be positive" },
                      })}
                    />
                    {errors.rate_per_qtl && <p className="text-sm text-red-500">{errors.rate_per_qtl.message}</p>}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="brokerage_rate">Brokerage Rate (%)</Label>
                    <Input
                      id="brokerage_rate"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      {...register("brokerage_rate", {
                        min: { value: 0, message: "Rate must be positive" },
                      })}
                    />
                    {errors.brokerage_rate && <p className="text-sm text-red-500">{errors.brokerage_rate.message}</p>}
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="condition_text">Condition Text</Label>
                  <Textarea id="condition_text" placeholder="Agreement conditions..." {...register("condition_text")} />
                </div>

                <div className="grid gap-2">
                  <Label>FRK Bheja Details</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="frk_total_qtl">Total Qtl</Label>
                      <Input
                        id="frk_total_qtl"
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        {...register("frk_bheja.total_qtl")}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="frk_invoice_no">Invoice No</Label>
                      <Input id="frk_invoice_no" placeholder="Invoice number" {...register("frk_bheja.invoice_no")} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="frk_description">Description</Label>
                      <Input id="frk_description" placeholder="Description" {...register("frk_bheja.description")} />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="frk_sent_date">Sent Date</Label>
                      <Input id="frk_sent_date" type="date" {...register("frk_bheja.sent_date")} />
                    </div>
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="status">Status</Label>
                  <Controller
                    name="status"
                    control={control}
                    defaultValue="Open"
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          {statusOptions.map((status) => (
                            <SelectItem key={status} value={status}>
                              {status}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
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
              {saudas.map((sauda) => (
                <TableRow key={sauda._id}>
                  <TableCell className="font-medium">{sauda.sauda_code}</TableCell>
                  <TableCell>{new Date(sauda.sauda_date).toLocaleDateString()}</TableCell>
                  <TableCell>{sauda.party?.name}</TableCell>
                  <TableCell>{sauda.broker?.name}</TableCell>
                  <TableCell>{sauda.rice_type}</TableCell>
                  <TableCell>₹{sauda.rate_per_qtl}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        sauda.status === "Open"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          : sauda.status === "Partial"
                            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                            : sauda.status === "Closed"
                              ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                              : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                      }`}
                    >
                      {sauda.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(sauda)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDelete(sauda._id)}>
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
