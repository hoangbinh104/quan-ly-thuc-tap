const mongoose = require("mongoose");

// Doanh nghiep tiep nhan HSSV den thuc tap san xuat.
const doanhNghiepSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    taxCode: String,
    address: String,
    phone: String,
    email: String,
    website: String,
    nguoiDaiDien: String,
    chucVuNguoiDaiDien: String,
    linhVuc: String,
    soLuongTiepNhan: { type: Number, default: 0 },
    ghiChu: String,
    status: { type: String, enum: ["active", "inactive"], default: "active" },
    deleted: { type: Boolean, default: false },
    deletedAt: Date
  },
  { timestamps: true }
);

module.exports = mongoose.model("DoanhNghiep", doanhNghiepSchema, "doanh_nghieps");
