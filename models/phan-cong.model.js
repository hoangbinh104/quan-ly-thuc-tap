const mongoose = require("mongoose");

// BANG TRUNG TAM cua he thong.
// Mot ban ghi = mot HSSV, trong mot dot thuc tap, tai mot doanh nghiep,
// duoi su huong dan cua mot giao vien.
// Day chinh la noi hoa giai cac quan he nhieu-nhieu giua HSSV / DoanhNghiep / GiaoVien.
const phanCongSchema = new mongoose.Schema(
  {
    dotThucTap_id: { type: mongoose.Schema.Types.ObjectId, ref: "DotThucTap", required: true },
    hocSinh_id: { type: mongoose.Schema.Types.ObjectId, ref: "HocSinh", required: true },
    doanhNghiep_id: { type: mongoose.Schema.Types.ObjectId, ref: "DoanhNghiep", required: true },
    giaoVien_id: { type: mongoose.Schema.Types.ObjectId, ref: "GiaoVien", default: null },
    viTriThucTap: String,
    canBoHuongDanDN: String,
    sdtCanBoDN: String,
    ngayBatDau: Date,
    ngayKetThuc: Date,
    // cho-duyet -> dang-thuc-tap -> hoan-thanh / khong-hoan-thanh
    trangThai: {
      type: String,
      enum: ["cho-duyet", "dang-thuc-tap", "hoan-thanh", "khong-hoan-thanh"],
      default: "cho-duyet"
    },
    ghiChu: String,
    deleted: { type: Boolean, default: false }
  },
  { timestamps: true }
);

// Mot HSSV chi duoc phan cong 1 lan trong 1 dot thuc tap.
phanCongSchema.index({ dotThucTap_id: 1, hocSinh_id: 1 }, { unique: true });

module.exports = mongoose.model("PhanCong", phanCongSchema, "phan_congs");
