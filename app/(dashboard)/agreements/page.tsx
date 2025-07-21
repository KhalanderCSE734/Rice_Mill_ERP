"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Edit, Trash2 } from "lucide-react"
import { useForm, Controller } from "react-hook-form"
import toast from "react-hot-toast"

interface Agreement {
  _id: string
  agreement_no: string
  description: string
  mill: {
    _id: string
    name: string
    mill_code: string
  }
  agreement_date: string
  rice_type: string
  base_rate: number
  validity_from: string
  validity_to: string
  createdAt: string
}

interface Mill {
  _id: string
  name: string
  mill_code: string
}

interface AgreementForm {
  agreement_no: string
  description: string
  mill: string
  agreement_date: string
  rice_type: string
  base_rate: number
  validity_from: string
  validity_to: string
}

const riceTypes = ["Boiled", "Raw", "Sarna", "Mota", "Patla", "Common", "FCI", "NAN"]

export default function AgreementsPage() {
  const [agreements, setAgreements] = useState<Agreement[]>([])
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
    formState: { errors },
  } = useForm<AgreementForm>()

  useEffect(() => {
    fetchAgreements()
    fetchMills()
  }, [])

  const fetchAgreements = async () => {
    try {
      const response = await fetch("/api/agreements")
      const data = await response.json()
      setAgreements(data)
    } catch (error) {
      toast.error("Failed to fetch agreements")
    } finally {
      setLoading(false)
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

  const onSubmit = async (data: AgreementForm) => {
    try {
      const url = editingId ? `/api/agreements/${editingId}` : "/api/agreements"
      const method = editingId ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        toast.success(editingId ? "Agreement updated" : "Agreement created")
        setDialogOpen(false)
        reset()
        setEditingId(null)
        fetchAgreements()
      } else {
        const error = await response.json()
        toast.error(error.error || "Operation failed")
      }
    } catch (error) {
      toast.error("Operation failed")
    }
  }

  const handleEdit = (agreement: Agreement) => {
    setEditingId(agreement._id)
    setValue("agreement_no", agreement.agreement_no)
    setValue("description", agreement.description)
    setValue("mill", agreement.mill._id)
    setValue("agreement_date", agreement.agreement_date?.split("T")[0] || "")
    setValue("rice_type", agreement.rice_type)
    setValue("base_rate", agreement.base_rate)
    setValue("validity_from", agreement.validity_from?.split("T")[0] || "")
    setValue("validity_to", agreement.validity_to?.split("T")[0] || "")
    setDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this agreement?")) return

    try {
      const response = await fetch(`/api/agreements/${id}`, { method: "DELETE" })
      if (response.ok) {
        toast.success("Agreement deleted")
        fetchAgreements()
      } else {
        toast.error("Failed to delete agreement")
      }
    } catch (error) {
      toast.error("Failed to delete agreement")
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
          <h1 className="text-3xl font-bold tracking-tight">Agreements</h1>
          <p className="text-muted-foreground">Manage rice processing agreements</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Agreement
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingId ? "Edit" : "Add"} Agreement</DialogTitle>
              <DialogDescription>
                {editingId ? "Update the" : "Create a new"} rice processing agreement.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="agreement_no">Agreement No.</Label>
                    <Input
                      id="agreement_no"
                      placeholder="e.g., AC122024430119"
                      {...register("agreement_no", { required: "Agreement number is required" })}
                    />
                    {errors.agreement_no && <p className="text-sm text-red-500">{errors.agreement_no.message}</p>}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="agreement_date">Agreement Date</Label>
                    <Input
                      id="agreement_date"
                      type="date"
                      {...register("agreement_date", { required: "Agreement date is required" })}
                    />
                    {errors.agreement_date && <p className="text-sm text-red-500">{errors.agreement_date.message}</p>}
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="mill">Mill</Label>
                  <Controller
                    name="mill"
                    control={control}
                    rules={{ required: "Mill is required" }}
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
                  {errors.mill && <p className="text-sm text-red-500">{errors.mill.message}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="rice_type">Rice Type</Label>
                    <Controller
                      name="rice_type"
                      control={control}
                      rules={{ required: "Rice type is required" }}
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
                    {errors.rice_type && <p className="text-sm text-red-500">{errors.rice_type.message}</p>}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="base_rate">Base Rate (₹/qtl)</Label>
                    <Input
                      id="base_rate"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      {...register("base_rate", {
                        required: "Base rate is required",
                        min: { value: 0, message: "Base rate must be positive" },
                      })}
                    />
                    {errors.base_rate && <p className="text-sm text-red-500">{errors.base_rate.message}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="validity_from">Valid From</Label>
                    <Input id="validity_from" type="date" {...register("validity_from")} />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="validity_to">Valid To</Label>
                    <Input id="validity_to" type="date" {...register("validity_to")} />
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" placeholder="Agreement description..." {...register("description")} />
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
              {agreements.map((agreement) => (
                <TableRow key={agreement._id}>
                  <TableCell className="font-medium">{agreement.agreement_no}</TableCell>
                  <TableCell>{agreement.mill?.name}</TableCell>
                  <TableCell>{agreement.rice_type}</TableCell>
                  <TableCell>₹{agreement.base_rate}</TableCell>
                  <TableCell>
                    {agreement.validity_from ? new Date(agreement.validity_from).toLocaleDateString() : "-"}
                  </TableCell>
                  <TableCell>
                    {agreement.validity_to ? new Date(agreement.validity_to).toLocaleDateString() : "-"}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(agreement)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDelete(agreement._id)}>
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
