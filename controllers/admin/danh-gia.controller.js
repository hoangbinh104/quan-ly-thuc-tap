// ============================================================================
// DANH GIA KET QUA THUC TAP
// Moi ban ghi danh gia gan 1-1 voi mot ban ghi phan cong.
// Diem tong ket = 0.4 x diem doanh nghiep + 0.4 x diem giao vien
//               + 0.2 x diem bao cao  (chi tinh khi nhap du 3 dau diem;
// neu thieu thi lay trung binh cong cac dau diem da nhap).
// ============================================================================

const PhanCong = require("../../models/phan-cong.model");
const DanhGia = require("../../models/danh-gia.model");
const DotThucTap = require("../../models/dot-thuc-tap.model");
const systemConfig = require("../../config/system");

const xepLoaiTheoDiem = (diem) => {
  if (diem === null || diem === undefined) return "";
  if (diem >= 9) return "Xuat sac";
  if (diem >= 8) return "Gioi";
  if (diem >= 6.5) return "Kha";
  if (diem >= 5) return "Trung binh";
  return "Khong dat";
};

const toDiem = (value) => {
  if (value === "" || value === undefined || value === null) return null;
  const so = Number(value);
  if (isNaN(so)) return null;
  return Math.min(10, Math.max(0, so));
};

const tinhDiemTongKet = (dn, gv, bc) => {
  if (dn !== null && gv !== null && bc !== null) {
    return Math.round((dn * 0.4 + gv * 0.4 + bc * 0.2) * 10) / 10;
  }
  const coDiem = [dn, gv, bc].filter((d) => d !== null);
  if (coDiem.length === 0) return null;
  const tong = coDiem.reduce((a, b) => a + b, 0);
  return Math.round((tong / coDiem.length) * 10) / 10;
};

// Neu nguoi dang nhap la giao vien thi chi duoc danh gia HSSV minh phu trach
const kiemTraQuyen = (user, phanCong) => {
  const slug = user.role_id && user.role_id.slug;
  if (slug !== "giao-vien") return true;
  if (!user.giaoVien_id || !phanCong.giaoVien_id) return false;
  return String(user.giaoVien_id) === String(phanCong.giaoVien_id._id || phanCong.giaoVien_id);
};

// [GET] /admin/danh-gia/dot/:dotId - bang tong hop ket qua cua ca dot
module.exports.theoDot = async (req, res) => {
  const dot = await DotThucTap.findOne({ _id: req.params.dotId, deleted: false });

  if (!dot) {
    req.flash("error", "Không tìm thấy đợt thực tập.");
    return res.redirect(systemConfig.prefixAdmin + "/dot-thuc-tap");
  }

  const phanCongs = await PhanCong.find({ dotThucTap_id: dot.id, deleted: false })
    .populate("hocSinh_id")
    .populate("doanhNghiep_id")
    .populate("giaoVien_id");

  const danhGias = await DanhGia.find({
    phanCong_id: { $in: phanCongs.map((pc) => pc._id) },
    deleted: false
  });

  // Ghep ket qua vao tung dong phan cong cho de hien thi
  const map = {};
  danhGias.forEach((dg) => { map[String(dg.phanCong_id)] = dg; });
  const rows = phanCongs.map((pc) => ({ phanCong: pc, danhGia: map[String(pc._id)] || null }));

  const daCoDiem = rows.filter((r) => r.danhGia && r.danhGia.diemTongKet !== null).length;

  res.render("admin/pages/danh-gia/index", {
    pageTitle: "Kết quả thực tập - " + dot.name,
    dot,
    rows,
    daCoDiem
  });
};

// [GET] /admin/danh-gia/nhap/:phanCongId - form nhap diem cho 1 HSSV
module.exports.nhap = async (req, res) => {
  const phanCong = await PhanCong.findOne({ _id: req.params.phanCongId, deleted: false })
    .populate("hocSinh_id")
    .populate("doanhNghiep_id")
    .populate("giaoVien_id")
    .populate("dotThucTap_id");

  if (!phanCong) {
    req.flash("error", "Không tìm thấy bản ghi phân công.");
    return res.redirect(systemConfig.prefixAdmin + "/dot-thuc-tap");
  }

  const danhGia = await DanhGia.findOne({ phanCong_id: phanCong.id, deleted: false });

  res.render("admin/pages/danh-gia/form", {
    pageTitle: "Đánh giá kết quả - " + (phanCong.hocSinh_id ? phanCong.hocSinh_id.fullName : ""),
    phanCong,
    danhGia,
    coQuyenNhap: kiemTraQuyen(req.user, phanCong)
  });
};

// [POST] /admin/danh-gia/nhap/:phanCongId
module.exports.nhapPost = async (req, res) => {
  const phanCong = await PhanCong.findOne({ _id: req.params.phanCongId, deleted: false }).populate("giaoVien_id");

  if (!phanCong || !kiemTraQuyen(req.user, phanCong)) {
    req.flash("error", "Bạn không được đánh giá HSSV này.");
    return res.redirect("back");
  }

  const diemDoanhNghiep = toDiem(req.body.diemDoanhNghiep);
  const diemGiaoVien = toDiem(req.body.diemGiaoVien);
  const diemBaoCao = toDiem(req.body.diemBaoCao);
  const diemTongKet = tinhDiemTongKet(diemDoanhNghiep, diemGiaoVien, diemBaoCao);

  const data = {
    phanCong_id: phanCong.id,
    diemDoanhNghiep,
    diemGiaoVien,
    diemBaoCao,
    diemTongKet,
    xepLoai: xepLoaiTheoDiem(diemTongKet),
    nhanXetDoanhNghiep: req.body.nhanXetDoanhNghiep,
    nhanXetGiaoVien: req.body.nhanXetGiaoVien,
    nguoiDanhGia_id: req.user._id,
    ngayDanhGia: new Date(),
    deleted: false
  };

  try {
    // upsert: chua co thi tao moi, co roi thi cap nhat (quan he 1-1)
    await DanhGia.updateOne({ phanCong_id: phanCong.id }, data, { upsert: true });

    // Ghi nhan HSSV da hoan thanh dot thuc tap khi da co diem tong ket
    if (diemTongKet !== null) {
      await PhanCong.updateOne(
        { _id: phanCong._id },
        { trangThai: diemTongKet >= 5 ? "hoan-thanh" : "khong-hoan-thanh" }
      );
    }

    req.flash("success", "Đã lưu kết quả đánh giá.");
    res.redirect(systemConfig.prefixAdmin + "/danh-gia/dot/" + phanCong.dotThucTap_id);
  } catch (error) {
    req.flash("error", "Lưu đánh giá thất bại: " + error.message);
    res.redirect("back");
  }
};
