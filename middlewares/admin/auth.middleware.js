const Account = require("../../models/account.model");
const systemConfig = require("../../config/system");

// Kiem tra da dang nhap chua.
// Nguyen tac: dung token trong cookie de tim account, khong tin du lieu client gui len.
module.exports.requireAuth = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    req.flash("error", "Vui long dang nhap de tiep tuc.");
    return res.redirect(systemConfig.prefixAdmin + "/auth/login");
  }

  const user = await Account.findOne({ token: token, deleted: false, status: "active" })
    .populate("role_id")
    .select("-password");

  if (!user) {
    res.clearCookie("token");
    req.flash("error", "Phien dang nhap khong hop le.");
    return res.redirect(systemConfig.prefixAdmin + "/auth/login");
  }

  // Gan vao res.locals de dung duoc ca trong controller va trong view .pug
  res.locals.user = user;
  req.user = user;
  next();
};
