const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/danh-gia.controller");
const { requirePermission } = require("../../middlewares/admin/permission.middleware");

router.get("/dot/:dotId", requirePermission("danh-gia_view"), controller.theoDot);
router.get("/nhap/:phanCongId", requirePermission("danh-gia_view"), controller.nhap);
router.post("/nhap/:phanCongId", requirePermission("danh-gia_create"), controller.nhapPost);

module.exports = router;
