import mongoose from "mongoose"

const { Schema } = mongoose

// 1. CMR Year
const CmrYearSchema = new Schema(
  {
    year_range: { type: String, required: true, unique: true }, // e.g. "2024-25"
  },
  { timestamps: true },
)

// 2. Mill
const MillSchema = new Schema(
  {
    mill_code: { type: String, required: true, unique: true }, // e.g. "Rice Mill 4"
    name: { type: String, required: true },
    address: String,
    gst_no: String,
    phone: String,
    cmr_year: { type: Schema.Types.ObjectId, ref: "CmrYear", required: true },
    is_active: { type: Boolean, default: true },
  },
  { timestamps: true },
)

// 3. Broker
const BrokerSchema = new Schema(
  {
    broker_code: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    phone: String,
    brokerage_rate: { type: Number, required: true }, // percentage or absolute value
    address: String,
    remarks: String,
  },
  { timestamps: true },
)

// 4. Party (could be rice mill, buyer, etc.)
const PartySchema = new Schema(
  {
    party_code: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    category: { type: String, enum: ["Farmer", "Trader", "Buyer", "Depot", "Transporter"], default: "Trader" },
    phone: String,
    address: String,
    gst_no: String,
    created_by: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true },
)

// 5. Vehicle
const VehicleSchema = new Schema(
  {
    vehicle_no: { type: String, required: true, unique: true }, // truck number like "CG07CG4240"
    owner_name: String,
    capacity_ton: Number,
    remarks: String,
  },
  { timestamps: true },
)

// 6. Agreement
const AgreementSchema = new Schema(
  {
    agreement_no: { type: String, required: true, unique: true }, // e.g. "AC122024430119"
    description: String,
    mill: { type: Schema.Types.ObjectId, ref: "Mill", required: true },
    agreement_date: Date,
    rice_type: {
      type: String,
      enum: ["Boiled", "Raw", "Sarna", "Mota", "Patla", "Common", "FCI", "NAN"],
      required: true,
    },
    base_rate: Number,
    validity_from: Date,
    validity_to: Date,
  },
  { timestamps: true },
)

// 7. Sauda (Purchase Agreement)
const SaudaSchema = new Schema(
  {
    sauda_code: { type: String, required: true, unique: true },
    sauda_date: { type: Date, required: true },
    broker: { type: Schema.Types.ObjectId, ref: "Broker" },
    party: { type: Schema.Types.ObjectId, ref: "Party", required: true },
    mill: { type: Schema.Types.ObjectId, ref: "Mill" },
    rice_type: { type: String },
    rate_per_qtl: { type: Number, required: true },
    brokerage_rate: { type: Number },
    condition_text: String,
    frk_bheja: {
      total_qtl: Number,
      invoice_no: String,
      description: String,
      sent_date: Date,
    },
    lots: [{ type: Schema.Types.ObjectId, ref: "Lot" }],
    payments: [{ type: Schema.Types.ObjectId, ref: "Payment" }],
    status: { type: String, enum: ["Open", "Partial", "Closed", "Cancelled"], default: "Open" },
  },
  { timestamps: true },
)

// 8. Rice LOT (detailed rice lot info)
const LotSchema = new Schema(
  {
    lot_no: { type: String, required: true, unique: true }, // e.g. "14127"
    sauda: { type: Schema.Types.ObjectId, ref: "Sauda", required: true },
    agreement: { type: Schema.Types.ObjectId, ref: "Agreement" },
    frk_qtl: Number,
    frk_invoice: String,
    frk_description: String,
    bora_sent_date: Date,
    flap_sticker_date: Date,
    gate_pass: {
      date: Date,
      truck: { type: Schema.Types.ObjectId, ref: "Vehicle" },
    },
    rice_pass_date: Date,
    deposit_centre: String,
    qtl: { type: Number },
    bags: { type: Number },
    moisture_cut: { type: Number, default: 0 },
    net_rice_qtl: { type: Number },
    amount_moisture: Number,
    net_amount: Number,
    qi_exp: Number,
    lot_dalali: Number,
    other_costs: Number,
    brokerage: Number,
    nett_amount_final: Number,
    invoice_no: String,
    invoice_amount: Number,
    purchase_expense: Number,
    total_amount: Number,
    vehicle: { type: Schema.Types.ObjectId, ref: "Vehicle" },
    notes: String,
  },
  { timestamps: true },
)

// Pre-save hook to calculate nett_amount_final
LotSchema.pre("save", function (next) {
  if (this.net_amount && typeof this.net_amount === "number") {
    const qi_exp = this.qi_exp || 0
    const lot_dalali = this.lot_dalali || 0
    const other_costs = this.other_costs || 0
    const brokerage = this.brokerage || 0

    this.nett_amount_final = this.net_amount - qi_exp - lot_dalali - other_costs - brokerage
  }
  next()
})

// 9. Payment
const PaymentSchema = new Schema(
  {
    payment_date: { type: Date, required: true },
    payer: { type: Schema.Types.ObjectId, ref: "Party", required: true },
    payee: { type: Schema.Types.ObjectId, ref: "Party", required: true },
    amount: { type: Number, required: true },
    mode: { type: String, enum: ["Cash", "Bank", "Cheque", "UPI", "Contra"], default: "Cash" },
    reference_no: String,
    remarks: String,
    allocations: [
      {
        ref_collection: String, // e.g. 'Sauda', 'Lot', 'Sale'
        ref_id: Schema.Types.ObjectId,
        allocated_amount: Number,
      },
    ],
  },
  { timestamps: true },
)

// 10. Bag Transaction
const BagTransactionSchema = new Schema(
  {
    ref_type: { type: String, enum: ["Lot", "DO", "Sale", "Purchase"], required: true },
    ref_id: { type: Schema.Types.ObjectId, required: true },
    date: { type: Date, required: true },
    bag_type: { type: String, enum: ["NewJute", "OldJute", "PlasticNew", "PlasticOld", "FRK"], required: true },
    quantity: { type: Number, required: true },
    action: { type: String, enum: ["In", "Out"], required: true },
    remarks: String,
  },
  { timestamps: true },
)

// Export models
export const CmrYear = mongoose.models.CmrYear || mongoose.model("CmrYear", CmrYearSchema)
export const Mill = mongoose.models.Mill || mongoose.model("Mill", MillSchema)
export const Broker = mongoose.models.Broker || mongoose.model("Broker", BrokerSchema)
export const Party = mongoose.models.Party || mongoose.model("Party", PartySchema)
export const Vehicle = mongoose.models.Vehicle || mongoose.model("Vehicle", VehicleSchema)
export const Agreement = mongoose.models.Agreement || mongoose.model("Agreement", AgreementSchema)
export const Sauda = mongoose.models.Sauda || mongoose.model("Sauda", SaudaSchema)
export const Lot = mongoose.models.Lot || mongoose.model("Lot", LotSchema)
export const Payment = mongoose.models.Payment || mongoose.model("Payment", PaymentSchema)
export const BagTransaction = mongoose.models.BagTransaction || mongoose.model("BagTransaction", BagTransactionSchema)
