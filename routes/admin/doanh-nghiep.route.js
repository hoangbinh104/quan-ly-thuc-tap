const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/doanh-nghiep.controller");
const validate = require("../../validates/admin/doanh-nghiep.validate");
const { requirePermission } = require("../../middlewares/admin/permission.middleware");

router.get("/", controller.index);
router.get("/create", requirePermission("doanh-nghiep_create"), controller.create);
router.post("/create", requirePermission("doanh-nghiep_create"), validate.createPatch, controller.createPost);
router.get("/edit/:id", requirePermission("doanh-nghiep_edit"), controller.edit);
router.patch("/edit/:id", requirePermission("doanh-nghiep_edit"), validate.createPatch, controller.editPatch);
router.delete("/delete/:id", requirePermission("doanh-nghiep_delete"), controller.deleteItem);

module.exports = router;
