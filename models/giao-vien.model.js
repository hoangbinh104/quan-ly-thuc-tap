const mongoose = require("mongoose");

// Ho so giao vien. Tach khoi Account de mot nguoi co the co ho so ma chua cap tai khoan.
const giaoVienSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true },
    fullName: { type: String, required: true },
    gender: { type: String, enum: ["Nam", "Nu", "Khac"], default: "Nam" },
    dob: Date,
    email: String,
    phone: String,
    khoa_id: { type: mongoose.Schema.Types.ObjectId, ref: "Khoa", required: true },
    chuyenMon: String,
    hocVi: String,
    status: { type: String, enum: ["active", "inactive"], default: "active" },
    deleted: { type: Boolean, default: false }
  },
  { timestamps: true }
);

module.exports = mongoose.model("GiaoVien", giaoVienSchema, "giao_viens");
