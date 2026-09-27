const systemConfig = require("../../config/system");
const authMiddleware = require("../../middlewares/admin/auth.middleware");
const danhMucConfigs = require("../../config/danh-muc.config");

const authRoutes = require("./auth.route");
const dashboardRoutes = require("./dashboard.route");
const doanhNghiepRoutes = require("./doanh-nghiep.route");
const dotThucTapRoutes = require("./dot-thuc-tap.route");
const phanCongRoutes = require("./phan-cong.route");
const nhatKyRoutes = require("./nhat-ky.route");
const danhGiaRoutes = require("./danh-gia.route");
const nhiemVuRoutes = require("./nhiem-vu.route");
const danhMucRoute = require("./danh-muc.route");

// Gom toan bo route cua khu vuc admin vao mot cho.
// Route dang nhap KHONG di qua requireAuth, cac route con lai deu phai qua.
module.exports = (app) => {
  const PATH = systemConfig.prefixAdmin;
  const auth = authMiddleware.requireAuth;

  app.use(PATH + "/auth", authRoutes);
  app.use(PATH + "/dashboard", auth, dashboardRoutes);
  app.use(PATH + "/doanh-nghiep", auth, doanhNghiepRoutes);
  app.use(PATH + "/dot-thuc-tap", auth, dotThucTapRoutes);
  app.use(PATH + "/phan-cong", auth, phanCongRoutes);
  app.use(PATH + "/nhat-ky", auth, nhatKyRoutes);
  app.use(PATH + "/danh-gia", auth, danhGiaRoutes);
  app.use(PATH + "/nhiem-vu", auth, nhiemVuRoutes);

  // Cac danh muc (khoa, nganh-nghe, lop, giao-vien, hoc-sinh, tai-khoan,
  // nhom-quyen) dung chung mot router sinh tu cau hinh.
  Object.keys(danhMucConfigs).forEach((key) => {
    app.use(PATH + "/" + key, auth, danhMucRoute(key));
  });
};
