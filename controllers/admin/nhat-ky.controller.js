// ============================================================================
// NHAT KY HUONG DAN THUC TAP
// Moi ban ghi nhat ky gan voi MOT ban ghi phan cong (1 HSSV trong 1 dot thuc
// tap) va duoc ghi theo tuan. Giao vien chi duoc ghi nhat ky cho HSSV minh
// phu trach - kiem tra o ham kiemTraQuyen ben duoi.
// ============================================================================

const PhanCong = require("../../models/phan-cong.model");
const NhatKy = require("../../models/nhat-ky.model");
const systemConfig = require("../../config/system");

// Lay ban ghi phan cong kem cac thong tin lien quan
const layPhanCong = (id) =>
  PhanCong.findOne({ _id: id, deleted: false })
    .populate("hocSinh_id")
    .populate("doanhNghiep_id")
    .populate("giaoVien_id")
    .populate("dotThucTap_id");

// Neu nguoi dang nhap la giao vien thi chi duoc thao tac tren HSSV minh phu trach
const kiemTraQuyen = (user, phanCong) => {
  const slug = user.role_id && user.role_id.slug;
  if (slug !== "giao-vien") return true;
  if (!user.giaoVien_id || !phanCong.giaoVien_id) return false;
  return String(user.giaoVien_id) === String(phanCong.giaoVien_id._id || phanCong.giaoVien_id);
};

// [GET] /admin/nhat-ky/:phanCongId
module.exports.index = async (req, res) => {
  const phanCong = await layPhanCong(req.params.phanCongId);

  if (!phanCong) {
    req.flash("error", "Không tìm thấy bản ghi phân công.");
    return res.redirect(systemConfig.prefixAdmin + "/dot-thuc-tap");
  }

  const records = await NhatKy.find({ phanCong_id: phanCong.id, deleted: false }).sort({ tuan: 1 });

  res.render("admin/pages/nhat-ky/index", {
    pageTitle: "Nhật ký hướng dẫn - " + (phanCong.hocSinh_id ? phanCong.hocSinh_id.fullName : ""),
    phanCong,
    records,
    coQuyenGhi: kiemTraQuyen(req.user, phanCong)
  });
};

// [POST] /admin/nhat-ky/:phanCongId
module.exports.createPost = async (req, res) => {
  const phanCong = await layPhanCong(req.params.phanCongId);

  if (!phanCong || !kiemTraQuyen(req.user, phanCong)) {
    req.flash("error", "Bạn không được ghi nhật ký cho HSSV này.");
    return res.redirect("back");
  }

  try {
    await new NhatKy({
      phanCong_id: phanCong.id,
      tuan: parseInt(req.body.tuan) || 1,
      tuNgay: req.body.tuNgay || null,
      denNgay: req.body.denNgay || null,
      noiDungCongViec: req.body.noiDungCongViec,
      tinhHinhHSSV: req.body.tinhHinhHSSV,
      vanDePhatSinh: req.body.vanDePhatSinh,
      deXuat: req.body.deXuat,
      nguoiGhi_id: req.user._id
    }).save();

    req.flash("success", "Đã lưu nhật ký tuần " + req.body.tuan + ".");
  } catch (error) {
    // Index unique (phanCong_id, tuan) chan viec ghi trung tuan
    if (error.code === 11000) req.flash("error", "Tuần này đã có nhật ký, hãy sửa bản ghi cũ.");
    else req.flash("error", "Lưu nhật ký thất bại: " + error.message);
  }

  res.redirect("back");
};

// [PATCH] /admin/nhat-ky/edit/:id
module.exports.editPatch = async (req, res) => {
  const nhatKy = await NhatKy.findOne({ _id: req.params.id, deleted: false });

  if (!nhatKy) {
    req.flash("error", "Không tìm thấy nhật ký.");
    return res.redirect("back");
  }

  const phanCong = await layPhanCong(nhatKy.phanCong_id);
  if (!kiemTraQuyen(req.user, phanCong)) {
    req.flash("error", "Bạn không được sửa nhật ký này.");
    return res.redirect("back");
  }

  await NhatKy.updateOne({ _id: nhatKy._id }, {
    noiDungCongViec: req.body.noiDungCongViec,
    tinhHinhHSSV: req.body.tinhHinhHSSV,
    vanDePhatSinh: req.body.vanDePhatSinh,
    deXuat: req.body.deXuat
  });

  req.flash("success", "Đã cập nhật nhật ký tuần " + nhatKy.tuan + ".");
  res.redirect("back");
};

// [DELETE] /admin/nhat-ky/delete/:id
module.exports.deleteItem = async (req, res) => {
  await NhatKy.updateOne({ _id: req.params.id }, { deleted: true });
  req.flash("success", "Đã xóa nhật ký.");
  res.redirect("back");
};
