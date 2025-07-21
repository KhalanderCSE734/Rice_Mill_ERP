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
import { Plus, Edit, Trash2 } from "lucide-react"
import { useForm, Controller } from "react-hook-form"
import toast from "react-hot-toast"

interface Party {
  _id: string
  party_code: string
  name: string
  category: string
  phone: string
  address: string
  gst_no: string
  createdAt: string
}

interface PartyForm {
  party_code: string
  name: string
  category: string
  phone: string
  address: string
  gst_no: string
}

const categories = ["Farmer", "Trader", "Buyer", "Depot", "Transporter"]

export default function PartiesPage() {
  const [parties, setParties] = useState<Party[]>([])
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
  } = useForm<PartyForm>()

  useEffect(() => {
    fetchParties()
  }, [])

  const fetchParties = async () => {
    try {
      const response = await fetch("/api/parties")
      const data = await response.json()
      setParties(data)
    } catch (error) {
      toast.error("Failed to fetch parties")
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = async (data: PartyForm) => {
    try {
      const url = editingId ? `/api/parties/${editingId}` : "/api/parties"
      const method = editingId ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        toast.success(editingId ? "Party updated" : "Party created")
        setDialogOpen(false)
        reset()
        setEditingId(null)
        fetchParties()
      } else {
        const error = await response.json()
        toast.error(error.error || "Operation failed")
      }
    } catch (error) {
      toast.error("Operation failed")
    }
  }

  const handleEdit = (party: Party) => {
    setEditingId(party._id)
    setValue("party_code", party.party_code)
    setValue("name", party.name)
    setValue("category", party.category)
    setValue("phone", party.phone || "")
    setValue("address", party.address || "")
    setValue("gst_no", party.gst_no || "")
    setDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this party?")) return

    try {
      const response = await fetch(`/api/parties/${id}`, { method: "DELETE" })
      if (response.ok) {
        toast.success("Party deleted")
        fetchParties()
      } else {
        toast.error("Failed to delete party")
      }
    } catch (error) {
      toast.error("Failed to delete party")
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
          <h1 className="text-3xl font-bold tracking-tight">Parties</h1>
          <p className="text-muted-foreground">Manage business parties</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Party
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingId ? "Edit" : "Add"} Party</DialogTitle>
              <DialogDescription>{editingId ? "Update the" : "Create a new"} business party.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="party_code">Party Code</Label>
                    <Input
                      id="party_code"
                      placeholder="Party code"
                      {...register("party_code", { required: "Party code is required" })}
                    />
                    {errors.party_code && <p className="text-sm text-red-500">{errors.party_code.message}</p>}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" placeholder="Party name" {...register("name", { required: "Name is required" })} />
                    {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="category">Category</Label>
                    <Controller
                      name="category"
                      control={control}
                      defaultValue="Trader"
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem key={category} value={category}>
                                {category}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" placeholder="Phone number" {...register("phone")} />
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="address">Address</Label>
                  <Input id="address" placeholder="Party address" {...register("address")} />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="gst_no">GST Number</Label>
                  <Input id="gst_no" placeholder="GST number" {...register("gst_no")} />
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
          <CardTitle>Parties</CardTitle>
          <CardDescription>List of all business parties</CardDescription>
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
              {parties.map((party) => (
                <TableRow key={party._id}>
                  <TableCell className="font-medium">{party.party_code}</TableCell>
                  <TableCell>{party.name}</TableCell>
                  <TableCell>
                    <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                      {party.category}
                    </span>
                  </TableCell>
                  <TableCell>{party.phone || "-"}</TableCell>
                  <TableCell>{party.gst_no || "-"}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(party)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDelete(party._id)}>
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
