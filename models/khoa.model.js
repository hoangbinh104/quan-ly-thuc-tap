const mongoose = require("mongoose");

// Khoa / phong chuyen mon cua truong.
const khoaSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    truongKhoa: String,
    phone: String,
    description: String,
    status: { type: String, enum: ["active", "inactive"], default: "active" },
    deleted: { type: Boolean, default: false }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Khoa", khoaSchema, "khoas");
