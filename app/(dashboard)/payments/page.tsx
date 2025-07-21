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

interface Payment {
  _id: string
  payment_date: string
  payer: {
    _id: string
    name: string
    party_code: string
  }
  payee: {
    _id: string
    name: string
    party_code: string
  }
  amount: number
  mode: string
  reference_no: string
  remarks: string
  createdAt: string
}

interface Party {
  _id: string
  name: string
  party_code: string
}

interface PaymentForm {
  payment_date: string
  payer: string
  payee: string
  amount: number
  mode: string
  reference_no: string
  remarks: string
}

const paymentModes = ["Cash", "Bank", "Cheque", "UPI", "Contra"]

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([])
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
  } = useForm<PaymentForm>()

  useEffect(() => {
    fetchPayments()
    fetchParties()
  }, [])

  const fetchPayments = async () => {
    try {
      const response = await fetch("/api/payments")
      const data = await response.json()
      setPayments(data)
    } catch (error) {
      toast.error("Failed to fetch payments")
    } finally {
      setLoading(false)
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

  const onSubmit = async (data: PaymentForm) => {
    try {
      const url = editingId ? `/api/payments/${editingId}` : "/api/payments"
      const method = editingId ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        toast.success(editingId ? "Payment updated" : "Payment created")
        setDialogOpen(false)
        reset()
        setEditingId(null)
        fetchPayments()
      } else {
        const error = await response.json()
        toast.error(error.error || "Operation failed")
      }
    } catch (error) {
      toast.error("Operation failed")
    }
  }

  const handleEdit = (payment: Payment) => {
    setEditingId(payment._id)
    setValue("payment_date", payment.payment_date?.split("T")[0] || "")
    setValue("payer", payment.payer?._id || "")
    setValue("payee", payment.payee?._id || "")
    setValue("amount", payment.amount)
    setValue("mode", payment.mode)
    setValue("reference_no", payment.reference_no || "")
    setValue("remarks", payment.remarks || "")
    setDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this payment?")) return

    try {
      const response = await fetch(`/api/payments/${id}`, { method: "DELETE" })
      if (response.ok) {
        toast.success("Payment deleted")
        fetchPayments()
      } else {
        toast.error("Failed to delete payment")
      }
    } catch (error) {
      toast.error("Failed to delete payment")
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
          <h1 className="text-3xl font-bold tracking-tight">Payments</h1>
          <p className="text-muted-foreground">Manage payment transactions</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Payment
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingId ? "Edit" : "Add"} Payment</DialogTitle>
              <DialogDescription>{editingId ? "Update the" : "Create a new"} payment transaction.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="payment_date">Payment Date</Label>
                    <Input
                      id="payment_date"
                      type="date"
                      {...register("payment_date", { required: "Payment date is required" })}
                    />
                    {errors.payment_date && <p className="text-sm text-red-500">{errors.payment_date.message}</p>}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="amount">Amount (₹)</Label>
                    <Input
                      id="amount"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      {...register("amount", {
                        required: "Amount is required",
                        min: { value: 0.01, message: "Amount must be positive" },
                      })}
                    />
                    {errors.amount && <p className="text-sm text-red-500">{errors.amount.message}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="payer">Payer</Label>
                    <Controller
                      name="payer"
                      control={control}
                      rules={{ required: "Payer is required" }}
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select payer" />
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
                    {errors.payer && <p className="text-sm text-red-500">{errors.payer.message}</p>}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="payee">Payee</Label>
                    <Controller
                      name="payee"
                      control={control}
                      rules={{ required: "Payee is required" }}
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select payee" />
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
                    {errors.payee && <p className="text-sm text-red-500">{errors.payee.message}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="mode">Payment Mode</Label>
                    <Controller
                      name="mode"
                      control={control}
                      defaultValue="Cash"
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select payment mode" />
                          </SelectTrigger>
                          <SelectContent>
                            {paymentModes.map((mode) => (
                              <SelectItem key={mode} value={mode}>
                                {mode}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="reference_no">Reference No</Label>
                    <Input id="reference_no" placeholder="Cheque/Transaction ID" {...register("reference_no")} />
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="remarks">Remarks</Label>
                  <Textarea id="remarks" placeholder="Payment remarks..." {...register("remarks")} />
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
              {payments.map((payment) => (
                <TableRow key={payment._id}>
                  <TableCell>{new Date(payment.payment_date).toLocaleDateString()}</TableCell>
                  <TableCell>{payment.payer?.name}</TableCell>
                  <TableCell>{payment.payee?.name}</TableCell>
                  <TableCell className="font-medium">₹{payment.amount.toLocaleString()}</TableCell>
                  <TableCell>
                    <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                      {payment.mode}
                    </span>
                  </TableCell>
                  <TableCell>{payment.reference_no || "-"}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(payment)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDelete(payment._id)}>
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
