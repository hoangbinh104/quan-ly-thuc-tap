const DotThucTap = require("../../models/dot-thuc-tap.model");
const DoanhNghiep = require("../../models/doanh-nghiep.model");
const HocSinh = require("../../models/hoc-sinh.model");
const GiaoVien = require("../../models/giao-vien.model");
const PhanCong = require("../../models/phan-cong.model");
const NhatKy = require("../../models/nhat-ky.model");
const DanhGia = require("../../models/danh-gia.model");

// [GET] /admin/dashboard
module.exports.index = async (req, res) => {
  // Promise.all de cac cau dem chay song song thay vi tuan tu -> nhanh hon nhieu.
  const [soDot, soDoanhNghiep, soHocSinh, soGiaoVien, soPhanCong, soNhatKy, soDanhGia, thongKeTrangThai] = await Promise.all([
    DotThucTap.countDocuments({ deleted: false }),
    DoanhNghiep.countDocuments({ deleted: false }),
    HocSinh.countDocuments({ deleted: false }),
    GiaoVien.countDocuments({ deleted: false }),
    PhanCong.countDocuments({ deleted: false }),
    NhatKy.countDocuments({ deleted: false }),
    DanhGia.countDocuments({ deleted: false }),
    PhanCong.aggregate([
      { $match: { deleted: false } },
      { $group: { _id: "$trangThai", total: { $sum: 1 } } }
    ])
  ]);

  res.render("admin/pages/dashboard/index", {
    pageTitle: "Tong quan he thong",
    thongKe: { soDot, soDoanhNghiep, soHocSinh, soGiaoVien, soPhanCong, soNhatKy, soDanhGia },
    thongKeTrangThai
  });
};
