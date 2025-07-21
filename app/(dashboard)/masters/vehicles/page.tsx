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

interface Vehicle {
  _id: string
  vehicle_no: string
  owner_name: string
  capacity_ton: number
  remarks: string
  createdAt: string
}

interface VehicleForm {
  vehicle_no: string
  owner_name: string
  capacity_ton: number
  remarks: string
}

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<VehicleForm>()

  useEffect(() => {
    fetchVehicles()
  }, [])

  const fetchVehicles = async () => {
    try {
      const response = await fetch("/api/vehicles")
      const data = await response.json()
      setVehicles(data)
    } catch (error) {
      toast.error("Failed to fetch vehicles")
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = async (data: VehicleForm) => {
    try {
      const url = editingId ? `/api/vehicles/${editingId}` : "/api/vehicles"
      const method = editingId ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        toast.success(editingId ? "Vehicle updated" : "Vehicle created")
        setDialogOpen(false)
        reset()
        setEditingId(null)
        fetchVehicles()
      } else {
        const error = await response.json()
        toast.error(error.error || "Operation failed")
      }
    } catch (error) {
      toast.error("Operation failed")
    }
  }

  const handleEdit = (vehicle: Vehicle) => {
    setEditingId(vehicle._id)
    setValue("vehicle_no", vehicle.vehicle_no)
    setValue("owner_name", vehicle.owner_name || "")
    setValue("capacity_ton", vehicle.capacity_ton || 0)
    setValue("remarks", vehicle.remarks || "")
    setDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this vehicle?")) return

    try {
      const response = await fetch(`/api/vehicles/${id}`, { method: "DELETE" })
      if (response.ok) {
        toast.success("Vehicle deleted")
        fetchVehicles()
      } else {
        toast.error("Failed to delete vehicle")
      }
    } catch (error) {
      toast.error("Failed to delete vehicle")
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
          <h1 className="text-3xl font-bold tracking-tight">Vehicles</h1>
          <p className="text-muted-foreground">Manage transport vehicles</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Vehicle
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingId ? "Edit" : "Add"} Vehicle</DialogTitle>
              <DialogDescription>{editingId ? "Update the" : "Create a new"} transport vehicle.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="vehicle_no">Vehicle Number</Label>
                    <Input
                      id="vehicle_no"
                      placeholder="e.g., CG07CG4240"
                      {...register("vehicle_no", { required: "Vehicle number is required" })}
                    />
                    {errors.vehicle_no && <p className="text-sm text-red-500">{errors.vehicle_no.message}</p>}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="owner_name">Owner Name</Label>
                    <Input id="owner_name" placeholder="Owner name" {...register("owner_name")} />
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="capacity_ton">Capacity (Tons)</Label>
                  <Input
                    id="capacity_ton"
                    type="number"
                    step="0.1"
                    placeholder="0.0"
                    {...register("capacity_ton", {
                      min: { value: 0, message: "Capacity must be positive" },
                    })}
                  />
                  {errors.capacity_ton && <p className="text-sm text-red-500">{errors.capacity_ton.message}</p>}
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
          <CardTitle>Vehicles</CardTitle>
          <CardDescription>List of all transport vehicles</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vehicle Number</TableHead>
                <TableHead>Owner Name</TableHead>
                <TableHead>Capacity (Tons)</TableHead>
                <TableHead>Remarks</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vehicles.map((vehicle) => (
                <TableRow key={vehicle._id}>
                  <TableCell className="font-medium">{vehicle.vehicle_no}</TableCell>
                  <TableCell>{vehicle.owner_name || "-"}</TableCell>
                  <TableCell>{vehicle.capacity_ton ? `${vehicle.capacity_ton} tons` : "-"}</TableCell>
                  <TableCell>{vehicle.remarks || "-"}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(vehicle)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDelete(vehicle._id)}>
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
