const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/nhat-ky.controller");
const { requirePermission } = require("../../middlewares/admin/permission.middleware");

router.get("/:phanCongId", requirePermission("nhat-ky_view"), controller.index);
router.post("/:phanCongId", requirePermission("nhat-ky_create"), controller.createPost);
router.patch("/edit/:id", requirePermission("nhat-ky_edit"), controller.editPatch);
router.delete("/delete/:id", requirePermission("nhat-ky_delete"), controller.deleteItem);

module.exports = router;
