const DoanhNghiep = require("../../models/doanh-nghiep.model");
const systemConfig = require("../../config/system");
const searchHelper = require("../../helpers/search");
const filterStatusHelper = require("../../helpers/filterStatus");
const paginationHelper = require("../../helpers/pagination");

// [GET] /admin/doanh-nghiep
// Mau chuan cho MOI trang danh sach: loc + tim kiem + phan trang.
module.exports.index = async (req, res) => {
  const find = { deleted: false };

  const filterStatus = filterStatusHelper(req.query, [
    { label: "Dang hop tac", value: "active" },
    { label: "Ngung hop tac", value: "inactive" }
  ]);
  if (req.query.status) find.status = req.query.status;

  const objectSearch = searchHelper(req.query, ["name", "code", "linhVuc"]);
  if (objectSearch.keyword) Object.assign(find, objectSearch.filter);

  const countRecords = await DoanhNghiep.countDocuments(find);
  const pagination = paginationHelper(req.query, countRecords, systemConfig.pageSizeDefault);

  const records = await DoanhNghiep.find(find)
    .sort({ createdAt: -1 })
    .limit(pagination.limitItems)
    .skip(pagination.skip);

  res.render("admin/pages/doanh-nghiep/index", {
    pageTitle: "Quan ly doanh nghiep",
    records,
    filterStatus,
    keyword: objectSearch.keyword,
    pagination
  });
};

// [GET] /admin/doanh-nghiep/create
module.exports.create = (req, res) => {
  res.render("admin/pages/doanh-nghiep/create", { pageTitle: "Them doanh nghiep" });
};

// [POST] /admin/doanh-nghiep/create
module.exports.createPost = async (req, res) => {
  try {
    req.body.soLuongTiepNhan = parseInt(req.body.soLuongTiepNhan) || 0;
    await new DoanhNghiep(req.body).save();
    req.flash("success", "Them doanh nghiep thanh cong.");
  } catch (error) {
    req.flash("error", "Them that bai: " + error.message);
  }
  res.redirect(systemConfig.prefixAdmin + "/doanh-nghiep");
};

// [GET] /admin/doanh-nghiep/edit/:id
module.exports.edit = async (req, res) => {
  const record = await DoanhNghiep.findOne({ _id: req.params.id, deleted: false });
  if (!record) {
    req.flash("error", "Khong tim thay doanh nghiep.");
    return res.redirect(systemConfig.prefixAdmin + "/doanh-nghiep");
  }
  res.render("admin/pages/doanh-nghiep/create", {
    pageTitle: "Chinh sua doanh nghiep",
    record
  });
};

// [PATCH] /admin/doanh-nghiep/edit/:id
module.exports.editPatch = async (req, res) => {
  try {
    req.body.soLuongTiepNhan = parseInt(req.body.soLuongTiepNhan) || 0;
    await DoanhNghiep.updateOne({ _id: req.params.id }, req.body);
    req.flash("success", "Cap nhat thanh cong.");
  } catch (error) {
    req.flash("error", "Cap nhat that bai: " + error.message);
  }
  res.redirect(systemConfig.prefixAdmin + "/doanh-nghiep");
};

// [DELETE] /admin/doanh-nghiep/delete/:id
// Xoa mem: chi danh dau deleted = true, du lieu lich su van con.
module.exports.deleteItem = async (req, res) => {
  await DoanhNghiep.updateOne(
    { _id: req.params.id },
    { deleted: true, deletedAt: new Date() }
  );
  req.flash("success", "Da xoa doanh nghiep.");
  res.redirect("back");
};
