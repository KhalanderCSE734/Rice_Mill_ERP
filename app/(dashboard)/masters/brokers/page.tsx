"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"

interface Broker {
  _id: string
  broker_code: string
  name: string
  phone: string
  brokerage_rate: number
  address: string
  remarks: string
  createdAt: string
}

interface BrokerForm {
  broker_code: string
  name: string
  phone: string
  brokerage_rate: number
  address: string
  remarks: string
}

export default function BrokersPage() {
  const [brokers, setBrokers] = useState<Broker[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<BrokerForm>()

  useEffect(() => {
    fetchBrokers()
  }, [])

  const fetchBrokers = async () => {
    try {
      const response = await fetch("/api/brokers")
      const data = await response.json()
      setBrokers(data)
    } catch (error) {
      toast.error("Failed to fetch brokers")
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = async (data: BrokerForm) => {
    try {
      const url = editingId ? `/api/brokers/${editingId}` : "/api/brokers"
      const method = editingId ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        toast.success(editingId ? "Broker updated" : "Broker created")
        setDialogOpen(false)
        reset()
        setEditingId(null)
        fetchBrokers()
      } else {
        const error = await response.json()
        toast.error(error.error || "Operation failed")
      }
    } catch (error) {
      toast.error("Operation failed")
    }
  }

  const handleEdit = (broker: Broker) => {
    setEditingId(broker._id)
    setValue("broker_code", broker.broker_code)
    setValue("name", broker.name)
    setValue("phone", broker.phone || "")
    setValue("brokerage_rate", broker.brokerage_rate)
    setValue("address", broker.address || "")
    setValue("remarks", broker.remarks || "")
    setDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this broker?")) return

    try {
      const response = await fetch(`/api/brokers/${id}`, { method: "DELETE" })
      if (response.ok) {
        toast.success("Broker deleted")
        fetchBrokers()
      } else {
        toast.error("Failed to delete broker")
      }
    } catch (error) {
      toast.error("Failed to delete broker")
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
          <h1 className="text-3xl font-bold tracking-tight">Brokers</h1>
          <p className="text-muted-foreground">Manage rice brokers</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Broker
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingId ? "Edit" : "Add"} Broker</DialogTitle>
              <DialogDescription>{editingId ? "Update the" : "Create a new"} broker.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="broker_code">Broker Code</Label>
                    <Input
                      id="broker_code"
                      placeholder="Broker code"
                      {...register("broker_code", { required: "Broker code is required" })}
                    />
                    {errors.broker_code && <p className="text-sm text-red-500">{errors.broker_code.message}</p>}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      placeholder="Broker name"
                      {...register("name", { required: "Name is required" })}
                    />
                    {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" placeholder="Phone number" {...register("phone")} />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="brokerage_rate">Brokerage Rate (%)</Label>
                    <Input
                      id="brokerage_rate"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      {...register("brokerage_rate", {
                        required: "Brokerage rate is required",
                        min: { value: 0, message: "Rate must be positive" },
                      })}
                    />
                    {errors.brokerage_rate && <p className="text-sm text-red-500">{errors.brokerage_rate.message}</p>}
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="address">Address</Label>
                  <Input id="address" placeholder="Broker address" {...register("address")} />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="remarks">Remarks</Label>
                  <Textarea id="remarks" placeholder="Additional remarks..." {...register("remarks")} />
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
          <CardTitle>Brokers</CardTitle>
          <CardDescription>List of all rice brokers</CardDescription>
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
              {brokers.map((broker) => (
                <TableRow key={broker._id}>
                  <TableCell className="font-medium">{broker.broker_code}</TableCell>
                  <TableCell>{broker.name}</TableCell>
                  <TableCell>{broker.phone || "-"}</TableCell>
                  <TableCell>{broker.brokerage_rate}%</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(broker)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDelete(broker._id)}>
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
