const mongoose = require("mongoose");

// Dot thuc tap san xuat: gan voi 1 quyet dinh, 1 khoang thoi gian, nhieu lop tham gia.
const dotThucTapSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    namHoc: String, // vd: 2026-2027
    hocKy: String,
    quyetDinhSo: String,
    ngayQuyetDinh: Date,
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    lop_ids: [{ type: mongoose.Schema.Types.ObjectId, ref: "Lop" }],
    moTa: String,
    // draft: dang soan | open: dang dien ra | closed: da ket thuc
    status: { type: String, enum: ["draft", "open", "closed"], default: "draft" },
    deleted: { type: Boolean, default: false },
    deletedAt: Date
  },
  { timestamps: true }
);

module.exports = mongoose.model("DotThucTap", dotThucTapSchema, "dot_thuc_taps");
