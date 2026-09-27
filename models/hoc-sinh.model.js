const mongoose = require("mongoose");

// Ho so hoc sinh - sinh vien (HSSV).
const hocSinhSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true }, // ma HSSV
    fullName: { type: String, required: true },
    gender: { type: String, enum: ["Nam", "Nu", "Khac"], default: "Nam" },
    dob: Date,
    email: String,
    phone: String,
    address: String,
    lop_id: { type: mongoose.Schema.Types.ObjectId, ref: "Lop", required: true },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
    deleted: { type: Boolean, default: false }
  },
  { timestamps: true }
);

module.exports = mongoose.model("HocSinh", hocSinhSchema, "hoc_sinhs");
