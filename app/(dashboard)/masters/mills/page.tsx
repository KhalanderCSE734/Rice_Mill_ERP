"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Switch } from "@/components/ui/switch"
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

interface Mill {
  _id: string
  mill_code: string
  name: string
  address: string
  gst_no: string
  phone: string
  cmr_year: {
    _id: string
    year_range: string
  }
  is_active: boolean
  createdAt: string
}

interface CmrYear {
  _id: string
  year_range: string
}

interface MillForm {
  mill_code: string
  name: string
  address: string
  gst_no: string
  phone: string
  cmr_year: string
  is_active: boolean
}

export default function MillsPage() {
  const [mills, setMills] = useState<Mill[]>([])
  const [cmrYears, setCmrYears] = useState<CmrYear[]>([])
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
  } = useForm<MillForm>()

  useEffect(() => {
    fetchMills()
    fetchCmrYears()
  }, [])

  const fetchMills = async () => {
    try {
      const response = await fetch("/api/mills")
      const data = await response.json()
      setMills(data)
    } catch (error) {
      toast.error("Failed to fetch mills")
    } finally {
      setLoading(false)
    }
  }

  const fetchCmrYears = async () => {
    try {
      const response = await fetch("/api/cmr-years")
      const data = await response.json()
      setCmrYears(data)
    } catch (error) {
      toast.error("Failed to fetch CMR years")
    }
  }

  const onSubmit = async (data: MillForm) => {
    try {
      const url = editingId ? `/api/mills/${editingId}` : "/api/mills"
      const method = editingId ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        toast.success(editingId ? "Mill updated" : "Mill created")
        setDialogOpen(false)
        reset()
        setEditingId(null)
        fetchMills()
      } else {
        const error = await response.json()
        toast.error(error.error || "Operation failed")
      }
    } catch (error) {
      toast.error("Operation failed")
    }
  }

  const handleEdit = (mill: Mill) => {
    setEditingId(mill._id)
    setValue("mill_code", mill.mill_code)
    setValue("name", mill.name)
    setValue("address", mill.address || "")
    setValue("gst_no", mill.gst_no || "")
    setValue("phone", mill.phone || "")
    setValue("cmr_year", mill.cmr_year._id)
    setValue("is_active", mill.is_active)
    setDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this mill?")) return

    try {
      const response = await fetch(`/api/mills/${id}`, { method: "DELETE" })
      if (response.ok) {
        toast.success("Mill deleted")
        fetchMills()
      } else {
        toast.error("Failed to delete mill")
      }
    } catch (error) {
      toast.error("Failed to delete mill")
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
          <h1 className="text-3xl font-bold tracking-tight">Mills</h1>
          <p className="text-muted-foreground">Manage rice processing mills</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Mill
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingId ? "Edit" : "Add"} Mill</DialogTitle>
              <DialogDescription>{editingId ? "Update the" : "Create a new"} rice processing mill.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="mill_code">Mill Code</Label>
                    <Input
                      id="mill_code"
                      placeholder="e.g., Rice Mill 4"
                      {...register("mill_code", { required: "Mill code is required" })}
                    />
                    {errors.mill_code && <p className="text-sm text-red-500">{errors.mill_code.message}</p>}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" placeholder="Mill name" {...register("name", { required: "Name is required" })} />
                    {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="cmr_year">CMR Year</Label>
                  <Controller
                    name="cmr_year"
                    control={control}
                    rules={{ required: "CMR Year is required" }}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select CMR year" />
                        </SelectTrigger>
                        <SelectContent>
                          {cmrYears.map((year) => (
                            <SelectItem key={year._id} value={year._id}>
                              {year.year_range}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.cmr_year && <p className="text-sm text-red-500">{errors.cmr_year.message}</p>}
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="address">Address</Label>
                  <Input id="address" placeholder="Mill address" {...register("address")} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="gst_no">GST Number</Label>
                    <Input id="gst_no" placeholder="GST number" {...register("gst_no")} />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" placeholder="Phone number" {...register("phone")} />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Controller
                    name="is_active"
                    control={control}
                    defaultValue={true}
                    render={({ field }) => (
                      <Switch id="is_active" checked={field.value} onCheckedChange={field.onChange} />
                    )}
                  />
                  <Label htmlFor="is_active">Active</Label>
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
          <CardTitle>Mills</CardTitle>
          <CardDescription>List of all rice processing mills</CardDescription>
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
              {mills.map((mill) => (
                <TableRow key={mill._id}>
                  <TableCell className="font-medium">{mill.mill_code}</TableCell>
                  <TableCell>{mill.name}</TableCell>
                  <TableCell>{mill.cmr_year?.year_range}</TableCell>
                  <TableCell>{mill.phone || "-"}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        mill.is_active
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                      }`}
                    >
                      {mill.is_active ? "Active" : "Inactive"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(mill)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDelete(mill._id)}>
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
