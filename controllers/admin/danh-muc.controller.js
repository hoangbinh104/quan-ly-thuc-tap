// ============================================================================
// CONTROLLER DUNG CHUNG CHO CAC DANH MUC
// Doc cau hinh tu config/danh-muc.config.js roi sinh ra 6 ham xu ly quen
// thuoc: index (danh sach), create + createPost, edit + editPatch, deleteItem.
//
// Cach doc code: moi ham deu tra ve mot middleware cua Express
//   module.exports.index = (key) => async (req, res) => { ... }
// nghia la "dua vao ten danh muc (key), tra ve ham xu ly request cho danh muc do".
// ============================================================================

const bcrypt = require("bcryptjs");
const configs = require("../../config/danh-muc.config");
const systemConfig = require("../../config/system");
const searchHelper = require("../../helpers/search");
const paginationHelper = require("../../helpers/pagination");

// Lay cau hinh cua mot danh muc, kem duong dan goc /admin/<key>
const getConfig = (key) => {
  const config = configs[key];
  if (!config) throw new Error("Khong tim thay cau hinh danh muc: " + key);
  return { ...config, key, basePath: systemConfig.prefixAdmin + "/" + key };
};

// Nap danh sach lua chon cho cac truong ref / multiref (de do vao the <select>)
const loadRefOptions = async (config) => {
  const refOptions = {};
  for (const field of config.fields) {
    if (field.type === "ref" || field.type === "multiref") {
      const docs = await field.ref.model.find({ deleted: false }).sort({ createdAt: 1 });
      refOptions[field.name] = docs.map((doc) => ({
        value: String(doc._id),
        label: (doc[field.ref.labelField] || "") + (doc.code ? " (" + doc.code + ")" : "")
      }));
    }
  }
  return refOptions;
};

// Chuyen du lieu tu form (req.body) thanh doi tuong luu vao CSDL
const buildData = async (config, body, isEdit) => {
  const data = {};

  for (const field of config.fields) {
    let value = body[field.name];

    switch (field.type) {
      case "number":
        data[field.name] = value === "" || value === undefined ? 0 : Number(value);
        break;

      case "date":
        data[field.name] = value ? new Date(value) : null;
        break;

      case "ref":
        // Chuoi rong -> null, neu khong Mongoose se bao loi ep kieu ObjectId
        data[field.name] = value ? value : null;
        break;

      case "multiref":
        if (!value) value = [];
        data[field.name] = Array.isArray(value) ? value : [value];
        break;

      case "list":
        // Nguoi dung nhap "a, b, c" hoac xuong dong -> tach thanh mang
        data[field.name] = (value || "")
          .split(/[,\n]/)
          .map((item) => item.trim())
          .filter((item) => item !== "");
        break;

      case "password":
        // Khi sua ma de trong thi giu nguyen mat khau cu
        if (value) data[field.name] = await bcrypt.hash(value, 10);
        else if (!isEdit) data[field.name] = await bcrypt.hash("123456", 10);
        break;

      default:
        data[field.name] = value === undefined ? "" : value;
    }
  }

  return data;
};

// [GET] /admin/<key>
module.exports.index = (key) => async (req, res) => {
  const config = getConfig(key);

  const find = { deleted: false };
  if (req.query.status) find.status = req.query.status;

  const objectSearch = searchHelper(req.query, config.searchFields);
  if (objectSearch.keyword) Object.assign(find, objectSearch.filter);

  const countRecords = await config.model.countDocuments(find);
  const pagination = paginationHelper(req.query, countRecords, systemConfig.pageSizeDefault);

  let query = config.model.find(find).sort({ createdAt: -1 }).limit(pagination.limitItems).skip(pagination.skip);

  // populate = lay kem du lieu cua bang lien quan (tuong duong JOIN ben SQL)
  config.fields
    .filter((f) => f.type === "ref" || f.type === "multiref")
    .forEach((f) => { query = query.populate(f.name); });

  const records = await query;

  res.render("admin/pages/danh-muc/index", {
    pageTitle: "Quản lý " + config.title.toLowerCase(),
    config,
    fields: config.fields.filter((f) => f.list),
    records,
    keyword: objectSearch.keyword,
    pagination
  });
};

// [GET] /admin/<key>/create
module.exports.create = (key) => async (req, res) => {
  const config = getConfig(key);
  res.render("admin/pages/danh-muc/form", {
    pageTitle: "Thêm mới - " + config.title,
    config,
    record: null,
    refOptions: await loadRefOptions(config)
  });
};

// [POST] /admin/<key>/create
module.exports.createPost = (key) => async (req, res) => {
  const config = getConfig(key);
  try {
    const data = await buildData(config, req.body, false);
    await new config.model(data).save();
    req.flash("success", "Thêm mới thành công.");
    res.redirect(config.basePath);
  } catch (error) {
    // Loi hay gap: trung ma (unique index) hoac thieu truong bat buoc
    req.flash("error", "Thêm mới thất bại: " + error.message);
    res.redirect("back");
  }
};

// [GET] /admin/<key>/edit/:id
module.exports.edit = (key) => async (req, res) => {
  const config = getConfig(key);
  const record = await config.model.findOne({ _id: req.params.id, deleted: false });

  if (!record) {
    req.flash("error", "Không tìm thấy bản ghi.");
    return res.redirect(config.basePath);
  }

  res.render("admin/pages/danh-muc/form", {
    pageTitle: "Chỉnh sửa - " + config.title,
    config,
    record,
    refOptions: await loadRefOptions(config)
  });
};

// [PATCH] /admin/<key>/edit/:id
module.exports.editPatch = (key) => async (req, res) => {
  const config = getConfig(key);
  try {
    const data = await buildData(config, req.body, true);
    await config.model.updateOne({ _id: req.params.id }, data);
    req.flash("success", "Cập nhật thành công.");
    res.redirect(config.basePath);
  } catch (error) {
    req.flash("error", "Cập nhật thất bại: " + error.message);
    res.redirect("back");
  }
};

// [DELETE] /admin/<key>/delete/:id
// Xoa mem: chi danh dau deleted = true de giu lai du lieu lich su.
module.exports.deleteItem = (key) => async (req, res) => {
  const config = getConfig(key);
  await config.model.updateOne({ _id: req.params.id }, { deleted: true, deletedAt: new Date() });
  req.flash("success", "Đã xóa bản ghi.");
  res.redirect("back");
};
