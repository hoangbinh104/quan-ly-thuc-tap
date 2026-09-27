const mongoose = require("mongoose");

// Ket qua danh gia cuoi dot thuc tap cua mot HSSV.
// Quan he 1-1 voi PhanCong.
const danhGiaSchema = new mongoose.Schema(
  {
    phanCong_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PhanCong",
      required: true,
      unique: true
    },
    diemDoanhNghiep: { type: Number, min: 0, max: 10, default: null },
    diemGiaoVien: { type: Number, min: 0, max: 10, default: null },
    diemBaoCao: { type: Number, min: 0, max: 10, default: null },
    diemTongKet: { type: Number, min: 0, max: 10, default: null },
    xepLoai: {
      type: String,
      enum: ["Xuat sac", "Gioi", "Kha", "Trung binh", "Khong dat", ""],
      default: ""
    },
    nhanXetDoanhNghiep: String,
    nhanXetGiaoVien: String,
    nguoiDanhGia_id: { type: mongoose.Schema.Types.ObjectId, ref: "Account" },
    ngayDanhGia: Date,
    deleted: { type: Boolean, default: false }
  },
  { timestamps: true }
);

module.exports = mongoose.model("DanhGia", danhGiaSchema, "danh_gias");
