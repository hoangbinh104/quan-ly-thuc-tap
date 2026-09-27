const systemConfig = require("../../config/system");

// Phan quyen theo ma quyen, vd: requirePermission("phan-cong_edit")
// Tach rieng khoi requireAuth vi: xac thuc (ban la ai) khac uy quyen (ban duoc lam gi).
module.exports.requirePermission = (permission) => {
  return (req, res, next) => {
    const role = res.locals.user && res.locals.user.role_id;
    const permissions = (role && role.permissions) || [];

    if (role && role.slug === "quan-tri") return next(); // admin toan quyen
    if (permissions.includes(permission)) return next();

    req.flash("error", "Ban khong co quyen thuc hien chuc nang nay.");
    return res.redirect(systemConfig.prefixAdmin + "/dashboard");
  };
};
