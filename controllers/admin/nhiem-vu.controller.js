// ============================================================================
// MAN HINH "NHIEM VU CUA TOI" DANH CHO GIAO VIEN HUONG DAN
// Hien thi cac HSSV ma giao vien dang dang nhap duoc phan cong phu trach,
// kem so tuan nhat ky da ghi va ket qua danh gia (neu co).
// ============================================================================

const PhanCong = require("../../models/phan-cong.model");
const NhatKy = require("../../models/nhat-ky.model");
const DanhGia = require("../../models/danh-gia.model");

// [GET] /admin/nhiem-vu
module.exports.index = async (req, res) => {
  const user = req.user;

  // Tai khoan giao vien duoc gan ho so giao vien (giaoVien_id).
  // Tai khoan quan tri / khoa khong gan ho so nay -> xem duoc toan bo.
  const find = { deleted: false };
  if (user.giaoVien_id) find.giaoVien_id = user.giaoVien_id;

  const phanCongs = await PhanCong.find(find)
    .populate("hocSinh_id")
    .populate("doanhNghiep_id")
    .populate("dotThucTap_id")
    .populate("giaoVien_id")
    .sort({ createdAt: -1 });

  const ids = phanCongs.map((pc) => pc._id);

  const [nhatKys, danhGias] = await Promise.all([
    NhatKy.find({ phanCong_id: { $in: ids }, deleted: false }),
    DanhGia.find({ phanCong_id: { $in: ids }, deleted: false })
  ]);

  // Dem so tuan nhat ky va lay ket qua cua tung ban ghi phan cong
  const soNhatKy = {};
  nhatKys.forEach((nk) => {
    const key = String(nk.phanCong_id);
    soNhatKy[key] = (soNhatKy[key] || 0) + 1;
  });

  const ketQua = {};
  danhGias.forEach((dg) => { ketQua[String(dg.phanCong_id)] = dg; });

  const rows = phanCongs.map((pc) => ({
    phanCong: pc,
    soNhatKy: soNhatKy[String(pc._id)] || 0,
    danhGia: ketQua[String(pc._id)] || null
  }));

  res.render("admin/pages/nhiem-vu/index", {
    pageTitle: "Nhiệm vụ hướng dẫn của tôi",
    rows,
    laGiaoVien: Boolean(user.giaoVien_id)
  });
};
