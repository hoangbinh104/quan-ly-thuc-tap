const mongoose = require("mongoose");

// Nhat ky huong dan thuc tap, ghi theo tuan, gan voi mot ban ghi phan cong.
const nhatKySchema = new mongoose.Schema(
  {
    phanCong_id: { type: mongoose.Schema.Types.ObjectId, ref: "PhanCong", required: true },
    tuan: { type: Number, required: true },
    tuNgay: Date,
    denNgay: Date,
    noiDungCongViec: String,
    tinhHinhHSSV: String,
    vanDePhatSinh: String,
    deXuat: String,
    nguoiGhi_id: { type: mongoose.Schema.Types.ObjectId, ref: "Account" },
    deleted: { type: Boolean, default: false }
  },
  { timestamps: true }
);

nhatKySchema.index({ phanCong_id: 1, tuan: 1 }, { unique: true });

module.exports = mongoose.model("NhatKy", nhatKySchema, "nhat_kys");
