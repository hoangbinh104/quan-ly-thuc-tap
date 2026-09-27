const PhanCong = require("../../models/phan-cong.model");
const HocSinh = require("../../models/hoc-sinh.model");
const DoanhNghiep = require("../../models/doanh-nghiep.model");
const GiaoVien = require("../../models/giao-vien.model");
const DotThucTap = require("../../models/dot-thuc-tap.model");
const systemConfig = require("../../config/system");

// [GET] /admin/phan-cong/:dotId
// Man hinh phan cong: chon HSSV -> gan doanh nghiep -> gan giao vien huong dan.
module.exports.index = async (req, res) => {
  const dot = await DotThucTap.findOne({ _id: req.params.dotId, deleted: false }).populate("lop_ids");
  if (!dot) {
    req.flash("error", "Khong tim thay dot thuc tap.");
    return res.redirect(systemConfig.prefixAdmin + "/dot-thuc-tap");
  }

  const [hocSinhs, doanhNghieps, giaoViens, daPhanCong] = await Promise.all([
    HocSinh.find({ lop_id: { $in: dot.lop_ids.map((l) => l._id) }, deleted: false }).populate("lop_id"),
    DoanhNghiep.find({ deleted: false, status: "active" }),
    GiaoVien.find({ deleted: false, status: "active" }),
    PhanCong.find({ dotThucTap_id: dot.id, deleted: false })
      .populate("hocSinh_id")
      .populate("doanhNghiep_id")
      .populate("giaoVien_id")
  ]);

  const daPhanCongIds = daPhanCong.map((p) => String(p.hocSinh_id && p.hocSinh_id._id));
  const chuaPhanCong = hocSinhs.filter((h) => !daPhanCongIds.includes(String(h._id)));

  res.render("admin/pages/phan-cong/index", {
    pageTitle: "Phan cong thuc tap - " + dot.name,
    dot,
    chuaPhanCong,
    daPhanCong,
    doanhNghieps,
    giaoViens
  });
};

// [POST] /admin/phan-cong/:dotId
module.exports.createPost = async (req, res) => {
  try {
    const hocSinhIds = Array.isArray(req.body.hocSinh_ids)
      ? req.body.hocSinh_ids
      : [req.body.hocSinh_ids].filter(Boolean);

    if (hocSinhIds.length === 0) {
      req.flash("error", "Chua chon HSSV nao.");
      return res.redirect("back");
    }

    const docs = hocSinhIds.map((id) => ({
      dotThucTap_id: req.params.dotId,
      hocSinh_id: id,
      doanhNghiep_id: req.body.doanhNghiep_id,
      giaoVien_id: req.body.giaoVien_id || null,
      viTriThucTap: req.body.viTriThucTap,
      ngayBatDau: req.body.ngayBatDau || null,
      ngayKetThuc: req.body.ngayKetThuc || null,
      trangThai: "cho-duyet"
    }));

    // ordered:false -> ban ghi nao trung index thi bo qua, cac ban ghi con lai van duoc them.
    await PhanCong.insertMany(docs, { ordered: false });
    req.flash("success", "Da phan cong " + docs.length + " HSSV.");
  } catch (error) {
    req.flash("error", "Mot so HSSV da duoc phan cong truoc do nen bi bo qua.");
  }
  res.redirect("back");
};

// [PATCH] /admin/phan-cong/doi-giao-vien/:id
module.exports.doiGiaoVien = async (req, res) => {
  await PhanCong.updateOne({ _id: req.params.id }, { giaoVien_id: req.body.giaoVien_id || null });
  req.flash("success", "Da cap nhat giao vien huong dan.");
  res.redirect("back");
};

// [DELETE] /admin/phan-cong/delete/:id
module.exports.deleteItem = async (req, res) => {
  await PhanCong.updateOne({ _id: req.params.id }, { deleted: true });
  req.flash("success", "Da huy phan cong.");
  res.redirect("back");
};
