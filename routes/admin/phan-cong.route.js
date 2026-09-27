const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/phan-cong.controller");
const { requirePermission } = require("../../middlewares/admin/permission.middleware");

router.get("/:dotId", controller.index);
router.post("/:dotId", requirePermission("phan-cong_create"), controller.createPost);
router.patch("/doi-giao-vien/:id", requirePermission("phan-cong_edit"), controller.doiGiaoVien);
router.delete("/delete/:id", requirePermission("phan-cong_delete"), controller.deleteItem);

module.exports = router;
