const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/dot-thuc-tap.controller");
const { requirePermission } = require("../../middlewares/admin/permission.middleware");

router.get("/", controller.index);
router.get("/create", requirePermission("dot-thuc-tap_create"), controller.create);
router.post("/create", requirePermission("dot-thuc-tap_create"), controller.createPost);
router.get("/edit/:id", requirePermission("dot-thuc-tap_edit"), controller.edit);
router.patch("/edit/:id", requirePermission("dot-thuc-tap_edit"), controller.editPatch);
router.delete("/delete/:id", requirePermission("dot-thuc-tap_delete"), controller.deleteItem);
router.get("/detail/:id", controller.detail);

module.exports = router;
