const mongoose = require("mongoose");

// Nganh / nghe dao tao. Vd: Cong nghe o to, Dien cong nghiep, Quan tri mang may tinh...
const nganhNgheSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    khoa_id: { type: mongoose.Schema.Types.ObjectId, ref: "Khoa", required: true },
    trinhDo: { type: [String], default: [] }, // ["Cao dang", "Trung cap", "So cap"]
    description: String,
    status: { type: String, enum: ["active", "inactive"], default: "active" },
    deleted: { type: Boolean, default: false }
  },
  { timestamps: true }
);

module.exports = mongoose.model("NganhNghe", nganhNgheSchema, "nganh_nghes");
