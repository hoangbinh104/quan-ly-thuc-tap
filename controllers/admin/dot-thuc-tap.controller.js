const DotThucTap = require("../../models/dot-thuc-tap.model");
const Lop = require("../../models/lop.model");
const PhanCong = require("../../models/phan-cong.model");
const systemConfig = require("../../config/system");
const searchHelper = require("../../helpers/search");
const paginationHelper = require("../../helpers/pagination");

// [GET] /admin/dot-thuc-tap
module.exports.index = async (req, res) => {
  const find = { deleted: false };
  if (req.query.status) find.status = req.query.status;

  const objectSearch = searchHelper(req.query, ["name", "code", "namHoc"]);
  if (objectSearch.keyword) Object.assign(find, objectSearch.filter);

  const countRecords = await DotThucTap.countDocuments(find);
  const pagination = paginationHelper(req.query, countRecords, systemConfig.pageSizeDefault);

  const records = await DotThucTap.find(find)
    .sort({ startDate: -1 })
    .limit(pagination.limitItems)
    .skip(pagination.skip);

  res.render("admin/pages/dot-thuc-tap/index", {
    pageTitle: "Quan ly dot thuc tap",
    records,
    keyword: objectSearch.keyword,
    pagination
  });
};

// [GET] /admin/dot-thuc-tap/create
module.exports.create = async (req, res) => {
  const lops = await Lop.find({ deleted: false, status: "active" });
  res.render("admin/pages/dot-thuc-tap/create", {
    pageTitle: "Tao dot thuc tap",
    lops,
    record: null
  });
};

// [POST] /admin/dot-thuc-tap/create
module.exports.createPost = async (req, res) => {
  try {
    if (new Date(req.body.endDate) <= new Date(req.body.startDate)) {
      req.flash("error", "Ngay ket thuc phai sau ngay bat dau.");
      return res.redirect("back");
    }
    if (typeof req.body.lop_ids === "string") req.body.lop_ids = [req.body.lop_ids];
    await new DotThucTap(req.body).save();
    req.flash("success", "Tao dot thuc tap thanh cong.");
  } catch (error) {
    req.flash("error", "Tao that bai: " + error.message);
  }
  res.redirect(systemConfig.prefixAdmin + "/dot-thuc-tap");
};

// [GET] /admin/dot-thuc-tap/edit/:id
module.exports.edit = async (req, res) => {
  const record = await DotThucTap.findOne({ _id: req.params.id, deleted: false });

  if (!record) {
    req.flash("error", "Khong tim thay dot thuc tap.");
    return res.redirect(systemConfig.prefixAdmin + "/dot-thuc-tap");
  }

  const lops = await Lop.find({ deleted: false, status: "active" });
  res.render("admin/pages/dot-thuc-tap/create", {
    pageTitle: "Chinh sua dot thuc tap",
    lops,
    record
  });
};

// [PATCH] /admin/dot-thuc-tap/edit/:id
module.exports.editPatch = async (req, res) => {
  try {
    if (new Date(req.body.endDate) <= new Date(req.body.startDate)) {
      req.flash("error", "Ngay ket thuc phai sau ngay bat dau.");
      return res.redirect("back");
    }
    if (typeof req.body.lop_ids === "string") req.body.lop_ids = [req.body.lop_ids];
    if (!req.body.lop_ids) req.body.lop_ids = [];
    await DotThucTap.updateOne({ _id: req.params.id }, req.body);
    req.flash("success", "Cap nhat dot thuc tap thanh cong.");
  } catch (error) {
    req.flash("error", "Cap nhat that bai: " + error.message);
  }
  res.redirect(systemConfig.prefixAdmin + "/dot-thuc-tap");
};

// [DELETE] /admin/dot-thuc-tap/delete/:id - xoa mem
module.exports.deleteItem = async (req, res) => {
  await DotThucTap.updateOne({ _id: req.params.id }, { deleted: true, deletedAt: new Date() });
  req.flash("success", "Da xoa dot thuc tap.");
  res.redirect("back");
};

// [GET] /admin/dot-thuc-tap/detail/:id
module.exports.detail = async (req, res) => {
  const record = await DotThucTap.findOne({ _id: req.params.id, deleted: false }).populate("lop_ids");
  if (!record) {
    req.flash("error", "Khong tim thay dot thuc tap.");
    return res.redirect(systemConfig.prefixAdmin + "/dot-thuc-tap");
  }

  // populate lay du lieu tu cac collection lien quan - tuong duong JOIN ben SQL
  const phanCongs = await PhanCong.find({ dotThucTap_id: record.id, deleted: false })
    .populate("hocSinh_id")
    .populate("doanhNghiep_id")
    .populate("giaoVien_id");

  res.render("admin/pages/dot-thuc-tap/detail", {
    pageTitle: "Chi tiet: " + record.name,
    record,
    phanCongs
  });
};
