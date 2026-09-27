const mongoose = require("mongoose");

// Lop hoc. Moi lop thuoc 1 nganh/nghe va co 1 giao vien chu nhiem.
const lopSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    nganhNghe_id: { type: mongoose.Schema.Types.ObjectId, ref: "NganhNghe", required: true },
    gvChuNhiem_id: { type: mongoose.Schema.Types.ObjectId, ref: "GiaoVien", default: null },
    khoaHoc: String, // vd: 2024-2027
    trinhDo: String,
    status: { type: String, enum: ["active", "inactive"], default: "active" },
    deleted: { type: Boolean, default: false }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Lop", lopSchema, "lops");
