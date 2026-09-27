const mongoose = require("mongoose");

// Tai khoan dang nhap. Moi giao vien / HSSV deu co 1 account tro toi ho so tuong ung.
const accountSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // luu chuoi da bam bang bcrypt
    phone: String,
    avatar: String,
    role_id: { type: mongoose.Schema.Types.ObjectId, ref: "Role", required: true },
    // Tro toi ho so chi tiet, tuy theo vai tro
    giaoVien_id: { type: mongoose.Schema.Types.ObjectId, ref: "GiaoVien", default: null },
    hocSinh_id: { type: mongoose.Schema.Types.ObjectId, ref: "HocSinh", default: null },
    token: String, // token luu trong cookie de nhan dien phien dang nhap
    status: { type: String, enum: ["active", "inactive"], default: "active" },
    deleted: { type: Boolean, default: false },
    deletedAt: Date
  },
  { timestamps: true }
);

module.exports = mongoose.model("Account", accountSchema, "accounts");
