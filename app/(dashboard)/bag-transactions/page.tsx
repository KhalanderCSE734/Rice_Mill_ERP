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
import { Plus, Edit, Trash2, ArrowUp, ArrowDown } from "lucide-react"
import { useForm, Controller } from "react-hook-form"
import toast from "react-hot-toast"

interface BagTransaction {
  _id: string
  ref_type: string
  ref_id: string
  date: string
  bag_type: string
  quantity: number
  action: string
  remarks: string
  createdAt: string
}

interface BagTransactionForm {
  ref_type: string
  ref_id: string
  date: string
  bag_type: string
  quantity: number
  action: string
  remarks: string
}

const refTypes = ["Lot", "DO", "Sale", "Purchase"]
const bagTypes = ["NewJute", "OldJute", "PlasticNew", "PlasticOld", "FRK"]
const actions = ["In", "Out"]

export default function BagTransactionsPage() {
  const [bagTransactions, setBagTransactions] = useState<BagTransaction[]>([])
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
  } = useForm<BagTransactionForm>()

  useEffect(() => {
    fetchBagTransactions()
  }, [])

  const fetchBagTransactions = async () => {
    try {
      const response = await fetch("/api/bag-transactions")
      const data = await response.json()
      setBagTransactions(data)
    } catch (error) {
      toast.error("Failed to fetch bag transactions")
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = async (data: BagTransactionForm) => {
    try {
      const url = editingId ? `/api/bag-transactions/${editingId}` : "/api/bag-transactions"
      const method = editingId ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        toast.success(editingId ? "Bag transaction updated" : "Bag transaction created")
        setDialogOpen(false)
        reset()
        setEditingId(null)
        fetchBagTransactions()
      } else {
        const error = await response.json()
        toast.error(error.error || "Operation failed")
      }
    } catch (error) {
      toast.error("Operation failed")
    }
  }

  const handleEdit = (bagTransaction: BagTransaction) => {
    setEditingId(bagTransaction._id)
    setValue("ref_type", bagTransaction.ref_type)
    setValue("ref_id", bagTransaction.ref_id)
    setValue("date", bagTransaction.date?.split("T")[0] || "")
    setValue("bag_type", bagTransaction.bag_type)
    setValue("quantity", bagTransaction.quantity)
    setValue("action", bagTransaction.action)
    setValue("remarks", bagTransaction.remarks || "")
    setDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this bag transaction?")) return

    try {
      const response = await fetch(`/api/bag-transactions/${id}`, { method: "DELETE" })
      if (response.ok) {
        toast.success("Bag transaction deleted")
        fetchBagTransactions()
      } else {
        toast.error("Failed to delete bag transaction")
      }
    } catch (error) {
      toast.error("Failed to delete bag transaction")
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
          <h1 className="text-3xl font-bold tracking-tight">Bag Transactions</h1>
          <p className="text-muted-foreground">Track bag movements and inventory</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Transaction
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingId ? "Edit" : "Add"} Bag Transaction</DialogTitle>
              <DialogDescription>{editingId ? "Update the" : "Create a new"} bag transaction record.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="ref_type">Reference Type</Label>
                    <Controller
                      name="ref_type"
                      control={control}
                      rules={{ required: "Reference type is required" }}
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select reference type" />
                          </SelectTrigger>
                          <SelectContent>
                            {refTypes.map((type) => (
                              <SelectItem key={type} value={type}>
                                {type}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.ref_type && <p className="text-sm text-red-500">{errors.ref_type.message}</p>}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="ref_id">Reference ID</Label>
                    <Input
                      id="ref_id"
                      placeholder="Reference ID"
                      {...register("ref_id", { required: "Reference ID is required" })}
                    />
                    {errors.ref_id && <p className="text-sm text-red-500">{errors.ref_id.message}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="date">Date</Label>
                    <Input id="date" type="date" {...register("date", { required: "Date is required" })} />
                    {errors.date && <p className="text-sm text-red-500">{errors.date.message}</p>}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="bag_type">Bag Type</Label>
                    <Controller
                      name="bag_type"
                      control={control}
                      rules={{ required: "Bag type is required" }}
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select bag type" />
                          </SelectTrigger>
                          <SelectContent>
                            {bagTypes.map((type) => (
                              <SelectItem key={type} value={type}>
                                {type.replace(/([A-Z])/g, " $1").trim()}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.bag_type && <p className="text-sm text-red-500">{errors.bag_type.message}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="quantity">Quantity</Label>
                    <Input
                      id="quantity"
                      type="number"
                      placeholder="0"
                      {...register("quantity", {
                        required: "Quantity is required",
                        min: { value: 1, message: "Quantity must be at least 1" },
                      })}
                    />
                    {errors.quantity && <p className="text-sm text-red-500">{errors.quantity.message}</p>}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="action">Action</Label>
                    <Controller
                      name="action"
                      control={control}
                      rules={{ required: "Action is required" }}
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select action" />
                          </SelectTrigger>
                          <SelectContent>
                            {actions.map((action) => (
                              <SelectItem key={action} value={action}>
                                {action}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.action && <p className="text-sm text-red-500">{errors.action.message}</p>}
                  </div>
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
              {bagTransactions.map((transaction) => (
                <TableRow key={transaction._id}>
                  <TableCell>{new Date(transaction.date).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <span className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200">
                      {transaction.ref_type}
                    </span>
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
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          transaction.action === "In"
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                            : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                        }`}
                      >
                        {transaction.action}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{transaction.remarks || "-"}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(transaction)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDelete(transaction._id)}>
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
