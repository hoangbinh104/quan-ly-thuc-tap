const express = require("express");
const controller = require("../../controllers/admin/danh-muc.controller");
const { requirePermission } = require("../../middlewares/admin/permission.middleware");

// Router dung chung cho moi danh muc.
// index.route.js goi: danhMucRoute("khoa"), danhMucRoute("lop") ...
module.exports = (key) => {
  const router = express.Router();

  router.get("/", requirePermission(key + "_view"), controller.index(key));
  router.get("/create", requirePermission(key + "_create"), controller.create(key));
  router.post("/create", requirePermission(key + "_create"), controller.createPost(key));
  router.get("/edit/:id", requirePermission(key + "_edit"), controller.edit(key));
  router.patch("/edit/:id", requirePermission(key + "_edit"), controller.editPatch(key));
  router.delete("/delete/:id", requirePermission(key + "_delete"), controller.deleteItem(key));

  return router;
};
