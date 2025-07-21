"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"

interface CmrYear {
  _id: string
  year_range: string
  createdAt: string
  updatedAt: string
}

interface CmrYearForm {
  year_range: string
}

export default function CmrYearsPage() {
  const [cmrYears, setCmrYears] = useState<CmrYear[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CmrYearForm>()

  useEffect(() => {
    fetchCmrYears()
  }, [])

  const fetchCmrYears = async () => {
    try {
      const response = await fetch("/api/cmr-years")
      const data = await response.json()
      setCmrYears(data)
    } catch (error) {
      toast.error("Failed to fetch CMR years")
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = async (data: CmrYearForm) => {
    try {
      const url = editingId ? `/api/cmr-years/${editingId}` : "/api/cmr-years"
      const method = editingId ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        toast.success(editingId ? "CMR Year updated" : "CMR Year created")
        setDialogOpen(false)
        reset()
        setEditingId(null)
        fetchCmrYears()
      } else {
        const error = await response.json()
        toast.error(error.error || "Operation failed")
      }
    } catch (error) {
      toast.error("Operation failed")
    }
  }

  const handleEdit = (cmrYear: CmrYear) => {
    setEditingId(cmrYear._id)
    setValue("year_range", cmrYear.year_range)
    setDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this CMR year?")) return

    try {
      const response = await fetch(`/api/cmr-years/${id}`, { method: "DELETE" })
      if (response.ok) {
        toast.success("CMR Year deleted")
        fetchCmrYears()
      } else {
        toast.error("Failed to delete CMR year")
      }
    } catch (error) {
      toast.error("Failed to delete CMR year")
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
          <h1 className="text-3xl font-bold tracking-tight">CMR Years</h1>
          <p className="text-muted-foreground">Manage CMR year ranges</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add CMR Year
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingId ? "Edit" : "Add"} CMR Year</DialogTitle>
              <DialogDescription>{editingId ? "Update the" : "Create a new"} CMR year range.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="year_range">Year Range</Label>
                  <Input
                    id="year_range"
                    placeholder="e.g., 2024-25"
                    {...register("year_range", { required: "Year range is required" })}
                  />
                  {errors.year_range && <p className="text-sm text-red-500">{errors.year_range.message}</p>}
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
          <CardTitle>CMR Years</CardTitle>
          <CardDescription>List of all CMR year ranges</CardDescription>
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
              {cmrYears.map((cmrYear) => (
                <TableRow key={cmrYear._id}>
                  <TableCell className="font-medium">{cmrYear.year_range}</TableCell>
                  <TableCell>{new Date(cmrYear.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(cmrYear)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDelete(cmrYear._id)}>
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
