const mongoose = require("mongoose");

// Nhom quyen: quan-tri, khoa, giao-vien, hoc-sinh.
// permissions luu danh sach ma quyen dang "doanh-nghiep_create", "phan-cong_edit"...
const roleSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: String,
    permissions: { type: Array, default: [] },
    deleted: { type: Boolean, default: false }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Role", roleSchema, "roles");
